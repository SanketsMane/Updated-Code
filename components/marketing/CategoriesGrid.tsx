"use client";

import { motion } from "framer-motion";
import { Code, GraduationCap, Briefcase, FileText, Calculator, Monitor, Music, Megaphone, HeartPulse } from "lucide-react";

// Pastel colors for icons matching the reference vibe
const categories = [
    { icon: Code, label: "Software Development", color: "bg-purple-100 text-purple-600" },
    { icon: GraduationCap, label: "Teaching & Academics", color: "bg-cyan-100 text-cyan-600" },
    { icon: Briefcase, label: "Business Development", color: "bg-violet-100 text-violet-600" },
    { icon: FileText, label: "Office Productivity", color: "bg-amber-100 text-amber-600" },
    { icon: Calculator, label: "Finance & Accounting", color: "bg-blue-100 text-blue-600" },
    { icon: Monitor, label: "IT & Softwares", color: "bg-blue-100 text-blue-600" },
    { icon: Music, label: "Music Production", color: "bg-pink-100 text-pink-600" },
    { icon: Megaphone, label: "Marketing", color: "bg-blue-100 text-blue-500" },
    { icon: HeartPulse, label: "Health & Fitness", color: "bg-indigo-100 text-indigo-500" },
];

export function CategoriesGrid() {
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
                    {categories.map((cat, idx) => (
                        <motion.div
                            key={idx}
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
                            <div className={`w-14 h-14 rounded-full flex items-center justify-center ${cat.color} group-hover:scale-110 transition-transform duration-300`}>
                                <cat.icon className="w-7 h-7" />
                            </div>
                            <span className="font-semibold text-gray-800 dark:text-gray-200 leading-tight">
                                {cat.label}
                            </span>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section >
    );
}
