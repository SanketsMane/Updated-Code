import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// GET - List all sessions for a teacher
export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get teacher profile or create one if it doesn't exist
    let teacherProfile = await prisma.teacherProfile.findUnique({
      where: { userId: session.user.id }
    });

    if (!teacherProfile) {
      // Create teacher profile if it doesn't exist
      teacherProfile = await prisma.teacherProfile.create({
        data: {
          userId: session.user.id,
          bio: 'Welcome to teaching!',
          expertise: ['General'],
          hourlyRate: 50,
          isVerified: true,
          isApproved: true,
          rating: 5.0,
          totalEarnings: 0,
          totalReviews: 0,
        }
      });
    }

    // Get query parameters
    const searchParams = req.nextUrl.searchParams;
    const status = searchParams.get('status') || 'all';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      teacherId: teacherProfile.id
    };

    if (status !== 'all') {
      where.status = status;
    }

    // Fetch sessions with pagination
    const [sessions, totalCount] = await Promise.all([
      prisma.liveSession.findMany({
        where,
        include: {
          student: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true
            }
          },
          teacher: {
            include: {
              user: {
                select: {
                  name: true,
                  image: true
                }
              }
            }
          }
        },
        orderBy: {
          scheduledAt: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.liveSession.count({ where })
    ]);

    // Calculate stats
    const statsData = await prisma.liveSession.aggregate({
      where: { teacherId: teacherProfile.id },
      _count: { _all: true },
      _sum: { price: true }
    });

    const [upcomingCount, completedCount] = await Promise.all([
      prisma.liveSession.count({
        where: {
          teacherId: teacherProfile.id,
          scheduledAt: { gte: new Date() },
          status: 'scheduled'
        }
      }),
      prisma.liveSession.count({
        where: {
          teacherId: teacherProfile.id,
          status: 'completed'
        }
      })
    ]);

    return NextResponse.json({
      sessions: sessions || [],
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit)
      },
      stats: {
        total: statsData._count._all || 0,
        upcoming: upcomingCount || 0,
        completed: completedCount || 0,
        totalEarnings: Number(statsData._sum.price) || 0
      }
    });
  } catch (error) {
    console.error("Error fetching teacher sessions:", error);
    return NextResponse.json({ 
      sessions: [],
      pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
      stats: { total: 0, upcoming: 0, completed: 0, totalEarnings: 0 },
      error: "Internal server error" 
    }, { status: 500 });
  }
}

// POST - Create a new session
export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get teacher profile
    const teacherProfile = await prisma.teacherProfile.findUnique({
      where: { userId: session.user.id }
    });

    if (!teacherProfile) {
      return NextResponse.json({ error: "Teacher profile not found" }, { status: 404 });
    }

    const body = await req.json();
    const {
      title,
      description,
      subject,
      scheduledAt,
      duration,
      price,
      timezone,
      isRecurring,
      recurringPattern
    } = body;

    // Validation
    if (!title || !scheduledAt || !duration || !price) {
      return NextResponse.json(
        { error: "Missing required fields: title, scheduledAt, duration, price" },
        { status: 400 }
      );
    }

    // Validate scheduled time is in the future
    const scheduledDate = new Date(scheduledAt);
    if (scheduledDate < new Date()) {
      return NextResponse.json(
        { error: "Scheduled time must be in the future" },
        { status: 400 }
      );
    }

    // Check for scheduling conflicts
    const conflictingSession = await prisma.liveSession.findFirst({
      where: {
        teacherId: teacherProfile.id,
        status: { in: ['scheduled', 'in_progress'] },
        OR: [
          {
            // New session starts during existing session
            AND: [
              { scheduledAt: { lte: scheduledDate } },
              {
                scheduledAt: {
                  gte: new Date(scheduledDate.getTime() - duration * 60000)
                }
              }
            ]
          },
          {
            // Existing session overlaps with new session
            scheduledAt: {
              gte: scheduledDate,
              lt: new Date(scheduledDate.getTime() + duration * 60000)
            }
          }
        ]
      }
    });

    if (conflictingSession) {
      return NextResponse.json(
        { error: "Time slot conflicts with another session" },
        { status: 409 }
      );
    }

    // Create the session
    const newSession = await prisma.liveSession.create({
      data: {
        teacherId: teacherProfile.id,
        title,
        description,
        subject,
        scheduledAt: scheduledDate,
        duration,
        price,
        timezone: timezone || 'UTC',
        isRecurring: isRecurring || false,
        recurringPattern: recurringPattern || null,
        status: 'scheduled'
      },
      include: {
        teacher: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
                image: true
              }
            }
          }
        }
      }
    });

    return NextResponse.json({
      message: "Session created successfully",
      session: newSession
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating session:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
