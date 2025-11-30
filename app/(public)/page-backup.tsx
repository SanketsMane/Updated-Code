import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getSessionWithRole } from "../data/auth/require-roles";
import { getAllCourses } from "../data/course/get-all-courses";
import { getFeaturedBlogPosts } from "../actions/blog";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { PublicCourseCard } from "./_components/PublicCourseCard";
import { PWAInstallPrompt } from "@/components/pwa/PWAComponents";
import { Suspense } from "react";
import { ArrowRight, BookOpen, Users, TrendingUp, Award, Play, Star, Calendar, Clock, Eye, User, CheckIcon } from "lucide-react";
import { format } from "date-fns";

interface CategoryProps {
  name: string;
  icon: string;
  href: string;
  count?: number;
}

const categories: CategoryProps[] = [
  { name: "Programming & Development", icon: "💻", href: "/courses?category=Programming", count: 45 },
  { name: "Business & Marketing", icon: "📈", href: "/courses?category=Business", count: 32 },
  { name: "Design & Creative", icon: "🎨", href: "/courses?category=Design", count: 28 },
  { name: "Health & Fitness", icon: "💪", href: "/courses?category=Health", count: 19 },
  { name: "Language Learning", icon: "🌍", href: "/courses?category=Language", count: 24 },
  { name: "Music & Arts", icon: "🎵", href: "/courses?category=Music", count: 15 },
  { name: "Photography", icon: "📸", href: "/courses?category=Photography", count: 18 },
  { name: "Data Science", icon: "📊", href: "/courses?category=Data", count: 22 }
];

const stats = [
  { icon: BookOpen, label: "Total Courses", value: "1000+" },
  { icon: Users, label: "Active Students", value: "50,000+" },
  { icon: Award, label: "Expert Instructors", value: "500+" },
  { icon: TrendingUp, label: "Success Rate", value: "95%" }
];

