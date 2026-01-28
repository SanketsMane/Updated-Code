import { NextResponse } from "next/server";
import { requireUser } from "@/app/data/user/require-user";
import { getWalletBalance } from "@/app/actions/wallet";

/**
 * Get current user's wallet balance
 * @author Sanket
 */
export async function GET() {
    try {
        await requireUser(); // Ensure authenticated
        const balance = await getWalletBalance();

        return NextResponse.json({ balance });
    } catch (error: any) {
        console.error("Get wallet balance error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to fetch balance" },
            { status: 500 }
        );
    }
}
