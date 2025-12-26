"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ChartSectionProps {
    title?: string;
    tabs?: string[];
    activeTab?: string;
    onTabChange?: (tab: string) => void;
    children: React.ReactNode;
    className?: string; // Add className prop
}

export function ChartSection({
    title = "Statistics",
    tabs = [],
    activeTab,
    onTabChange,
    children,
    className, // Destructure className
}: ChartSectionProps) {
    return (
        <Card className={cn("border-none shadow-sm", className)}> {/* Use cn to merge className */}
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
                <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">{title}</CardTitle>
                {tabs.length > 0 && (
                    <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => onTabChange?.(tab)}
                                className={cn(
                                    "px-3 py-1.5 text-xs font-semibold rounded-md transition-all",
                                    activeTab === tab
                                        ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                                        : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-300"
                                )}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                )}
            </CardHeader>
            <CardContent>
                {children}
            </CardContent>
        </Card>
    );
}
