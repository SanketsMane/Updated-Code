"use server";

import { prisma } from "@/lib/db";
import { getSessionWithRole } from "@/app/data/auth/require-roles";
import { revalidatePath } from "next/cache";

interface BookSessionInput {
    teacherProfileId: string;
    dateTime: string; // "2025-12-20 10:00 AM"
    price: number;
}

export async function bookSessionAction(data: BookSessionInput) {
    try {
        const session = await getSessionWithRole();
        if (!session || !session.user) {
            return { success: false, error: "You must be logged in to book a session" };
        }

        // Parse Date Demo (Naive parsing for "2025-12-20 10:00 AM")
        const scheduledAt = new Date(data.dateTime);

        // Create Session
        const liveSession = await prisma.liveSession.create({
            data: {
                teacherId: data.teacherProfileId,
                studentId: session.user.id,
                title: "1-on-1 Mentorship Session", // Default title
                description: "Private Live Session",
                scheduledAt: scheduledAt,
                duration: 60, // Default 60 mins
                price: data.price,
                status: "scheduled",
                meetingUrl: `/video-call/${crypto.randomUUID()}` // Generate a unique meeting ID URL
            }
        });

        // Revalidate dashboard sessions
        revalidatePath("/dashboard/sessions");

        return { success: true, sessionId: liveSession.id };

    } catch (error) {
        console.error("Booking Error:", error);
        return { success: false, error: "Failed to create session" };
    }
}
