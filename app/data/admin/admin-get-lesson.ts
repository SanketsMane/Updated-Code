import "server-only";
import { prisma } from "@/lib/db";
import { requireTeacherOrAdmin } from "../auth/require-roles";
import { notFound } from "next/navigation";

export async function adminGetLesson(id: string) {
  const session = await requireTeacherOrAdmin();

  let data;

  if (session.user.role === "teacher") {
    data = await prisma.lesson.findFirst({
      where: {
        id: id,
        Chapter: {
          Course: {
            userId: session.user.id
          }
        }
      },
      select: {
        title: true,
        videoKey: true,
        thumbnailKey: true,
        description: true,
        id: true,
        position: true,
        videoUrl: true,
      },
    });
  } else {
    data = await prisma.lesson.findUnique({
      where: {
        id: id,
      },
      select: {
        title: true,
        videoKey: true,
        thumbnailKey: true,
        description: true,
        id: true,
        position: true,
        videoUrl: true,
      },
    });
  }

  if (!data) {
    return notFound();
  }

  return data;
}

export type AdminLessonType = Awaited<ReturnType<typeof adminGetLesson>>;
