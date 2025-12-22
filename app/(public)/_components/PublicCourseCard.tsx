"use client";

import { PublicCourseType } from "@/app/data/course/get-all-courses";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useConstructUrl } from "@/hooks/use-construct-url";
import { School, TimerIcon, DollarSign, Star, Users, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface iAppProps {
  data: PublicCourseType;
}

export function PublicCourseCard({ data }: iAppProps) {
  const thumbnailUrl = useConstructUrl(data.fileKey);

  return (
    <Card className="group relative flex flex-col h-full bg-card border-border hover:shadow-lg transition-all duration-300 hover:border-primary/50 overflow-hidden">
      {/* Thumbnail Section */}
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        <Image
          src={thumbnailUrl}
          alt={data.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Level Badge in top left */}
        <Badge
          variant="secondary"
          className="absolute top-3 left-3 bg-background/80 backdrop-blur-sm text-foreground hover:bg-background font-medium"
        >
          {data.level}
        </Badge>

        {/* Play Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="bg-background/90 text-primary rounded-full p-3 shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
            <Play className="w-6 h-6 fill-current ml-1" />
          </div>
        </div>
      </div>

      <CardContent className="flex flex-col flex-1 p-5 gap-3">
        {/* Category & Rating Row */}
        <div className="flex items-center justify-between text-xs font-medium">
          <div className="text-primary flex items-center gap-1.5">
            <School className="w-3.5 h-3.5" />
            {data.category}
          </div>
          <div className="flex items-center gap-1 text-amber-500">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>4.8</span>
            <span className="text-muted-foreground ml-0.5">(240)</span>
          </div>
        </div>

        {/* Title */}
        <Link
          href={`/courses/${data.slug}`}
          className="font-bold text-lg leading-snug group-hover:text-primary transition-colors line-clamp-2"
        >
          {data.title}
        </Link>

        {/* Instructor/Students */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-auto pt-2">
          <Users className="w-4 h-4" />
          <span>1.2k students</span>
          <span className="mx-1">•</span>
          <TimerIcon className="w-4 h-4" />
          <span>{data.duration}h</span>
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-0 flex items-center justify-between border-t border-border/50 mt-auto bg-secondary/20">
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Price</span>
          <span className="text-xl font-bold text-primary">${data.price}</span>
        </div>

        <Link
          href={`/courses/${data.slug}`}
          className="text-sm font-semibold text-foreground hover:text-primary transition-colors flex items-center gap-1 group/btn"
        >
          View Details
          <Play className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
        </Link>
      </CardFooter>
    </Card>
  );
}

export function PublicCourseCardSkeleton() {
  return (
    <Card className="group relative py-0 gap-0">
      <div className="absolute top-2 right-2 z-10 flex items-center ">
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <div className="w-full relative h-fit">
        <Skeleton className="w-full rounded-t-xl aspect-video" />
      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-3/4" />
        </div>

        <div className="mt-4 flex items-center gap-x-5">
          <div className="flex items-center gap-x-2">
            <Skeleton className="size-6 rounded-md" />
            <Skeleton className="h-4 w-8" />
          </div>
          <div className="flex items-center gap-x-2">
            <Skeleton className="size-6 rounded-md" />
            <Skeleton className="h-4 w-8" />
          </div>
        </div>

        <Skeleton className="mt-4 w-full h-10 rounded-md" />
      </CardContent>
    </Card>
  );
}
