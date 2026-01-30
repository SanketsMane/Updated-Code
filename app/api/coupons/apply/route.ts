import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { headers } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { code, originalPrice, context } = await req.json();

    if (!code || originalPrice === undefined || !context) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Context format: { type: "GROUP" | "SESSION" | "COURSE", teacherId?: string, entityId?: string }
    
    // Find Coupon
    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() }
    });

    if (!coupon) {
      return NextResponse.json({ error: "Invalid coupon code" }, { status: 404 });
    }

    if (!coupon.isActive) {
      return NextResponse.json({ error: "Coupon is inactive" }, { status: 400 });
    }

    if (new Date() > coupon.expiryDate) {
      return NextResponse.json({ error: "Coupon has expired" }, { status: 400 });
    }

    if (coupon.usedCount >= coupon.usageLimit) {
      return NextResponse.json({ error: "Coupon usage limit reached" }, { status: 400 });
    }

    // Check Applicable On
    // Map context type to applicable strings
    // Context types: "DEMO", "30MIN", "60MIN", "GROUP", "CRASH", "FULL" 
    // We need the frontend/request to send the specific "SessionType" or infer it.
    // For now, let's assume `context.detailedType` is sent, e.g. "GROUP" or "DEMO".
    const typeToCheck = context.detailedType || context.type; 
    
    // If ApplicableOn is empty, assume global (or handle as restricted? Usually empty means none, but maybe global?)
    // Let's assume if array is empty, it applies to nothing unless logic says otherwise. 
    // Or if teacherId is null and applicableOn is empty, maybe allows all? 
    // Better: ApplicableOn must match.
    if (coupon.applicableOn.length > 0 && !coupon.applicableOn.includes(typeToCheck)) {
         return NextResponse.json({ error: `Coupon not applicable for ${typeToCheck}` }, { status: 400 });
    }

    // Check Teacher
    if (coupon.teacherId && coupon.teacherId !== context.teacherId) {
       // Need to fetch teacher profile id vs user id? 
       // Context should likely pass TeacherProfile ID.
       return NextResponse.json({ error: "Coupon not valid for this teacher" }, { status: 400 });
    }

    // Check User Usage Limit
    const userUsage = await prisma.couponUsage.count({
        where: {
            couponId: coupon.id,
            userId: session.user.id
        }
    });

    if (userUsage >= coupon.perUserLimit) {
        return NextResponse.json({ error: "You have already used this coupon" }, { status: 400 });
    }

    // Calculate Discount
    let discountAmount = 0;
    if (coupon.type === "PERCENTAGE") {
      discountAmount = Math.round((originalPrice * coupon.value) / 100);
    } else {
      discountAmount = coupon.value; // Flat amount (assuming same currency/cents issue handled)
    }

    // Ensure discount doesn't exceed price
    if (discountAmount > originalPrice) {
      discountAmount = originalPrice;
    }

    const finalPrice = originalPrice - discountAmount;

    return NextResponse.json({
        success: true,
        discountAmount,
        finalPrice,
        couponId: coupon.id,
        code: coupon.code
    });

  } catch (error) {
    console.error("Coupon apply error:", error);
    return NextResponse.json({ error: "Failed to apply coupon" }, { status: 500 });
  }
}
