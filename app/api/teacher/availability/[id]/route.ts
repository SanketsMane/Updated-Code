import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// PUT - Update availability slot
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const availability = await prisma.sessionAvailability.findUnique({
      where: { id },
      include: {
        teacher: {
          include: {
            user: true
          }
        }
      }
    });

    if (!availability) {
      return NextResponse.json({ error: "Availability slot not found" }, { status: 404 });
    }

    // Verify teacher owns this availability
    if (availability.teacher.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const {
      startTime,
      endTime,
      timezone,
      defaultDuration,
      bufferTime,
      isActive
    } = body;

    // Validate time format if provided
    if (startTime || endTime) {
      const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (startTime && !timeRegex.test(startTime)) {
        return NextResponse.json(
          { error: "startTime must be in HH:MM format (24-hour)" },
          { status: 400 }
        );
      }
      if (endTime && !timeRegex.test(endTime)) {
        return NextResponse.json(
          { error: "endTime must be in HH:MM format (24-hour)" },
          { status: 400 }
        );
      }
    }

    // Validate start time is before end time
    const finalStartTime = startTime || availability.startTime;
    const finalEndTime = endTime || availability.endTime;
    
    const [startHour, startMin] = finalStartTime.split(':').map(Number);
    const [endHour, endMin] = finalEndTime.split(':').map(Number);
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    if (startMinutes >= endMinutes) {
      return NextResponse.json(
        { error: "Start time must be before end time" },
        { status: 400 }
      );
    }

    const updatedAvailability = await prisma.sessionAvailability.update({
      where: { id },
      data: {
        ...(startTime && { startTime }),
        ...(endTime && { endTime }),
        ...(timezone && { timezone }),
        ...(defaultDuration && { defaultDuration }),
        ...(bufferTime && { bufferTime }),
        ...(isActive !== undefined && { isActive })
      }
    });

    return NextResponse.json({
      message: "Availability slot updated successfully",
      availability: updatedAvailability
    });
  } catch (error) {
    console.error("Error updating availability:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE - Delete availability slot
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const availability = await prisma.sessionAvailability.findUnique({
      where: { id },
      include: {
        teacher: {
          include: {
            user: true
          }
        }
      }
    });

    if (!availability) {
      return NextResponse.json({ error: "Availability slot not found" }, { status: 404 });
    }

    // Verify teacher owns this availability
    if (availability.teacher.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.sessionAvailability.delete({
      where: { id }
    });

    return NextResponse.json({
      message: "Availability slot deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting availability:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
