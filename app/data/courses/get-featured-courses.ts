import { prisma } from "@/lib/db";
import { cache } from "react";

export const getFeaturedCourses = cache(async () => {
    try {
        const featuredCourses = await prisma.course.findMany({
            where: {
                isFeatured: true,
                status: "Published",
            },
            take: 4,
            orderBy: {
                totalStudents: "desc",
            },
            include: {
                user: {
                    include: {
                        teacherProfile: true,
                    },
                },
                reviews: {
                    select: {
                        rating: true,
                    },
                },
                _count: {
                    select: {
                        chapter: true,
                    }
                },
                categoryModel: true,
            },
        });

        // Convert Decimal fields to numbers for client component compatibility
        // Author: Sanket
        return featuredCourses.map(course => ({
            ...course,
            user: {
                ...course.user,
                teacherProfile: course.user.teacherProfile ? {
                    ...course.user.teacherProfile,
                    totalEarnings: course.user.teacherProfile.totalEarnings.toNumber(),
                    hourlyRate: Number(course.user.teacherProfile.hourlyRate),
                } : null
            }
        }));
    } catch (error) {
        console.error("Failed to fetch featured courses:", error);
        return [];
    }
});

