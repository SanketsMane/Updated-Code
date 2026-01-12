import { getSessionWithRole } from "../data/auth/require-roles";
import { getUserAnalytics } from "../actions/analytics";
import { StatsCard, ScheduleWidget, ActivityFeed, WalletWidget, QuickActions } from "@/components/dashboard/dashboard-widgets";
import { IconBook, IconTrophy, IconClock, IconFlame, IconSearch, IconSparkles } from "@tabler/icons-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { getEnrolledCourses } from "../data/user/get-enrolled-courses";
import { CourseProgressCard } from "./_components/CourseProgressCard";
import { Input } from "@/components/ui/input";
import { MotionWrapper } from "@/components/ui/motion-wrapper";
import { ArrowRight, PlayCircle, BookOpen, Clock, Target } from "lucide-react";
import { RevenueCard } from "@/components/dashboard/yo-coach/revenue-card"; // Reusing for consistency
import { StatBox } from "@/components/dashboard/yo-coach/stat-box";
import { ChartSection } from "@/components/dashboard/yo-coach/chart-section";
import { ChartAreaInteractive } from "@/components/sidebar/chart-area-interactive";
import { getStudentSchedule } from "../data/student/get-student-schedule";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getSessionWithRole();

  if (session) {
    if (session.user.role === "admin") redirect("/admin");
    if (session.user.role === "teacher") redirect("/teacher");
  }

  const userId = session?.user?.id || '';
  const analytics = await getUserAnalytics(userId);
  const enrolledCourses = await getEnrolledCourses();
  const scheduleItems = await getStudentSchedule(userId);

  // Recent activity adapted from analytics
  // const recentActivity = analytics.recentActivity ... (TODO: Map this if needed for a widget)

  // Yo-Coach Style Top Cards (Adapted for Student)
  const topStats = [
    {
      title: "Lessons Done",
      amount: analytics.stats.totalLessonsCompleted.toString(),
      subTitle: "Keep learning!",
      icon: <BookOpen className="h-5 w-5" />,
      variant: "blue" as const
    },
    {
      title: "Completed Courses",
      amount: analytics.stats.completedCourses.toString(),
      subTitle: `Out of ${analytics.stats.enrollmentCount} enrolled`,
      icon: <IconTrophy className="h-5 w-5" />,
      variant: "orange" as const
    },
    {
      title: "Sessions Attended",
      amount: analytics.stats.completedSessions.toString(),
      subTitle: `${analytics.stats.totalSessionsBooked} booked total`,
      icon: <IconFlame className="h-5 w-5" />,
      variant: "purple" as const
    }
  ];

  return (
    <div className="space-y-6 p-6 max-w-[1600px] mx-auto bg-gray-50/50 dark:bg-black/50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Student Dashboard</h1>
          <p className="text-muted-foreground text-sm">Track your learning progress and upcoming classes.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="hidden md:flex">View Calendar</Button>
          <Link href="/courses">
            <Button className="bg-[#1e293b] hover:bg-[#0f172a]">Browse Courses</Button>
          </Link>
        </div>
      </div>

      {/* 1. Top Stats Row (Yo-Coach Style) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {topStats.map((stat, i) => (
          <RevenueCard key={i} {...stat} />
        ))}
      </div>

      {/* 2. Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column (Span 2) */}
        <div className="lg:col-span-2 space-y-6">

          {/* Active Courses Box */}
          <div className="bg-white dark:bg-card rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">Active Courses</h3>
              <Link href="/dashboard/courses" className="text-sm text-blue-600 font-medium hover:underline">View All</Link>
            </div>

            {enrolledCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {enrolledCourses.slice(0, 4).map((course: any) => (
                  <CourseProgressCard key={course.Course.id} data={course} />
                ))}
              </div>
            ) : (
              <div className="text-center py-10 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-xl">
                <p className="text-muted-foreground text-sm mb-4">You have no active courses.</p>
                <Link href="/courses"><Button variant="outline">Browse Marketplace</Button></Link>
              </div>
            )}
          </div>

          {/* Learning Activity Chart */}
          <ChartSection
            title="Learning Activity"
            tabs={["Hours", "Lessons"]}
            activeTab="Hours"
            className="bg-white dark:bg-card"
          >
            <ChartAreaInteractive />
          </ChartSection>
        </div>

        {/* Right Column (Span 1) */}
        <div className="space-y-6">
          <WalletWidget />
          <ScheduleWidget items={scheduleItems} />

          {/* Quick Stats Box */}
          <StatBox
            title="Achievements"
            mainStat={{ label: "Certificates", value: "3", subValue: "Latest: React" }}
            secondaryStat={{ label: "Badges", value: "12", subValue: "Level 4" }}
            accentColor="bg-yellow-500"
          />
        </div>

      </div>
    </div>
  );
}
