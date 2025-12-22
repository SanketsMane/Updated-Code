"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Calendar, Clock, Users, ArrowRight, Video } from "lucide-react";

interface SessionCardProps {
    id: string;
    title: string;
    instructor: string;
    date: string;
    time: string;
    duration: string;
    participants: number;
    maxParticipants: number;
    level: string;
    price: string;
    rating: number;
    index: number; // for staggering animations
}

export function SessionCard({
    id,
    title,
    instructor,
    date,
    time,
    duration,
    participants,
    maxParticipants,
    level,
    price,
    rating,
}: SessionCardProps) {
    const isAvailable = participants < maxParticipants;
    const levelColor =
        level === "Beginner" ? "text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400" :
            level === "Intermediate" ? "text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400" :
                "text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400";

    return (
        <Card className="group relative overflow-hidden bg-card border-border hover:shadow-lg transition-all duration-300 hover:border-primary/50 flex flex-col h-full">
            {/* Top Status Bar */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <CardContent className="p-6 flex flex-col gap-4 flex-1">

                {/* Header Row */}
                <div className="flex items-start justify-between">
                    <Badge variant="outline" className={`${levelColor} border-0 font-semibold px-2.5 py-0.5`}>
                        {level}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm font-medium text-amber-500">
                        <span>★ {rating}</span>
                    </div>
                </div>

                {/* Title */}
                <div>
                    <h3 className="text-xl font-bold text-card-foreground leading-tight group-hover:text-primary transition-colors mb-1">
                        {title}
                    </h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                        <span className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-primary">
                            {instructor.charAt(0)}
                        </span>
                        by {instructor}
                    </p>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground mt-2">
                    <div className="flex items-center gap-2 bg-secondary/50 p-2 rounded">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span>{date}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-secondary/50 p-2 rounded">
                        <Clock className="w-4 h-4 text-primary" />
                        <span>{time}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-secondary/50 p-2 rounded">
                        <Video className="w-4 h-4 text-primary" />
                        <span>{duration}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-secondary/50 p-2 rounded">
                        <Users className="w-4 h-4 text-primary" />
                        <span>{participants}/{maxParticipants}</span>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="p-6 pt-0 flex items-center justify-between border-t border-border/50 bg-secondary/10 mt-auto">
                <div className="flex flex-col">
                    <span className="text-2xl font-bold text-primary">{price}</span>
                    <span className="text-xs text-muted-foreground uppercase">Per Session</span>
                </div>

                <Link
                    href={`/live-sessions/${id}`}
                    className={`
                inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all
                ${isAvailable
                            ? 'bg-foreground text-background hover:bg-primary hover:text-primary-foreground shadow-md'
                            : 'bg-muted text-muted-foreground cursor-not-allowed opacity-80'}
            `}
                >
                    {isAvailable ? (
                        <>
                            Book Seat
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </>
                    ) : (
                        'Full'
                    )}
                </Link>
            </CardFooter>
        </Card>
    );
}
