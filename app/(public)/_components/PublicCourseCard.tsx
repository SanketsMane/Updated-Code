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
    <Card className="group relative py-0 gap-0 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] overflow-hidden border-0 shadow-lg">
      <div className="relative overflow-hidden">
        <Badge className="absolute top-3 right-3 z-10 bg-white/90 text-black hover:bg-white">
          {data.level}
        </Badge>
        
        <div className="absolute top-3 left-3 z-10">
          <Badge variant="secondary" className="bg-green-500 text-white hover:bg-green-600">
            Featured
          </Badge>
        </div>

        <Image
          width={600}
          height={400}
          className="w-full aspect-video object-cover group-hover:scale-110 transition-transform duration-300"
          src={thumbnailUrl}
          alt={`Course thumbnail for ${data.title}`}
        />
        
        {/* Play overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="bg-white/90 rounded-full p-3 transform scale-75 group-hover:scale-100 transition-transform duration-300">
            <Play className="h-6 w-6 text-blue-600 ml-1" />
          </div>
        </div>
      </div>

      <CardContent className="p-6">
        {/* Category tag */}
        <div className="flex items-center gap-2 mb-3">
          <School className="h-4 w-4 text-blue-600" />
          <span className="text-sm text-blue-600 font-medium">{data.category}</span>
        </div>

        <Link
          className="font-bold text-lg line-clamp-2 hover:text-blue-600 transition-colors leading-tight"
          href={`/courses/${data.slug}`}
        >
          {data.title}
        </Link>
        
        <p className="line-clamp-2 text-sm text-muted-foreground leading-relaxed mt-2 mb-4">
          {data.smallDescription}
        </p>

        {/* Course stats */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            <span className="text-sm font-medium">4.8</span>
            <span className="text-sm text-muted-foreground">(234)</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-muted-foreground">1,234 students</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TimerIcon className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-muted-foreground">{data.duration}h total</span>
          </div>
          <div className="flex items-center gap-1">
            <DollarSign className="h-5 w-5 text-green-600" />
            <span className="text-xl font-bold text-green-600">${data.price}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <Link
          href={`/courses/${data.slug}`}
          className={buttonVariants({ 
            className: "w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300" 
          })}
        >
          Enroll Now
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
