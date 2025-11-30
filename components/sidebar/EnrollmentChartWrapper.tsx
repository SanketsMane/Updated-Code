import { ChartAreaInteractive } from "./chart-area-interactive";
import { getEnrollmentData } from "@/app/data/analytics/get-enrollment-data";

export async function EnrollmentChartWrapper() {
  try {
    const enrollmentData = await getEnrollmentData(30);
    return <ChartAreaInteractive data={enrollmentData} />;
  } catch (error) {
    console.error("Error fetching enrollment data:", error);
    // Fallback data
    const fallbackData = [{ date: new Date().toISOString().split('T')[0], enrollments: 0 }];
    return <ChartAreaInteractive data={fallbackData} />;
  }
}