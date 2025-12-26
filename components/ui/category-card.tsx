"use client";

import { cn } from "@/lib/utils";
import { ArrowRight, LucideIcon } from "lucide-react";
import Link from "next/link";
import { MotionWrapper } from "./motion-wrapper";

interface CategoryCardProps {
    title: string;
    count: number;
    icon?: LucideIcon; // Optional icon if available
    href: string;
    className?: string;
    delay?: number;
}

export function CategoryCard({
    title,
    count,
    icon: Icon,
    href,
    className,
    delay = 0,
}: CategoryCardProps) {
    return (
        <MotionWrapper delay={delay} variant="scale" className="h-full">
            <Link
                href={href}
                className={cn(
                    "group relative flex flex-col justify-between h-full p-6 bg-white dark:bg-card border border-border/50 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden",
                    className
                )}
            >
                {/* Hover Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                            {Icon ? <Icon className="h-6 w-6" /> : <div className="h-6 w-6 bg-current rounded-full opacity-20" />}
                        </div>
                        <span className="text-xs font-semibold text-muted-foreground bg-secondary px-2 py-1 rounded-full group-hover:bg-white/80 transition-colors">
                            {count} Courses
                        </span>
                    </div>

                    <h3 className="text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                        {title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                        Explore {title} courses
                    </p>
                </div>

                <div className="relative z-10 flex items-center text-sm font-semibold text-primary opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    Explore Now <ArrowRight className="ml-1 h-4 w-4" />
                </div>
            </Link>
        </MotionWrapper>
    );
}
