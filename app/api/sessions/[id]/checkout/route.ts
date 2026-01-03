import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma as db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify authentication
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Get session details
    const liveSession = await db.liveSession.findUnique({
      where: { id: params.id },
      include: {
        teacher: {
          include: {
            user: {
              select: { name: true }
            }
          }
        },
        _count: {
          select: {
            bookings: {
              where: { status: 'confirmed' }
            }
          }
        }
      }
    });

    if (!liveSession) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      );
    }

    // Validate session is available
    if (liveSession.status !== 'scheduled') {
      return NextResponse.json(
        { error: "Session is not available for booking" },
        { status: 400 }
      );
    }

    // Check if session is full
    if (liveSession.maxParticipants && liveSession._count.bookings >= liveSession.maxParticipants) {
      return NextResponse.json(
        { error: "Session is full" },
        { status: 400 }
      );
    }

    // Check if user already has a booking
    const existingBooking = await db.sessionBooking.findFirst({
      where: {
        sessionId: liveSession.id,
        studentId: userId,
        status: { in: ['confirmed', 'pending'] }
      }
    });

    if (existingBooking) {
      return NextResponse.json(
        { error: "You have already booked this session" },
        { status: 400 }
      );
    }

    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: liveSession.title,
              description: `1-on-1 Live Session with ${liveSession.teacher.user.name}`,
            },
            unit_amount: liveSession.price, // Price in cents
          },
          quantity: 1,
        },
      ],
      metadata: {
        type: 'live_session',
        sessionId: liveSession.id,
        studentId: userId,
        teacherId: liveSession.teacherId,
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/sessions?booking=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/live-sessions/${liveSession.id}?booking=cancelled`,
      customer_email: session.user.email,
    });

    // Create pending booking
    await db.sessionBooking.create({
      data: {
        sessionId: liveSession.id,
        studentId: userId,
        status: 'pending',
        stripeSessionId: checkoutSession.id,
        amount: liveSession.price
      }
    });

    return NextResponse.json({
      url: checkoutSession.url
    });

  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: error.message || "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
