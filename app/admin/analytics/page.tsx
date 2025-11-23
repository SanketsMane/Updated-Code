import { requireAdmin } from "../../data/admin/require-admin";
import { adminGetDashboardStats } from "../../data/admin/admin-get-dashboard-stats";
import { adminGetEnrollmentStats } from "../../data/admin/admin-get-enrollment-stats";
import { ChartAreaInteractive } from "@/components/sidebar/chart-area-interactive";
import { SectionCards } from "@/components/sidebar/section-cards";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  IconTrendingUp, 
  IconUsers, 
  IconBook, 
  IconCertificate,
  IconChartBar,
  IconEye,
  IconClock
} from "@tabler/icons-react";

export default async function AdminAnalyticsPage() {
  await requireAdmin();
  
  const dashboardStats = await adminGetDashboardStats();
  const enrollmentData = await adminGetEnrollmentStats();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Comprehensive insights into your LMS performance
          </p>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <IconTrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,431</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Students</CardTitle>
            <IconUsers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              +8% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <IconBook className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.totalCourses}</div>
            <p className="text-xs text-muted-foreground">
              +3 new this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <IconCertificate className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68%</div>
            <p className="text-xs text-muted-foreground">
              +2% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Enrollment Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconChartBar className="h-5 w-5" />
            Enrollment Trends
          </CardTitle>
          <CardDescription>
            Monthly enrollment statistics over the past year
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartAreaInteractive data={enrollmentData} />
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconEye className="h-5 w-5" />
              Course Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Most Popular Course</span>
              <span className="text-sm text-muted-foreground">React Masterclass</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Highest Rated</span>
              <span className="text-sm text-muted-foreground">JavaScript Fundamentals (4.9★)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Most Completed</span>
              <span className="text-sm text-muted-foreground">HTML & CSS Basics</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconClock className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">New enrollment in React Course</span>
              <span className="text-xs text-muted-foreground">2 hours ago</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Course completion certificate issued</span>
              <span className="text-xs text-muted-foreground">4 hours ago</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">New course published</span>
              <span className="text-xs text-muted-foreground">1 day ago</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}