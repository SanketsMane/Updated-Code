"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, MapPin, Briefcase, Clock, CheckCircle } from "lucide-react";

interface MentorCardProps {
    id: number;
    name: string;
    title: string;
    company: string;
    rating: number;
    reviews: number;
    students: number;
    courses: number;
    hourlyRate: string;
    specialties: string[];
    location: string;
    experience: string;
    featured: boolean;
    verified: boolean;
    responseTime: string;
}

export function MentorCard({
    id,
    name,
    title,
    company,
    rating,
    reviews,
    students,
    courses,
    hourlyRate,
    specialties,
    location,
    experience,
    featured,
    verified,
    responseTime,
}: MentorCardProps) {
    return (
        <Card className={`group relative bg-card border hover:shadow-lg transition-all duration-300 flex flex-col h-full ${featured ? 'border-primary/40 shadow-md' : 'border-border'}`}>

            {featured && (
                <div className="absolute top-3 right-3 z-10">
                    <Badge className="bg-amber-500 hover:bg-amber-600 text-white border-0">FEATURED</Badge>
                </div>
            )}

            <CardContent className="p-6 flex flex-col items-center text-center gap-4 flex-1">
                {/* Profile Header */}
                <div className="relative mt-2">
                    <div className={`p-1 rounded-full ${featured ? 'bg-gradient-to-br from-primary to-orange-400' : 'bg-secondary'}`}>
                        <Avatar className="w-24 h-24 border-4 border-background">
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`} />
                            <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                        </Avatar>
                    </div>
                    {verified && (
                        <div className="absolute bottom-0 right-1 bg-background rounded-full p-0.5" title="Verified Expert">
                            <CheckCircle className="w-6 h-6 text-blue-500 fill-current" />
                        </div>
                    )}
                </div>

                <div>
                    <h3 className="text-xl font-bold text-foreground leading-tight mb-1 group-hover:text-primary transition-colors">
                        {name}
                    </h3>
                    <p className="text-sm font-medium text-muted-foreground">{title}</p>
                    <p className="text-sm text-primary font-medium mt-0.5">{company}</p>
                </div>

                {/* Stats Row */}
                <div className="flex items-center gap-4 text-sm w-full justify-center py-3 border-y border-border/50 bg-secondary/20 -mx-6 px-6">
                    <div className="flex flex-col items-center">
                        <span className="font-bold text-foreground flex items-center gap-1">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {rating}
                        </span>
                        <span className="text-xs text-muted-foreground">{reviews} reviews</span>
                    </div>
                    <div className="w-px h-8 bg-border" />
                    <div className="flex flex-col items-center">
                        <span className="font-bold text-foreground">{(students / 1000).toFixed(1)}k</span>
                        <span className="text-xs text-muted-foreground">Students</span>
                    </div>
                    <div className="w-px h-8 bg-border" />
                    <div className="flex flex-col items-center">
                        <span className="font-bold text-foreground">{experience}</span>
                        <span className="text-xs text-muted-foreground">Exp.</span>
                    </div>
                </div>

                {/* Specialties */}
                <div className="flex flex-wrap gap-2 justify-center">
                    {specialties.slice(0, 3).map((s, i) => (
                        <Badge key={i} variant="secondary" className="font-normal text-xs bg-secondary/80">
                            {s}
                        </Badge>
                    ))}
                </div>
            </CardContent>

            <CardFooter className="p-4 flex gap-3 border-t border-border bg-secondary/10 mt-auto">
                <Link
                    href={`/marketplace/instructor/${id}`}
                    className="flex-1 text-center py-2.5 rounded-lg border border-border bg-background hover:bg-secondary text-sm font-semibold transition-colors"
                >
                    View Profile
                </Link>
                <Link
                    href={`/marketplace/book/${id}`}
                    className="flex-1 text-center py-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-bold transition-colors shadow-sm"
                >
                    Book {hourlyRate}
                </Link>
            </CardFooter>
        </Card>
    );
}
