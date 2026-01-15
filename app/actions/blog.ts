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

export async function createBlogPost(prevState: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const user = await requireAdmin();

    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const excerpt = formData.get("excerpt") as string;
    const isPublished = formData.get("isPublished") === "on";
    const coverImage = formData.get("coverImage") as string;
    let slug = formData.get("slug") as string;

    if (!title) return { error: "Title is required" };

    if (!slug) {
      slug = slugify(title, { lower: true, strict: true });
    }

    const existing = await prisma.blogPost.findUnique({ where: { slug } });
    if (existing) return { error: "Post with this slug already exists" };

    await prisma.blogPost.create({
      data: {
        title,
        slug,
        content: content || "",
        excerpt,
        featuredImage: coverImage,
        isPublished,
        publishedAt: isPublished ? new Date() : null,
        authorId: user.id,
      },
    });

    revalidatePath("/admin/blog");
    return { success: true, timestamp: Date.now() };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function updateBlogPost(prevState: ActionState, formData: FormData): Promise<ActionState> {
  try {
    await requireAdmin();

    const id = formData.get("id") as string;
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const excerpt = formData.get("excerpt") as string;
    const isPublished = formData.get("isPublished") === "on";
    const coverImage = formData.get("coverImage") as string;
    const slug = formData.get("slug") as string;

    if (!id || !title) return { error: "ID and Title are required" };

    const existing = await prisma.blogPost.findFirst({
      where: { slug, NOT: { id } }
    });
    if (existing) return { error: "Post with this slug already exists" };

    await prisma.blogPost.update({
      where: { id },
      data: {
        title,
        slug,
        content,
        excerpt,
        featuredImage: coverImage,
        isPublished,
        publishedAt: isPublished ? (new Date()) : null, // Should we reset date? Maybe check if it was already published.
        // For simplicity, update publishedAt if publishing now.
      },
    });

    revalidatePath("/admin/blog");
    return { success: true, timestamp: Date.now() };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function deleteBlogPost(id: string) {
  try {
    await requireAdmin();
    await prisma.blogPost.delete({ where: { id } });
    revalidatePath("/admin/blog");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}