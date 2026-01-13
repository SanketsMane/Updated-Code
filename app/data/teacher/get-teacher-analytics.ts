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

  // Calculate Revenue
  const totalRevenue = teacherCourses.reduce((acc: number, course) => {
    return acc + course.enrollment.reduce((sum: number, enrollment) => sum + (enrollment.amount || 0), 0);
  }, 0);

  // Calculate Engagement Rate (Average Completion %)
  // First, get total lessons per course
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

  // This is a simplified "Global Engagement" metric: Total Completed Lessons / Total Possible Lessons (Students * CourseLessons)
  // A more accurate one would be average per student, but this is a good aggregate proxy.
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

  // ... (Growth logic remains similar for counts, adding revenue growth)
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
    prisma.enrollment.aggregate({
      _sum: { amount: true },
      where: {
        courseId: { in: courseIds },
        createdAt: { gte: thirtyDaysAgo },
      }
    }),
    prisma.enrollment.aggregate({
      _sum: { amount: true },
      where: {
        courseId: { in: courseIds },
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

  const recentRev = recentRevenue._sum.amount || 0;
  const prevRev = previousRevenue._sum.amount || 0;
  const revenueGrowth = prevRev > 0
    ? ((recentRev - prevRev) / prevRev) * 100
    : 0;

  // Calculate Graph Data (Last 30 days)
  const graphData: { date: string; revenue: number; students: number }[] = [];
  const today = new Date();

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD

    // Filter enrollments for this day
    const dayEnrollments = teacherCourses.flatMap(c => c.enrollment).filter((e: any) => {
      const eDate = new Date(e.createdAt);
      return eDate.toISOString().split('T')[0] === dateString;
    });

    const dayRevenue = dayEnrollments.reduce((sum: number, e: any) => sum + (e.amount || 0), 0);
    const dayStudents = dayEnrollments.length;

    graphData.push({
      date: dateString,
      revenue: dayRevenue / 100, // Convert cents to dollars if stored in cents, assuming standard Stripe usage
      students: dayStudents
    });
  }

  return {
    totalStudents,
    totalCourses,
    totalRevenue,
    engagementRate,
    studentGrowth,
    courseGrowth,
    revenueGrowth,
    engagementGrowth: 0,
    graphData
  };
}