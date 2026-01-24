import { requireTeacher } from "@/app/data/auth/require-roles";
import { TeacherSidebarLayout } from "./_components/teacher-sidebar-layout";

export default async function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side auth check
  await requireTeacher();

  return (
    <TeacherSidebarLayout>
      {children}
    </TeacherSidebarLayout>
  );
}
