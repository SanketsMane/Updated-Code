"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Star, MapPin, Clock, ArrowRight, ShieldCheck } from "lucide-react";
import Image from "next/image";

interface Teacher {
    id: string;
    userId: string;
    rating: number;
    totalReviews: number;
    hourlyRate: number;
    bio: string | null;
    expertise: string[];
    user: {
        name: string;
        image: string | null;
    };
}

interface Props {
    teachers: Teacher[];
}

export function AnimatedTeacherGrid({ teachers }: Props) {
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={{
                hidden: { opacity: 0 },
                visible: {
                    opacity: 1,
                    transition: {
                        staggerChildren: 0.1
                    }
                }
            }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
            {teachers.map((teacher) => (
                <motion.div
                    key={teacher.id}
                    variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 }
                    }}
                    className="group flex flex-col h-full bg-white dark:bg-card border border-gray-100 dark:border-gray-800 rounded-[2rem] overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                    {/* Header / Avatar */}
                    <div className="p-6 flex items-start gap-4">
                        <div className="relative shrink-0">
                            <div className="w-20 h-20 rounded-full border-2 border-white dark:border-gray-800 shadow-md relative overflow-hidden">
                                <img // Using img for external URLs if not configured in next.config
                                    src={teacher.user.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${teacher.user.name}`}
                                    alt={teacher.user.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="absolute -bottom-1 -right-1 bg-green-500 text-white p-1 rounded-full border-2 border-white dark:border-gray-800" title="Verified">
                                <ShieldCheck className="w-3.5 h-3.5" />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold group-hover:text-primary transition-colors text-[#011E21] dark:text-white leading-tight">
                                {teacher.user.name}
                            </h3>
                            <p className="text-sm text-primary font-medium mb-1.5 mt-0.5">
                                {teacher.expertise[0] || "Instructor"}
                            </p>
                            <div className="flex items-center gap-1 text-sm text-amber-500 bg-amber-50 dark:bg-amber-900/10 px-2 py-0.5 rounded-full w-fit">
                                <Star className="w-3.5 h-3.5 fill-current" />
                                <span className="font-bold">{teacher.rating?.toFixed(1) || "New"}</span>
                                <span className="text-muted-foreground ml-1 font-normal text-xs">({teacher.totalReviews})</span>
                            </div>
                        </div>
                    </div>

                    {/* Bio & Details */}
                    <div className="px-6 pb-6 flex-grow flex flex-col">
                        <p className="text-muted-foreground text-sm line-clamp-3 mb-5 leading-relaxed">
                            {teacher.bio || "Passionate educator helping students achieve their goals through personalized mentorship."}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-6">
                            {teacher.expertise.slice(0, 3).map((skill, i) => (
                                <span key={i} className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2.5 py-1 rounded-lg font-medium">
                                    {skill}
                                </span>
                            ))}
                        </div>

                        <div className="flex items-center justify-between text-sm text-muted-foreground mt-auto pt-5 border-t border-gray-100 dark:border-gray-800">
                            <div className="flex items-center gap-1.5 bg-secondary/50 px-2 py-1 rounded-md">
                                <Clock className="w-4 h-4 text-primary" />
                                <span className="font-medium">60 min</span>
                            </div>
                            <div className="text-[#011E21] dark:text-white font-extrabold text-lg">
                                {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format((teacher.hourlyRate || 0) / 100)}
                            </div>
                        </div>
                    </div>

                    {/* Action */}
                    <div className="p-4 bg-gray-50 dark:bg-black/20 mt-auto">
                        <Link
                            href={`/find-teacher/${teacher.id}`}
                            className="flex w-full py-3.5 text-center font-bold bg-[#011E21] dark:bg-white text-white dark:text-black rounded-xl hover:bg-primary hover:text-white transition-all items-center justify-center gap-2 shadow-sm group/btn"
                        >
                            View Profile <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </motion.div>
            ))}
        </motion.div>
    );
}
