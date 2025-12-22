import "server-only";

import { prisma } from "@/lib/db";
import { requireTeacherOrAdmin } from "../auth/require-roles";

export async function adminGetCourses() {
  // await new Promise((resolve) => setTimeout(resolve, 2000));

  const session = await requireTeacherOrAdmin();

  // If teacher, only show their own courses
  const whereCondition = session.user.role === "teacher"
    ? { userId: session.user.id }
    : {};

  const data = await prisma.course.findMany({
    where: whereCondition,
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      title: true,
      smallDescription: true,
      duration: true,
      level: true,
      status: true,
      price: true,
      fileKey: true,
      slug: true,
    },
  });

  return data;
}

export type AdminCourseType = Awaited<ReturnType<typeof adminGetCourses>>[0];
