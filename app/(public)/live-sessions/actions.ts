"use server";

import { requireUser } from "@/app/data/user/require-user";
import { protectEnrollmentAction } from "@/lib/action-security";
import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { ApiResponse } from "@/lib/types";
import { redirect } from "next/navigation";
import { z } from "zod";

const bookSessionSchema = z.object({
  teacherId: z.string().uuid(),
  scheduledAt: z.string().datetime(),
  duration: z.number().min(30).max(180),
  subject: z.string().min(1),
  message: z.string().optional(),
  price: z.number().min(0),
});

export async function bookLiveSession(
  values: z.infer<typeof bookSessionSchema>
): Promise<ApiResponse | never> {
  const user = await requireUser();

  try {
    // Apply security protection
    const securityCheck = await protectEnrollmentAction(user.id);
    if (!securityCheck.success) {
      return {
        status: "error",
        message: securityCheck.error || "Security check failed",
      };
    }

    const validation = bookSessionSchema.safeParse(values);
    if (!validation.success) {
      return {
        status: "error",
        message: "Invalid session data",
      };
    }

    const data = validation.data;

    // Check if teacher exists and is available
    const teacher = await prisma.teacherProfile.findUnique({
      where: { id: data.teacherId },
      include: { user: true }
    });

    if (!teacher || !teacher.isApproved) {
      return {
        status: "error",
        message: "Teacher not found or not available",
      };
    }

    // Check for scheduling conflicts
    const scheduledDateTime = new Date(data.scheduledAt);
    const endDateTime = new Date(scheduledDateTime.getTime() + data.duration * 60000);

    const conflictingSession = await prisma.liveSession.findFirst({
      where: {
        teacherId: data.teacherId,
        scheduledAt: {
          gte: scheduledDateTime,
          lt: endDateTime,
        },
        status: {
          in: ["Scheduled", "InProgress"]
        }
      }
    });

    if (conflictingSession) {
      return {
        status: "error",
        message: "This time slot is not available",
      };
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer: user.stripeCustomerId || undefined,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Live Session with ${teacher.user.name}`,
              description: `${data.duration} minute session on ${data.subject}`,
            },
            unit_amount: Math.round(data.price * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/sessions?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/live-sessions`,
      metadata: {
        type: "live_session",
        teacherId: data.teacherId,
        studentId: user.id,
        scheduledAt: data.scheduledAt,
        duration: data.duration.toString(),
        subject: data.subject,
        message: data.message || "",
      },
    });

    // Create pending session record
    await prisma.liveSession.create({
      data: {
        teacherId: data.teacherId,
        studentId: user.id,
        title: `${data.subject} Session`,
        description: data.message,
        subject: data.subject,
        scheduledAt: scheduledDateTime,
        duration: data.duration,
        price: Math.round(data.price * 100),
        status: "Scheduled",
      },
    });

    if (session.url) {
      redirect(session.url);
    } else {
      return {
        status: "error",
        message: "Could not create payment session",
      };
    }
  } catch (error) {
    console.error("Error booking session:", error);
    return {
      status: "error",
      message: "Failed to book session. Please try again.",
    };
  }
}

export async function getAvailableTimeSlots(
  teacherId: string,
  date: string
): Promise<ApiResponse> {
  try {
    const teacher = await prisma.teacherProfile.findUnique({
      where: { id: teacherId },
    });

    if (!teacher) {
      return {
        status: "error",
        message: "Teacher not found",
      };
    }

    const selectedDate = new Date(date);
    const startOfDay = new Date(selectedDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(selectedDate.setHours(23, 59, 59, 999));

    // Get existing sessions for the day
    const existingSessions = await prisma.liveSession.findMany({
      where: {
        teacherId,
        scheduledAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
        status: {
          in: ["Scheduled", "InProgress"]
        }
      },
    });

    // Generate available time slots (9 AM to 6 PM)
    const timeSlots = [];
    for (let hour = 9; hour <= 18; hour++) {
      const timeSlot = new Date(selectedDate);
      timeSlot.setHours(hour, 0, 0, 0);
      
      // Check if slot is available
      const isBooked = existingSessions.some(session => {
        const sessionEnd = new Date(session.scheduledAt.getTime() + session.duration * 60000);
        return timeSlot >= session.scheduledAt && timeSlot < sessionEnd;
      });

      if (!isBooked) {
        timeSlots.push({
          time: timeSlot.toISOString(),
          label: timeSlot.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          available: true
        });
      }
    }

    return {
      status: "success",
      data: timeSlots,
    };
  } catch (error) {
    console.error("Error fetching time slots:", error);
    return {
      status: "error",
      message: "Failed to fetch available time slots",
    };
  }
}

export async function getTeacherProfile(teacherId: string): Promise<ApiResponse> {
  try {
    const teacher = await prisma.teacherProfile.findUnique({
      where: { id: teacherId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          }
        },
        reviews: {
          include: {
            reviewer: {
              select: {
                name: true,
                image: true,
              }
            }
          },
          orderBy: {
            createdAt: "desc"
          },
          take: 10,
        }
      }
    });

    if (!teacher) {
      return {
        status: "error",
        message: "Teacher not found",
      };
    }

    return {
      status: "success",
      data: teacher,
    };
  } catch (error) {
    console.error("Error fetching teacher profile:", error);
    return {
      status: "error",
      message: "Failed to fetch teacher profile",
    };
  }
}