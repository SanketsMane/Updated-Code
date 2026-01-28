import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { generateCertificate } from "@/app/actions/certificates";

/**
 * Update lesson progress for a course
 * @author Sanket
 */
export async function PUT(
    req: Request,
    { params }: { params: Promise<{ slug: string; lessonId: string }> }
) {
    try {
        const { isCompleted } = await req.json();
        const { slug, lessonId } = await params;

        const session = await auth.api.getSession({ headers: await headers() });
        const user = session?.user;

        if (!user || !user.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Get courseId from slug
        const course = await prisma.course.findUnique({
            where: { slug },
            select: { id: true }
        });

        if (!course) {
            return new NextResponse("Course not found", { status: 404 });
        }

        const courseId = course.id;

        // Upsert progress
        const progress = await prisma.lessonProgress.upsert({
            where: {
                userId_lessonId: {
                    userId: user.id,
                    lessonId: lessonId,
                },
            },
            update: {
                completed: isCompleted,
            },
            create: {
                userId: user.id,
                lessonId: lessonId,
                completed: isCompleted,
            },
        });

        // Check if course is fully completed
        let certificateId = null;
        if (isCompleted) {
            // Count total lessons
            const totalLessons = await prisma.lesson.count({
                where: {
                    Chapter: {
                        courseId: courseId
                    }
                }
            });

            // Count completed lessons
            const completedLessons = await prisma.lessonProgress.count({
                where: {
                    userId: user.id,
                    completed: true,
                    Lesson: {
                        Chapter: {
                            courseId: courseId
                        }
                    }
                }
            });

            if (totalLessons > 0 && totalLessons === completedLessons) {
                // Auto generate certificate
                const certResult = await generateCertificate(courseId);
                if (certResult.status === "success") {
                    certificateId = certResult.id;
                }
            }
        }

        return NextResponse.json({
            ...progress,
            certificateCreated: !!certificateId,
            certificateId
        });

    } catch (error) {
        console.log("[LESSON_PROGRESS]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
