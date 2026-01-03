import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// POST - Reschedule a session
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { newScheduledAt, reason } = body;

    if (!newScheduledAt) {
      return NextResponse.json(
        { error: "newScheduledAt is required" },
        { status: 400 }
      );
    }

    const liveSession = await prisma.liveSession.findUnique({
      where: { id },
      include: {
        teacher: {
          include: {
            user: true
          }
        },
        student: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    if (!liveSession) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Verify teacher owns this session
    if (liveSession.teacher.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Can't reschedule completed or cancelled sessions
    if (liveSession.status === 'completed' || liveSession.status === 'cancelled') {
      return NextResponse.json(
        { error: `Cannot reschedule ${liveSession.status} session` },
        { status: 400 }
      );
    }

    // Check reschedule limit
    if (liveSession.rescheduleCount >= liveSession.maxReschedules) {
      return NextResponse.json(
        { error: `Maximum reschedule limit (${liveSession.maxReschedules}) reached` },
        { status: 400 }
      );
    }

    // Validate new time is in the future
    const newDate = new Date(newScheduledAt);
    if (newDate < new Date()) {
      return NextResponse.json(
        { error: "New scheduled time must be in the future" },
        { status: 400 }
      );
    }

    // Check that reschedule is at least 24 hours before original session
    const now = new Date();
    const originalTime = new Date(liveSession.scheduledAt);
    const hoursUntilSession = (originalTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    if (hoursUntilSession < 24) {
      return NextResponse.json(
        { error: "Rescheduling must be done at least 24 hours before the session" },
        { status: 400 }
      );
    }

    // Check for scheduling conflicts with the new time
    const conflictingSession = await prisma.liveSession.findFirst({
      where: {
        teacherId: liveSession.teacherId,
        id: { not: id }, // Exclude current session
        status: { in: ['scheduled', 'in_progress'] },
        OR: [
          {
            // New time conflicts with existing session
            AND: [
              { scheduledAt: { lte: newDate } },
              {
                scheduledAt: {
                  gte: new Date(newDate.getTime() - liveSession.duration * 60000)
                }
              }
            ]
          },
          {
            // Existing session overlaps with new time
            scheduledAt: {
              gte: newDate,
              lt: new Date(newDate.getTime() + liveSession.duration * 60000)
            }
          }
        ]
      }
    });

    if (conflictingSession) {
      return NextResponse.json(
        { error: "New time slot conflicts with another session" },
        { status: 409 }
      );
    }

    // Update session
    const updatedSession = await prisma.liveSession.update({
      where: { id },
      data: {
        scheduledAt: newDate,
        originalScheduledAt: liveSession.originalScheduledAt || liveSession.scheduledAt,
        rescheduleCount: liveSession.rescheduleCount + 1,
        // Reset reminders since time changed
        reminderSent: false
      },
      include: {
        teacher: {
          include: {
            user: {
              select: {
                name: true,
                email: true
              }
            }
          }
        },
        student: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    // TODO: Send rescheduling email to student with new time
    // TODO: Update calendar invite
    // TODO: Send notification

    return NextResponse.json({
      message: "Session rescheduled successfully",
      session: updatedSession,
      rescheduleInfo: {
        originalTime: liveSession.scheduledAt,
        newTime: newDate,
        rescheduleCount: updatedSession.rescheduleCount,
        remainingReschedules: liveSession.maxReschedules - updatedSession.rescheduleCount,
        reason: reason || 'No reason provided'
      }
    });
  } catch (error) {
    console.error("Error rescheduling session:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
