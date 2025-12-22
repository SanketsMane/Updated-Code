"use server";

import { requireUser } from "@/app/data/user/require-user";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createReview({
    courseId,
    rating,
    comment,
}: {
    courseId: string;
    rating: number;
    comment: string;
}) {
    const session = await requireUser();

    try {
        // Check if user is enrolled
        const enrollment = await prisma.enrollment.findUnique({
            where: {
                userId_courseId: {
                    userId: session.id,
                    courseId: courseId,
                },
            },
        });

        if (!enrollment) {
            return {
                status: "error",
                message: "You must be enrolled to review this course.",
            };
        }

        // Check if already reviewed
        const existingReview = await prisma.review.findFirst({
            where: {
                reviewerId: session.id,
                courseId: courseId,
            },
        });

        if (existingReview) {
            // Update existing
            await prisma.review.update({
                where: { id: existingReview.id },
                data: {
                    rating,
                    comment,
                },
            });
            revalidatePath(`/courses/${courseId}`);
            return {
                status: "success",
                message: "Review updated successfully",
            };
        }

        // Create new
        await prisma.review.create({
            data: {
                reviewerId: session.id,
                courseId,
                rating,
                comment,
                isVerified: true, // Since we checked enrollment
            },
        });

        revalidatePath(`/courses/${courseId}`);
        return {
            status: "success",
            message: "Review submitted successfully",
        };
    } catch (error) {
        console.error("Review Error:", error);
        return {
            status: "error",
            message: "Failed to submit review",
        };
    }
}