export default async function Home() {
  // Check if user is logged in and redirect to appropriate dashboard
  const session = await getSessionWithRole();
  
  if (session) {
    if (session.user.role === "admin") {
      redirect("/admin");
    }
    if (session.user.role === "teacher") {
      redirect("/teacher");
    }
    // For regular users, show the home page or redirect to student dashboard
    if (session.user.role === null || session.user.role === undefined) {
      redirect("/dashboard");
    }
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/30 dark:via-indigo-950/30 dark:to-purple-950/30 -z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)] -z-10" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-300/20 rounded-full blur-3xl animate-pulse delay-1000" />
        
        <div className="container mx-auto px-6 md:px-8 lg:px-12 max-w-7xl">
          <div className="flex flex-col items-center text-center space-y-8 lg:space-y-12">
            <Badge variant="outline" className="bg-white/90 backdrop-blur-md border-blue-200 text-sm px-4 py-2 shadow-lg animate-fade-in">
              ✨ Transform Your Future with Learning
            </Badge>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent leading-tight animate-fade-in-up">
              Master Skills with
              <br className="hidden sm:block" />
              <span className="sm:hidden"> </span>
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Expert Instructors</span>
            </h1>
            <p className="max-w-3xl text-gray-600 dark:text-gray-300 text-lg sm:text-xl lg:text-2xl leading-relaxed font-medium animate-fade-in-up delay-200">
              Join <span className="font-bold text-blue-600">50,000+</span> learners worldwide. Access premium courses, learn from industry experts,
              and <span className="font-bold text-indigo-600">transform your career</span> with our comprehensive learning platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-8 lg:mt-12 w-full sm:w-auto animate-fade-in-up delay-300">
              <Link
                className={buttonVariants({
                  size: "lg",
                  className: "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300 px-8 py-4 text-lg font-semibold"
                })}
                href="/courses"
              >
                <BookOpen className="mr-3 h-5 w-5" />
                Start Learning Today
              </Link>

              <Link
                className={buttonVariants({
                  size: "lg",
                  variant: "outline",
                  className: "border-2 border-indigo-200 hover:border-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-semibold px-8 py-4 text-lg transform hover:scale-105 transition-all duration-300"
                })}
                href="/marketplace"
              >
                <Users className="mr-3 h-5 w-5" />
                Meet Instructors
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-y border-gray-200/50 dark:border-gray-700/50">
        <div className="container mx-auto px-6 md:px-8 lg:px-12 max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center group hover:scale-110 transition-transform duration-300">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 mb-6 shadow-lg group-hover:shadow-xl transition-shadow">
                    <IconComponent className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent mb-2">{stat.value}</div>
                  <div className="text-sm lg:text-base font-medium text-gray-600 dark:text-gray-400">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Course Categories */}
      <section className="py-24 bg-gradient-to-b from-gray-50/50 to-white dark:from-gray-900/50 dark:to-gray-900">
        <div className="container mx-auto px-6 md:px-8 lg:px-12 max-w-7xl">
          <div className="text-center mb-20">
            <Badge variant="outline" className="mb-6 px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              🎆 Popular Categories
            </Badge>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
              Most Demanding Categories
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto text-lg lg:text-xl leading-relaxed">
              Explore our most popular course categories and start your learning journey today. From coding to creative arts, we have something for everyone.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-12">
            {categories.map((category, index) => (
              <Link key={index} href={category.href}>
                <Card className="group hover:shadow-2xl transition-all duration-500 hover:scale-110 cursor-pointer border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <CardContent className="p-8 text-center relative z-10">
                    <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-300">{category.icon}</div>
                    <h3 className="font-bold text-lg mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                      {category.count} courses available
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          
          <div className="text-center">
            <Link
              href="/courses"
              className={buttonVariants({ 
                variant: "outline",
                size: "lg",
                className: "px-8 py-4 text-lg font-semibold border-2 hover:scale-105 transition-all duration-300"
              })}
            >
              View All Categories
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-24 bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-purple-50/50 dark:from-blue-950/20 dark:via-indigo-950/10 dark:to-purple-950/20">
        <div className="container mx-auto px-6 md:px-8 lg:px-12 max-w-7xl">
          <div className="text-center mb-20">
            <Badge variant="outline" className="mb-6 px-4 py-2 text-sm font-medium bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
              🏆 Premium Learning
            </Badge>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
              Featured Courses
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto text-lg lg:text-xl leading-relaxed">
              Discover our most popular and highly-rated courses from expert instructors. Start your journey to mastery today.
            </p>
          </div>
        
          <Suspense fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="animate-pulse shadow-lg">
                  <div className="h-48 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-t-lg" />
                  <CardContent className="p-6">
                    <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded mb-4" />
                    <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded mb-2" />
                    <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          }>
          <FeaturedCourses />
        </Suspense>
      </section>

      {/* Live Learning Section */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6 md:px-8 lg:px-12 max-w-7xl">
          <div className="text-center mb-20">
            <Badge variant="outline" className="mb-6 px-4 py-2 text-sm font-medium bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              📹 Live Learning Experience
            </Badge>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
              Learn Live with Expert Instructors
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto text-lg lg:text-xl leading-relaxed">
              Take your learning to the next level with personalized 1-on-1 sessions 
              and collaborative group classes. Real-time interaction, instant feedback.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
          {/* 1-on-1 Sessions */}
          <Card className="relative overflow-hidden border-2 border-blue-200 hover:border-blue-300 transition-colors">
            <div className="absolute top-0 right-0 bg-blue-600 text-white px-4 py-1 text-sm font-medium rounded-bl-lg">
              Popular
            </div>
            <CardContent className="p-8">
              <div className="bg-blue-100 dark:bg-blue-900/30 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4">1-on-1 Sessions</h3>
              <p className="text-muted-foreground mb-6">
                Get personalized mentoring with undivided attention from expert instructors. 
                Perfect for focused learning and addressing specific challenges.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Personalized curriculum</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Flexible scheduling</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Real-time feedback</span>
                </li>
              </ul>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-bold text-blue-600">$75</span>
                  <span className="text-muted-foreground">/hour</span>
                </div>
                <Link
                  href="/live-sessions"
                  className={buttonVariants({ 
                    variant: "outline",
                    className: "border-blue-600 text-blue-600 hover:bg-blue-50"
                  })}
                >
                  Book Now
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Group Classes */}
          <Card className="relative overflow-hidden border-2 border-purple-200 hover:border-purple-300 transition-colors">
            <div className="absolute top-0 right-0 bg-purple-600 text-white px-4 py-1 text-sm font-medium rounded-bl-lg">
              Best Value
            </div>
            <CardContent className="p-8">
              <div className="bg-purple-100 dark:bg-purple-900/30 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <BookOpen className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Group Classes</h3>
              <p className="text-muted-foreground mb-6">
                Join small groups for collaborative learning experiences. 
                Learn alongside peers and benefit from diverse perspectives.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Collaborative learning</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Peer interaction</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Cost effective</span>
                </li>
              </ul>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-bold text-purple-600">$25</span>
                  <span className="text-muted-foreground">/session</span>
                </div>
                <Link
                  href="/live-sessions"
                  className={buttonVariants({ 
                    variant: "outline",
                    className: "border-purple-600 text-purple-600 hover:bg-purple-50"
                  })}
                >
                  Join Class
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

          <div className="text-center">
            <Link
              href="/live-sessions"
              className={buttonVariants({ 
                size: "lg",
                className: "px-8 py-4 text-lg font-semibold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transform hover:scale-105 transition-all duration-300 shadow-xl"
              })}
            >
              Explore All Live Sessions
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Blog Posts */}
      <section className="py-24 bg-gradient-to-b from-gray-50/80 to-white/80 dark:from-gray-900/80 dark:to-gray-900">
        <div className="container mx-auto px-6 md:px-8 lg:px-12 max-w-7xl">
          <div className="text-center mb-20">
            <Badge variant="outline" className="mb-6 px-4 py-2 text-sm font-medium bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
              📚 Learning Hub
            </Badge>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
              Latest from Our Learning Hub
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed">
              Discover insights, tutorials, and expert knowledge to enhance your learning journey and stay ahead of the curve.
            </p>
          </div>

        <Suspense fallback={<BlogSectionSkeleton />}>
          <FeaturedBlogPosts />
        </Suspense>

          <div className="text-center mt-12">
            <Link
              href="/blog"
              className={buttonVariants({ 
                variant: "outline",
                size: "lg",
                className: "px-8 py-4 text-lg font-semibold border-2 hover:scale-105 transition-all duration-300"
              })}
            >
              Read More Articles
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24">
        <div className="container mx-auto px-6 md:px-8 lg:px-12 max-w-7xl">
          <Card className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 border-0 shadow-2xl overflow-hidden relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.2),transparent_50%)]" />
            <CardContent className="p-12 lg:p-16 text-center text-white relative z-10">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
                Ready to Start Your Learning Journey?
              </h2>
              <p className="text-blue-100 mb-10 text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed">
                Join thousands of students already learning on our platform. 
                Get access to premium courses, expert instructors, and transform your future today.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link
                  href="/register"
                  className={buttonVariants({
                    size: "lg",
                    variant: "secondary",
                    className: "px-8 py-4 text-lg font-semibold bg-white text-blue-600 hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-xl"
                  })}
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  href="/courses"
                  className={buttonVariants({
                    size: "lg",
                    variant: "outline",
                    className: "px-8 py-4 text-lg font-semibold border-2 border-white text-white hover:bg-white hover:text-blue-600 transform hover:scale-105 transition-all duration-300"
                  })}
                >
                  <BookOpen className="mr-2 h-5 w-5" />
                  Browse Courses
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
          </CardContent>
        </Card>
      </section>

      {/* PWA Install Prompt */}
      <PWAInstallPrompt />
    </>
  );
}

