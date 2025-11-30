import { NextRequest, NextResponse } from "next/server";
import { getEnrollmentData } from "@/app/data/analytics/get-enrollment-data";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const days = parseInt(searchParams.get('days') || '30');

    // Validate days parameter
    if (days < 1 || days > 365) {
      return NextResponse.json(
        { error: "Days parameter must be between 1 and 365" },
        { status: 400 }
      );
    }

    const enrollmentData = await getEnrollmentData(days);
    return NextResponse.json(enrollmentData);
  } catch (error) {
    console.error("Error fetching enrollment data:", error);
    return NextResponse.json(
      { error: "Failed to fetch enrollment data" },
      { status: 500 }
    );
  }
}