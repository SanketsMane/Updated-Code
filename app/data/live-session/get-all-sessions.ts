import { prisma } from "@/lib/db";


export async function getAllSessions() {
    const sessions = await prisma.liveSession.findMany({
        where: {
            status: "scheduled", // or any status logic
        },
        include: {
            teacher: {
                include: {
                    user: true,
                },
            },
            // If we had participants count
            // _count: { select: { students: true } } // if relation exists
        },
        orderBy: {
            scheduledAt: 'asc',
        },
    });

    return sessions;
}
