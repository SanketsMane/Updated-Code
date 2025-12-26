import "server-only";

import { prisma } from "@/lib/db";

export async function getAllCourses() {
  const data = await prisma.course.findMany({
    where: {
      status: "Published",
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      title: true,
      smallDescription: true,
      price: true,
      level: true,
      category: true,
      fileKey: true,
      slug: true,
      duration: true,
      createdAt: true,
    },
  });

  return data.map(course => ({
    ...course,
    createdAt: course.createdAt.toISOString(),
  }));
}

export type PublicCourseType = Awaited<ReturnType<typeof getAllCourses>>[0];
