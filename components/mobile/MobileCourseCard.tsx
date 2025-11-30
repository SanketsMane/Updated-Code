"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Clock, 
  Users, 
  Star, 
  BookOpen, 
  Play, 
  Heart,
  Share2,
  Download,
  Calendar,
  ChevronRight,
  Trophy,
  CheckCircle2,
  PlayCircle,
  FileText,
  Video,
  Headphones
} from "lucide-react";

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: {
    name: string;
    avatar?: string;
  };
  thumbnail?: string;
  price: number;
  rating: number;
  reviewCount: number;
  duration: string;
  studentCount: number;
  level: "Beginner" | "Intermediate" | "Advanced";
  progress?: number;
  isEnrolled?: boolean;
  category: string;
  lessons: number;
  certificate: boolean;
}

interface MobileCourseCardProps {
  course: Course;
  variant?: "grid" | "list" | "featured";
  showProgress?: boolean;
}

export function MobileCourseCard({ course, variant = "grid", showProgress = false }: MobileCourseCardProps) {
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: course.title,
        text: course.description,
        url: `/courses/${course.id}`,
      });
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "Advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  if (variant === "list") {
    return (
      <Card className="mb-4">
        <Link href={`/courses/${course.id}`} className="block">
          <div className="flex">
            {/* Thumbnail */}
            <div className="w-24 h-24 sm:w-32 sm:h-24 relative flex-shrink-0">
              {course.thumbnail ? (
                <Image
                  src={course.thumbnail}
                  alt={course.title}
                  fill
                  className="object-cover rounded-l-lg"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 rounded-l-lg flex items-center justify-center">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
              )}
              {course.isEnrolled && (
                <div className="absolute top-2 left-2">
                  <Badge className="text-xs">Enrolled</Badge>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 pr-2">
                  <h3 className="font-semibold text-sm line-clamp-2 mb-1">{course.title}</h3>
                  <p className="text-xs text-muted-foreground mb-2">{course.instructor.name}</p>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs ml-1">{course.rating}</span>
                    </div>
                    <Badge variant="secondary" className={`text-xs ${getLevelColor(course.level)}`}>
                      {course.level}
                    </Badge>
                  </div>

                  {showProgress && course.progress !== undefined ? (
                    <div className="mb-2">
                      <Progress value={course.progress} className="h-1" />
                      <span className="text-xs text-muted-foreground">{course.progress}% complete</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      {course.duration}
                      <Users className="h-3 w-3 ml-2 mr-1" />
                      {course.studentCount}
                    </div>
                  )}
                </div>

                <div className="text-right">
                  {course.price === 0 ? (
                    <Badge variant="secondary" className="bg-green-100 text-green-800">Free</Badge>
                  ) : (
                    <p className="font-bold text-sm">${course.price}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Link>
      </Card>
    );
  }

  if (variant === "featured") {
    return (
      <Card className="overflow-hidden">
        <Link href={`/courses/${course.id}`} className="block">
          <div className="relative h-48">
            {course.thumbnail ? (
              <Image
                src={course.thumbnail}
                alt={course.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <BookOpen className="h-16 w-16 text-white" />
              </div>
            )}
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40" />
            
            {/* Top badges */}
            <div className="absolute top-3 left-3 flex gap-2">
              {course.isEnrolled && (
                <Badge className="bg-green-600 hover:bg-green-700">Enrolled</Badge>
              )}
              {course.certificate && (
                <Badge variant="secondary">
                  <Trophy className="h-3 w-3 mr-1" />
                  Certificate
                </Badge>
              )}
            </div>

            {/* Actions */}
            <div className="absolute top-3 right-3 flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 bg-white/20 hover:bg-white/30"
                onClick={handleLike}
              >
                <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : 'text-white'}`} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 bg-white/20 hover:bg-white/30"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4 text-white" />
              </Button>
            </div>

            {/* Play button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Button size="lg" className="rounded-full h-16 w-16 p-0">
                <Play className="h-8 w-8" />
              </Button>
            </div>

            {/* Bottom info */}
            <div className="absolute bottom-3 left-3 right-3">
              <h3 className="font-bold text-white text-lg mb-1 line-clamp-2">{course.title}</h3>
              <div className="flex items-center text-white/90 text-sm">
                <Avatar className="h-6 w-6 mr-2">
                  <AvatarImage src={course.instructor.avatar} />
                  <AvatarFallback className="text-xs">{course.instructor.name[0]}</AvatarFallback>
                </Avatar>
                <span>{course.instructor.name}</span>
              </div>
            </div>
          </div>
        </Link>

        <CardContent className="p-4">
          {showProgress && course.progress !== undefined ? (
            <div className="mb-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm text-muted-foreground">{course.progress}%</span>
              </div>
              <Progress value={course.progress} className="h-2" />
            </div>
          ) : (
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center text-sm text-muted-foreground">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                {course.rating} ({course.reviewCount})
              </div>
              <Badge variant="secondary" className={getLevelColor(course.level)}>
                {course.level}
              </Badge>
            </div>
          )}

          <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
            <div className="flex items-center">
              <FileText className="h-4 w-4 mr-1" />
              {course.lessons} lessons
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {course.duration}
            </div>
          </div>

          <div className="flex items-center justify-between">
            {course.price === 0 ? (
              <Badge variant="secondary" className="bg-green-100 text-green-800">Free Course</Badge>
            ) : (
              <span className="font-bold text-lg">${course.price}</span>
            )}
            {course.isEnrolled ? (
              <Button size="sm">
                Continue Learning
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button size="sm">
                Enroll Now
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Default grid variant
  return (
    <Card className="overflow-hidden h-full">
      <Link href={`/courses/${course.id}`} className="block">
        <div className="relative h-40">
          {course.thumbnail ? (
            <Image
              src={course.thumbnail}
              alt={course.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <BookOpen className="h-12 w-12 text-white" />
            </div>
          )}

          {/* Top badges */}
          <div className="absolute top-2 left-2">
            {course.isEnrolled && (
              <Badge className="text-xs bg-green-600 hover:bg-green-700">Enrolled</Badge>
            )}
          </div>

          {/* Actions */}
          <div className="absolute top-2 right-2 flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 bg-black/20 hover:bg-black/30"
              onClick={handleLike}
            >
              <Heart className={`h-3 w-3 ${isLiked ? 'fill-red-500 text-red-500' : 'text-white'}`} />
            </Button>
          </div>

          {/* Price badge */}
          <div className="absolute bottom-2 right-2">
            {course.price === 0 ? (
              <Badge className="bg-green-600 hover:bg-green-700">Free</Badge>
            ) : (
              <Badge variant="secondary" className="bg-white/90 text-gray-900">
                ${course.price}
              </Badge>
            )}
          </div>
        </div>
      </Link>

      <CardContent className="p-3">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="secondary" className={`text-xs ${getLevelColor(course.level)}`}>
            {course.level}
          </Badge>
          <div className="flex items-center text-xs text-muted-foreground">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
            {course.rating}
          </div>
        </div>

        <h3 className="font-semibold text-sm line-clamp-2 mb-2">{course.title}</h3>
        
        <div className="flex items-center mb-2">
          <Avatar className="h-5 w-5 mr-2">
            <AvatarImage src={course.instructor.avatar} />
            <AvatarFallback className="text-xs">{course.instructor.name[0]}</AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground truncate">{course.instructor.name}</span>
        </div>

        {showProgress && course.progress !== undefined ? (
          <div className="mb-3">
            <Progress value={course.progress} className="h-1 mb-1" />
            <span className="text-xs text-muted-foreground">{course.progress}% complete</span>
          </div>
        ) : (
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {course.duration}
            </div>
            <div className="flex items-center">
              <Users className="h-3 w-3 mr-1" />
              {course.studentCount}
            </div>
          </div>
        )}

        {course.isEnrolled ? (
          <Button size="sm" className="w-full" asChild>
            <Link href={`/courses/${course.id}/learn`}>
              <PlayCircle className="h-4 w-4 mr-2" />
              Continue
            </Link>
          </Button>
        ) : (
          <Button size="sm" variant="outline" className="w-full" asChild>
            <Link href={`/courses/${course.id}`}>
              View Course
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

// Course grid for mobile
export function MobileCourseGrid({ 
  courses, 
  showProgress = false,
  className 
}: { 
  courses: Course[]; 
  showProgress?: boolean;
  className?: string;
}) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${className}`}>
      {courses.map((course) => (
        <MobileCourseCard
          key={course.id}
          course={course}
          variant="grid"
          showProgress={showProgress}
        />
      ))}
    </div>
  );
}

// Course list for mobile
export function MobileCourseList({ 
  courses, 
  showProgress = false,
  className 
}: { 
  courses: Course[]; 
  showProgress?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      {courses.map((course) => (
        <MobileCourseCard
          key={course.id}
          course={course}
          variant="list"
          showProgress={showProgress}
        />
      ))}
    </div>
  );
}

// Featured course carousel for mobile
export function FeaturedCourseCarousel({ 
  courses,
  className 
}: { 
  courses: Course[];
  className?: string;
}) {
  return (
    <div className={`overflow-x-auto pb-4 ${className}`}>
      <div className="flex gap-4 w-max">
        {courses.map((course) => (
          <div key={course.id} className="w-80 flex-shrink-0">
            <MobileCourseCard
              course={course}
              variant="featured"
            />
          </div>
        ))}
      </div>
    </div>
  );
}