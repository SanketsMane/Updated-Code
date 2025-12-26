import { requireTeacher } from "../data/auth/require-roles";
import { adminGetCourses } from "../data/admin/admin-get-courses";
import { RevenueCard } from "@/components/dashboard/yo-coach/revenue-card";
import { StatBox } from "@/components/dashboard/yo-coach/stat-box";
import { ChartSection } from "@/components/dashboard/yo-coach/chart-section";
import { ChartAreaInteractive } from "@/components/sidebar/chart-area-interactive";
import { BookOpen, Users, Wallet, Clock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function TeacherDashboardPage() {
  await requireTeacher();
  const courses = await adminGetCourses();

  const stats = {
    totalCourses: courses.length,
    activeCourses: courses.filter((c: any) => c.status === "Published").length,
    draftCourses: courses.filter((c: any) => c.status === "Draft").length,
  };

  // Mock Earnings Data
  const earningsStats = [
    {
      title: "Total Earnings",
      amount: "₹12,450.00",
      icon: <Wallet className="h-5 w-5" />,
      variant: "blue" as const,
      subTitle: "This month ₹2,400.00"
    },
    {
      title: "Pending Payout",
      amount: "₹1,240.00",
      icon: <Clock className="h-5 w-5" />,
      variant: "orange" as const,
      subTitle: "Process date: 30th Dec"
    },
    {
      title: "Lifetime Students",
      amount: "156",
      icon: <Users className="h-5 w-5" />,
      variant: "purple" as const,
      subTitle: "+12 this week"
    }
  ];

  const contentStats = [
    {
      title: "My Content",
      main: { label: "Total Courses", value: stats.totalCourses.toString(), subValue: `${stats.activeCourses} Published` },
      secondary: { label: "Total Lessons", value: "48", subValue: "Across all courses" },
      color: "bg-blue-600"
    },
    {
      title: "Engagement",
      main: { label: "Total Reviews", value: "24", subValue: "Avg Rating 4.8" },
      secondary: { label: "Questions Answered", value: "142", subValue: "Response rate 98%" },
      color: "bg-orange-500"
    },
    {
      title: "Live Sessions",
      main: { label: "Hours Taught", value: "128h", subValue: "This year" },
      secondary: { label: "Upcoming", value: "3", subValue: "Next: Today 6PM" },
      color: "bg-purple-600"
    }
  ];

  return (
    <div className="space-y-6 p-6 max-w-[1600px] mx-auto bg-gray-50/50 dark:bg-black/50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Instructor Dashboard</h1>
          <p className="text-muted-foreground text-sm">Welcome back! Here's your performance overview.</p>
        </div>
        <Link href="/teacher/courses/create">
          <Button className="bg-[#1e293b] hover:bg-[#0f172a]">Create New Course</Button>
        </Link>
      </div>

      {/* 1. Earnings Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {earningsStats.map((stat, i) => (
          <RevenueCard key={i} {...stat} />
        ))}
      </div>

      {/* 2. Content Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {contentStats.map((stat, i) => (
          <StatBox
            key={i}
            title={stat.title}
            mainStat={stat.main}
            secondaryStat={stat.secondary}
            accentColor={stat.color}
          />
        ))}
      </div>

      {/* 3. Main Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartSection
          title="Earnings Statistics"
          tabs={["Course Sales", "Live Sessions"]}
          activeTab="Course Sales"
          className="lg:col-span-2 bg-white dark:bg-card"
        >
          <ChartAreaInteractive />
        </ChartSection>

        {/* Right Side Widgets */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-card p-6 rounded-xl shadow-sm border-none">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" /> Top Review
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 italic mb-4">"The React course was absolutely amazing! Explained concepts clearly."</p>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-gray-200" />
              <div>
                <p className="text-xs font-bold">Sarah Jenkins</p>
                <p className="text-[10px] text-muted-foreground">Frontend Developer</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}