import { prisma } from "@/lib/db";

export async function getStudentSchedule(userId: string) {
    // Fetch sessions where the user is the direct student (1-on-1) OR has a booking
    const sessions = await prisma.liveSession.findMany({
        where: {
            status: "scheduled",
            scheduledAt: {
                gte: new Date(), // Future sessions only
            },
            OR: [
                { studentId: userId },
                {
                    bookings: {
                        some: {
                            studentId: userId,
                            status: "confirmed"
                        }
                    }
                }
            ]
        },
        orderBy: {
            scheduledAt: "asc"
        },
        take: 5,
        include: {
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
        }
    });

    return sessions.map(session => ({
        id: session.id,
        title: session.title,
        time: session.scheduledAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: session.scheduledAt.toLocaleDateString([], { month: 'short', day: 'numeric' }),
        type: "class" as const,
        user: session.teacher.user.name || "Instructor",
        image: session.teacher.user.image || undefined,
        meetingUrl: session.meetingUrl
    }));
}
