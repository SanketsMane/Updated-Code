import { getSessionWithRole } from "../data/auth/require-roles";
import { redirect } from "next/navigation";
import Link from "next/link";
import { FeaturesSectionWithHoverEffects } from "@/components/ui/feature-section-with-hover-effects";
import { TestimonialsSection } from "@/components/ui/testimonials-section";
import { Logos3 } from "@/components/ui/logos3";
import { FadeIn } from "@/components/ui/fade-in";
import { MentorsSection } from "@/components/mentors/mentors-section";
import {
  ArrowRight, BookOpen, Users, TrendingUp, Award, Play, Star,
  Calendar, Clock, Eye, User, CheckIcon, Globe, Shield, Zap,
  Video, MessageSquare, Trophy, Target, Lightbulb, Headphones,
  FileText, BarChart3, Smartphone, Laptop, Tablet, CheckCircle2
} from "lucide-react";
import { prisma } from "@/lib/db";

const features = [
  {
    icon: Video,
    title: "Live Interactive Sessions",
    description: "Join real-time classes with expert instructors, ask questions, and collaborate with peers worldwide."
  },
  {
    icon: BookOpen,
    title: "Comprehensive Course Library",
    description: "Access our growing library of courses across programming, business, design, and more."
  },
  {
    icon: MessageSquare,
    title: "AI-Powered Learning Assistant",
    description: "Get personalized recommendations and instant help with our intelligent tutoring system."
  },
  {
    icon: Trophy,
    title: "Certification & Badges",
    description: "Earn industry-recognized certificates and digital badges to showcase your achievements."
  },
  {
    icon: BarChart3,
    title: "Progress Analytics",
    description: "Track your learning journey with detailed analytics and performance insights."
  },
  {
    icon: Globe,
    title: "Global Community",
    description: "Connect with learners worldwide, join study groups, and participate in coding challenges."
  }
];

const pricingPlans = [
  {
    name: "Free",
    price: "₹0",
    period: "forever",
    features: [
      "Access to free courses",
      "Basic progress tracking",
      "Community forum access",
    ],
    popular: false
  },
  {
    name: "Pro",
    price: "₹999",
    period: "per month",
    features: [
      "Access to all courses",
      "Live interactive sessions",
      "AI learning assistant",
      "Certificates & badges",
      "Priority support",
    ],
    popular: true
  },
  {
    name: "Enterprise",
    price: "₹2999",
    period: "per month",
    features: [
      "Everything in Pro",
      "Team management tools",
      "Advanced analytics",
      "Custom learning paths",
      "One-on-one mentorship",
    ],
    popular: false
  }
];

