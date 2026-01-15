"use server";

import { requireUser } from "@/app/data/user/require-user";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const profileSchema = z.object({
    name: z.string().min(2, "Name is required"),
    bio: z.string().optional(),
    education: z.string().optional(), // Could be JSON later, text for now
    image: z.string().optional(),
});

export async function updateProfile(prevState: any, formData: FormData) {
    const user = await requireUser();

    const data = {
        name: formData.get("name") as string,
        bio: formData.get("bio") as string,
        education: formData.get("education") as string,
        image: formData.get("image") as string,
    };

    const validation = profileSchema.safeParse(data);

    if (!validation.success) {
        return {
            status: "error",
            message: validation.error.errors[0].message,
        };
    }

    try {
        await prisma.user.update({
            where: { id: user.id },
            data: {
                name: validation.data.name,
                bio: validation.data.bio,
                education: validation.data.education,
                image: validation.data.image,
            },
        });

        revalidatePath("/dashboard/settings");
        revalidatePath("/dashboard");

        return {
            status: "success",
            message: "Profile updated successfully",
        };
    } catch (error) {
        return {
            status: "error",
            message: "Failed to update profile",
        };
    }
}
