import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

// Get all published blog posts
export async function getBlogPosts(page: number = 1, limit: number = 10, categorySlug?: string, tag?: string) {
  const skip = (page - 1) * limit;

  const where: any = {
    isPublished: true,
  };

  if (categorySlug) {
    where.category = {
      slug: categorySlug,
    };
  }

  if (tag) {
    where.tags = {
      some: {
        slug: tag,
      },
    };
  }

  const [posts, totalCount] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            color: true,
          },
        },
        tags: {
          select: {
            id: true,
            name: true,
            slug: true,
            color: true,
          },
        },
      },
      orderBy: { publishedAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.blogPost.count({ where }),
  ]);

  return {
    posts,
    totalPages: Math.ceil(totalCount / limit),
    currentPage: page,
    totalCount,
  };
}

// Get single blog post by slug
export async function getBlogPostBySlug(slug: string) {
  const post = await prisma.blogPost.findUnique({
    where: { slug },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          image: true,
          teacherProfile: {
            select: {
              bio: true,
              expertise: true,
            },
          },
        },
      },
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
          color: true,
        },
      },
      tags: {
        select: {
          id: true,
          name: true,
          slug: true,
          color: true,
        },
      },
    },
  });

  if (post) {
    // Increment view count
    await prisma.blogPost.update({
      where: { id: post.id },
      data: { views: { increment: 1 } },
    });
  }

  return post;
}

// Get blog categories
export async function getBlogCategories() {
  const categories = await prisma.blogCategory.findMany({
    include: {
      _count: {
        select: {
          posts: {
            where: {
              isPublished: true,
            },
          },
        },
      },
    },
    orderBy: { name: "asc" },
  });

  return categories;
}

// Get popular blog tags
export async function getBlogTags(limit: number = 20) {
  const tags = await prisma.blogTag.findMany({
    include: {
      _count: {
        select: {
          posts: {
            where: {
              isPublished: true,
            },
          },
        },
      },
    },
    orderBy: {
      posts: {
        _count: "desc",
      },
    },
    take: limit,
  });

  return tags;
}

// Get featured blog posts (most viewed or manually selected)
export async function getFeaturedBlogPosts(limit: number = 6) {
  const posts = await prisma.blogPost.findMany({
    where: {
      isPublished: true,
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
          color: true,
        },
      },
      tags: {
        select: {
          id: true,
          name: true,
          slug: true,
          color: true,
        },
      },
    },
    orderBy: [
      { views: "desc" },
      { publishedAt: "desc" },
    ],
    take: limit,
  });

  return posts;
}

// Search blog posts
export async function searchBlogPosts(query: string, page: number = 1, limit: number = 10) {
  const skip = (page - 1) * limit;

  const where = {
    isPublished: true,
    OR: [
      { title: { contains: query, mode: "insensitive" as const } },
      { content: { contains: query, mode: "insensitive" as const } },
      { excerpt: { contains: query, mode: "insensitive" as const } },
    ],
  };

  const [posts, totalCount] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            color: true,
          },
        },
        tags: {
          select: {
            id: true,
            name: true,
            slug: true,
            color: true,
          },
        },
      },
      orderBy: { publishedAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.blogPost.count({ where }),
  ]);

  return {
    posts,
    totalPages: Math.ceil(totalCount / limit),
    currentPage: page,
    totalCount,
  };
}

// Admin: Create blog post
export async function createBlogPost(data: {
  title: string;
  content: string;
  excerpt?: string;
  categoryId?: string;
  tags?: string[];
  featuredImage?: string;
  isPublished?: boolean;
  metaTitle?: string;
  metaDescription?: string;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  // Check if user has permission to create blog posts (admin or teacher)
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { teacherProfile: true },
  });

  if (!user || (user.role !== "admin" && !user.teacherProfile)) {
    throw new Error("Unauthorized to create blog posts");
  }

  // Generate slug from title
  const slug = data.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  // Ensure unique slug
  let finalSlug = slug;
  let counter = 1;
  while (await prisma.blogPost.findUnique({ where: { slug: finalSlug } })) {
    finalSlug = `${slug}-${counter}`;
    counter++;
  }

  const post = await prisma.blogPost.create({
    data: {
      title: data.title,
      slug: finalSlug,
      content: data.content,
      excerpt: data.excerpt,
      authorId: session.user.id,
      categoryId: data.categoryId,
      featuredImage: data.featuredImage,
      isPublished: data.isPublished || false,
      publishedAt: data.isPublished ? new Date() : null,
      metaTitle: data.metaTitle,
      metaDescription: data.metaDescription,
      ...(data.tags && {
        tags: {
          connect: data.tags.map(tagId => ({ id: tagId })),
        },
      }),
    },
  });

  revalidatePath("/blog");
  return post;
}

// Admin: Update blog post
export async function updateBlogPost(
  id: string,
  data: {
    title?: string;
    content?: string;
    excerpt?: string;
    categoryId?: string;
    tags?: string[];
    featuredImage?: string;
    isPublished?: boolean;
    metaTitle?: string;
    metaDescription?: string;
  }
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const existingPost = await prisma.blogPost.findUnique({
    where: { id },
    include: { author: true },
  });

  if (!existingPost) {
    throw new Error("Blog post not found");
  }

  // Check if user has permission to edit this post
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user || (user.role !== "admin" && existingPost.authorId !== user.id)) {
    throw new Error("Unauthorized to edit this blog post");
  }

  const updateData: any = { ...data };

  // Update slug if title changed
  if (data.title && data.title !== existingPost.title) {
    const slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    let finalSlug = slug;
    let counter = 1;
    while (await prisma.blogPost.findFirst({
      where: { slug: finalSlug, id: { not: id } },
    })) {
      finalSlug = `${slug}-${counter}`;
      counter++;
    }
    updateData.slug = finalSlug;
  }

  // Set published date if publishing for the first time
  if (data.isPublished && !existingPost.publishedAt) {
    updateData.publishedAt = new Date();
  }

  // Handle tags
  if (data.tags) {
    updateData.tags = {
      set: data.tags.map(tagId => ({ id: tagId })),
    };
  }

  const post = await prisma.blogPost.update({
    where: { id },
    data: updateData,
  });

  revalidatePath("/blog");
  revalidatePath(`/blog/${existingPost.slug}`);
  return post;
}

// Admin: Delete blog post
export async function deleteBlogPost(id: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const existingPost = await prisma.blogPost.findUnique({
    where: { id },
    include: { author: true },
  });

  if (!existingPost) {
    throw new Error("Blog post not found");
  }

  // Check if user has permission to delete this post
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user || (user.role !== "admin" && existingPost.authorId !== user.id)) {
    throw new Error("Unauthorized to delete this blog post");
  }

  await prisma.blogPost.delete({
    where: { id },
  });

  revalidatePath("/blog");
  return { success: true };
}