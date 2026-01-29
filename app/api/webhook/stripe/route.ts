import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = (await headers()).get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    return new NextResponse(`Webhook error: ${error.message}`, {
      status: 400,
    });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === "checkout.session.completed") {
    // Handle different payment types based on metadata
    if (session.metadata?.type === "wallet_recharge") {
      await handleWalletRecharge(session);
    } else if (session.metadata?.type === "live_session") {
      await handleLiveSessionPayment(session);
    } else {
      // Default to Course Enrollment (Standard flow)
      await handleCourseEnrollmentPayment(session);
    }
  }

  return new NextResponse(null, { status: 200 });
}

// ----------------
// Helper: Live Session Payment
// ----------------
async function handleLiveSessionPayment(session: Stripe.Checkout.Session) {
  const metadata = session.metadata || {};

  try {
    // Get the pending booking
    const booking = await prisma.sessionBooking.findFirst({
      where: {
        stripeSessionId: session.id,
        status: 'pending'
      },
      include: {
        session: {
          include: {
            teacher: {
              include: {
                user: true
              }
            }
          }
        },
        student: true
      }
    });

    if (!booking) {
      console.error('No pending booking found for session:', session.id);
      return;
    }

    // Update booking status
    await prisma.sessionBooking.update({
      where: { id: booking.id },
      data: {
        status: 'confirmed',
        stripePaymentIntentId: session.payment_intent as string,
        paymentCompletedAt: new Date()
      }
    });

    // Update live session status
    await prisma.liveSession.update({
      where: { id: booking.sessionId },
      data: {
        status: 'scheduled',
      }
    });

    // Create commission record for teacher
    const commissionRate = 0.20; // 20% platform fee
    const commissionAmount = Math.round(booking.amount * commissionRate);
    const netAmount = booking.amount - commissionAmount;

    // Correct access to teacher profile ID via session relation
    const teacherProfileId = booking.session.teacherId;
    // Correct access to teacher User ID via session -> teacher -> user
    const teacherUserId = booking.session.teacher.userId;

    await prisma.commission.create({
      data: {
        teacherId: teacherProfileId,
        sessionId: booking.sessionId,
        type: 'LiveSession',
        amount: booking.amount,
        commission: commissionAmount,
        netAmount: netAmount,
        status: 'Pending'
      }
    });

    // Notifications
    await prisma.notification.createMany({
      data: [
        { userId: booking.studentId, title: "Booking Confirmed", message: `Your session "${booking.session.title}" is confirmed!`, type: "Session" },
        { userId: teacherUserId, title: "New Session Booking", message: `${booking.student.name} booked "${booking.session.title}"`, type: "Session" }
      ]
    });

    // Send Emails (Lazy import)
    const { sendTemplatedEmail } = await import("@/lib/email");
    await sendTemplatedEmail("notification", booking.student.email, "Booking Confirmed", {
      userName: booking.student.name || 'Student',
      title: "Session Booked",
      messageTitle: booking.session.title,
      message: `Your session is scheduled for ${new Date(booking.session.scheduledAt).toLocaleString()}.`
    });

    console.log(`Live session booking confirmed: ${booking.id}`);
  } catch (error) {
    console.error("Error handling course enrollment payment:", error);
    throw error;
  }
}

