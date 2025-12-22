import { requireTeacher } from "../data/auth/require-roles";
import { adminGetCourses } from "../data/admin/admin-get-courses";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Book,
  Plus,
  Users,
  TrendingUp,
  BarChart,
  ArrowRight,
  MonitorPlay,
  FileEdit
} from "lucide-react";
import Link from "next/link";
import { TeacherCourseCard } from "./courses/_components/TeacherCourseCard";
import { Separator } from "@/components/ui/separator";

export default async function TeacherDashboardPage() {
  await requireTeacher();

  const courses = await adminGetCourses();

  const stats = {
    totalCourses: courses.length,
    activeCourses: courses.filter(c => c.status === "Published").length,
    draftCourses: courses.filter(c => c.status === "Draft").length,
  };

  return (
    <div className="space-y-8 p-1">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Welcome Back!
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your courses, track progress, and engage with students.
          </p>
        </div>
        <Link href="/teacher/courses/create">
          <Button className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-lg shadow-orange-600/20 transition-all hover:scale-105 border-0">
            <Plus className="h-4 w-4" />
            Create New Course
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Courses</CardTitle>
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-full">
              <Book className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalCourses}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across all categories
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Published</CardTitle>
            <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-full">
              <MonitorPlay className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.activeCourses}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Live and enrollment ready
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Drafts</CardTitle>
            <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-full">
              <FileEdit className="h-4 w-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.draftCourses}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Works in progress
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Recent Activity Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">

        {/* Main Course List */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <MonitorPlay className="h-5 w-5 text-gray-500" />
              Recent Courses
            </h2>
            <Link href="/teacher/courses" className="text-sm text-orange-600 hover:text-orange-700 hover:underline flex items-center gap-1">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {courses.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {courses.slice(0, 4).map((course) => (
                <TeacherCourseCard key={course.id} data={course} />
              ))}
            </div>
          ) : (
            <Card className="border-dashed">
              <CardContent className="text-center py-12 flex flex-col items-center">
                <div className="h-16 w-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                  <Book className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No courses yet</h3>
                <p className="text-muted-foreground mb-6 max-w-sm">
                  Create your first course to start teaching students and earning revenue.
                </p>
                <Link href="/teacher/courses/create">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Course
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar - Quick Actions */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
              <CardDescription>
                Essential tools for management
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <Link href="/teacher/courses/create" className="group">
                <div className="flex items-start gap-4 p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-md group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors">
                    <Plus className="h-5 w-5 text-blue-700 dark:text-blue-300" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">New Course</h4>
                    <p className="text-xs text-muted-foreground">Start a fresh curriculum</p>
                  </div>
                </div>
              </Link>

              <Link href="/teacher/courses" className="group">
                <div className="flex items-start gap-4 p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-md group-hover:bg-purple-200 dark:group-hover:bg-purple-800 transition-colors">
                    <Book className="h-5 w-5 text-purple-700 dark:text-purple-300" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Manage Courses</h4>
                    <p className="text-xs text-muted-foreground">Edit existing content</p>
                  </div>
                </div>
              </Link>

              <Link href="/teacher/analytics" className="group">
                <div className="flex items-start gap-4 p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-md group-hover:bg-orange-200 dark:group-hover:bg-orange-800 transition-colors">
                    <BarChart className="h-5 w-5 text-orange-700 dark:text-orange-300" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">View Analytics</h4>
                    <p className="text-xs text-muted-foreground">Check performance</p>
                  </div>
                </div>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}