"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { SessionType } from "@prisma/client";

export async function updateTeacherPricing(formData: any) {
    const { teacherId, allowFreeDemo, allowFreeGroup, pricing } = formData;

    try {
        await prisma.teacherProfile.update({
            where: { id: teacherId },
            data: {
                allowFreeDemo,
                allowFreeGroup
            }
        });

        // Upsert pricing
        for (const item of pricing) {
             // type, price, duration
             await prisma.teacherPricing.upsert({
                where: {
                    teacherId_type: {
                        teacherId,
                        type: item.type as SessionType
                    }
                },
                create: {
                    teacherId,
                    type: item.type as SessionType,
                    price: item.price,
                    duration: item.duration || 60
                },
                update: {
                    price: item.price,
                    duration: item.duration || 60
                }
             });
        }

        revalidatePath("/teacher/pricing");
        return { success: true };
    } catch (error) {
        console.error("Update pricing error:", error);
        return { error: "Failed to update pricing" };
    }
}
