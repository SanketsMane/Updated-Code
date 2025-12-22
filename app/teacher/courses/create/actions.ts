"use server";

import { getSessionWithRole } from "@/app/data/auth/require-roles";
import { protectAdminAction } from "@/lib/action-security";
import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { ApiResponse } from "@/lib/types";
import { courseSchema, CourseSchemaType } from "@/lib/zodSchemas";

export async function CreateCourse(
    values: CourseSchemaType
): Promise<ApiResponse> {
    const session = await getSessionWithRole();

    if (!session || (session.user.role !== "admin" && session.user.role !== "teacher")) {
        return {
            status: "error",
            message: "Unauthorized: You must be a teacher or admin to create a course",
        };
    }

    try {
        // Reusing the admin protection rate limit for now (it works on userId)
        // In future, can rename to protectTeacherAction if specific limits needed
        const securityCheck = await protectAdminAction(session.user.id);
        if (!securityCheck.success) {
            return {
                status: "error",
                message: securityCheck.error || "Security check failed",
            };
        }

        const validation = courseSchema.safeParse(values);

        if (!validation.success) {
            return {
                status: "error",
                message: "Invalid Form Data",
            };
        }

        let stripePriceId: string | null = null;
        try {
            const data = await stripe.products.create({
                name: validation.data.title,
                description: validation.data.smallDescription,
                default_price_data: {
                    currency: "usd",
                    unit_amount: validation.data.price * 100,
                },
            });
            stripePriceId = data.default_price as string;
        } catch (stripeError) {
            console.error("Stripe creation failed (continuing with dummy ID):", stripeError);
            // Proceed without stripe ID for dev/testing. Unique constraint allows multiple nulls.
        }

        await prisma.course.create({
            data: {
                ...validation.data,
                user: {
                    connect: {
                        id: session?.user.id as string,
                    },
                },
                stripePriceId: stripePriceId,
            },
        });

        return {
            status: "success",
            message: "Course created succesfully",
        };
    } catch (error: any) {
        console.error("Course creation error:", error);
        return {
            status: "error",
            message: error.message || "Failed to create course",
        };
    }
}
