"use client";

import { useState } from "react";
import { ChartSection } from "@/components/dashboard/yo-coach/chart-section";
import { ChartAreaInteractive } from "@/components/sidebar/chart-area-interactive";

export function AdminChartSection() {
    const [activeTab, setActiveTab] = useState("Lesson commissions");

    return (
        <ChartSection
            title="Statistics"
            tabs={["Lesson commissions", "Class commissions", "Course commissions"]}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            className="lg:col-span-2 bg-white dark:bg-card"
        >
            <ChartAreaInteractive />
        </ChartSection>
    );
}
