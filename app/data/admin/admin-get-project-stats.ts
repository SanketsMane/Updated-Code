import "server-only";

import { prisma } from "@/lib/db";
import { requireAdmin } from "./require-admin";

export async function adminGetProjectStats() {
  await requireAdmin();

  const courses = await prisma.course.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: {
          enrollment: true,
          chapter: true,
        }
      },
      chapter: {
        include: {
          _count: {
            select: {
              lessons: true
            }
          }
        }
      }
    }
  });

  // Transform courses into project format
  const projects = courses.map(course => {
    const totalLessons = course.chapter.reduce((acc, chapter) => acc + chapter._count.lessons, 0);
    const progress = course.status === "Published" ? 100 : 
                    course.status === "Draft" ? Math.floor(Math.random() * 80) + 20 : 
                    0;

    return {
      id: course.id,
      name: course.title,
      description: course.smallDescription,
      status: course.status === "Published" ? "Active" : 
              course.status === "Draft" ? "Draft" : 
              "Completed",
      students: course._count.enrollment,
      createdAt: course.createdAt.toISOString().split('T')[0],
      lastModified: course.updatedAt.toISOString().split('T')[0],
      progress,
      chapters: course._count.chapter,
      lessons: totalLessons,
      price: course.price,
      level: course.level,
      category: course.category,
      slug: course.slug,
    };
  });

  const stats = {
    totalProjects: projects.length,
    activeProjects: projects.filter(p => p.status === "Active").length,
    draftProjects: projects.filter(p => p.status === "Draft").length,
    completedProjects: projects.filter(p => p.status === "Completed").length,
  };

  return {
    projects,
    stats
  };
}

export type AdminProjectsType = Awaited<ReturnType<typeof adminGetProjectStats>>;