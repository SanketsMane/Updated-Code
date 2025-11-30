import "server-only";

import { prisma } from "@/lib/db";
import { subDays, format } from "date-fns";

export interface EnrollmentData {
  date: string;
  enrollments: number;
}

export async function getEnrollmentData(days: number = 30): Promise<EnrollmentData[]> {
  const dates = Array.from({ length: days }, (_, i) => 
    subDays(new Date(), days - 1 - i)
  );

  const enrollmentData = await Promise.all(
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
      };
    })
  );

  return enrollmentData;
}