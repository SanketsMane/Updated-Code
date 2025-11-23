"use server";

import { requireTeacherOrAdmin } from "@/app/data/auth/require-roles";
import { protectAdminAction } from "@/lib/action-security";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { revalidatePath } from "next/cache";

export async function deleteCourse(courseId: string): Promise<ApiResponse> {
  const session = await requireTeacherOrAdmin();

  try {
    // Apply security protection for admin actions
    const securityCheck = await protectAdminAction(session.user.id);
    if (!securityCheck.success) {
      return {
        status: "error",
        message: securityCheck.error || "Security check failed",
      };
    }
    await prisma.course.delete({
      where: {
        id: courseId,
      },
    });

    revalidatePath("/admin/courses");

    return {
      status: "success",
      message: "Course deleted successfully",
    };
  } catch (error) {
    console.log(error);
    return {
      status: "error",
      message: "Failed to delete Course!",
    };
  }
}