export default async function Home() {
  const session = await getSessionWithRole();

  if (session) {
    if (session.user.role === "admin") {
      redirect("/admin");
    }
    if (session.user.role === "teacher") {
      redirect("/teacher");
    }
    if (session.user.role === null || session.user.role === undefined) {
      redirect("/dashboard");
    }
  }

  // Fetch Real Data
  const courseCount = await prisma.course.count({ where: { status: 'Published' } });
  const studentCount = await prisma.user.count({ where: { role: 'student' } }); // Assuming role 'student' or null defaults to student
  const instructorCount = await prisma.teacherProfile.count({ where: { isVerified: true } });

  // Fetch Categories with course counts
  const categories = await prisma.category.findMany({
    take: 8,
    orderBy: { courses: { _count: 'desc' } },
    include: { _count: { select: { courses: true } } }
  });

  // Fetch Testimonials
  const reviewsData = await prisma.review.findMany({
    take: 9,
    where: { rating: { gte: 4 } },
    include: {
      reviewer: {
        select: {
          name: true,
          image: true,
          role: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  // Fetch Mentors (Real Data)
  const verifiedInstructors = await prisma.teacherProfile.findMany({
    where: { isVerified: true },
    include: { user: true },
    take: 4,
    orderBy: { rating: 'desc' }
  });

  const mentors = verifiedInstructors.map((inst) => ({
    name: inst.user.name || "Instructor",
    role: inst.expertise[0] || "Expert Instructor",
    rating: inst.rating || 5.0,
    reviews: inst.totalReviews || 0,
    students: (inst.totalStudents || 0).toString() + "+",
    experience: "Verified",
    skills: inst.expertise.slice(0, 3),
    hourlyRate: (inst.hourlyRate || 0) / 100,
    image: inst.user.image || "/placeholder-user.jpg",
    featured: inst.isVerified,
  }));

  const reviews = reviewsData.map(r => ({
    id: r.id,
    comment: r.comment,
    rating: r.rating,
    title: r.title, // Pass the role/title from DB
    reviewer: {
      name: r.reviewer.name,
      image: r.reviewer.image,
      role: r.reviewer.role
    }
  }));

  const stats = [
    { icon: BookOpen, label: "Total Courses", value: `${courseCount}+` },
    { icon: Users, label: "Active Students", value: `${studentCount}+` },
    { icon: Award, label: "Expert Instructors", value: `${instructorCount}+` },
  ];

  return (
    <div className="font-sans text-foreground bg-background">
      {/* Hero Section - Clean & Professional */}
      <section className="relative min-h-[90vh] flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-foreground overflow-hidden pb-16 pt-24">
        {/* Ambient Background from Live Sessions */}
        <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-primary/5 dark:from-primary/20 to-transparent opacity-30" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 dark:bg-primary/30 rounded-full blur-[128px] opacity-50" />
        <div className="absolute left-0 bottom-0 w-72 h-72 bg-blue-400/10 dark:bg-blue-400/20 rounded-full blur-[96px] opacity-30" />

        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 z-0 opacity-[0.03]"
          style={{
            backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)',
            backgroundSize: '30px 30px'
          }}>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full text-center">
          <div className="inline-block bg-primary/10 border border-primary/20 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-8 backdrop-blur-sm">
            🚀 Trusted by {studentCount}+ learners worldwide
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 dark:text-white mb-6 leading-[1.1]">
            Master Skills That <br />
            <span className="text-primary">Matter</span>
          </h1>

          <p className="text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join KIDOKOOL, the global learning destination. Learn from industry experts,
            get certified, and advance your career with hands-on projects.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link
              href="/register"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-primary hover:bg-primary/90 rounded shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              Start Learning Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>

            <Link
              href="/courses"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-slate-900 dark:text-white bg-white dark:bg-white/10 hover:bg-slate-50 dark:hover:bg-white/20 border border-slate-200 dark:border-white/20 rounded shadow-sm hover:shadow-md transition-all duration-300"
            >
              <Play className="mr-2 h-5 w-5 fill-current" />
              Watch Demo
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 p-6 bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg inline-block md:max-w-2xl mx-auto backdrop-blur-sm">
            <p className="text-slate-600 dark:text-slate-300/80 text-sm">
              💡 <strong>No risk:</strong> Start with our free plan. Upgrade anytime. Cancel anytime.
              30-day money-back guarantee on all paid plans.
            </p>
          </div>
        </div>
      </section>

      {/* Trust Carousel */}
      <FadeIn delay={0.2}>
        <Logos3 heading={`Trusted by leading companies and ${studentCount}+ learners`} />
      </FadeIn>

      {/* Stats Section - Minimalist */}
      <section className="py-20 bg-secondary border-y border-border">
        <div className="max-w-7xl mx-auto px-6">
          <FadeIn className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="group p-6 bg-transparent hover:bg-card/50 rounded-xl transition-all duration-300">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-4 text-primary group-hover:scale-110 transition-transform">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </FadeIn>
        </div>
      </section>

      {/* Features Section - Grid Cards */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Why Choose KIDOKOOL?
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                We provide everything you need to learn new skills and advance your career.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="p-8 bg-card border border-border rounded-lg hover:shadow-lg hover:border-primary/30 transition-all duration-300 group">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-secondary rounded-lg mb-6 text-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Course Categories - Clean List/Grid */}
      <section className="py-24 bg-secondary">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Explore Top Categories
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Find the perfect course for your career goals from our extensive library.
            </p>
          </div>

          <FeaturesSectionWithHoverEffects categories={categories} />

          <div className="text-center mt-12">
            <Link
              href="/courses"
              className="inline-flex items-center justify-center px-6 py-3 text-base font-bold text-primary border-2 border-primary hover:bg-primary hover:text-white rounded transition-all duration-300"
            >
              Browse All Courses
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>



      <TestimonialsSection reviews={reviews} />

      <MentorsSection mentors={mentors} />

      {/* Pricing Section - Clean Tables */}
      <section className="py-24 bg-secondary">
        <div className="max-w-7xl mx-auto px-6">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Simple, Transparent Pricing
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Start for free, upgrade when you're ready. No hidden fees.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto items-start">
              {pricingPlans.map((plan, index) => (
                <div key={index} className={`relative p-8 bg-card rounded-xl transition-all duration-300 ${plan.popular ? 'border-2 border-primary shadow-xl scale-105 z-10' : 'border border-border shadow-sm'}`}>
                  {plan.popular && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-foreground mb-2">{plan.name}</h3>
                  <div className="flex items-baseline mb-6">
                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground ml-2">/{plan.period}</span>
                  </div>
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-muted-foreground">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/register"
                    className={`block w-full py-3 px-4 text-center font-bold rounded-lg transition-colors ${plan.popular
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                      : 'bg-secondary text-foreground hover:bg-secondary/80'
                      }`}
                  >
                    Get Started
                  </Link>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* CTA Section - Minimal Dark */}
      <section className="py-24 bg-card text-card-foreground text-center border-t border-border">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Future?
          </h2>
          <p className="text-xl text-muted-foreground/80 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join KIDOKOOL today and start your journey towards mastering the skills that matter.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-foreground bg-background hover:bg-muted rounded shadow-lg transition-all"
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
          <div className="mt-12 p-6 bg-background/5 border border-background/10 rounded-lg inline-block md:max-w-2xl mx-auto">
            <p className="text-muted-foreground/80 text-sm">
              💡 <strong>No risk:</strong> Start with our free plan. Upgrade anytime. Cancel anytime.
              30-day money-back guarantee on all paid plans.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}