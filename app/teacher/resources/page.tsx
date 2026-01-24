import { requireTeacher } from "@/app/data/auth/require-roles";
import { getTeacherResources } from "@/app/actions/resources";
import { ResourceForm } from "./_components/resource-form";
import { ResourceList } from "./_components/resource-list";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

export default async function TeacherResourcesPage() {
  await requireTeacher();
  const session = await auth.api.getSession({ headers: await headers() });

  const [resources, courses] = await Promise.all([
    getTeacherResources(),
    prisma.course.findMany({
      where: { userId: session?.user?.id },
      select: { id: true, title: true }
    })
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Resources</h1>
          <p className="text-muted-foreground">
            Manage your course materials and resources
          </p>
        </div>
        <ResourceForm courses={courses} />
      </div>

      <ResourceList resources={resources} />
    </div>
  );
}