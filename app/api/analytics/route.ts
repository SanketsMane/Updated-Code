import { NextRequest, NextResponse } from "next/server";
import { getAnalyticsData } from "@/app/data/analytics/get-analytics";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated and has admin role
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // For now, allow all authenticated users. In production, check for admin role
    // if (session.user.role !== "ADMIN") {
    //   return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    // }

    const searchParams = request.nextUrl.searchParams;
    const range = searchParams.get('range') || '30d';
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    // For now, we'll ignore the date range parameters and return all data
    // In a full implementation, you'd filter based on the date range
    const analyticsData = await getAnalyticsData();

    return NextResponse.json(analyticsData);
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics data" },
      { status: 500 }
    );
  }
}