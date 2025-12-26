"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface StatItem {
    label: string;
    value: string | number;
    subValue?: string;
}

interface StatBoxProps {
    title: string;
    mainStat: StatItem;
    secondaryStat: StatItem;
    accentColor?: string; // e.g. "bg-blue-600"
}

export function StatBox({
    title,
    mainStat,
    secondaryStat,
    accentColor = "bg-blue-600",
}: StatBoxProps) {
    return (
        <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
                <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-6">{title}</h4>

                <div className="space-y-6">
                    {/* Main Stat */}
                    <div className="flex items-stretch gap-4">
                        <div className={`w-1 rounded-full ${accentColor}`} />
                        <div className="flex-1 space-y-1">
                            <p className="text-sm text-muted-foreground font-medium">{mainStat.label}</p>
                            <div className="flex items-baseline justify-between">
                                <span className="text-2xl font-bold text-gray-900 dark:text-gray-50">{mainStat.value}</span>
                                {mainStat.subValue && (
                                    <span className="text-xs text-muted-foreground">{mainStat.subValue}</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <Separator className="bg-gray-100 dark:bg-gray-800" />

                    {/* Secondary Stat */}
                    <div className="flex items-stretch gap-4">
                        <div className={`w-1 rounded-full ${accentColor} opacity-50`} />
                        <div className="flex-1 space-y-1">
                            <p className="text-sm text-muted-foreground font-medium">{secondaryStat.label}</p>
                            <div className="flex items-baseline justify-between">
                                <span className="text-xl font-bold text-gray-900 dark:text-gray-50">{secondaryStat.value}</span>
                                {secondaryStat.subValue && (
                                    <span className="text-xs text-muted-foreground">{secondaryStat.subValue}</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
