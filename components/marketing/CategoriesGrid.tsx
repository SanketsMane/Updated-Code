"use client";

import { motion } from "framer-motion";
import { FeaturedCategory } from "@/app/data/marketing/get-marketing-data";
import { Code, GraduationCap, Briefcase, FileText, Calculator, Monitor, Music, Megaphone, HeartPulse, icons } from "lucide-react";

interface CategoriesGridProps {
    categories: FeaturedCategory[];
}

// Fallback icons map
const IconMap: any = {
    development: Code,
    design: Monitor,
    business: Briefcase,
    marketing: Megaphone,
    // Add more mappings or generic fallback
    default: GraduationCap
};

export function CategoriesGrid({ categories }: CategoriesGridProps) {
    // If no categories, return null or empty state
    if (!categories || categories.length === 0) return null;

    return (
        <section className="py-20 bg-gray-50/50 dark:bg-background border-t border-gray-100 dark:border-gray-800">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-[#011E21] dark:text-white">Most demanding categories</h2>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ staggerChildren: 0.1 }}
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
                >
                    {categories.map((cat, idx) => {
                        const Icon = IconMap[cat.slug] || IconMap.default;
                        // Use a consistent color or map it
                        const colorClass = cat.color || "bg-blue-100 text-blue-600";

                        return (
                            <motion.div
                                key={cat.id}
                                variants={{
                                    hidden: { opacity: 0, scale: 0.8 },
                                    visible: { opacity: 1, scale: 1 }
                                }}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                whileHover={{ y: -5, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)" }}
                                className="bg-white dark:bg-card rounded-2xl p-6 flex flex-col items-center text-center justify-center gap-4 border border-gray-100 dark:border-gray-800 h-[180px] transition-all cursor-pointer group hover:border-gray-200 dark:hover:border-gray-700"
                            >
                                <div className={`w-14 h-14 rounded-full flex items-center justify-center ${colorClass} group-hover:scale-110 transition-transform duration-300`}>
                                    <Icon className="w-7 h-7" />
                                </div>
                                <span className="font-semibold text-gray-800 dark:text-gray-200 leading-tight">
                                    {cat.label}
                                </span>
                                <span className="text-xs text-muted-foreground">{cat.count} Courses</span>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section >
    );
}
