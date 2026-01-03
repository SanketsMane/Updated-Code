import { notFound, redirect } from "next/navigation";
import { prisma as db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { BookingPageClient } from "./_components/BookingPageClient";

async function getSession(id: string) {
  const session = await db.liveSession.findUnique({
    where: { id },
    include: {
      teacher: {
        include: {
          user: {
            select: {
              name: true,
              image: true
            }
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

  if (!session) {
    notFound();
  }

  return session;
}

export default async function BookSessionPage({
  params
}: {
  params: { id: string };
}) {
  // Require authentication
  const sessionAuth = await auth.api.getSession({ headers: await headers() });
  
  if (!sessionAuth?.user) {
    redirect(`/login?redirect=/live-sessions/${params.id}/book`);
  }

  const session = await getSession(params.id);

  // Check if session is available
  if (session.status !== 'scheduled') {
    redirect(`/live-sessions/${params.id}`);
  }

  // Check if already booked
  const existingBooking = await db.sessionBooking.findFirst({
    where: {
      sessionId: session.id,
      studentId: sessionAuth.user.id,
      status: { in: ['confirmed', 'pending'] }
    }
  });

  if (existingBooking) {
    redirect(`/dashboard/sessions`);
  }

  // Check if session is full
  if (session.maxParticipants && session._count.bookings >= session.maxParticipants) {
    redirect(`/live-sessions/${params.id}`);
  }

  return <BookingPageClient session={session} />;
}
