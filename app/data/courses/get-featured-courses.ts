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

        return featuredCourses;
    } catch (error) {
        console.error("Failed to fetch featured courses:", error);
        return [];
    }
});
