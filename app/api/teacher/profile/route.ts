import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { teacherProfileSchema } from "@/lib/zodSchemas";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await import('next/headers').then(h => h.headers())
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "teacher" && session.user.role !== "admin") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const profile = await prisma.teacherProfile.findUnique({
      where: {
        userId: session.user.id,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            image: true,
          },
        },
        _count: {
          select: {
            liveSessions: true,
          },
        },
      },
    });

    return NextResponse.json({ profile });
  } catch (error) {
    console.error("Error fetching teacher profile:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await import('next/headers').then(h => h.headers())
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "teacher" && session.user.role !== "admin") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const body = await req.json();
    const validatedData = teacherProfileSchema.parse(body);

    // Check if profile already exists
    const existingProfile = await prisma.teacherProfile.findUnique({
      where: { userId: session.user.id },
    });

    let profile;

    if (existingProfile) {
      // Update existing profile
      profile = await prisma.teacherProfile.update({
        where: { userId: session.user.id },
        data: validatedData,
        include: {
          user: {
            select: {
              name: true,
              email: true,
              image: true,
            },
          },
        },
      });
    } else {
      // Create new profile
      profile = await prisma.teacherProfile.create({
        data: {
          ...validatedData,
          userId: session.user.id,
        },
        include: {
          user: {
            select: {
              name: true,
              email: true,
              image: true,
            },
          },
        },
      });
    }

    return NextResponse.json({ profile }, { status: 201 });
  } catch (error) {
    console.error("Error creating/updating teacher profile:", error);

    if (error instanceof Error && "code" in error && error.code === "P2002") {
      return NextResponse.json({ error: "Profile already exists" }, { status: 409 });
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await import('next/headers').then(h => h.headers())
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "teacher" && session.user.role !== "admin") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const body = await req.json();
    const validatedData = teacherProfileSchema.parse(body);

    const profile = await prisma.teacherProfile.update({
      where: { userId: session.user.id },
      data: validatedData,
      include: {
        user: {
          select: {
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json({ profile });
  } catch (error) {
    console.error("Error updating teacher profile:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}