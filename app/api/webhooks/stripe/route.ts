import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = (await headers()).get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    return new NextResponse(`Webhook error: ${error.message}`, {
      status: 400,
    });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === "checkout.session.completed") {
    if (!session?.metadata?.type) {
      return new NextResponse(null, { status: 200 });
    }

    const metadata = session.metadata;

    // Handle different payment types
    if (metadata.type === "live_session") {
      await handleLiveSessionPayment(session);
    } else if (metadata.type === "course_enrollment") {
      await handleCourseEnrollmentPayment(session);
    }
  }

  return new NextResponse(null, { status: 200 });
}

async function handleLiveSessionPayment(session: Stripe.Checkout.Session) {
  const metadata = session.metadata!;
  
  try {
    // Get the pending booking
    const booking = await prisma.sessionBooking.findFirst({
      where: {
        stripeSessionId: session.id,
        status: 'pending'
      },
      include: {
        session: true
      }
    });

    if (!booking) {
      console.error('No pending booking found for session:', session.id);
      return;
    }

    // Update booking status to confirmed
    await prisma.sessionBooking.update({
      where: { id: booking.id },
      data: {
        status: 'confirmed',
        stripePaymentIntentId: session.payment_intent as string,
        paymentCompletedAt: new Date()
      }
    });

    // Update live session status
    await prisma.liveSession.update({
      where: { id: booking.sessionId },
      data: {
        status: 'scheduled',
        stripeSessionId: session.id
      }
    });

    // Create commission record for teacher
    const commissionRate = 0.15; // 15% platform fee
    const commissionAmount = Math.round(booking.amount * commissionRate);
    const netAmount = booking.amount - commissionAmount;

    await prisma.commission.create({
      data: {
        teacherId: metadata.teacherId!,
        sessionId: booking.sessionId,
        type: 'LiveSession',
        amount: booking.amount,
        commission: commissionAmount,
        netAmount: netAmount,
        status: 'Pending'
      }
    });

    // TODO: Send confirmation emails to both student and teacher
    // TODO: Create calendar invites
    // TODO: Send notifications
    
    console.log(`Live session booking confirmed: ${booking.id}`);
  } catch (error) {
    console.error('Error processing live session payment:', error);
  }
}

async function handleCourseEnrollmentPayment(session: Stripe.Checkout.Session) {
  const metadata = session.metadata!;
  
  try {
    if (!metadata.userId || !metadata.courseId) {
      throw new Error("Missing metadata for course enrollment");
    }

    // Update enrollment status
    await prisma.enrollment.update({
      where: {
        userId_courseId: {
          userId: metadata.userId,
          courseId: metadata.courseId,
        },
      },
      data: {
        status: "Active",
      },
    });

    // Update course statistics
    await prisma.course.update({
      where: { id: metadata.courseId },
      data: {
        totalStudents: {
          increment: 1,
        },
      },
    });

    // Create commission record for course instructor
    const course = await prisma.course.findUnique({
      where: { id: metadata.courseId },
    });

    if (course) {
      const commissionRate = 0.1; // 10% commission for courses
      const commissionAmount = Math.round(course.price * commissionRate);
      const netAmount = course.price - commissionAmount;

      await prisma.commission.create({
        data: {
          teacherId: course.userId, // Course owner
          courseId: course.id,
          type: "Course",
          amount: course.price,
          commission: commissionAmount,
          netAmount: netAmount,
          status: "Pending",
        },
      });
    }

    console.log(`Course enrollment confirmed: ${metadata.courseId} for user: ${metadata.userId}`);
  } catch (error) {
    console.error("Error processing course enrollment payment:", error);
  }
}