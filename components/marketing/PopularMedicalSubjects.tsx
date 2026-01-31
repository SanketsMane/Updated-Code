"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Stethoscope, Activity, Heart, Brain, Microscope, FlaskConical, Baby, Syringe, ClipboardList, Eye, Zap } from "lucide-react";

const subjects = [
    { name: "Human Anatomy", icon: Brain, color: "text-blue-600", bg: "bg-blue-50" },
    { name: "Pharmacology", icon: FlaskConical, color: "text-rose-600", bg: "bg-rose-50" },
    { name: "Pathology", icon: Microscope, color: "text-emerald-600", bg: "bg-emerald-50" },
    { name: "General Medicine", icon: Stethoscope, color: "text-indigo-600", bg: "bg-indigo-50" },
    { name: "Pediatrics", icon: Baby, color: "text-pink-600", bg: "bg-pink-50" },
    { name: "Cardiology", icon: Heart, color: "text-red-600", bg: "bg-red-50" },
    { name: "Physiology", icon: Activity, color: "text-cyan-600", bg: "bg-cyan-50" },
    { name: "Microbiology", icon: Syringe, color: "text-green-600", bg: "bg-green-50" },
    { name: "Obstetrics & Gynae", icon: ClipboardList, color: "text-purple-600", bg: "bg-purple-50" },
    { name: "Ophthalmology", icon: Eye, color: "text-amber-600", bg: "bg-amber-50" },
    { name: "Biochemistry", icon: Zap, color: "text-yellow-600", bg: "bg-yellow-50" },
    { name: "General Surgery", icon: Activity, color: "text-slate-600", bg: "bg-slate-50" },
];

export function PopularMedicalSubjects() {
    return (
        <section className="py-20 bg-white dark:bg-background border-t border-slate-200 dark:border-gray-800">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-[#011E21] dark:text-white mb-2">Most Popular Medical Subjects</h2>
                    <p className="text-muted-foreground">High-yield subjects mastered by thousands of NEET PG toppers.</p>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ staggerChildren: 0.05 }}
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                >
                    {subjects.map((subject, idx) => (
                        <motion.button
                            key={idx}
                            variants={{
                                hidden: { opacity: 0, x: -20 },
                                visible: { opacity: 1, x: 0 }
                            }}
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            className="bg-white dark:bg-card border border-slate-200 dark:border-gray-800 rounded-2xl py-4 px-5 flex items-center justify-between shadow-sm hover:shadow-md transition-all group hover:border-primary/30 dark:hover:border-primary/30"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl ${subject.bg} flex items-center justify-center shadow-inner border border-white dark:border-gray-700 transition-transform group-hover:scale-110`}>
                                    <subject.icon className={`w-6 h-6 ${subject.color}`} />
                                </div>
                                <span className="font-bold text-[#011E21] dark:text-gray-200 text-base">{subject.name}</span>
                            </div>
                            <div>
                                <ArrowRight className="w-5 h-5 text-gray-300 dark:text-gray-600 group-hover:text-primary transition-colors" />
                            </div>
                        </motion.button>
                    ))}
                </motion.div>

                <div className="text-center mt-12">
                    <Link href="/courses" className="text-gray-600 dark:text-gray-400 font-semibold flex items-center gap-2 mx-auto hover:text-primary transition-colors group w-fit">
                        <span className="underline underline-offset-4 decoration-gray-300 dark:decoration-gray-700 group-hover:decoration-primary">Explore all 19 subjects</span>
                        <div className="w-8 h-8 rounded-full bg-gray-800 dark:bg-secondary text-white dark:text-secondary-foreground flex items-center justify-center group-hover:bg-primary transition-colors">
                            <ArrowRight className="w-4 h-4" />
                        </div>
                    </Link>
                </div>
            </div>
        </section >
    );
}