async function FeaturedCourses() {
  const courses = await getAllCourses();
  const featuredCourses = courses.slice(0, 6); // Show first 6 courses

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {featuredCourses.map((course) => (
          <PublicCourseCard key={course.id} data={course} />
        ))}
      </div>
      
      <div className="text-center">
        <Link
          href="/courses"
          className={buttonVariants({ 
            variant: "outline", 
            size: "lg",
            className: "px-8 py-4 text-lg font-semibold border-2 hover:scale-105 transition-all duration-300"
          })}
        >
          View All Courses
          <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
      </div>
    </>
  );
}

async function FeaturedBlogPosts() {
  const posts = await getFeaturedBlogPosts(3);

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No featured articles available yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <Link key={post.id} href={`/blog/${post.slug}`}>
          <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
            {post.featuredImage && (
              <div className="aspect-video relative overflow-hidden rounded-t-lg">
                <Image
                  src={post.featuredImage}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
            )}
            <CardHeader>
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                <div className="flex items-center gap-2">
                  <User className="h-3 w-3" />
                  {post.author.name}
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="h-3 w-3" />
                  {post.views}
                </div>
              </div>
              
              {post.category && (
                <Badge 
                  variant="secondary" 
                  className="w-fit mb-2"
                  style={{ 
                    backgroundColor: post.category.color || "#e5e7eb",
                    color: "#374151"
                  }}
                >
                  {post.category.name}
                </Badge>
              )}
              
              <CardTitle className="text-lg line-clamp-2 hover:text-blue-600 transition-colors">
                {post.title}
              </CardTitle>
            </CardHeader>
            
            {post.excerpt && (
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(post.publishedAt!), "MMM dd")}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {Math.ceil(post.content.split(" ").length / 200)} min read
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        </Link>
      ))}
    </div>
  );
}

function BlogSectionSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(3)].map((_, i) => (
        <Card key={i}>
          <Skeleton className="aspect-video w-full" />
          <CardHeader>
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
