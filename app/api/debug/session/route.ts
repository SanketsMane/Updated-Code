import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ 
        error: "No session found",
        loggedIn: false 
      });
    }

    return NextResponse.json({
      loggedIn: true,
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role,
      },
      session: {
        id: session.session.id,
        expiresAt: session.session.expiresAt,
      }
    });
  } catch (error) {
    return NextResponse.json({ 
      error: "Error fetching session",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
