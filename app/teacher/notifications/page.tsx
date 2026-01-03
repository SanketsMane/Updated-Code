import { redirect } from "next/navigation";

export default function TeacherNotificationsPage() {
  // For now, redirect to the main notifications page
  // TODO: Create teacher-specific notifications interface
  redirect("/dashboard/notifications");
}
