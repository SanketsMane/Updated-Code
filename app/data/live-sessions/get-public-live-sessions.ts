import { prisma } from "@/lib/db";

export interface LiveSession {
  id: string;
  title: string;
  description?: string;
  teacher: {
    id: string;
    name: string;
    avatar: string;
    rating: number;
    reviews: number;
    verified: boolean;
  };
  scheduledAt: string;
  duration: number;
  price: number;
  subject?: string;
  level?: string;
  language?: string;
  availableSlots: number;
  type: string;
  bookedByCurrentUser?: boolean;
}

export async function getPublicLiveSessions(): Promise<LiveSession[]> {
  try {
    const sessions = await prisma.liveSession.findMany({
      where: {
        scheduledAt: {
          gte: new Date(),
        },
        // Only show sessions that are available for booking
        studentId: null,
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
      },
      orderBy: {
        scheduledAt: "asc",
      },
      take: 20,
    });

    return sessions.map(session => ({
      id: session.id,
      title: session.title,
      description: session.description || undefined,
      teacher: {
        id: session.teacher.user.id,
        name: session.teacher.user.name || "Anonymous Teacher",
        avatar: session.teacher.user.image || "/placeholder-avatar.svg",
        rating: session.teacher.rating || 0,
        reviews: session.teacher.totalReviews || 0,
        verified: session.teacher.isVerified,
      },
      scheduledAt: session.scheduledAt.toISOString(),
      duration: session.duration,
      price: Math.round(session.price / 100), // Convert from cents
      subject: session.subject || undefined,
      level: "Intermediate", // Default level
      language: "English", // Default language
      availableSlots: 1,
      type: "1-on-1",
      bookedByCurrentUser: false,
    }));
  } catch (error) {
    console.error("Error fetching live sessions:", error);
    return [];
  }
}