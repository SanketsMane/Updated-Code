"use server";

import { requireTeacherOrAdmin } from "@/app/data/auth/require-roles";
import { protectAdminAction } from "@/lib/action-security";
import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { ApiResponse } from "@/lib/types";
import { courseSchema, CourseSchemaType } from "@/lib/zodSchemas";

export async function CreateCourse(
  values: CourseSchemaType
): Promise<ApiResponse> {
  const session = await requireTeacherOrAdmin();

  try {
    // Apply security protection for admin actions
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

    const data = await stripe.products.create({
      name: validation.data.title,
      description: validation.data.smallDescription,
      default_price_data: {
        currency: "usd",
        unit_amount: validation.data.price * 100,
      },
    });

    await prisma.course.create({
      data: {
        ...validation.data,
        userId: session?.user.id as string,
        stripePriceId: data.default_price as string,
      },
    });

    return {
      status: "success",
      message: "Course created succesfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to create course",
    };
  }
}
