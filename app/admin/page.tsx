"use client";

import { useState } from "react";
import { RevenueCard } from "@/components/dashboard/yo-coach/revenue-card";
import { StatBox } from "@/components/dashboard/yo-coach/stat-box";
import { ChartSection } from "@/components/dashboard/yo-coach/chart-section";
import { LayoutDashboard, Users, BookOpen, MonitorPlay, Wallet, CreditCard, Ticket } from "lucide-react";
import { ChartAreaInteractive } from "@/components/sidebar/chart-area-interactive";

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState("Lesson commissions");

  // Mock Data
  const revenueStats = [
    {
      title: "Lessons revenue",
      amount: "$3,202.10",
      icon: <BookOpen className="h-5 w-5" />,
      variant: "blue" as const
    },
    {
      title: "Classes revenue",
      amount: "$1,765.00",
      icon: <MonitorPlay className="h-5 w-5" />,
      variant: "orange" as const
    },
    {
      title: "Subscription revenue",
      amount: "$9,100.00",
      icon: <CreditCard className="h-5 w-5" />,
      variant: "purple" as const
    }
  ];

  const contentStats = [
    {
      title: "Lessons",
      main: { label: "Total lessons", value: "342", subValue: "This month 0" },
      secondary: { label: "Completed lessons", value: "96", subValue: "This month 0" },
      color: "bg-blue-600"
    },
    {
      title: "Classes",
      main: { label: "Total classes", value: "109", subValue: "This month 0" },
      secondary: { label: "Purchased classes", value: "17", subValue: "This month 0" },
      color: "bg-orange-500"
    },
    {
      title: "Subscriptions",
      main: { label: "Purchased subscriptions", value: "29", subValue: "This month 0" },
      secondary: { label: "Completed subscriptions", value: "2", subValue: "This month 0" },
      color: "bg-purple-600"
    }
  ];

  return (
    <div className="space-y-6 bg-gray-50/50 dark:bg-black/50">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
      </div>

      {/* 1. Revenue Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {revenueStats.map((stat, i) => (
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
          title="Statistics"
          tabs={["Lesson commissions", "Class commissions", "Course commissions"]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          className="lg:col-span-2 bg-white dark:bg-card"
        >
          {/* Reusing existing chart component for now, can be specialized later */}
          <ChartAreaInteractive />
        </ChartSection>

        {/* Right Side Widgets (Placeholder for "Total Orders" or similar) */}
        <div className="space-y-6">
          <div className="bg-[#1e293b] text-white p-6 rounded-xl shadow-lg h-48 flex flex-col justify-center relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="font-bold text-xl mb-1">System Status</h3>
              <p className="text-slate-300 text-sm">All systems operational</p>
              <div className="mt-4 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs font-medium text-green-400">Live</span>
              </div>
            </div>
            <div className="absolute right-0 bottom-0 opacity-10">
              <LayoutDashboard className="h-32 w-32 -mb-8 -mr-8" />
            </div>
          </div>

          <div className="bg-white dark:bg-card p-6 rounded-xl shadow-sm border-none">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                <Ticket className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">Total orders</p>
                <h3 className="text-2xl font-bold">513</h3>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">This month <span className="text-green-600 font-bold">+12%</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
