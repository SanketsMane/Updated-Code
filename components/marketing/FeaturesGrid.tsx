"use client";

import { motion } from "framer-motion";
import { User, MessageCircle, Users, Star } from "lucide-react";
import Image from "next/image";

const features = [
    {
        icon: User,
        title: "Professional Tutors",
        description: "Choose from over a myriad of professional & experienced teachers to be fluent in any language.",
        color: "bg-blue-500",
        visual: (
            <div className="relative w-full h-full flex items-center justify-center">
                {/* Yellow Decoration */}
                <div className="absolute top-[-20%] left-[-20%] w-[200px] h-[200px] bg-yellow-300/30 rounded-full -z-10 blur-3xl" />
                <div className="absolute top-0 left-0 w-24 h-12 bg-[#FFEF5E] rounded-b-full -rotate-45 -translate-x-4 -translate-y-4" />
                <div className="absolute top-4 left-16 flex gap-1">
                    <div className="w-2 h-2 bg-[#FFEF5E] rounded-full" />
                    <div className="w-2 h-2 bg-[#FF5E5E] rounded-full" />
                </div>

                {/* Mock UI for Profile Card */}
                <motion.div
                    whileHover={{ y: -5, rotate: 0 }}
                    className="bg-white p-4 rounded-2xl shadow-xl w-[220px] relative z-10 border border-gray-100"
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden relative ring-2 ring-yellow-100">
                            <Image src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=200" alt="Tutor" fill className="object-cover" unoptimized />
                        </div>
                        <div>
                            <div className="h-2.5 w-24 bg-gray-800 rounded mb-1.5" />
                            <div className="h-2 w-16 bg-gray-200 rounded" />
                        </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2 flex items-center gap-2 mb-2">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-xs font-bold text-gray-700">4.9/5</span>
                    </div>
                </motion.div>
            </div>
        )
    },
    {
        icon: MessageCircle,
        title: "1-on-1 Live sessions",
        description: "Connect with your teachers via 1-on-1 live chat sessions and build a deeper understanding of a language.",
        color: "bg-teal-500",
        visual: (
            <div className="relative w-full h-full flex items-center justify-center">
                {/* Teal Decoration */}
                <div className="absolute bottom-[-20%] right-[-10%] w-[200px] h-[200px] bg-teal-300/30 rounded-full -z-10 blur-3xl" />
                <div className="absolute bottom-0 right-1/2 translate-x-1/2 translate-y-6 w-32 h-16 bg-[#4FB5C6] rounded-t-full -z-10" />

                {/* Mock UI for Video Call */}
                <div className="flex gap-4 z-10 items-center">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="w-24 h-32 bg-gray-900 rounded-xl overflow-hidden relative shadow-2xl border-2 border-white transform -rotate-3"
                    >
                        <Image src="https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=1000&auto=format&fit=crop" alt="Tutor" fill className="object-cover opacity-90" unoptimized />
                    </motion.div>
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="w-24 h-32 bg-gray-200 rounded-xl overflow-hidden relative shadow-2xl border-2 border-white transform rotate-3 mt-8"
                    >
                        <Image src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1000&auto=format&fit=crop" alt="Student" fill className="object-cover" unoptimized />

                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                            <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center"><div className="w-2 h-[2px] bg-white" /></div>
                            <div className="w-5 h-5 rounded-full bg-gray-700/50 backdrop-blur-sm flex items-center justify-center"><div className="w-2 h-2 bg-white rounded-full" /></div>
                        </div>
                    </motion.div>
                </div>
            </div>
        )
    },
    {
        icon: Users,
        title: "Group Classes",
        description: "Choose from over a myriad of professional & experienced teachers to be fluent in any language.",
        color: "bg-rose-500",
        visual: (
            <div className="relative w-full h-full flex items-center justify-center">
                {/* Red Decoration */}
                <div className="absolute top-[-10%] right-[-10%] w-[180px] h-[180px] bg-rose-300/30 rounded-full -z-10 blur-3xl" />
                <div className="absolute top-0 right-0 w-32 h-16 bg-[#FCA5A5] rounded-b-full -z-10" />

                {/* Mock UI for Group Call */}
                <div className="w-[280px] bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100 relative z-10">
                    <div className="grid grid-cols-2 gap-1 p-2 bg-gray-50">
                        {[1, 2, 3, 4].map(i => (
                            <motion.div
                                key={i}
                                whileHover={{ scale: 1.05 }}
                                className="aspect-video bg-gray-200 rounded-lg relative overflow-hidden"
                            >
                                <Image src={`https://randomuser.me/api/portraits/${i % 2 === 0 ? 'men' : 'women'}/${40 + i}.jpg`} alt="Participant" fill className="object-cover" unoptimized />
                                <div className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-green-500 border border-white" />
                            </motion.div>
                        ))}
                    </div>
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
                        We Make Language Learning Easy & Simpler
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
                            <div className="bg-white dark:bg-card p-6 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-800 w-full h-full hover:shadow-2xl transition-all duration-300">
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
