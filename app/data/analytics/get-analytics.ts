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
  ]);

  // Calculate growth percentages
  const studentGrowth = enrollmentsPrevious30Days > 0 
    ? ((enrollmentsLast30Days - enrollmentsPrevious30Days) / enrollmentsPrevious30Days) * 100 
    : 0;

  const courseGrowth = coursesPrevious30Days > 0 
    ? ((coursesLast30Days - coursesPrevious30Days) / coursesPrevious30Days) * 100 
    : 0;

  // Get completion rate (simplified calculation)
  const completionData = await prisma.enrollment.aggregate({
    _avg: {
      amount: true,
    },
    where: {
      amount: {
        gt: 0,
      },
    },
  });

  const averageCompletion = completionData._avg?.amount || 0;

  return {
    totalStudents,
    totalCourses,
    totalRevenue: 0, // TODO: Implement when payment system is active
    averageCompletion,
    studentGrowth,
    courseGrowth,
    revenueGrowth: 0, // TODO: Implement when payment system is active
    completionGrowth: 0, // TODO: Calculate based on historical data
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

      const enrollments = await prisma.enrollment.count({
        where: {
          createdAt: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      });

      return {
        date: format(date, 'yyyy-MM-dd'),
        enrollments,
        revenue: 0, // TODO: Implement when payment system is active
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
    },
    orderBy: {
      enrollment: {
        _count: "desc",
      },
    },
    take: 10, // Top 10 performing courses
  });

  return courses.map((course) => {
    const totalEnrollments = course._count?.enrollment || 0;
    const completedEnrollments = 0; // Will be calculated differently

    const completionRate = totalEnrollments > 0 
      ? (completedEnrollments / totalEnrollments) * 100 
      : 0;

    return {
      id: course.id,
      title: course.title,
      enrollments: totalEnrollments,
      completionRate,
      averageRating: 0, // TODO: Implement when rating system is active
      revenue: 0, // TODO: Implement when payment system is active
      category: course.category,
    };
  });
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