"use server";

import { requireAdmin } from "@/app/data/auth/require-roles";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSystemNotification } from "@/app/actions/notifications";
import { sendNotificationEmail } from "@/lib/email-notifications";

export async function approveCourse(courseId: string) {
    await requireAdmin();

    const course = await prisma.course.update({
        where: {
            id: courseId,
        },
        data: {
            status: "Published",
        },
        select: {
            userId: true,
            title: true
        }
    });

    if (course) {
        // System Notification
        await createSystemNotification(
            course.userId,
            "Course Approved",
            `Your course "${course.title}" has been approved and is now live!`,
            "Course",
            { courseId: courseId, action: "approved" }
        );

        // Email Notification
        const teacher = await prisma.user.findUnique({
            where: { id: course.userId },
            select: { email: true, name: true }
        });

        if (teacher?.email) {
            await sendNotificationEmail(
                teacher.email,
                teacher.name || "Teacher",
                "Course Approved 🎉",
                "Your course has been approved!",
                `Congratulations! Your course "${course.title}" is now published and available for students.`
            );
        }
    }

    revalidatePath("/admin/courses");
}

export async function rejectCourse(courseId: string, reason: string) {
    await requireAdmin();

    const course = await prisma.course.update({
        where: {
            id: courseId,
        },
        data: {
            status: "Draft",
            rejectionReason: reason,
        },
        select: {
            userId: true,
            title: true
        }
    });

    if (course) {
        // System Notification
        await createSystemNotification(
            course.userId,
            "Course Rejected",
            `Your course "${course.title}" was not approved. Reason: ${reason}. It has been set to Draft.`,
            "Course",
            { courseId: courseId, action: "rejected", reason: reason }
        );

        // Email Notification
        const teacher = await prisma.user.findUnique({
            where: { id: course.userId },
            select: { email: true, name: true }
        });

        if (teacher?.email) {
            await sendNotificationEmail(
                teacher.email,
                teacher.name || "Teacher",
                "Course Rejected",
                "Action Required: Course Review",
                `Your course "${course.title}" was not approved and has been set to Draft status.\n\nReason for rejection: ${reason}\n\nPlease address these issues and resubmit.`
            );
        }
    }

    revalidatePath("/admin/courses");
}
