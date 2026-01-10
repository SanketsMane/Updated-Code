import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Get upcoming live sessions with teacher details
    const liveSessions = await prisma.liveSession.findMany({
      where: {
        scheduledAt: {
          gte: new Date(), // Only future sessions
        },
        status: "scheduled" // Use the correct enum value
      },
      include: {
        teacher: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
        student: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        scheduledAt: "asc",
      },
      take: 20, // Limit for performance
    });

    // Transform the data to match the expected format
    const transformedSessions = liveSessions.map(session => ({
      id: session.id,
      title: session.title,
      description: session.description,
      teacher: {
        id: session.teacher.user.id,
        name: session.teacher.user.name || "Anonymous Teacher",
        avatar: session.teacher.user.image || "/placeholder-avatar.svg",
        rating: session.teacher.rating || 0,
        totalReviews: session.teacher.totalReviews || 0,
        isVerified: session.teacher.isVerified,
      },
      scheduledAt: session.scheduledAt,
      duration: session.duration,
      price: session.price,
      subject: session.subject,
      type: "1-on-1", // All current sessions are 1-on-1
      availableSlots: session.studentId ? 0 : 1, // If student assigned, no slots available
      bookedByCurrentUser: false, // Will be updated based on authentication
    }));

    return NextResponse.json({ sessions: transformedSessions });
  } catch (error) {
    console.error("Error fetching live sessions:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}