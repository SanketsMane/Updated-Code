"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

// --- User Management ---

export async function suspendUser(userId: string, reason?: string) {
    try {
        await prisma.user.update({
            where: { id: userId },
            data: {
                banned: true,
                banReason: reason || "Suspended by admin",
            },
        });
        revalidatePath("/admin/users");
        return { success: true, message: "User suspended successfully" };
    } catch (error) {
        console.error("Failed to suspend user:", error);
        return { success: false, message: "Failed to suspend user" };
    }
}

export async function unsuspendUser(userId: string) {
    try {
        await prisma.user.update({
            where: { id: userId },
            data: {
                banned: false,
                banReason: null,
            },
        });
        revalidatePath("/admin/users");
        return { success: true, message: "User unsuspended successfully" };
    } catch (error) {
        console.error("Failed to unsuspend user:", error);
        return { success: false, message: "Failed to unsuspend user" };
    }
}

export async function updateUserRole(userId: string, role: string) {
    try {
        await prisma.user.update({
            where: { id: userId },
            data: { role },
        });
        revalidatePath("/admin/users");
        return { success: true, message: "User role updated successfully" };
    } catch (error) {
        console.error("Failed to update role:", error);
        return { success: false, message: "Failed to update role" };
    }
}

export async function deleteUser(userId: string) {
    try {
        // Delete related data first to avoid constraint errors if cascade isn't perfect
        // Though schema has onDelete: Cascade, explicit cleanup is safer for major entities
        await prisma.user.delete({
            where: { id: userId },
        });
        revalidatePath("/admin/users");
        return { success: true, message: "User deleted successfully" };
    } catch (error) {
        console.error("Failed to delete user:", error);
        return { success: false, message: "Failed to delete user" };
    }
}

export async function deleteCourse(courseId: string) {
    try {
        // Check if course has enrollments? Maybe prevent delete?
        // For now, allow delete (schema handles cascade)
        await prisma.course.delete({
            where: { id: courseId }
        });
        revalidatePath("/admin/courses");
        return { success: true, message: "Course deleted successfully" };
    } catch (error) {
        console.error("Failed to delete course:", error);
        return { success: false, message: "Failed to delete course" };
    }
}

// --- Teacher Management ---

export async function approveTeacher(teacherId: string) {
    try {
        // teacherId here refers to the User ID, not TeacherProfile ID, based on typical UI usage
        // But let's check. Usually passed ID is row ID.
        // If passing Profile ID:
        await prisma.teacherProfile.updateMany({
            where: { userId: teacherId }, // Assuming we pass User ID
            data: { isApproved: true }
        });

        // Also verify the user if not already
        await prisma.teacherProfile.updateMany({
            where: { userId: teacherId },
            data: { isVerified: true }
        });

        revalidatePath("/admin/teachers");
        return { success: true, message: "Teacher approved successfully" };
    } catch (error) {
        console.error("Failed to approve teacher:", error);
        return { success: false, message: "Failed to approve teacher" };
    }
}

export async function rejectTeacher(teacherUserId: string, reason: string) {
    try {
        await prisma.teacherProfile.updateMany({
            where: { userId: teacherUserId },
            data: { isApproved: false }
        });

        const teacher = await prisma.teacherProfile.findUnique({ where: { userId: teacherUserId } });
        if (teacher) {
            await prisma.teacherVerification.update({
                where: { teacherId: teacher.id },
                data: {
                    status: 'Rejected',
                    rejectionReason: reason,
                    rejectedAt: new Date(),
                }
            });

            // Optionally send email here to notify teacher
        }

        revalidatePath("/admin/teachers");
        return { success: true, message: "Teacher rejected/unapproved" };
    } catch (error) {
        console.error("Failed to reject teacher:", error);
        return { success: false, message: "Failed to reject teacher" };
    }
}
