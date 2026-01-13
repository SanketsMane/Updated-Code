"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function getTeacherPayoutData() {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user?.id) {
        redirect("/sign-in");
    }

    const teacher = await prisma.teacherProfile.findUnique({
        where: { userId: session.user.id },
        include: {
            payoutRequests: {
                orderBy: { createdAt: "desc" },
                take: 20
            },
            liveSessions: {
                where: { status: "completed" }
            }
        }
    });

    if (!teacher) {
        // Return empty state for non-teachers or new accounts
        return {
            totalEarnings: 0,
            availableForPayout: 0,
            pendingPayouts: 0,
            totalSessions: 0,
            averageSessionEarning: 0,
            payoutHistory: []
        };
    }

    // 1. Calculate Earnings
    // For now, we rely on the `totalEarnings` field in TeacherProfile which should be updated on enrollment/payment
    // If logical gaps exist in data seeding, this might be 0, but it removes "dummy" non-zero values.
    const totalEarnings = Number(teacher.totalEarnings) || 0;

    // 2. Calculate Payouts
    const allPayouts = await prisma.payoutRequest.findMany({
        where: { teacherId: teacher.id }
    });

    const processedPayouts = allPayouts
        .filter(p => ["Completed", "Paid", "Processed"].includes(p.status))
        .reduce((sum, p) => sum + Number(p.requestedAmount), 0);

    const pendingPayouts = allPayouts
        .filter(p => ["Pending", "UnderReview", "Approved", "Processing"].includes(p.status))
        .reduce((sum, p) => sum + Number(p.requestedAmount), 0);

    // 3. Available Balance
    // Available = Total Earned - (Already Paid + Currently Pending)
    // Ensure we don't show negative if data is slightly out of sync
    const availableForPayout = Math.max(0, totalEarnings - processedPayouts - pendingPayouts);

    // 4. Session Stats
    const totalSessions = teacher.liveSessions.length;
    // Use simple division if sessions exist, otherwise 0
    const averageSessionEarning = totalSessions > 0
        ? (totalEarnings / totalSessions)
        : 0;

    return {
        totalEarnings,
        availableForPayout,
        pendingPayouts,
        totalSessions,
        averageSessionEarning,
        payoutHistory: teacher.payoutRequests.map(p => ({
            id: p.id,
            amount: Number(p.requestedAmount),
            status: p.status,
            requestedAt: p.createdAt.toISOString().split('T')[0], // YYYY-MM-DD
            processedAt: p.processedAt ? p.processedAt.toISOString().split('T')[0] : undefined
        }))
    };
}
