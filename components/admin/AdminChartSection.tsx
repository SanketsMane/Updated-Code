"use client";

import { useState } from "react";
import { ChartSection } from "@/components/dashboard/yo-coach/chart-section";
import { ChartAreaInteractive } from "@/components/sidebar/chart-area-interactive";

export function AdminChartSection({ data }: { data?: any[] }) {
    const [activeTab, setActiveTab] = useState("Revenue");

    return (
        <ChartSection
            title="Statistics"
            tabs={["Revenue"]}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            className="lg:col-span-2 bg-white dark:bg-card"
        >
            <ChartAreaInteractive
                data={data}
                dataKey="revenue"
                label="Revenue"
                color="hsl(var(--primary))"
            />
        </ChartSection>
    );
}
