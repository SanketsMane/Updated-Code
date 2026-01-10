import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/app/data/auth/require-roles";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();

    const body = await request.json();
    const { status, reviewNotes, reviewedBy } = body;
    const payoutId = params.id;

    if (!status || !['Approved', 'Rejected', 'Completed', 'Pending'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Valid status is required' },
        { status: 400 }
      );
    }

    const updateData: any = {
      status,
      adminNotes: reviewNotes,
      reviewedById: reviewedBy
    };

    // Set appropriate date fields based on status
    if (status === 'Approved') {
      updateData.approvedAt = new Date();
    } else if (status === 'Rejected') {
      updateData.rejectedAt = new Date();
    } else if (status === 'Completed') {
      updateData.processedAt = new Date();
    }

    const payout = await prisma.payoutRequest.update({
      where: { id: payoutId },
      data: updateData,
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

    // If processed, create commission record (if applicable)
    if (status === 'Completed') {
      // Note: This would typically link to actual earnings/commissions
      // For now, we'll skip automatic commission creation
      const requestedAmount = Number(payout.requestedAmount);
      updateData.processedAt = new Date();
      updateData.netAmount = requestedAmount * 0.92; // 8% platform fee
      updateData.processingFee = requestedAmount * 0.08;
      updateData.processedAmount = requestedAmount;
    }

    return NextResponse.json({
      success: true,
      data: payout
    });

  } catch (error) {
    console.error('Error updating payout:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update payout' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();

    const payout = await prisma.payoutRequest.findUnique({
      where: { id: params.id },
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
        },
        commissions: true
      }
    });

    if (!payout) {
      return NextResponse.json(
        { success: false, error: 'Payout not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: payout
    });

  } catch (error) {
    console.error('Error fetching payout:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch payout' },
      { status: 500 }
    );
  }
}