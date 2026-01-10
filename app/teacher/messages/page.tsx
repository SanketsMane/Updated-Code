import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default function TeacherMessagesPage() {
  // For now, redirect to the main messages page
  // TODO: Create teacher-specific messaging interface
  redirect("/dashboard/messages");
}
