"use client";

import { motion } from "framer-motion";
import { User, MessageCircle, Users, Star } from "lucide-react";
import Image from "next/image";

const features = [
    {
        icon: User,
        title: "Top Medical Faculty",
        description: "Learn from top-ranked doctors and medical specialists who bring years of clinical and academic expertise to your preparation.",
        color: "bg-blue-500",
        visual: (
            <div className="relative w-full h-full flex items-center justify-center">
                {/* Modern Backdrop */}
                <div className="absolute inset-0 bg-blue-500/5 rounded-3xl -z-10 blur-2xl" />
                
                {/* Premium Profile Card */}
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-2xl w-[240px] relative z-10 border border-slate-200 dark:border-white/20"
                >
                    <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-3">
                        <Image 
                            src="/marketing/tutor_portrait.png" 
                            alt="Medical Faculty" 
                            fill 
                            className="object-cover"
                        />
                        <div className="absolute top-2 right-2 px-2 py-0.5 bg-green-500 text-white text-[10px] font-bold rounded-full flex items-center gap-1">
                            <Star className="w-2.5 h-2.5 fill-current" /> Verified
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <div className="h-4 w-3/4 bg-slate-800 rounded-sm" />
                        <div className="h-3 w-1/2 bg-slate-200 rounded-sm" />
                    </div>
                </motion.div>
                
                {/* Floating Elements */}
                <motion.div 
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-4 -right-2 w-16 h-16 bg-[#FFEF5E]/20 rounded-full blur-xl"
                />
            </div>
        )
    },
    {
        icon: MessageCircle,
        title: "1-on-1 Mentorship",
        description: "Experience personalized guidance with high-definition video calls and real-time clinical doubt clearance.",
        color: "bg-teal-500",
        visual: (
            <div className="relative w-full h-full flex items-center justify-center">
                <div className="absolute inset-0 bg-teal-500/5 rounded-3xl -z-10 blur-2xl" />
                
                {/* Live Call Interface */}
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="relative w-[280px] aspect-video rounded-2xl overflow-hidden shadow-2xl border-4 border-slate-200 dark:border-white"
                >
                    <Image 
                        src="/marketing/live_session_call.png" 
                        alt="1-on-1 Mentorship" 
                        fill 
                        className="object-cover"
                    />
                    {/* UI Overlay */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 px-4 py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/10">
                        <div className="w-6 h-6 rounded-full bg-white/20" />
                        <div className="w-6 h-6 rounded-full bg-white/20" />
                        <div className="w-8 h-8 rounded-full bg-red-500/80" />
                    </div>
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-[10px] font-bold text-white uppercase tracking-wider">Live</span>
                    </div>
                </motion.div>
            </div>
        )
    },
    {
        icon: Users,
        title: "High-Yield Groups",
        description: "Join vibrant aspirant communities and crack complex clinical cases through interactive peer discussions.",
        color: "bg-rose-500",
        visual: (
            <div className="relative w-full h-full flex items-center justify-center">
                <div className="absolute inset-0 bg-rose-500/5 rounded-3xl -z-10 blur-2xl" />
                
                {/* Group Class Grid */}
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="w-[280px] aspect-square rounded-2xl overflow-hidden shadow-2xl border-4 border-slate-200 dark:border-white bg-slate-900"
                >
                    <Image 
                        src="/marketing/group_class.png" 
                        alt="Group Class" 
                        fill 
                        className="object-cover"
                    />
                </motion.div>
                
                {/* Floating Participant Count */}
                <div className="absolute -bottom-2 -right-4 bg-white px-4 py-2 rounded-xl shadow-lg border border-slate-200 flex items-center gap-2">
                    <div className="flex -space-x-2">
                        {[1,2,3].map(i => (
                            <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-200" />
                        ))}
                    </div>
                    <span className="text-[10px] font-bold text-slate-600">+12 more</span>
                </div>
            </div>
        )
    },
];

export function FeaturesGrid() {
    return (
        <section className="py-24 bg-white dark:bg-background border-b border-border/40">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16 max-w-2xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#011E21] dark:text-white mb-6">
                        We Make NEET PG Preparation Easy & Smarter
                    </h2>
                    <div className="h-1 w-20 bg-primary mx-auto rounded-full" />
                </div>

                <div className="grid md:grid-cols-3 gap-8 md:gap-12">
                    {features.map((feature, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: -50 }} // Changed from 30 to -50 for "up to down"
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6, delay: idx * 0.2, ease: "easeOut" }}
                            className="group flex flex-col items-center text-center"
                        >
                            <div className="bg-white dark:bg-card p-6 rounded-3xl shadow-lg border border-slate-200 dark:border-gray-800 w-full h-full hover:shadow-2xl transition-all duration-300">
                                {/* Visual Container - Added padding and centered content to avoid clipping */}
                                <div className="w-full aspect-[4/3] mb-6 relative flex items-center justify-center p-4">
                                    {feature.visual}
                                </div>

                                <h3 className="text-2xl font-bold text-[#011E21] dark:text-white mb-3">
                                    {feature.title}
                                </h3>

                                <p className="text-muted-foreground leading-relaxed dark:text-slate-400">
                                    {feature.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
