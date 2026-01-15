'use server';

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek } from "date-fns";

export type CalendarEvent = {
    id: string;
    title: string;
    start: Date;
    end: Date;
    type: 'session' | 'class';
    status: string;
    studentName?: string; // For 1-on-1
    studentCount?: number; // For Group
};

export async function getCalendarEvents(date: Date) {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) {
        throw new Error("Unauthorized");
    }

    const teacherProfile = await prisma.teacherProfile.findUnique({
        where: { userId: session.user.id },
    });

    if (!teacherProfile) {
        return [];
    }

    // Get range for the whole month view including padding days
    const start = startOfWeek(startOfMonth(date));
    const end = endOfWeek(endOfMonth(date));

    const [sessions, classes] = await Promise.all([
        prisma.liveSession.findMany({
            where: {
                teacherId: teacherProfile.id,
                scheduledAt: {
                    gte: start,
                    lte: end,
                },
            },
            include: {
                student: { select: { name: true } }
            }
        }),
        prisma.groupClass.findMany({
            where: {
                teacherId: teacherProfile.id,
                scheduledAt: {
                    gte: start,
                    lte: end,
                },
            },
            include: {
                _count: { select: { enrollments: true } }
            }
        })
    ]);

    const events: CalendarEvent[] = [
        ...sessions.map(s => ({
            id: s.id,
            title: s.title,
            start: s.scheduledAt,
            end: new Date(s.scheduledAt.getTime() + s.duration * 60000),
            type: 'session' as const,
            status: s.status,
            studentName: s.student?.name || 'Unknown Student'
        })),
        ...classes.map(c => ({
            id: c.id,
            title: c.title,
            start: c.scheduledAt,
            end: new Date(c.scheduledAt.getTime() + c.duration * 60000),
            type: 'class' as const,
            status: c.status,
            studentCount: c._count.enrollments
        }))
    ];

    return events;
}
