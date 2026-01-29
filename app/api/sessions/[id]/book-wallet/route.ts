import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/app/data/user/require-user";
import { prisma } from "@/lib/db";
import { deductFromWallet } from "@/app/actions/wallet";

/**
 * Book a live session using wallet balance
 * @author Sanket
 */
export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await requireUser();
        const { id: sessionId } = await params;

        // Get session details
        const session = await prisma.liveSession.findUnique({
            where: { id: sessionId },
            include: {
                teacher: {
                    include: { user: true }
                }
            }
        });

        if (!session) {
            return NextResponse.json(
                { error: "Session not found" },
                { status: 404 }
            );
        }

        // Check if already booked
        const existingBooking = await prisma.sessionBooking.findFirst({
            where: {
                sessionId,
                studentId: user.id
            }
        });

        if (existingBooking) {
            return NextResponse.json(
                { error: "Already booked this session" },
                { status: 400 }
            );
        }

        // Book session and deduct wallet atomically
        const result = await prisma.$transaction(async (tx) => {
            // Deduct from wallet
            await deductFromWallet(
                user.id,
                session.price,
                "SESSION_BOOKING",
                `Booked live session: ${session.title}`,
                { sessionId: session.id, sessionTitle: session.title }
            );

            // Create booking
            const booking = await tx.sessionBooking.create({
                data: {
                    sessionId,
                    studentId: user.id,
                    amount: session.price,
                    status: "confirmed",
                    paymentCompletedAt: new Date()
                }
            });

            // Update session status
            await tx.liveSession.update({
                where: { id: sessionId },
                data: { status: "scheduled" }
            });

            // Create commission for teacher
            const commissionRate = 0.20;
            const commissionAmount = Math.round(session.price * commissionRate);
            const netAmount = session.price - commissionAmount;

            await tx.commission.create({
                data: {
                    teacherId: session.teacherId,
                    amount: netAmount,
                    commission: commissionAmount,
                    commissionAmount,
                    netAmount,
                    type: "LiveSession",
                    status: "Pending",
                    description: `Live session: ${session.title}`,
                    metadata: {
                        sessionId: session.id,
                        bookingId: booking.id,
                        studentId: user.id
                    }
                }
            });

            // Create notification
            await tx.notification.create({
                data: {
                    userId: user.id,
                    title: "Session Booked Successfully",
                    message: `You've successfully booked "${session.title}" using your wallet.`,
                    type: "Session"
                }
            });

            return booking;
        });

        return NextResponse.json({
            success: true,
            bookingId: result.id,
            message: "Successfully booked session using wallet"
        });

    } catch (error: any) {
        console.error("Wallet session booking error:", error);

        if (error.message?.includes("Insufficient balance")) {
            return NextResponse.json(
                { error: error.message },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: error.message || "Failed to book session" },
            { status: 500 }
        );
    }
}
