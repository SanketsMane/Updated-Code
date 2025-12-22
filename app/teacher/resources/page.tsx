import { requireTeacher } from "../../data/auth/require-roles";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IconFileText } from "@tabler/icons-react";

export default async function TeacherResourcesPage() {
  await requireTeacher();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Resources</h1>
        <p className="text-muted-foreground">
          Manage your course materials and resources
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconFileText className="h-5 w-5" />
            Course Attachments
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-12 text-muted-foreground">
          <p className="mb-4">This feature is currently under development.</p>
          <p className="text-sm">
            Soon you will be able to upload and manage global resources for your students here.
            For now, please add materials directly to your Lessons.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}