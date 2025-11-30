import { requireTeacher } from "../../data/auth/require-roles";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconUsers, IconMail, IconEye } from "@tabler/icons-react";

export default async function TeacherStudentsPage() {
  await requireTeacher();

  // Mock student data
  const students = [
    {
      id: 1,
      name: "Alice Johnson",
      email: "alice@example.com",
      courses: 3,
      progress: 85,
      lastActive: "2 hours ago"
    },
    {
      id: 2,
      name: "Bob Smith",
      email: "bob@example.com",
      courses: 2,
      progress: 72,
      lastActive: "1 day ago"
    },
    {
      id: 3,
      name: "Carol Davis",
      email: "carol@example.com",
      courses: 4,
      progress: 96,
      lastActive: "30 minutes ago"
    },
    {
      id: 4,
      name: "David Wilson",
      email: "david@example.com",
      courses: 1,
      progress: 45,
      lastActive: "3 days ago"
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Students</h1>
          <p className="text-muted-foreground">
            Manage and track your students&apos; progress
          </p>
        </div>
        <Button>
          <IconMail className="h-4 w-4 mr-2" />
          Send Announcement
        </Button>
      </div>

      {/* Students Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <IconUsers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.length}</div>
            <p className="text-xs text-muted-foreground">
              Across all your courses
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Students</CardTitle>
            <IconUsers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.filter(s => s.lastActive.includes('hour') || s.lastActive.includes('minute')).length}</div>
            <p className="text-xs text-muted-foreground">
              Active in last 24 hours
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Progress</CardTitle>
            <IconUsers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(students.reduce((acc, s) => acc + s.progress, 0) / students.length)}%</div>
            <p className="text-xs text-muted-foreground">
              Overall course progress
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Students List */}
      <Card>
        <CardHeader>
          <CardTitle>Student List</CardTitle>
          <CardDescription>
            Overview of your students and their progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {students.map((student) => (
              <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium">{student.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-medium">{student.name}</p>
                    <p className="text-sm text-muted-foreground">{student.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <p className="text-sm font-medium">{student.courses}</p>
                    <p className="text-xs text-muted-foreground">Courses</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium">{student.progress}%</p>
                    <p className="text-xs text-muted-foreground">Progress</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium">{student.lastActive}</p>
                    <p className="text-xs text-muted-foreground">Last Active</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <IconEye className="h-4 w-4 mr-2" />
                    View Profile
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}