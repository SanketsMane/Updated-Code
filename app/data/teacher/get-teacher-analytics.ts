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
}

export async function getTeacherAnalytics(userId: string): Promise<TeacherAnalytics> {
  // Get teacher's courses
  const teacherCourses = await prisma.course.findMany({
    where: {
      userId: userId,
      status: "Published",
    },
    select: {
      id: true,
      createdAt: true,
      enrollment: {
        select: {
          id: true,
          createdAt: true,
          status: true,
        },
      },
    },
  });

  const courseIds = teacherCourses.map(course => course.id);

  // Calculate metrics
  const totalCourses = teacherCourses.length;
  const uniqueStudentsGroup = await prisma.enrollment.groupBy({
    where: {
      courseId: {
        in: courseIds,
      },
    },
    by: ['userId'],
  });
  
  const totalStudents = uniqueStudentsGroup.length;

  // Calculate engagement rate (based on completion percentage)
  const enrollments = await prisma.enrollment.findMany({
    where: {
      courseId: {
        in: courseIds,
      },
    },
    select: {
      amount: true,
    },
  });

  const averageCompletion = enrollments.length > 0
    ? enrollments.reduce((sum, enrollment) => sum + (enrollment.amount || 0), 0) / enrollments.length
    : 0;

  const engagementRate = Math.min(averageCompletion, 100); // Cap at 100%

  // Calculate growth metrics (comparing last 30 days to previous 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const sixtyDaysAgo = new Date();
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

  const [recentEnrollments, previousEnrollments, recentCourses, previousCourses] = await Promise.all([
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
  ]);

  const studentGrowth = previousEnrollments > 0 
    ? ((recentEnrollments - previousEnrollments) / previousEnrollments) * 100 
    : 0;

  const courseGrowth = previousCourses > 0 
    ? ((recentCourses - previousCourses) / previousCourses) * 100 
    : 0;

  return {
    totalStudents,
    totalCourses,
    totalRevenue: 0, // TODO: Implement when payment system is active
    engagementRate,
    studentGrowth,
    courseGrowth,
    revenueGrowth: 0, // TODO: Implement when payment system is active
    engagementGrowth: 0, // TODO: Calculate historical engagement
  };
}