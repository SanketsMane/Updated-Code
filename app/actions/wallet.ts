"use server";

import { requireUser } from "@/app/data/user/require-user";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

/**
 * Get wallet balance for the current user
 * @author Sanket
 */
export async function getWalletBalance() {
    const user = await requireUser();

    const wallet = await prisma.wallet.findUnique({
        where: { userId: user.id },
        select: { balance: true }
    });

    return wallet?.balance ?? 0;
}

/**
 * Get wallet with full details
 * @author Sanket
 */
export async function getWallet(userId?: string) {
    const user = userId ? { id: userId } : await requireUser();

    let wallet = await prisma.wallet.findUnique({
        where: { userId: user.id }
    });

    // Create wallet if it doesn't exist (for existing users)
    if (!wallet) {
        wallet = await prisma.wallet.create({
            data: { userId: user.id, balance: 0 }
        });
    }

    return wallet;
}

/**
 * Get transaction history for the current user
 * @author Sanket
 * @param limit - Number of transactions to fetch (default: 50)
 */
export async function getTransactionHistory(limit: number = 50) {
    const user = await requireUser();

    const wallet = await getWallet(user.id);

    const transactions = await prisma.walletTransaction.findMany({
        where: { walletId: wallet.id },
        orderBy: { createdAt: 'desc' },
        take: limit
    });

    return transactions;
}

/**
 * Internal function to deduct balance from wallet
 * Used by purchase flows (courses, sessions, groups)
 * @author Sanket
 */
export async function deductFromWallet(
    userId: string,
    amount: number,
    type: 'COURSE_PURCHASE' | 'SESSION_BOOKING' | 'GROUP_ENROLLMENT',
    description: string,
    metadata?: any
) {
    // Validate amount
    if (amount <= 0) {
        throw new Error("Amount must be positive");
    }

    const wallet = await getWallet(userId);

    // Check sufficient balance
    if (wallet.balance < amount) {
        throw new Error(`Insufficient balance. You have ₹${wallet.balance} but need ₹${amount}`);
    }

    // Atomic transaction to deduct balance and create transaction record
    const result = await prisma.$transaction(async (tx) => {
        const balanceBefore = wallet.balance;
        const balanceAfter = balanceBefore - amount;

        // Update wallet balance
        const updatedWallet = await tx.wallet.update({
            where: { id: wallet.id },
            data: { balance: balanceAfter }
        });

        // Create transaction record
        const transaction = await tx.walletTransaction.create({
            data: {
                walletId: wallet.id,
                type,
                amount: -amount, // Negative for debit
                balanceBefore,
                balanceAfter,
                description,
                metadata: metadata ? JSON.parse(JSON.stringify(metadata)) : null
            }
        });

        return { wallet: updatedWallet, transaction };
    });

    revalidatePath('/dashboard/wallet');
    return result;
}

/**
 * Internal function to add balance to wallet (refunds, admin credits)
 * @author Sanket
 */
export async function creditToWallet(
    userId: string,
    amount: number,
    type: 'REFUND' | 'ADMIN_CREDIT',
    description: string,
    metadata?: any
) {
    if (amount <= 0) {
        throw new Error("Amount must be positive");
    }

    const wallet = await getWallet(userId);

    const result = await prisma.$transaction(async (tx) => {
        const balanceBefore = wallet.balance;
        const balanceAfter = balanceBefore + amount;

        const updatedWallet = await tx.wallet.update({
            where: { id: wallet.id },
            data: { balance: balanceAfter }
        });

        const transaction = await tx.walletTransaction.create({
            data: {
                walletId: wallet.id,
                type,
                amount, // Positive for credit
                balanceBefore,
                balanceAfter,
                description,
                metadata: metadata ? JSON.parse(JSON.stringify(metadata)) : null
            }
        });

        return { wallet: updatedWallet, transaction };
    });

    revalidatePath('/dashboard/wallet');
    return result;
}
