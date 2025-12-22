"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function approveTeacher(profileId: string) {
    try {
        await prisma.teacherProfile.update({
            where: { id: profileId },
            data: { isVerified: true, isApproved: true },
        });
        revalidatePath("/admin/team");
        return { success: true };
    } catch (error) {
        console.error("Failed to approve teacher:", error);
        return { error: "Failed to approve teacher" };
    }
}

export async function rejectTeacher(profileId: string, userId: string) {
    try {
        // Option 1: Delete profile + revert role?
        // Option 2: Just set approved=false? 
        // Let's delete the profile and revert role to student for now.

        await prisma.teacherProfile.delete({
            where: { id: profileId },
        });

        await prisma.user.update({
            where: { id: userId },
            data: { role: 'student' }
        });

        revalidatePath("/admin/team");
        return { success: true };
    } catch (error) {
        console.error("Failed to reject teacher:", error);
        return { error: "Failed to reject teacher" };
    }
}
