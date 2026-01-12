"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { Star, ShieldCheck, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import { FeaturedMentor } from "@/app/data/marketing/get-marketing-data";

interface FeaturedMentorCarouselProps {
    mentors: FeaturedMentor[];
}

export function FeaturedMentorCarousel({ mentors }: FeaturedMentorCarouselProps) {
    if (!mentors || mentors.length === 0) return null;

    return (
        <div className="w-full py-2">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                    <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                    Top Rated This Week
                </h3>
                <Link href="/mentors" className="text-xs font-semibold text-primary hover:underline flex items-center">
                    View All <ChevronRight className="w-3 h-3" />
                </Link>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
                {mentors.map((mentor, i) => (
                    <motion.div
                        key={mentor.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={`min-w-[280px] p-4 rounded-xl border bg-gradient-to-br ${mentor.color} cursor-pointer hover:shadow-md transition-all snap-center`}
                    >
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <Image
                                    src={mentor.image}
                                    alt={mentor.name}
                                    width={64}
                                    height={64}
                                    className="rounded-full object-cover border-2 border-white dark:border-black shadow-sm"
                                />
                                <div className="absolute -bottom-1 -right-1 bg-white dark:bg-black rounded-full p-0.5">
                                    <ShieldCheck className="w-4 h-4 text-green-500 fill-green-500/20" />
                                </div>
                            </div>
                            <div>
                                <h4 className="font-bold text-foreground leading-tight">{mentor.name}</h4>
                                <p className="text-xs text-muted-foreground mb-1">{mentor.role}</p>
                                <div className="flex items-center gap-2 text-xs">
                                    <span className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-0.5">
                                        <Star className="w-3 h-3 fill-current" /> {mentor.rating.toFixed(1)}
                                    </span>
                                    <span className="text-muted-foreground">• {mentor.students} students</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
