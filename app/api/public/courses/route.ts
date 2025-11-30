import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Get featured and popular courses
    const featuredCourses = await prisma.course.findMany({
      where: {
        status: "PUBLISHED",
        OR: [
          { isFeatured: true },
          { totalEnrollments: { gte: 10 } }, // Popular courses
          { avgRating: { gte: 4.5 } }, // Highly rated courses
        ],
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        teacherProfile: {
          select: {
            avgRating: true,
            totalStudents: true,
            isVerified: true,
          },
        },
        _count: {
          select: {
            enrollments: true,
            reviews: true,
          },
        },
      },
      orderBy: [
        { isFeatured: "desc" },
        { avgRating: "desc" },
        { totalEnrollments: "desc" },
        { createdAt: "desc" },
      ],
      take: 20, // Limit for homepage display
    });

    // Get course categories with counts
    const categories = await prisma.course.groupBy({
      by: ["category"],
      where: {
        status: "PUBLISHED",
      },
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: "desc",
        },
      },
    });

    // Get some statistics for the homepage
    const stats = await prisma.course.aggregate({
      where: {
        status: "PUBLISHED",
      },
      _count: {
        id: true,
      },
    });

    const teacherStats = await prisma.teacherProfile.aggregate({
      where: {
        isVerified: true,
      },
      _count: {
        id: true,
      },
    });

    const studentStats = await prisma.user.aggregate({
      where: {
        role: "USER",
      },
      _count: {
        id: true,
      },
    });

    return NextResponse.json({
      courses: featuredCourses,
      categories: categories.map(cat => ({
        name: cat.category,
        count: cat._count.id,
      })),
      stats: {
        totalCourses: stats._count.id,
        totalTeachers: teacherStats._count.id,
        totalStudents: studentStats._count.id,
      },
    });
  } catch (error) {
    console.error("Error fetching featured courses:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}