"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  BookOpen,
  Clock,
  TrendingUp,
  Award,
  Calendar,
  PlayCircle,
  MessageSquare,
  Video,
  Users,
  Target,
  ChevronRight,
  Plus,
  Star,
  Flame,
  Zap,
  CheckCircle2,
  AlertCircle,
  Bell
} from "lucide-react";
import { MobileCourseCard } from "./MobileCourseCard";
import Link from "next/link";

interface DashboardStats {
  totalCourses: number;
  completedCourses: number;
  totalHours: number;
  certificatesEarned: number;
  currentStreak: number;
  weeklyGoal: number;
  weeklyProgress: number;
}

interface RecentActivity {
  id: string;
  type: "course_started" | "lesson_completed" | "certificate_earned" | "quiz_passed" | "assignment_submitted";
  title: string;
  description: string;
  time: string;
  course?: string;
  progress?: number;
}

interface UpcomingEvent {
  id: string;
  title: string;
  type: "live_session" | "assignment_due" | "exam" | "webinar";
  time: string;
  course: string;
  instructor?: string;
}

interface MobileDashboardProps {
  user: {
    name: string;
    email: string;
    avatar?: string;
    role: string;
  };
  stats: DashboardStats;
  recentActivities: RecentActivity[];
  upcomingEvents: UpcomingEvent[];
  continueCourses: any[];
  recommendedCourses: any[];
}

export default function MobileDashboard({
  user,
  stats,
  recentActivities,
  upcomingEvents,
  continueCourses,
  recommendedCourses
}: MobileDashboardProps) {
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  const getActivityIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case "course_started":
        return <PlayCircle className="h-4 w-4 text-blue-500" />;
      case "lesson_completed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "certificate_earned":
        return <Award className="h-4 w-4 text-yellow-500" />;
      case "quiz_passed":
        return <Target className="h-4 w-4 text-purple-500" />;
      case "assignment_submitted":
        return <BookOpen className="h-4 w-4 text-orange-500" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  const getEventIcon = (type: UpcomingEvent['type']) => {
    switch (type) {
      case "live_session":
        return <Video className="h-4 w-4 text-red-500" />;
      case "assignment_due":
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      case "exam":
        return <Target className="h-4 w-4 text-purple-500" />;
      case "webinar":
        return <Users className="h-4 w-4 text-blue-500" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  const completionPercentage = (stats.completedCourses / stats.totalCourses) * 100;

  return (
    <div className="p-4 space-y-6 pb-20 lg:pb-4">
      {/* Welcome Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              {greeting}, {user.name.split(' ')[0]}! 👋
            </h1>
            <p className="text-muted-foreground">Ready to continue learning?</p>
          </div>
          <Avatar className="h-12 w-12">
            <AvatarImage src={user.avatar} />
            <AvatarFallback>{user.name[0]}</AvatarFallback>
          </Avatar>
        </div>

        {/* Streak & Weekly Goal */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Flame className="h-5 w-5" />
                <div>
                  <p className="text-sm opacity-90">Current Streak</p>
                  <p className="text-xl font-bold">{stats.currentStreak} days</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <div>
                  <p className="text-sm opacity-90">Weekly Goal</p>
                  <p className="text-xl font-bold">{stats.weeklyProgress}/{stats.weeklyGoal}h</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Progress */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Weekly Progress</span>
              <span className="text-sm text-muted-foreground">
                {Math.round((stats.weeklyProgress / stats.weeklyGoal) * 100)}%
              </span>
            </div>
            <Progress value={(stats.weeklyProgress / stats.weeklyGoal) * 100} className="h-2" />
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <BookOpen className="h-6 w-6 mx-auto mb-2 text-blue-500" />
            <p className="text-2xl font-bold">{stats.totalCourses}</p>
            <p className="text-xs text-muted-foreground">Total Courses</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle2 className="h-6 w-6 mx-auto mb-2 text-green-500" />
            <p className="text-2xl font-bold">{stats.completedCourses}</p>
            <p className="text-xs text-muted-foreground">Completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-6 w-6 mx-auto mb-2 text-orange-500" />
            <p className="text-2xl font-bold">{stats.totalHours}</p>
            <p className="text-xs text-muted-foreground">Hours Learned</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Award className="h-6 w-6 mx-auto mb-2 text-yellow-500" />
            <p className="text-2xl font-bold">{stats.certificatesEarned}</p>
            <p className="text-xs text-muted-foreground">Certificates</p>
          </CardContent>
        </Card>
      </div>

      {/* Continue Learning */}
      {continueCourses.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Continue Learning</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/courses">
                View All <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>

          <ScrollArea className="w-full">
            <div className="flex space-x-4 pb-4">
              {continueCourses.map((course) => (
                <div key={course.id} className="w-72 flex-shrink-0">
                  <MobileCourseCard 
                    course={course} 
                    variant="grid" 
                    showProgress={true}
                  />
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Upcoming Events
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingEvents.slice(0, 3).map((event) => (
              <div key={event.id} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                {getEventIcon(event.type)}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm line-clamp-1">{event.title}</p>
                  <p className="text-xs text-muted-foreground">{event.course}</p>
                  <p className="text-xs text-muted-foreground">{event.time}</p>
                </div>
                <Button size="sm" variant="ghost">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            ))}
            
            {upcomingEvents.length > 3 && (
              <Button variant="outline" className="w-full" size="sm" asChild>
                <Link href="/dashboard/calendar">
                  View All Events
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Recent Activity */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-64">
            <div className="space-y-3">
              {recentActivities.map((activity, index) => (
                <div key={activity.id}>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{activity.title}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {activity.description}
                      </p>
                      {activity.course && (
                        <p className="text-xs text-blue-600 font-medium mt-1">
                          {activity.course}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                    </div>
                    {activity.progress && (
                      <div className="text-right">
                        <p className="text-sm font-bold text-green-600">+{activity.progress}%</p>
                      </div>
                    )}
                  </div>
                  {index < recentActivities.length - 1 && <Separator className="my-3" />}
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Recommended Courses */}
      {recommendedCourses.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold flex items-center">
              <Zap className="h-5 w-5 mr-2 text-yellow-500" />
              Recommended for You
            </h2>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/marketplace">
                Explore <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>

          <ScrollArea className="w-full">
            <div className="flex space-x-4 pb-4">
              {recommendedCourses.map((course) => (
                <div key={course.id} className="w-72 flex-shrink-0">
                  <MobileCourseCard 
                    course={course} 
                    variant="grid"
                  />
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="h-auto p-4 flex flex-col space-y-2" asChild>
              <Link href="/marketplace">
                <BookOpen className="h-6 w-6" />
                <span className="text-sm font-medium">Browse Courses</span>
              </Link>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex flex-col space-y-2" asChild>
              <Link href="/dashboard/messages">
                <MessageSquare className="h-6 w-6" />
                <span className="text-sm font-medium">Messages</span>
              </Link>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex flex-col space-y-2" asChild>
              <Link href="/dashboard/video-rooms">
                <Video className="h-6 w-6" />
                <span className="text-sm font-medium">Join Session</span>
              </Link>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex flex-col space-y-2" asChild>
              <Link href="/dashboard/certificates">
                <Award className="h-6 w-6" />
                <span className="text-sm font-medium">Certificates</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}