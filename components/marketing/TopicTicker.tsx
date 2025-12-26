"use client";

import { Marquee } from "@/components/ui/marquee";
import { TrendingUp, Users, Zap } from "lucide-react";

const trendingTopics = [
    { label: "Business English", change: "+24%", color: "text-green-500" },
    { label: "Python for Kids", change: "+18%", color: "text-green-500" },
    { label: "IELTS Prep", change: "+12%", color: "text-green-500" },
    { label: "Spanish Conversation", change: "Hot", color: "text-orange-500" },
    { label: "Math Olympiad", change: "New", color: "text-blue-500" },
    { label: "Public Speaking", change: "+8%", color: "text-green-500" },
    { label: "React & Next.js", change: "Hot", color: "text-orange-500" },
];

export function TopicTicker() {
    return (
        <div className="border-y border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-black/50 backdrop-blur-sm">
            <Marquee pauseOnHover className="[--duration:30s] py-3">
                {trendingTopics.map((topic, i) => (
                    <div key={i} className="flex items-center gap-2 mx-8 text-sm font-medium text-muted-foreground whitespace-nowrap">
                        <TrendingUp className="w-4 h-4 text-primary" />
                        <span className="text-foreground">{topic.label}</span>
                        <span className={`text-xs font-bold ${topic.color} bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded-full`}>
                            {topic.change}
                        </span>
                    </div>
                ))}
            </Marquee>
        </div>
    );
}
