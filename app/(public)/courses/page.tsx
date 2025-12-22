import { getAllCourses } from "@/app/data/course/get-all-courses";
import { PublicCourseCard, PublicCourseCardSkeleton } from "../_components/PublicCourseCard";
import { CourseFilters } from "../_components/CourseFilters";
import { Suspense } from "react";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen, Code, Palette, BarChart3, TrendingUp, Target, Lightbulb,
  Search, Zap, ArrowRight, Sparkles
} from "lucide-react";
import Link from "next/link";
import { FadeIn } from "@/components/ui/fade-in";

export const dynamic = "force-dynamic";

interface SearchParams {
  category?: string;
  level?: string;
  search?: string;
}

interface Props {
  searchParams: Promise<SearchParams>;
}

const featuredCategories = [
  { name: "Programming", icon: Code, count: 245, popular: true },
  { name: "Design", icon: Palette, count: 189, popular: true },
  { name: "Business", icon: BarChart3, count: 156, popular: false },
  { name: "Marketing", icon: TrendingUp, count: 134, popular: false },
  { name: "Data Science", icon: Target, count: 98, popular: true },
  { name: "Photography", icon: Lightbulb, count: 87, popular: false }
];

const trendingTopics = [
  "React & Next.js", "AI & Machine Learning", "Python Programming",
  "UI/UX Design", "Digital Marketing", "Data Analytics",
  "Cloud Computing", "Cybersecurity"
];

export default async function PublicCoursesRoute({ searchParams }: Props) {
  const params = await searchParams;
  const allCourses = await getAllCourses();

  // Filter courses based on search parameters
  let filteredCourses = allCourses;

  if (params.search) {
    filteredCourses = filteredCourses.filter(course =>
      course.title.toLowerCase().includes(params.search!.toLowerCase()) ||
      course.smallDescription?.toLowerCase().includes(params.search!.toLowerCase())
    );
  }

  if (params.category) {
    filteredCourses = filteredCourses.filter(course =>
      course.category?.toLowerCase() === params.category!.toLowerCase()
    );
  }

  if (params.level) {
    filteredCourses = filteredCourses.filter(course =>
      course.level?.toLowerCase() === params.level!.toLowerCase()
    );
  }

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      {/* Billboard Hero Section */}
      <section className="relative overflow-hidden bg-background border-b border-border">
        {/* Abstract Background */}
        <div className="absolute inset-0 bg-secondary/30">
          <div className="absolute inset-0 bg-grid-primary/5 [mask-image:linear-gradient(0deg,transparent,black)]" />
          <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-primary/5 to-transparent blur-3xl opacity-50" />
        </div>

        <div className="container mx-auto relative z-10 py-16 lg:py-24">
          <FadeIn>
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="flex flex-col items-start text-left">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6 border border-primary/20">
                  <Sparkles className="h-4 w-4" />
                  <span>Explore 1,200+ Premium Courses</span>
                </div>

                <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 leading-[1.15]">
                  Master New Skills with <br />
                  <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-orange-500">
                    World-Class Instructors
                  </span>
                </h1>

                <p className="text-lg text-muted-foreground mb-8 max-w-xl leading-relaxed">
                  Join millions of learners. Get unlimited access to structured courses, hands-on projects, and certificate programs.
                </p>

                {/* Trending Tags */}
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-sm font-semibold text-foreground mr-2">Trending:</span>
                  {trendingTopics.slice(0, 5).map((topic, index) => (
                    <Link
                      key={index}
                      href={`/courses?search=${encodeURIComponent(topic)}`}
                      className="px-3 py-1 rounded-full bg-background border border-border hover:border-primary/50 text-xs font-medium text-muted-foreground hover:text-primary transition-all shadow-sm"
                    >
                      {topic}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Right Illustration/Image Placeholer */}
              <div className="hidden lg:block relative">
                <div className="bg-gradient-to-tr from-primary/20 to-orange-500/20 rounded-2xl p-8 aspect-[4/3] flex items-center justify-center relative overflow-hidden ring-1 ring-border shadow-2xl">
                  <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,transparent)]" />

                  {/* Rich Course Success Card Illustration */}
                  <div className="relative z-10 w-full max-w-sm">
                    {/* Main Success Card */}
                    <div className="bg-background rounded-2xl p-6 shadow-2xl border border-border/50 transform -rotate-2 hover:rotate-0 transition-all duration-500 group">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="h-14 w-14 rounded-full bg-gradient-to-br from-primary to-orange-400 p-[2px]">
                          <div className="h-full w-full rounded-full bg-background p-1">
                            <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80" alt="User" className="h-full w-full rounded-full object-cover" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg leading-tight">Alex Morgan</h3>
                          <p className="text-xs text-muted-foreground">Full Stack Developer</p>
                        </div>
                        <div className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          Top 1%
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="bg-secondary/50 rounded-xl p-4 flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                            <Code className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between text-sm mb-1">
                              <span className="font-medium">React Mastery</span>
                              <span className="font-bold text-primary">100%</span>
                            </div>
                            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                              <div className="h-full bg-primary w-full" />
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <div className="flex-1 bg-orange-50 dark:bg-orange-950/20 rounded-xl p-3 text-center border border-orange-100 dark:border-orange-800/20">
                            <div className="text-orange-600 font-bold text-xl">12</div>
                            <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Certificates</div>
                          </div>
                          <div className="flex-1 bg-purple-50 dark:bg-purple-950/20 rounded-xl p-3 text-center border border-purple-100 dark:border-purple-800/20">
                            <div className="text-purple-600 font-bold text-xl">850</div>
                            <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Points</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Floating Badge */}
                    <div className="absolute -right-4 -top-4 bg-white dark:bg-slate-800 p-3 rounded-xl shadow-xl border border-border animate-bounce duration-[3000ms]">
                      <div className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 p-2 rounded-lg">
                        <Target className="w-6 h-6" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Main Content: Filters & Grid */}
      <section className="py-20 container mx-auto">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border pb-6">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Browse Courses</h2>
              <p className="text-muted-foreground mt-1">Showing {filteredCourses.length} results based on your preferences</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10 items-start">
            {/* Sidebar Filters */}
            <aside className="lg:sticky lg:top-24 h-fit">
              <CourseFilters />
            </aside>

            {/* Course Grid */}
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <Suspense fallback={
                  Array.from({ length: 6 }).map((_, i) => (
                    <PublicCourseCardSkeleton key={i} />
                  ))
                }>
                  <CoursesGrid courses={filteredCourses} />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function CoursesGrid({ courses }: { courses: any[] }) {
  if (courses.length === 0) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center py-20 text-center text-muted-foreground bg-card rounded-xl border border-dashed border-border">
        <div className="bg-secondary/50 p-4 rounded-full mb-4">
          <Search className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          No courses found
        </h3>
        <p className="max-w-md mx-auto mb-6">
          We couldn't find any courses matching your criteria. Try adjusting your filters or search terms.
        </p>
        <Link
          href="/courses"
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 transition-colors"
        >
          Clear Filters
        </Link>
      </div>
    );
  }

  return (
    <>
      {courses.map((course) => (
        <PublicCourseCard key={course.id} data={course} />
      ))}
    </>
  );
}