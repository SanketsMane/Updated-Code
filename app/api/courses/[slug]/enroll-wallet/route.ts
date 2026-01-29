import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/app/data/user/require-user";
import { prisma } from "@/lib/db";
import { deductFromWallet } from "@/app/actions/wallet";
import { createCourseNotification } from "@/app/actions/notifications";

/**
 * Enroll in a course using wallet balance
 * @author Sanket
 */
export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const user = await requireUser();
        const { slug } = await params;

        // Get course details
        const course = await prisma.course.findUnique({
            where: { slug },
            select: {
                id: true,
                title: true,
                price: true,
                userId: true,
                user: {
                    select: { email: true, name: true }
                }
            }
        });

        if (!course) {
            return NextResponse.json(
                { error: "Course not found" },
                { status: 404 }
            );
        }

        // Check if already enrolled
        const existingEnrollment = await prisma.enrollment.findUnique({
            where: {
                userId_courseId: {
                    userId: user.id,
                    courseId: course.id
                }
            }
        });

        if (existingEnrollment) {
            return NextResponse.json(
                { error: "Already enrolled in this course" },
                { status: 400 }
            );
        }

        // Deduct from wallet and create enrollment atomically
        const result = await prisma.$transaction(async (tx) => {
            // Deduct wallet balance
            await deductFromWallet(
                user.id,
                course.price,
                "COURSE_PURCHASE",
                `Enrolled in "${course.title}"`,
                { courseId: course.id, courseTitle: course.title }
            );

            // Create enrollment
            const enrollment = await tx.enrollment.create({
                data: {
                    userId: user.id,
                    courseId: course.id,
                    amount: course.price,
                    status: "Active"
                }
            });

            // Create commission record for teacher
            const commissionRate = 0.20; // 20% platform fee
            const commissionAmount = Math.round(course.price * commissionRate);
            const netAmount = course.price - commissionAmount;

            await tx.commission.create({
                data: {
                    teacherId: course.userId,
                    amount: netAmount,
                    commission: commissionAmount,
                    commissionAmount,
                    netAmount,
                    type: "Course",
                    status: "Pending",
                    description: `Course sale: ${course.title}`,
                    metadata: {
                        courseId: course.id,
                        enrollmentId: enrollment.id,
                        studentId: user.id
                    }
                }
            });

            // Create notification
            await tx.notification.create({
                data: {
                    userId: user.id,
                    title: "Course Enrollment Successful",
                    message: `You've successfully enrolled in "${course.title}" using your wallet.`,
                    type: "Course"
                }
            });

            return enrollment;
        });

        // Send notification (non-blocking)
        createCourseNotification(user.id, course.id, "enrolled").catch(console.error);

        return NextResponse.json({
            success: true,
            enrollmentId: result.id,
            message: "Successfully enrolled using wallet"
        });

    } catch (error: any) {
        console.error("Wallet enrollment error:", error);

        // Handle insufficient balance error
        if (error.message?.includes("Insufficient balance")) {
            return NextResponse.json(
                { error: error.message },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: error.message || "Failed to enroll in course" },
            { status: 500 }
        );
    }
}
