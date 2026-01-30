"use server";

import { requireUser } from "@/app/data/user/require-user";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function toggleSavedTutor(tutorId: string) {
    try {
        const user = await requireUser();

        const existing = await prisma.studentSavedTutor.findUnique({
            where: {
                studentId_tutorId: {
                    studentId: user.id,
                    tutorId
                }
            }
        });

        if (existing) {
            await prisma.studentSavedTutor.delete({
                where: { id: existing.id }
            });
            revalidatePath("/dashboard/saved-tutors");
            revalidatePath(`/find-teacher/${tutorId}`);
            return { saved: false };
        } else {
            await prisma.studentSavedTutor.create({
                data: {
                    studentId: user.id,
                    tutorId
                }
            });
            revalidatePath("/dashboard/saved-tutors");
            revalidatePath(`/find-teacher/${tutorId}`);
            return { saved: true };
        }
    } catch (error) {
        console.error("Error toggling saved tutor:", error);
        return { error: "Failed to update saved status" };
    }
}
