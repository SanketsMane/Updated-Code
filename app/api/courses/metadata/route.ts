import { NextRequest, NextResponse } from "next/server";
import { getCourseCategories, getCourseLevels, getCourseDurations } from "@/app/data/course/get-course-metadata";

export async function GET() {
  try {
    const [categories, levels, durations] = await Promise.all([
      getCourseCategories(),
      getCourseLevels(),
      getCourseDurations(),
    ]);

    return NextResponse.json({
      categories,
      levels,
      durations,
    });
  } catch (error) {
    console.error("Error fetching course metadata:", error);
    return NextResponse.json(
      { error: "Failed to fetch course metadata" },
      { status: 500 }
    );
  }
}