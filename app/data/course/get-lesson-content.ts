import { getSessionWithRole } from "@/app/data/auth/require-roles";
import { prisma } from "@/lib/db";
import { notFound, redirect } from "next/navigation";

export async function getLessonContent(lessonId: string) {
  const session = await getSessionWithRole();

  if (!session) {
    return redirect("/login");
  }

  const lesson = await prisma.lesson.findUnique({
    where: {
      id: lessonId,
    },
    select: {
      id: true,
      title: true,
      description: true,
      thumbnailKey: true,
      videoKey: true,
      position: true,
      lessonProgress: {
        where: {
          userId: session.user.id,
        },
        select: {
          completed: true,
          lessonId: true,
        },
      },
      Chapter: {
        select: {
          courseId: true,
          Course: {
            select: {
              id: true,
              title: true,
              slug: true,
              userId: true, // Select userId to check ownership
            },
          },
        },
      },
    },
  });

  if (!lesson) {
    return notFound();
  }

  // Allow access if user is admin or course owner
  if (session.user.role === "admin" || lesson.Chapter.Course.userId === session.user.id) {
    return lesson;
  }

  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: session.user.id,
        courseId: lesson.Chapter.courseId,
      },
    },
    select: {
      status: true,
    },
  });

  if (!enrollment || enrollment.status !== "Active") {
    return notFound();
  }
  return lesson;
}

export type LessonContentType = Awaited<ReturnType<typeof getLessonContent>>;
