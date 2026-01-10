import { requireAdmin } from "../../data/admin/require-admin";
import { adminGetProjectStats } from "../../data/admin/admin-get-project-stats";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  IconFolder, 
  IconFolderPlus, 
  IconCalendar, 
  IconUsers, 
  IconEye,
  IconEdit,
  IconTrash,
  IconDownload,
  IconBook,
  IconListDetails
} from "@tabler/icons-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  await requireAdmin();

  const { projects, stats } = await adminGetProjectStats();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground">
            Manage your course projects and development pipeline
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <IconFolderPlus className="h-4 w-4" />
          New Project
        </Button>
      </div>

      {/* Project Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <IconFolder className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProjects}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <IconEye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeProjects}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Draft Projects</CardTitle>
            <IconEdit className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.draftProjects}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <IconDownload className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedProjects}</div>
          </CardContent>
        </Card>
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">All Projects</h2>
          <Link href="/admin/courses/create">
            <Button className="flex items-center gap-2">
              <IconFolderPlus className="h-4 w-4" />
              Create New Project
            </Button>
          </Link>
        </div>
        
        <div className="grid gap-4">
          {projects.length > 0 ? projects.map((project) => (
            <Card key={project.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">
                      <IconFolder className="h-5 w-5" />
                      {project.name}
                    </CardTitle>
                    <CardDescription>{project.description}</CardDescription>
                  </div>
                  <Badge variant={
                    project.status === "Active" ? "default" :
                    project.status === "Draft" ? "secondary" :
                    "outline"
                  }>
                    {project.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-5">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <IconUsers className="h-4 w-4" />
                    {project.students} students
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <IconBook className="h-4 w-4" />
                    {project.chapters} chapters
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <IconListDetails className="h-4 w-4" />
                    {project.lessons} lessons
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <IconCalendar className="h-4 w-4" />
                    Created {project.createdAt}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    ${project.price}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mt-4">
                  <Link href={`/admin/courses/${project.id}`}>
                    <Button variant="outline" size="sm">
                      <IconEye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </Link>
                  <Link href={`/admin/courses/${project.id}/edit`}>
                    <Button variant="outline" size="sm">
                      <IconEdit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </Link>
                  <Link href={`/admin/courses/${project.id}/delete`}>
                    <Button variant="outline" size="sm" className="text-red-600">
                      <IconTrash className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </Link>
                </div>
                
                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>Completion Progress ({project.level})</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )) : (
            <Card>
              <CardContent className="text-center py-8">
                <IconFolder className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No projects found</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first course project to get started.
                </p>
                <Link href="/admin/courses/create">
                  <Button>
                    <IconFolderPlus className="h-4 w-4 mr-2" />
                    Create New Project
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}