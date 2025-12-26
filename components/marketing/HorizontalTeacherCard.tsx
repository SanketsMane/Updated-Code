"use client";

import { QuickBookDrawer } from "./QuickBookDrawer";
import { IconStarFilled, IconMapPin, IconMessageCircle, IconVideo, IconShieldCheck } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

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
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            whileHover={{
                scale: 1.01,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
            }}
            className="group flex flex-col md:flex-row bg-white dark:bg-card border-2 border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-md transition-all duration-300"
        >
            {/* Left: Profile Section */}
            <div className="w-full md:w-64 p-6 bg-gray-50 dark:bg-muted/30 flex flex-col items-center justify-center border-r border-gray-100 dark:border-gray-800">
                <div className="relative">
                    <div className="h-28 w-28 rounded-full overflow-hidden border-4 border-white dark:border-card shadow-sm mb-4">
                        <Image
                            src={teacher.image || "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&h=400&fit=crop&crop=faces"}
                            alt={teacher.name}
                            width={112}
                            height={112}
                            className="object-cover h-full w-full group-hover:scale-105 transition-transform duration-500"
                        />
                    </div>
                    {teacher.isVerified && (
                        <div className="absolute bottom-4 right-0 bg-white dark:bg-card rounded-full p-1 shadow-sm" title="Verified Expert">
                            <IconShieldCheck className="h-5 w-5 text-green-500 fill-green-500/10" />
                        </div>
                    )}
                </div>

                <h3 className="font-bold text-lg text-center leading-tight mb-1">{teacher.name}</h3>

                <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                    <IconMapPin className="h-3.5 w-3.5" />
                    <span>{teacher.country}</span>
                </div>

                <div className="flex items-center gap-1 text-amber-500 bg-amber-50 dark:bg-amber-900/10 px-3 py-1 rounded-full text-sm font-semibold">
                    <IconStarFilled className="h-3.5 w-3.5" />
                    <span>{teacher.rating.toFixed(1)}</span>
                    <span className="text-gray-400 font-normal">({teacher.reviewCount})</span>
                </div>
            </div>

            {/* Middle: Info Section */}
            <div className="flex-1 p-6 flex flex-col justify-between">
                <div>
                    <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-lg text-primary">{teacher.headline}</h4>
                    </div>

                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 md:line-clamp-3 mb-4">
                        {teacher.description}
                    </p>

                    <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-2 text-sm">
                            <span className="font-semibold text-gray-700 dark:text-gray-300">Teaches:</span>
                            {teacher.teaches.map((lang, idx) => (
                                <Badge key={idx} variant="secondary" className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 hover:bg-blue-100 border-none rounded-md px-2.5 py-0.5 font-medium">
                                    {lang}
                                </Badge>
                            ))}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-sm">
                            <span className="font-semibold text-gray-700 dark:text-gray-300">Speaks:</span>
                            {teacher.speaks.map((lang, idx) => (
                                <span key={idx} className="text-muted-foreground">{lang}{idx < teacher.speaks.length - 1 ? " • " : ""}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Right: Action Section */}
            <div className="w-full md:w-56 p-6 border-l border-gray-100 dark:border-gray-800 flex flex-col justify-center items-center gap-4 bg-gray-50/50 dark:bg-muted/10">
                <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">Hourly Rate</p>
                    <div className="text-3xl font-extrabold text-[#011E21] dark:text-white">
                        ₹{teacher.hourlyRate.toLocaleString()}
                    </div>
                </div>

                <div className="w-full space-y-3">
                    <QuickBookDrawer
                        teacher={teacher}
                        trigger={
                            <Button className="w-full font-bold shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all">
                                Book Now
                            </Button>
                        }
                    />
                    <Link href={`/teachers/profile/${teacher.id}`} className="block w-full">
                        <Button variant="outline" className="w-full font-semibold border-primary/20 text-primary hover:bg-primary/5">
                            View Profile
                        </Button>
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}
