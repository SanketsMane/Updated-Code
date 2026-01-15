"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import slugify from "slugify";

export type ActionState = {
    success?: boolean;
    error?: string;
    timestamp?: number;
};

async function requireAdmin() {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) throw new Error("Unauthorized");
    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (user?.role !== "admin") throw new Error("Unauthorized");
    return user;
}

export async function createPage(prevState: ActionState, formData: FormData): Promise<ActionState> {
    try {
        await requireAdmin();

        const title = formData.get("title") as string;
        const content = formData.get("content") as string;
        const isPublished = formData.get("isPublished") === "on";
        const metaTitle = formData.get("metaTitle") as string;
        const metaDescription = formData.get("metaDescription") as string;
        let slug = formData.get("slug") as string;

        if (!title) return { error: "Title is required" };

        if (!slug) {
            slug = slugify(title, { lower: true, strict: true });
        }

        // Check slug uniqueness
        const existing = await prisma.page.findUnique({ where: { slug } });
        if (existing) return { error: "Page with this slug already exists" };

        await prisma.page.create({
            data: {
                title,
                slug,
                content: content || "",
                isPublished,
                metaTitle,
                metaDescription,
            },
        });

        revalidatePath("/admin/pages");
        return { success: true, timestamp: Date.now() };
    } catch (error: any) {
        return { error: error.message };
    }
}

export async function updatePage(prevState: ActionState, formData: FormData): Promise<ActionState> {
    try {
        await requireAdmin();

        const id = formData.get("id") as string;
        const title = formData.get("title") as string;
        const content = formData.get("content") as string; // Will come from hidden input or similar
        const isPublished = formData.get("isPublished") === "on";
        const metaTitle = formData.get("metaTitle") as string;
        const metaDescription = formData.get("metaDescription") as string;
        const slug = formData.get("slug") as string;

        if (!id || !title) return { error: "ID and Title are required" };

        // Check slug collision excluding self
        const existing = await prisma.page.findFirst({
            where: { slug, NOT: { id } }
        });
        if (existing) return { error: "Page with this slug already exists" };

        await prisma.page.update({
            where: { id },
            data: {
                title,
                slug,
                content,
                isPublished,
                metaTitle,
                metaDescription,
            },
        });

        revalidatePath("/admin/pages");
        return { success: true, timestamp: Date.now() };
    } catch (error: any) {
        return { error: error.message };
    }
}

export async function deletePage(id: string) {
    try {
        await requireAdmin();
        await prisma.page.delete({ where: { id } });
        revalidatePath("/admin/pages");
        return { success: true };
    } catch (error: any) {
        return { error: error.message };
    }
}
