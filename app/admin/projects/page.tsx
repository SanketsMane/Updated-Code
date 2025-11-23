import { requireAdmin } from "../../data/admin/require-admin";
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
  IconDownload
} from "@tabler/icons-react";

export default async function AdminProjectsPage() {
  await requireAdmin();

  // Mock project data - in real app, fetch from database
  const projects = [
    {
      id: 1,
      name: "React Development Course",
      description: "Comprehensive React.js course with hands-on projects",
      status: "Active",
      students: 245,
      createdAt: "2024-01-15",
      lastModified: "2024-11-20",
      progress: 85,
    },
    {
      id: 2,
      name: "JavaScript Fundamentals",
      description: "Complete JavaScript course from basics to advanced",
      status: "Active",
      students: 189,
      createdAt: "2024-02-10",
      lastModified: "2024-11-18",
      progress: 92,
    },
    {
      id: 3,
      name: "Python for Beginners",
      description: "Learn Python programming from scratch",
      status: "Draft",
      students: 0,
      createdAt: "2024-11-01",
      lastModified: "2024-11-22",
      progress: 45,
    },
    {
      id: 4,
      name: "Web Design Masterclass",
      description: "UI/UX design principles and tools",
      status: "Completed",
      students: 156,
      createdAt: "2024-01-05",
      lastModified: "2024-10-15",
      progress: 100,
    },
  ];

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
            <div className="text-2xl font-bold">{projects.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <IconEye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {projects.filter(p => p.status === "Active").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Draft Projects</CardTitle>
            <IconEdit className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {projects.filter(p => p.status === "Draft").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <IconDownload className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {projects.filter(p => p.status === "Completed").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">All Projects</h2>
        <div className="grid gap-4">
          {projects.map((project) => (
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
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <IconUsers className="h-4 w-4" />
                    {project.students} students
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <IconCalendar className="h-4 w-4" />
                    Created {project.createdAt}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Progress: {project.progress}%
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <IconEye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <IconEdit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      <IconTrash className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>Completion Progress</span>
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
          ))}
        </div>
      </div>
    </div>
  );
}