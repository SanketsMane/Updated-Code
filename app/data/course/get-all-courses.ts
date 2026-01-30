import "server-only";

import { prisma } from "@/lib/db";
import { getSessionWithRole } from "@/app/data/auth/require-roles";

export type PublicCourseType = {
  id: string;
  title: string;
  smallDescription: string | null;
  price: number;
  level: string;
  category: string;
  fileKey: string | null;
  slug: string;
  duration: number | null;
  createdAt: string;
  userId: string;
  user: {
    name: string;
    image: string | null;
  };
  isEnrolled: boolean;
  firstChapterId?: string;
};

export async function getAllCourses(): Promise<PublicCourseType[]> {
  const session = await getSessionWithRole();
  const userId = session?.user.id;

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
      userId: true,
      user: {
        select: {
          name: true,
          image: true
        }
      },
      chapter: {
        take: 1,
        orderBy: { position: "asc" },
        select: { id: true }
      },
      enrollment: userId ? {
        where: { userId: userId },
        select: { status: true }
      } : false
    },
  });

  return data.map(course => {
    const isEnrolled = !!(course.enrollment && (course.enrollment as any[]).length > 0 && (course.enrollment as any[])[0].status === "Active");
    const isOwner = !!(userId && course.userId === userId);
    const isAdmin = (session?.user as any)?.role === "admin";

    return {
      ...course,
      createdAt: course.createdAt.toISOString(),
      isEnrolled: isEnrolled || isOwner || isAdmin,
      firstChapterId: course.chapter[0]?.id
    };
  });
}
