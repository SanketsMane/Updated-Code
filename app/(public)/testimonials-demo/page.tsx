"use client";

import { AnimatedTestimonialsDemo } from "@/components/ui/testimonial";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function TestimonialsDemoPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-8">
            <div className="w-full max-w-4xl mb-8 flex items-center justify-between">
                <Link href="/" className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
                </Link>
                <h1 className="text-2xl font-bold">New Animated Testimonials Demo</h1>
            </div>

            {/* Animated grid background effect */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] opacity-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            </div>

            <div className="z-10 w-full">
                <AnimatedTestimonialsDemo />
            </div>
        </div>
    );
}
