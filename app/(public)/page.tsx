import { getActiveBroadcasts } from "../actions/broadcasts";
import { getSessionWithRole } from "../data/auth/require-roles";
import { redirect } from "next/navigation";
import Link from "next/link";
import { FeaturesSectionWithHoverEffects } from "@/components/ui/feature-section-with-hover-effects";
import { TestimonialsSectionV2 } from "@/components/ui/testimonial-v2";
import { Logos3 } from "@/components/ui/logos3";
import { FadeIn } from "@/components/ui/fade-in";

import {
  ArrowRight, BookOpen, Users, TrendingUp, Award, Play, Star,
  Calendar, Clock, Eye, User, CheckIcon, Globe, Shield, Zap,
  Video, MessageSquare, Trophy, Target, Lightbulb, Headphones,
  FileText, BarChart3, Smartphone, Laptop, Tablet, CheckCircle2
} from "lucide-react";
import { prisma } from "@/lib/db";
import { CategoryCard } from "@/components/ui/category-card";
import { SectionHeading } from "@/components/ui/section-heading";
import HeroSection from "@/components/ui/hero-section-9";
import { FeaturesGrid } from "@/components/marketing/FeaturesGrid";
import { AnimationWrapper } from "@/components/ui/animation-wrapper";
import { CategoriesGrid } from "@/components/marketing/CategoriesGrid";
import { PopularMedicalSubjects } from "@/components/marketing/PopularMedicalSubjects";
import VersionXSection from "@/components/marketing/VersionXSection";
import { StatsBar } from "@/components/marketing/StatsBar";
import { VibeCard } from "@/components/marketing/vibe-card";
import { BroadcastBanner } from "@/components/marketing/BroadcastBanner";
import { getTopCategories } from "../data/marketing/get-marketing-data";
import KalviHero from "@/components/marketing/KalviHero";

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

export const dynamic = "force-dynamic";

export default async function Home() {
  const session = await getSessionWithRole();

  // ... (existing checks)

  // Fetch Real Data in Parallel for maximum speed
  const [
    broadcasts,
    courseCount,
    studentCount,
    instructorCount,
    categories,
    testimonials
  ] = await Promise.all([
    getActiveBroadcasts(),
    prisma.course.count({ where: { status: 'Published' } }),
    prisma.user.count({ where: { role: 'student' } }),
    prisma.teacherProfile.count({ where: { isVerified: true } }),
    getTopCategories(),
    prisma.testimonial.findMany({
      where: { isActive: true, isFeatured: true },
      orderBy: { createdAt: 'desc' },
      take: 9
    })
  ]);

  const stats = [
    { icon: BookOpen, label: "Total Courses", value: `${courseCount}+` },
    { icon: Users, label: "Active Students", value: `${studentCount}+` },
    { icon: Award, label: "Expert Instructors", value: `${instructorCount}+` },
  ];

  return (
    <AnimationWrapper className="min-h-screen bg-background font-sans">
      {/* --- BROADCAST BANNER --- */}
      <BroadcastBanner broadcasts={broadcasts} />
      
      {/* --- HERO SECTION (Kalvi Inspired) --- */}
      <KalviHero />

      {/* ... Stats Bar ... */}
      <StatsBar />

      {/* ... Vibe Card ... */}
      <VibeCard />

      {/* ... Features ... */}
      <FeaturesGrid />

      <VersionXSection />

      <CategoriesGrid categories={categories} />

      <PopularMedicalSubjects />


      {/* --- REVIEWS --- */}
      <TestimonialsSectionV2 testimonials={testimonials} />



      {/* --- DUAL CTA --- */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Student CTA */}
            <div className="relative overflow-hidden rounded-2xl bg-secondary dark:bg-card p-12 flex flex-col justify-center items-start group hover:shadow-2xl transition-all duration-500">
              <div className="relative z-10">
                <div className="h-12 w-12 bg-primary/20 rounded-xl flex items-center justify-center text-primary mb-6">
                  <BookOpen className="h-6 w-6" />
                </div>
                <h3 className="text-3xl font-bold mb-4">PG Aspirant</h3>
                <p className="text-muted-foreground mb-8 text-lg">
                  Access premium NEET PG courses from top medical educators and accelerate your preparation today.
                </p>
                <Link href="/register" className="inline-flex items-center px-6 py-3 rounded-lg bg-primary text-white font-bold hover:bg-primary/90 transition-colors">
                  Start Prep Now <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
              <div className="absolute right-0 bottom-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] group-hover:bg-primary/10 transition-colors" />
            </div>

            {/* Instructor CTA */}
            <div className="relative overflow-hidden rounded-2xl bg-slate-900 text-white p-12 flex flex-col justify-center items-start group hover:shadow-2xl transition-all duration-500">
              <div className="relative z-10">
                <div className="h-12 w-12 bg-white/10 rounded-xl flex items-center justify-center text-white mb-6">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-3xl font-bold mb-4">Medical Educator</h3>
                <p className="text-gray-300 mb-8 text-lg">
                  Share your clinical expertise, mentor future specialists, and build your medical legacy on Examsphere.
                </p>
                <Link href="/teacher/register" className="inline-flex items-center px-6 py-3 rounded-lg bg-white text-slate-900 font-bold hover:bg-gray-100 transition-colors">
                  Join as Faculty <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
              <div className="absolute right-0 bottom-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px]" />
            </div>
          </div>
        </div>
      </section>


    </AnimationWrapper>
  );
}