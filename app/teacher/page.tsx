import { requireTeacher } from "../data/auth/require-roles";
import { adminGetCourses } from "../data/admin/admin-get-courses";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  IconBook, 
  IconPlus, 
  IconUsers, 
  IconTrendingUp,
  IconChartBar
} from "@tabler/icons-react";
import Link from "next/link";
import { AdminCourseCard } from "../admin/courses/_components/AdminCourseCard";

export default async function TeacherDashboardPage() {
  await requireTeacher();
  
  const courses = await adminGetCourses();
  
  const stats = {
    totalCourses: courses.length,
    activeCourses: courses.filter(c => c.status === "Published").length,
    draftCourses: courses.filter(c => c.status === "Draft").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Welcome Back!</h1>
          <p className="text-muted-foreground">
            Manage your courses and track student progress
          </p>
        </div>
        <Link href="/admin/courses/create">
          <Button className="flex items-center gap-2">
            <IconPlus className="h-4 w-4" />
            Create New Course
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <IconBook className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCourses}</div>
            <p className="text-xs text-muted-foreground">
              Your course portfolio
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
            <IconTrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeCourses}</div>
            <p className="text-xs text-muted-foreground">
              Live courses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
            <IconChartBar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.draftCourses}</div>
            <p className="text-xs text-muted-foreground">
              In development
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Courses Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Your Courses</h2>
          <Link href="/admin/courses">
            <Button variant="outline">View All Courses</Button>
          </Link>
        </div>
        
        {courses.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {courses.slice(0, 6).map((course) => (
              <AdminCourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-8">
              <IconBook className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No courses yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first course to start teaching students.
              </p>
              <Link href="/admin/courses/create">
                <Button>
                  <IconPlus className="h-4 w-4 mr-2" />
                  Create Your First Course
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks for course management
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-2">
            <Link href="/admin/courses/create">
              <Button variant="outline" className="w-full justify-start">
                <IconPlus className="h-4 w-4 mr-2" />
                Create New Course
              </Button>
            </Link>
            <Link href="/admin/courses">
              <Button variant="outline" className="w-full justify-start">
                <IconBook className="h-4 w-4 mr-2" />
                Manage Courses
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}