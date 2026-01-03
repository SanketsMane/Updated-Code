import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";

// POST - Cancel a session
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { reason, refundType = 'auto' } = body; // refundType: 'auto', 'full', 'partial', 'none'

    const liveSession = await prisma.liveSession.findUnique({
      where: { id },
      include: {
        teacher: {
          include: {
            user: true
          }
        },
        student: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    if (!liveSession) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Verify teacher owns this session
    if (liveSession.teacher.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Can't cancel already completed or cancelled sessions
    if (liveSession.status === 'completed' || liveSession.status === 'cancelled') {
      return NextResponse.json(
        { error: `Session is already ${liveSession.status}` },
        { status: 400 }
      );
    }

    // Calculate refund amount based on cancellation policy
    let refundAmount = 0;
    
    if (liveSession.studentId && liveSession.stripeSessionId) {
      const now = new Date();
      const sessionTime = new Date(liveSession.scheduledAt);
      const hoursUntilSession = (sessionTime.getTime() - now.getTime()) / (1000 * 60 * 60);

      if (refundType === 'auto') {
        // Automatic refund policy
        if (hoursUntilSession >= 48) {
          // 48+ hours: Full refund
          refundAmount = liveSession.price;
        } else if (hoursUntilSession >= 24) {
          // 24-48 hours: 50% refund
          refundAmount = Math.floor(liveSession.price * 0.5);
        } else {
          // <24 hours: No refund
          refundAmount = 0;
        }
      } else if (refundType === 'full') {
        refundAmount = liveSession.price;
      } else if (refundType === 'partial') {
        refundAmount = Math.floor(liveSession.price * 0.5);
      }

      // Process refund if applicable
      if (refundAmount > 0 && liveSession.stripeSessionId) {
        try {
          // Get the payment intent from the checkout session
          const checkoutSession = await stripe.checkout.sessions.retrieve(
            liveSession.stripeSessionId
          );

          if (checkoutSession.payment_intent) {
            await stripe.refunds.create({
              payment_intent: checkoutSession.payment_intent as string,
              amount: refundAmount,
              reason: 'requested_by_customer',
              metadata: {
                sessionId: liveSession.id,
                cancelledBy: 'teacher',
                reason: reason || 'Teacher cancelled'
              }
            });
          }
        } catch (stripeError) {
          console.error("Stripe refund error:", stripeError);
          // Continue with cancellation even if refund fails
        }
      }
    }

    // Update session status
    const updatedSession = await prisma.liveSession.update({
      where: { id },
      data: {
        status: 'cancelled',
        cancelledBy: 'teacher',
        cancellationReason: reason,
        refundAmount
      },
      include: {
        teacher: {
          include: {
            user: {
              select: {
                name: true,
                email: true
              }
            }
          }
        },
        student: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    // TODO: Send cancellation email to student
    // TODO: Send cancellation notification

    return NextResponse.json({
      message: "Session cancelled successfully",
      session: updatedSession,
      refundAmount,
      refundPolicy: refundAmount === liveSession.price ? 'full' : 
                    refundAmount > 0 ? 'partial' : 'none'
    });
  } catch (error) {
    console.error("Error cancelling session:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
