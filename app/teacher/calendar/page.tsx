import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default function TeacherCalendarPage() {
  // For now, redirect to the main calendar page
  // TODO: Create teacher-specific calendar interface with session scheduling
  redirect("/dashboard/calendar");
}
