"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
// import { BroadcastType } from "@prisma/client"; // Avoiding lint error

// Local type definition to match Prisma schema
type BroadcastType = "Info" | "Offer" | "Alert" | "Coupon";

// Public: Get Active Broadcasts for Banner
export async function getActiveBroadcasts() {
    try {
        // @ts-ignore - Prisma client is generated at build time
        const broadcasts = await prisma.broadcast.findMany({
            where: {
                isActive: true, // Only active
                OR: [
                    { expiresAt: null }, // No expiry
                    { expiresAt: { gt: new Date() } } // Or future expiry
                ]
            },
            orderBy: { priority: 'desc' }
        });
        return broadcasts;
    } catch (error) {
        console.error("Failed to fetch active broadcasts", error);
        return [];
    }
}

// Admin: Get All
export async function getAllBroadcasts() {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        if ((session?.user as any)?.role !== "admin") return [];

        // @ts-ignore - Prisma client is generated at build time
        return await prisma.broadcast.findMany({
            orderBy: { createdAt: 'desc' }
        });
    } catch (error) {
        return [];
    }
}

// Admin: Create
export async function createBroadcast(data: {
    text: string;
    type: BroadcastType;
    link?: string;
    buttonText?: string;
    couponCode?: string;
    priority?: number;
    expiresAt?: Date;
}) {
    const session = await auth.api.getSession({ headers: await headers() });
    if ((session?.user as any)?.role !== "admin") throw new Error("Unauthorized");

    // @ts-ignore - Prisma client is generated at build time
    await prisma.broadcast.create({
        data: {
            ...data,
            isActive: true
        }
    });
    revalidatePath("/");
    revalidatePath("/admin/broadcasts");
    return { success: true };
}

// Admin: Update
export async function updateBroadcast(id: string, data: any) {
    const session = await auth.api.getSession({ headers: await headers() });
    if ((session?.user as any)?.role !== "admin") throw new Error("Unauthorized");

    // @ts-ignore - Prisma client is generated at build time
    await prisma.broadcast.update({
        where: { id },
        data
    });
    revalidatePath("/");
    revalidatePath("/admin/broadcasts");
    return { success: true };
}

// Admin: Delete
export async function deleteBroadcast(id: string) {
    const session = await auth.api.getSession({ headers: await headers() });
    if ((session?.user as any)?.role !== "admin") throw new Error("Unauthorized");

    // @ts-ignore - Prisma client is generated at build time
    await prisma.broadcast.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/admin/broadcasts");
    return { success: true };
}

// Admin: Toggle
export async function toggleBroadcastStatus(id: string, isActive: boolean) {
    const session = await auth.api.getSession({ headers: await headers() });
    if ((session?.user as any)?.role !== "admin") throw new Error("Unauthorized");

    // @ts-ignore - Prisma client is generated at build time
    await prisma.broadcast.update({
        where: { id },
        data: { isActive }
    });
    revalidatePath("/");
    revalidatePath("/admin/broadcasts");
    return { success: true };
}
