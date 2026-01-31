import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/app/data/user/require-user";
import { stripe } from "@/lib/stripe";

/**
 * Create Stripe checkout session for wallet recharge
 * @author Sanket
 */
export async function POST(req: NextRequest) {
    try {
        const user = await requireUser();
        const { amount } = await req.json();

        // Validate amount
        if (!amount || amount < 100) {
            return NextResponse.json(
                { error: "Minimum recharge amount is ₹100" },
                { status: 400 }
            );
        }

        if (amount > 100000) {
            return NextResponse.json(
                { error: "Maximum recharge amount is ₹100,000" },
                { status: 400 }
            );
        }

        // Create Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "inr",
                        product_data: {
                            name: "Wallet Recharge",
                            description: `Add ₹${amount} to your Examsphere wallet`,
                        },
                        unit_amount: amount * 100, // Convert to paise
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                type: "wallet_recharge",
                userId: user.id,
                amount: amount.toString(),
            },
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/wallet?recharge=success`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/wallet?recharge=cancelled`,
            customer_email: user.email,
        });

        return NextResponse.json({ url: session.url });
    } catch (error: any) {
        console.error("Wallet recharge error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to create checkout session" },
            { status: 500 }
        );
    }
}
