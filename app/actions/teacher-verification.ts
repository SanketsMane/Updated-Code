"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function saveBankDetails(data: {
    bankAccountName: string;
    bankAccountNumber: string;
    bankRoutingNumber: string;
}) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) throw new Error("Unauthorized");

    const teacher = await prisma.teacherProfile.findUnique({
        where: { userId: session.user.id }
    });

    if (!teacher) throw new Error("Teacher profile not found");

    // Upsert verification record
    await prisma.teacherVerification.upsert({
        where: { teacherId: teacher.id },
        create: {
            teacherId: teacher.id,
            ...data,
            // status default is Pending in schema, so we can omit or explicit
        },
        update: {
            ...data
        }
    });

    revalidatePath("/teacher/verification");
    return { success: true };
}

export async function getVerificationStatus() {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) return null;

    const teacher = await prisma.teacherProfile.findUnique({
        where: { userId: session.user.id },
        include: { verification: true }
    });

    if (!teacher) return null;

    return {
        isVerified: teacher.isVerified,
        verification: teacher.verification
    };
}


export async function saveVerificationDocument(type: 'identity' | 'qualification' | 'experience', urls: string | string[]) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) throw new Error("Unauthorized");

    const teacher = await prisma.teacherProfile.findUnique({
        where: { userId: session.user.id }
    });

    if (!teacher) throw new Error("Teacher profile not found");

    const updateData: any = {};

    if (type === 'identity') {
        // Identity is single URL
        if (Array.isArray(urls)) throw new Error("Identity document must be a single file");
        updateData.identityDocumentUrl = urls;
        updateData.identityVerifiedAt = null; // Reset verification on new upload
    } else if (type === 'qualification') {
        // Qualification is array
        const urlList = Array.isArray(urls) ? urls : [urls];
        // We probably want to APPEND or REPLACE. For simplicity, let's say we pass the NEW list.
        // Or if the UI passes a single new URL, we append it.
        // Let's assume the UI manages the list state and sends the *newly uploaded* URL to be appended.
        // Actually, safer to just push to the array.
        // But what if we want to remove?
        // Let's make this action "addDocument".
        // But for identity it's "set".

        // Let's fetch current to append
        const current = await prisma.teacherVerification.findUnique({ where: { teacherId: teacher.id } });
        const currentDocs = current?.qualificationDocuments || [];
        updateData.qualificationDocuments = [...currentDocs, ...urlList];
        updateData.qualificationsVerifiedAt = null;
    } else if (type === 'experience') {
        const urlList = Array.isArray(urls) ? urls : [urls];
        const current = await prisma.teacherVerification.findUnique({ where: { teacherId: teacher.id } });
        const currentDocs = current?.experienceDocuments || [];
        updateData.experienceDocuments = [...currentDocs, ...urlList];
        updateData.experienceVerifiedAt = null;
    }

    await prisma.teacherVerification.upsert({
        where: { teacherId: teacher.id },
        create: {
            teacherId: teacher.id,
            ...updateData
        },
        update: updateData
    });

    revalidatePath("/teacher/verification");
    return { success: true };
}

export async function removeVerificationDocument(type: 'qualification' | 'experience', urlToRemove: string) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) throw new Error("Unauthorized");

    const teacher = await prisma.teacherProfile.findUnique({
        where: { userId: session.user.id }
    });
    if (!teacher) throw new Error("Teacher profile not found");

    const verification = await prisma.teacherVerification.findUnique({ where: { teacherId: teacher.id } });
    if (!verification) return { success: false };

    const updateData: any = {};

    if (type === 'qualification') {
        updateData.qualificationDocuments = verification.qualificationDocuments.filter(u => u !== urlToRemove);
    } else if (type === 'experience') {
        updateData.experienceDocuments = verification.experienceDocuments.filter(u => u !== urlToRemove);
    }

    await prisma.teacherVerification.update({
        where: { teacherId: teacher.id },
        data: updateData
    });

    revalidatePath("/teacher/verification");
    return { success: true };
}
