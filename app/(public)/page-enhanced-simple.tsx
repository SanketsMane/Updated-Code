import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { getSessionWithRole } from "../data/auth/require-roles";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowRight, BookOpen, Users, TrendingUp, Award } from "lucide-react";

const stats = [
  { icon: BookOpen, label: "Total Courses", value: "1000+" },
  { icon: Users, label: "Active Students", value: "50,000+" },
  { icon: Award, label: "Expert Instructors", value: "500+" },
  { icon: TrendingUp, label: "Success Rate", value: "95%" }
];

export default async function Home() {
  const session = await getSessionWithRole();
  
  if (session) {
    if ((session.user as any).role === "admin") {
      redirect("/admin");
    }
    if ((session.user as any).role === "teacher") {
      redirect("/teacher");
    }
    if ((session.user as any).role === null || (session.user as any).role === undefined) {
      redirect("/dashboard");
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/30 dark:via-indigo-950/30 dark:to-purple-950/30 -z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)] -z-10" />
        
        <div className="container mx-auto px-6 md:px-8 lg:px-12 max-w-7xl">
          <div className="flex flex-col items-center text-center space-y-8 lg:space-y-12">
            <Badge variant="outline" className="bg-white/90 backdrop-blur-md border-blue-200 text-sm px-4 py-2 shadow-lg animate-fade-in">
              ✨ Transform Your Future with Learning
            </Badge>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent leading-tight animate-fade-in-up">
              Master Skills with Expert Instructors
            </h1>
            <p className="max-w-3xl text-gray-600 dark:text-gray-300 text-lg sm:text-xl lg:text-2xl leading-relaxed font-medium animate-fade-in-up delay-200">
              Join thousands of learners worldwide and unlock your potential with our comprehensive courses taught by industry experts.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 mt-8 animate-fade-in-up delay-300">
              <Link
                href="/courses"
                className={buttonVariants({
                  size: "lg",
                  className: "px-8 py-4 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                })}
              >
                Explore Courses
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              
              <Link
                href="/register"
                className={buttonVariants({
                  variant: "outline",
                  size: "lg",
                  className: "px-8 py-4 text-lg font-semibold border-2 border-blue-200 hover:border-blue-300 bg-white/80 backdrop-blur-md hover:bg-blue-50/80 transform hover:scale-105 transition-all duration-300"
                })}
              >
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 lg:py-24 bg-white/50 backdrop-blur-sm border-y border-gray-100">
        <div className="container mx-auto px-6 md:px-8 lg:px-12 max-w-7xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="text-center group animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 font-medium">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 lg:py-24 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
        <div className="container mx-auto px-6 md:px-8 lg:px-12 max-w-4xl text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 animate-fade-in-up">
            Ready to Start Learning?
          </h2>
          <p className="text-xl text-blue-100 mb-8 animate-fade-in-up delay-200">
            Join our community of learners and start your journey today.
          </p>
          <Link
            href="/register"
            className={buttonVariants({
              size: "lg",
              className: "px-8 py-4 text-lg font-semibold bg-white text-blue-600 hover:bg-blue-50 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 animate-fade-in-up delay-300"
            })}
          >
            Get Started Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}