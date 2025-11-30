import "server-only";

import { prisma } from "@/lib/db";

export async function getCategories() {
  const categories = await prisma.category.findMany({
    where: {
      isActive: true,
    },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return categories;
}

export async function getCourseCategories() {
  const courses = await prisma.course.findMany({
    where: {
      status: "Published",
    },
    select: {
      category: true,
    },
    distinct: ["category"],
  });

  return courses.map(course => course.category).filter(Boolean);
}

export async function getCourseLevels() {
  return ["Beginner", "Intermediate", "Advanced"] as const;
}

export async function getCourseDurations() {
  const courses = await prisma.course.findMany({
    where: {
      status: "Published",
      duration: {
        gt: 0,
      },
    },
    select: {
      duration: true,
    },
    distinct: ["duration"],
  });

  // Group durations into ranges
  const durations = courses.map(course => course.duration).filter(Boolean);
  const durationRanges = ["0-2 hours", "2-6 hours", "6+ hours"];
  
  return durationRanges;
}

export type CategoryType = Awaited<ReturnType<typeof getCategories>>[0];