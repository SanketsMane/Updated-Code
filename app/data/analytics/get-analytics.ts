import "server-only";

import { prisma } from "@/lib/db";
import { subDays, format } from "date-fns";

export interface AnalyticsOverview {
  totalStudents: number;
  totalCourses: number;
  totalRevenue: number;
  averageCompletion: number;
  studentGrowth: number;
  courseGrowth: number;
  revenueGrowth: number;
  completionGrowth: number;
}

export interface EnrollmentTrend {
  date: string;
  enrollments: number;
  revenue: number;
}

export interface CoursePerformance {
  id: string;
  title: string;
  enrollments: number;
  completionRate: number;
  averageRating: number;
  revenue: number;
  category: string;
}

export interface AnalyticsData {
  overview: AnalyticsOverview;
  enrollmentTrends: EnrollmentTrend[];
  coursePerformance: CoursePerformance[];
}

export async function getAnalyticsOverview(): Promise<AnalyticsOverview> {
  const [
    totalStudents,
    totalCourses,
    enrollmentsLast30Days,
    enrollmentsPrevious30Days,
    coursesLast30Days,
    coursesPrevious30Days,
    totalRevenueResult,
    revenueLast30DaysResult,
    revenuePrevious30DaysResult
  ] = await Promise.all([
    // Total students (users with enrollments)
    prisma.user.count({
      where: {
        enrollment: {
          some: {},
        },
      },
    }),

    // Total published courses
    prisma.course.count({
      where: {
        status: "Published",
      },
    }),

    // Enrollments in last 30 days
    prisma.enrollment.count({
      where: {
        createdAt: {
          gte: subDays(new Date(), 30),
        },
      },
    }),

    // Enrollments in previous 30 days (30-60 days ago)
    prisma.enrollment.count({
      where: {
        createdAt: {
          gte: subDays(new Date(), 60),
          lt: subDays(new Date(), 30),
        },
      },
    }),

    // Courses created in last 30 days
    prisma.course.count({
      where: {
        status: "Published",
        createdAt: {
          gte: subDays(new Date(), 30),
        },
      },
    }),

    // Courses created in previous 30 days
    prisma.course.count({
      where: {
        status: "Published",
        createdAt: {
          gte: subDays(new Date(), 60),
          lt: subDays(new Date(), 30),
        },
      },
    }),

    // Total Revenue (GMV)
    prisma.commission.aggregate({
      _sum: {
        amount: true
      }
    }),

    // Revenue Last 30 Days
    prisma.commission.aggregate({
      _sum: { amount: true },
      where: {
        createdAt: { gte: subDays(new Date(), 30) }
      }
    }),

    // Revenue Previous 30 Days
    prisma.commission.aggregate({
      _sum: { amount: true },
      where: {
        createdAt: {
          gte: subDays(new Date(), 60),
          lt: subDays(new Date(), 30)
        }
      }
    })
  ]);

  // Calculate growth percentages
  const studentGrowth = enrollmentsPrevious30Days > 0
    ? ((enrollmentsLast30Days - enrollmentsPrevious30Days) / enrollmentsPrevious30Days) * 100
    : 0;

  const courseGrowth = coursesPrevious30Days > 0
    ? ((coursesLast30Days - coursesPrevious30Days) / coursesPrevious30Days) * 100
    : 0;

  const revenueLast30 = revenueLast30DaysResult._sum.amount || 0;
  const revenuePrevious30 = revenuePrevious30DaysResult._sum.amount || 0;
  const revenueGrowth = revenuePrevious30 > 0
    ? ((revenueLast30 - revenuePrevious30) / revenuePrevious30) * 100
    : 0;

  const totalRevenue = totalRevenueResult._sum.amount || 0;

  // Get completion rate
  // This is still tricky without a dedicated "CompletedCourse" model or complex query
  // For now, we'll keep the averageCompletion simple or 0 if no data
  const averageCompletion = 0;

  return {
    totalStudents,
    totalCourses,
    totalRevenue,
    averageCompletion,
    studentGrowth,
    courseGrowth,
    revenueGrowth,
    completionGrowth: 0,
  };
}

export async function getEnrollmentTrends(): Promise<EnrollmentTrend[]> {
  const dates = Array.from({ length: 30 }, (_, i) =>
    subDays(new Date(), 29 - i)
  );

  const trends = await Promise.all(
    dates.map(async (date) => {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const [enrollments, revenueResult] = await Promise.all([
        prisma.enrollment.count({
          where: {
            createdAt: {
              gte: startOfDay,
              lte: endOfDay,
            },
          },
        }),
        prisma.commission.aggregate({
          _sum: { amount: true },
          where: {
            createdAt: {
              gte: startOfDay,
              lte: endOfDay
            }
          }
        })
      ]);

      return {
        date: format(date, 'yyyy-MM-dd'),
        enrollments,
        revenue: revenueResult._sum.amount || 0,
      };
    })
  );

  return trends;
}

export async function getCoursePerformance(): Promise<CoursePerformance[]> {
  const courses = await prisma.course.findMany({
    where: {
      status: "Published",
    },
    select: {
      id: true,
      title: true,
      category: true,
      price: true,
      enrollment: {
        select: {
          id: true,
          status: true,
        },
      },
      _count: {
        select: {
          enrollment: true,
        },
      },
      // We can't easily aggregate revenue inside findMany without raw query or separate call
      // So we will fetch basic info and then map
    },
    orderBy: {
      enrollment: {
        _count: "desc",
      },
    },
    take: 10,
  });

  const coursesWithRevenue = await Promise.all(courses.map(async (course) => {
    const revenueResult = await prisma.commission.aggregate({
      _sum: { amount: true },
      where: { courseId: course.id }
    });

    const totalEnrollments = course._count?.enrollment || 0;

    // Calculate completion rate based on 'completed' status in lessonProgress (hard to do here effeciently)
    // or just assume active for now.
    const completionRate = 0;

    return {
      id: course.id,
      title: course.title,
      enrollments: totalEnrollments,
      completionRate,
      averageRating: 0,
      revenue: revenueResult._sum.amount || 0,
      category: course.category,
    };
  }));

  return coursesWithRevenue;
}

export async function getAnalyticsData(): Promise<AnalyticsData> {
  const [overview, enrollmentTrends, coursePerformance] = await Promise.all([
    getAnalyticsOverview(),
    getEnrollmentTrends(),
    getCoursePerformance(),
  ]);

  return {
    overview,
    enrollmentTrends,
    coursePerformance,
  };
}