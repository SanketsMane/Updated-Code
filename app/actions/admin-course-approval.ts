"use server";

import { requireAdmin } from "@/app/data/auth/require-roles";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function approveCourse(courseId: string) {
    await requireAdmin();

    await prisma.course.update({
        where: {
            id: courseId,
        },
        data: {
            status: "Published",
        },
    });

    revalidatePath("/admin/courses");
}

export async function rejectCourse(courseId: string) {
    await requireAdmin();

    await prisma.course.update({
        where: {
            id: courseId,
        },
        data: {
            status: "Draft",
        },
    });

    revalidatePath("/admin/courses");
}
