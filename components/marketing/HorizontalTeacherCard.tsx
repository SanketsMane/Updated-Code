"use client";

import { QuickBookDrawer } from "./QuickBookDrawer";
import { IconStarFilled, IconMapPin, IconMessageCircle, IconVideo, IconShieldCheck, IconCalendar, IconClock, IconHeart, IconShare } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useState, useRef } from "react";

interface TeacherCardProps {
    teacher: {
        id: string;
        name: string;
        image: string;
        headline: string;
        rating: number;
        reviewCount: number;
        hourlyRate: number;
        teaches: string[];
        speaks: string[];
        description: string;
        country: string;
        isVerified: boolean;
    }
}

export function HorizontalTeacherCard({ teacher }: TeacherCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isFavorited, setIsFavorited] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    // 3D Tilt Effect
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), { stiffness: 300, damping: 30 });
    const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), { stiffness: 300, damping: 30 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        mouseX.set((e.clientX - centerX) / rect.width);
        mouseY.set((e.clientY - centerY) / rect.height);
    };

    const handleMouseLeave = () => {
        mouseX.set(0);
        mouseY.set(0);
    };

    // Mock availability data
    const nextAvailableSlots = ["Today 2:00 PM", "Tomorrow 10:00 AM", "Wed 3:00 PM"];

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onHoverStart={() => setIsExpanded(true)}
            onHoverEnd={() => setIsExpanded(false)}
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
            }}
            className="group relative flex flex-col md:flex-row bg-white dark:bg-[#1e293b] border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
        >
            {/* Animated Gradient Border - Blue Theme */}
            <motion.div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                    backgroundImage: "linear-gradient(90deg, #3b82f6, #6366f1, #0ea5e9, #3b82f6)",
                    backgroundSize: "300% 300%",
                    padding: "2px",
                    zIndex: -1,
                }}
                animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                }}
            >
                <div className="w-full h-full bg-white dark:bg-[#1e293b] rounded-2xl" />
            </motion.div>

            {/* Shimmer Effect Overlay */}
            <motion.div
                className="absolute inset-0 pointer-events-none"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                style={{
                    background: "linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.05), transparent)",
                }}
            />

            {/* Left: Enhanced Profile Section */}
            <div className="relative w-full md:w-72 p-6 bg-gradient-to-br from-blue-50/50 to-white dark:from-blue-900/10 dark:to-[#1e293b] flex flex-col items-center justify-center border-r border-gray-100 dark:border-gray-800">
                <div className="relative group/avatar">
                    {/* Animated Ring - Blue */}
                    <motion.div
                        className="absolute inset-0 rounded-full"
                        animate={{
                            scale: [1, 1.1, 1],
                            opacity: [0.5, 0.8, 0.5],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        style={{
                            background: "linear-gradient(45deg, #3b82f6, #6366f1)",
                            filter: "blur(8px)",
                        }}
                    />

                    <motion.div
                        className="relative h-32 w-32 rounded-full overflow-hidden border-4 border-white dark:border-[#1e293b] shadow-xl mb-4"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <Image
                            src={teacher.image || "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&h=400&fit=crop&crop=faces"}
                            alt={teacher.name}
                            width={128}
                            height={128}
                            className="object-cover h-full w-full"
                        />

                        {/* Video Play Overlay */}
                        <motion.div
                            className="absolute inset-0 bg-blue-900/60 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity cursor-pointer"
                            whileHover={{ scale: 1.1 }}
                        >
                            <IconVideo className="h-10 w-10 text-white" />
                        </motion.div>
                    </motion.div>

                    {teacher.isVerified && (
                        <motion.div
                            className="absolute bottom-4 right-0 bg-white dark:bg-[#1e293b] rounded-full p-1.5 shadow-lg border border-blue-100 dark:border-blue-900"
                            title="Verified Expert"
                            whileHover={{ scale: 1.2, rotate: 360 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <IconShieldCheck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </motion.div>
                    )}
                </div>

                <h3 className="font-bold text-xl text-center leading-tight mb-1 text-slate-800 dark:text-slate-100">
                    {teacher.name}
                </h3>

                <div className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400 mb-3">
                    <IconMapPin className="h-4 w-4" />
                    <span>{teacher.country}</span>
                </div>

                <motion.div
                    className="flex items-center gap-1 text-amber-600 bg-amber-50 dark:from-amber-900/10 dark:to-orange-900/10 px-4 py-2 rounded-full text-sm font-semibold shadow-sm border border-amber-100 dark:border-amber-900/30 dark:text-amber-400 dark:bg-amber-900/20"
                    whileHover={{ scale: 1.05 }}
                >
                    <IconStarFilled className="h-4 w-4" />
                    <span className="text-base">{teacher.rating.toFixed(1)}</span>
                    <span className="text-gray-400 font-normal">({teacher.reviewCount})</span>
                </motion.div>

                {/* Quick Actions */}
                <div className="flex gap-2 mt-4">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsFavorited(!isFavorited)}
                        className="p-2 rounded-full bg-white dark:bg-[#1e293b] shadow-md hover:shadow-lg transition-shadow border border-gray-100 dark:border-gray-800"
                    >
                        <IconHeart
                            className={`h-5 w-5 transition-colors ${isFavorited ? "fill-rose-500 text-rose-500" : "text-gray-400 dark:text-gray-500"
                                }`}
                        />
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 rounded-full bg-white dark:bg-[#1e293b] shadow-md hover:shadow-lg transition-shadow border border-gray-100 dark:border-gray-800"
                    >
                        <IconShare className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                    </motion.button>
                </div>
            </div>

            {/* Middle: Enhanced Info Section */}
            <div className="flex-1 p-6 flex flex-col justify-between overflow-hidden">
                <div>
                    <div className="flex justify-between items-start mb-3">
                        <h4 className="font-bold text-xl text-blue-700 dark:text-blue-300">
                            {teacher.headline}
                        </h4>
                    </div>

                    <motion.p
                        className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4"
                        animate={{
                            height: isExpanded ? "auto" : "3.6em",
                        }}
                        style={{
                            overflow: "hidden",
                            display: "-webkit-box",
                            WebkitLineClamp: isExpanded ? "unset" : 3,
                            WebkitBoxOrient: "vertical",
                        }}
                    >
                        {teacher.description}
                    </motion.p>

                    <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-2 text-sm">
                            <span className="font-semibold text-slate-700 dark:text-slate-300">Teaches:</span>
                            {teacher.teaches.map((lang, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.1 }}
                                    whileHover={{ scale: 1.1, y: -2 }}
                                >
                                    <Badge
                                        variant="secondary"
                                        className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200 border border-blue-100 dark:border-blue-800 rounded-lg px-3 py-1 font-medium cursor-pointer"
                                    >
                                        {lang}
                                    </Badge>
                                </motion.div>
                            ))}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-sm">
                            <span className="font-semibold text-slate-700 dark:text-slate-300">Speaks:</span>
                            {teacher.speaks.map((lang, idx) => (
                                <span key={idx} className="text-slate-500 dark:text-slate-400">
                                    {lang}{idx < teacher.speaks.length - 1 ? " • " : ""}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Expandable Availability Section */}
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{
                            opacity: isExpanded ? 1 : 0,
                            height: isExpanded ? "auto" : 0,
                        }}
                        transition={{ duration: 0.3 }}
                        className="mt-4 overflow-hidden"
                    >
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                            <div className="flex items-center gap-2 mb-3">
                                <IconCalendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                <span className="font-semibold text-slate-700 dark:text-slate-200">
                                    Next Available Slots
                                </span>
                            </div>
                            <div className="space-y-2">
                                {nextAvailableSlots.map((slot, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="flex items-center gap-2 text-sm"
                                    >
                                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                                        <IconClock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                        <span className="text-gray-700 dark:text-gray-300">{slot}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Right: Enhanced Action Section */}
            <div className="w-full md:w-64 p-6 border-l border-gray-100 dark:border-gray-800 flex flex-col justify-center items-center gap-4 bg-gray-50/30 dark:bg-transparent">
                <div className="text-center">
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Hourly Rate</p>
                    <motion.div
                        className="text-4xl font-extrabold text-blue-700 dark:text-white"
                        whileHover={{ scale: 1.05 }}
                    >
                        ₹{teacher.hourlyRate.toLocaleString()}
                    </motion.div>
                    <p className="text-xs text-slate-400 mt-1">per session</p>
                </div>

                <div className="w-full space-y-3">
                    <QuickBookDrawer
                        teacher={teacher}
                        trigger={
                            <motion.div
                                whileHover={{ scale: 1.02, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full"
                            >
                                <Button className="w-full font-bold shadow-lg hover:shadow-xl transition-all bg-blue-600 hover:bg-blue-700 text-white relative overflow-hidden group/btn">
                                    <motion.div
                                        className="absolute inset-0 bg-white/20"
                                        initial={{ x: "-100%" }}
                                        whileHover={{ x: "100%" }}
                                        transition={{ duration: 0.5 }}
                                    />
                                    <span className="relative">Book Now</span>
                                </Button>
                            </motion.div>
                        }
                    />
                    <Link href={`/teachers/profile/${teacher.id}`} className="block w-full">
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button
                                variant="outline"
                                className="w-full font-semibold border-2 border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 dark:border-blue-800 dark:text-blue-300 dark:hover:bg-blue-900/30 transition-all"
                            >
                                View Profile
                            </Button>
                        </motion.div>
                    </Link>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                            variant="ghost"
                            className="w-full font-semibold text-slate-500 dark:text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        >
                            <IconMessageCircle className="h-4 w-4 mr-2" />
                            Send Message
                        </Button>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}
