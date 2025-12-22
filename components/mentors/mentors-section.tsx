"use client";

import { FadeIn } from "../ui/fade-in";
import { MentorCard } from "./mentor-card";
import { useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface Mentor {
    name: string;
    role: string;
    company?: string;
    companyLogo?: string;
    rating: number;
    reviews: number;
    students: string;
    experience: string;
    skills: string[];
    hourlyRate: number;
    image: string;
    featured?: boolean;
}

interface MentorsSectionProps {
    mentors?: Mentor[];
}

export function MentorsSection({ mentors = [] }: MentorsSectionProps) {
    const [filter, setFilter] = useState<"popular" | "newest">("popular");

    if (!mentors || mentors.length === 0) {
        return null;
    }

    // Simple sort based on filter state for demonstration
    const displayedMentors = [...mentors].sort((a, b) => {
        if (filter === "popular") return b.reviews - a.reviews;
        return 0;
    });

    return (
        <section className="py-24 bg-[#0B0D10]">
            <div className="max-w-7xl mx-auto px-6">
                <FadeIn>
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
                        <div>
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-2">
                                Featured Mentors
                            </h2>
                            <p className="text-lg text-gray-400">
                                Learn from the best in the industry
                            </p>
                        </div>

                        <div className="flex items-center gap-4 mt-6 md:mt-0">
                            <button
                                onClick={() => setFilter("popular")}
                                suppressHydrationWarning
                                className={cn(
                                    "px-6 py-2 rounded-full text-sm font-medium transition-colors border",
                                    filter === "popular"
                                        ? "bg-[#1A1D21] border-white/10 text-white"
                                        : "bg-transparent border-transparent text-gray-400 hover:text-white"
                                )}
                            >
                                Most Popular
                            </button>
                            <button
                                onClick={() => setFilter("newest")}
                                suppressHydrationWarning
                                className={cn(
                                    "px-6 py-2 rounded-full text-sm font-medium transition-colors border",
                                    filter === "newest"
                                        ? "bg-[#1A1D21] border-white/10 text-white"
                                        : "bg-transparent border-transparent text-gray-400 hover:text-white"
                                )}
                            >
                                Newest
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center">
                        {displayedMentors.map((mentor, index) => (
                            <MentorCard key={index} {...mentor} />
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <Link
                            href="/find-teacher"
                            className="inline-flex items-center justify-center px-8 py-3 text-sm font-bold text-white border border-white/20 rounded-xl hover:bg-white/5 transition-all"
                        >
                            View All Mentors
                        </Link>
                    </div>
                </FadeIn>
            </div>
        </section>
    );
}
