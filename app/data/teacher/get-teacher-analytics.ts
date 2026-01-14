import "server-only";

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

export interface TeacherAnalytics {
  totalStudents: number;
  totalCourses: number;
  totalRevenue: number;
  engagementRate: number;
  studentGrowth: number;
  courseGrowth: number;
  revenueGrowth: number;
  engagementGrowth: number;
  graphData: { date: string; revenue: number; students: number }[];
}

export async function getTeacherAnalytics(userId: string): Promise<TeacherAnalytics> {
  // Get teacher profile to access teacherId
  const teacherProfile = await prisma.teacherProfile.findUnique({
    where: { userId: userId },
    select: { id: true }
  });

  if (!teacherProfile) {
    // Return empty analytics if no teacher profile exists
    return {
      totalStudents: 0,
      totalCourses: 0,
      totalRevenue: 0,
      engagementRate: 0,
      studentGrowth: 0,
      courseGrowth: 0,
      revenueGrowth: 0,
      engagementGrowth: 0,
      graphData: []
    };
  }

  const teacherId = teacherProfile.id;

  // Get teacher's courses
  const teacherCourses = await prisma.course.findMany({
    where: {
      userId: userId,
    },
    include: {
      enrollment: true,
      chapter: {
        include: {
          lessons: true
        }
      }
    }
  });

  const courseIds = teacherCourses.map((course: any) => course.id);

  // Calculate metrics
  const totalCourses = teacherCourses.length;
  const totalStudents = await prisma.enrollment.count({
    where: {
      courseId: {
        in: courseIds,
      },
    },
  });

  // Calculate Revenue from Commission table (Net Earnings)
  // Author: Sanket
  // This uses the Commission table to get the teacher's actual earnings (after platform fee)
  const totalRevenueResult = await prisma.commission.aggregate({
    _sum: { amount: true },
    where: {
      teacherId: teacherId,
      amount: { gt: 0 } // Exclude refunded (negative) commissions
    }
  });

  const totalRevenue = (totalRevenueResult._sum?.amount ?? 0);

  // Calculate Engagement Rate (Average Completion %)
  const courseLessonCounts = new Map<string, number>();
  teacherCourses.forEach((c: any) => {
    const lessonCount = c.chapter.reduce((sum: number, chapter: any) => sum + chapter.lessons.length, 0);
    courseLessonCounts.set(c.id, lessonCount);
  });

  // Get all lesson progress for these courses
  const progress = await prisma.lessonProgress.findMany({
    where: {
      Lesson: {
        Chapter: {
          courseId: {
            in: courseIds
          }
        }
      },
      completed: true
    }
  });

  let totalPossibleLessons = 0;
  teacherCourses.forEach((course: any) => {
    const lessonsInCourse = courseLessonCounts.get(course.id) || 0;
    const studentsInCourse = course.enrollment.length;
    totalPossibleLessons += (lessonsInCourse * studentsInCourse);
  });

  const engagementRate = totalPossibleLessons > 0
    ? (progress.length / totalPossibleLessons) * 100
    : 0;


  // Calculate growth metrics (comparing last 30 days to previous 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const sixtyDaysAgo = new Date();
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

  // Author: Sanket
  // Updated to use Commission table for revenue calculations
  const [recentEnrollments, previousEnrollments, recentCourses, previousCourses, recentRevenue, previousRevenue] = await Promise.all([
    prisma.enrollment.count({
      where: {
        courseId: { in: courseIds },
        createdAt: { gte: thirtyDaysAgo },
      },
    }),
    prisma.enrollment.count({
      where: {
        courseId: { in: courseIds },
        createdAt: {
          gte: sixtyDaysAgo,
          lt: thirtyDaysAgo,
        },
      },
    }),
    prisma.course.count({
      where: {
        userId: userId,
        status: "Published",
        createdAt: { gte: thirtyDaysAgo },
      },
    }),
    prisma.course.count({
      where: {
        userId: userId,
        status: "Published",
        createdAt: {
          gte: sixtyDaysAgo,
          lt: thirtyDaysAgo,
        },
      },
    }),
    prisma.commission.aggregate({
      _sum: { amount: true },
      where: {
        teacherId: teacherId,
        amount: { gt: 0 },
        createdAt: { gte: thirtyDaysAgo },
      }
    }),
    prisma.commission.aggregate({
      _sum: { amount: true },
      where: {
        teacherId: teacherId,
        amount: { gt: 0 },
        createdAt: {
          gte: sixtyDaysAgo,
          lt: thirtyDaysAgo,
        },
      }
    }),
  ]);

  const studentGrowth = previousEnrollments > 0
    ? ((recentEnrollments - previousEnrollments) / previousEnrollments) * 100
    : 0;

  const courseGrowth = previousCourses > 0
    ? ((recentCourses - previousCourses) / previousCourses) * 100
    : 0;

  const recentRev = recentRevenue._sum?.amount ?? 0;
  const prevRev = previousRevenue._sum?.amount ?? 0;
  const revenueGrowth = prevRev > 0
    ? ((recentRev - prevRev) / prevRev) * 100
    : 0;

  // Calculate Graph Data (Last 30 days) using Commission table
  // Author: Sanket
  // Fetches daily commission data for accurate revenue visualization
  const graphData: { date: string; revenue: number; students: number }[] = [];
  const today = new Date();

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);

    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);

    const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD

    // Get commissions for this day
    const [dayCommissions, dayEnrollments] = await Promise.all([
      prisma.commission.aggregate({
        _sum: { amount: true },
        where: {
          teacherId: teacherId,
          amount: { gt: 0 },
          createdAt: {
            gte: date,
            lt: nextDate
          }
        }
      }),
      prisma.enrollment.count({
        where: {
          courseId: { in: courseIds },
          createdAt: {
            gte: date,
            lt: nextDate
          }
        }
      })
    ]);

    const dayRevenue = dayCommissions._sum?.amount ?? 0;

    graphData.push({
      date: dateString,
      revenue: dayRevenue / 100, // Convert cents to dollars
      students: dayEnrollments
    });
  }

  return {
    totalStudents,
    totalCourses,
    totalRevenue: totalRevenue / 100, // Convert cents to dollars
    engagementRate,
    studentGrowth,
    courseGrowth,
    revenueGrowth,
    engagementGrowth: 0,
    graphData
  };
}