// ----------------
// Helper: Wallet Recharge Payment
// ----------------
async function handleWalletRecharge(session: Stripe.Checkout.Session) {
  const metadata = session.metadata || {};
  const userId = metadata.userId;
  const amount = parseInt(metadata.amount || "0");

  if (!userId || !amount) {
    console.error("Missing userId or amount in wallet recharge metadata");
    return;
  }

  try {
    // Check for duplicate processing (idempotency)
    const existingTransaction = await prisma.walletTransaction.findFirst({
      where: { stripeSessionId: session.id }
    });

    if (existingTransaction) {
      console.log("Wallet recharge already processed:", session.id);
      return;
    }

    // Get or create wallet
    let wallet = await prisma.wallet.findUnique({
      where: { userId }
    });

    if (!wallet) {
      wallet = await prisma.wallet.create({
        data: { userId, balance: 0 }
      });
    }

    // Atomic transaction to update balance and create transaction record
    await prisma.$transaction(async (tx) => {
      const balanceBefore = wallet!.balance;
      const balanceAfter = balanceBefore + amount;

      // Update wallet balance
      await tx.wallet.update({
        where: { id: wallet!.id },
        data: { balance: balanceAfter }
      });

      // Create transaction record
      await tx.walletTransaction.create({
        data: {
          walletId: wallet!.id,
          type: "RECHARGE",
          amount,
          balanceBefore,
          balanceAfter,
          description: `Wallet recharge of ₹${amount}`,
          stripeSessionId: session.id,
          metadata: {
            paymentIntentId: session.payment_intent as string,
            customerEmail: session.customer_email
          }
        }
      });

      // Create notification
      await tx.notification.create({
        data: {
          userId,
          title: "Wallet Recharged",
          message: `₹${amount} has been added to your wallet. New balance: ₹${balanceAfter}`,
          type: "Payment"
        }
      });
    });

    console.log(`Wallet recharge successful: ₹${amount} for user ${userId}`);
  } catch (error) {
    console.error("Error handling wallet recharge:", error);
    throw error;
  }
}
// ----------------
// Helper: Course Enrollment Payment
// ----------------
async function handleCourseEnrollmentPayment(session: Stripe.Checkout.Session) {
  const courseId = session.metadata?.courseId;
  const enrollmentId = session.metadata?.enrollmentId;

  if (!courseId || !enrollmentId) {
    console.error("Missing metadata for course enrollment");
    return;
  }

  const enrollment = await prisma.enrollment.findUnique({
    where: { id: enrollmentId },
    include: {
      Course: {
        include: {
          user: {
            include: {
              teacherProfile: true
            }
          }
        }
      },
      User: true // Use User relation (uppercase U)
    }
  });

  if (!enrollment || enrollment.status === "Active") {
    console.log("Enrollment already processed or not found");
    return;
  }

  if (!enrollment.Course.user.teacherProfile) {
    console.error("Teacher profile not found for this course");
    return;
  }

  const amount = session.amount_total || 0;
  const platformFeeRate = 0.20; // 20% platform commission
  const commissionAmount = Math.round(amount * platformFeeRate);
  const netAmount = amount - commissionAmount;

  // Use transaction for atomic consistency
  await prisma.$transaction([
    // 1. Activate Enrollment
    prisma.enrollment.update({
      where: { id: enrollmentId },
      data: { status: "Active" },
    }),
    // 2. Create Commission Record for Teacher
    prisma.commission.create({
      data: {
        teacherId: enrollment.Course.user.teacherProfile.id,
        courseId: courseId,
        type: "Course",
        amount: amount,
        commission: commissionAmount,
        netAmount: netAmount,
        status: "Pending",
      }
    }),
    // 3. Create Student Notification
    prisma.notification.create({
      data: {
        userId: enrollment.userId,
        title: "Enrollment Successful!",
        message: `Welcome to ${enrollment.Course.title}. Your payment was confirmed.`,
        type: "Payment",
      }
    }),
    // 4. Create Teacher Notification
    prisma.notification.create({
      data: {
        userId: enrollment.Course.user.id,
        title: "New Course Sale!",
        message: `Someone just enrolled in ${enrollment.Course.title}.`,
        type: "Payment",
      }
    })
  ]);

  // Send Emails (Non-blocking)
  const { sendTemplatedEmail } = await import("@/lib/email");

  // Student Receipt/Welcome
  await sendTemplatedEmail("courseEnrollment", enrollment.User.email, "Enrollment Confirmed", {
    userName: enrollment.User.name || "Student",
    courseTitle: enrollment.Course.title,
    courseDescription: enrollment.Course.description || "Start learning today!",
    enrollmentDate: new Date().toLocaleDateString(),
    courseUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/courses/${enrollment.Course.slug}`
  });

  // Teacher Notification
  await sendTemplatedEmail("notification", enrollment.Course.user.email, "New Course Sale", {
    userName: enrollment.Course.user.name || "Instructor",
    title: "New Student Enrolled",
    messageTitle: `Sold: ${enrollment.Course.title}`,
    message: `You earned $${(netAmount / 100).toFixed(2)} from this sale.`
  });
}
