import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/app/data/auth/require-roles";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();

    const body = await request.json();
    const { status, reviewNotes, reviewedBy } = body;
    const { id: verificationId } = await params;

    if (!status || !['approved', 'rejected', 'pending'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Valid status is required' },
        { status: 400 }
      );
    }

    const verification = await prisma.teacherVerification.update({
      where: { id: verificationId },
      data: {
        status,
        adminNotes: reviewNotes,
        reviewedById: reviewedBy,
        reviewedAt: new Date()
      },
      include: {
        teacher: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                name: true,
                image: true,
              }
            }
          }
        }
      }
    });

    // If approved, update teacher profile verification status
    if (status === 'Approved') {
      await prisma.teacherProfile.update({
        where: { id: verification.teacherId },
        data: {
          isVerified: true
        }
      });
    }

    return NextResponse.json({
      success: true,
      data: verification
    });

  } catch (error) {
    console.error('Error updating verification:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update verification' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;

    const verification = await prisma.teacherVerification.findUnique({
      where: { id },
      include: {
        teacher: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                name: true,
                image: true,
              }
            }
          }
        }
      }
    });

    if (!verification) {
      return NextResponse.json(
        { success: false, error: 'Verification not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: verification
    });

  } catch (error) {
    console.error('Error fetching verification:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch verification' },
      { status: 500 }
    );
  }
}