"use client";

import { FadeIn } from "@/components/ui/fade-in";
import { MentorsSection } from "@/components/mentors/mentors-section";
import {
  Search, Code, Layout, Database, TrendingUp, ShieldCheck,
  CheckCircle, ArrowRight, Star, Users, Briefcase
} from "lucide-react";
import Link from "next/link";



const categories = [
  { name: "Development", count: "1.2k Mentors", icon: Code, color: "text-blue-500 bg-blue-100 dark:bg-blue-900/20" },
  { name: "Design", count: "850 Mentors", icon: Layout, color: "text-pink-500 bg-pink-100 dark:bg-pink-900/20" },
  { name: "Data Science", count: "600 Mentors", icon: Database, color: "text-purple-500 bg-purple-100 dark:bg-purple-900/20" },
  { name: "Marketing", count: "900 Mentors", icon: TrendingUp, color: "text-green-500 bg-green-100 dark:bg-green-900/20" },
];

export default function MarketplacePage() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      {/* Hero Section - Talent Showcase */}
      <section className="relative bg-background border-b border-border py-20 lg:py-28 overflow-hidden">
        {/* Background Patterns */}
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-30 dark:opacity-5" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />

        <div className="container mx-auto relative z-10">
          <FadeIn>
            <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-sm font-medium text-secondary-foreground mb-8">
                <Briefcase className="h-4 w-4" />
                <span>Access Top 1% Global Talent</span>
              </div>

              <h1 className="text-4xl lg:text-7xl font-extrabold tracking-tight mb-8">
                Find Your Perfect <br />
                <span className="text-primary relative inline-block">
                  Mentor
                  <svg className="absolute w-full h-3 -bottom-1 left-0 text-primary opacity-30" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0 5 Q 50 10 100 5 L 100 10 L 0 10 Z" fill="currentColor" />
                  </svg>
                </span>
              </h1>

              <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                Connect with industry experts from top companies for 1-on-1 guidance, code reviews, and career advice.
              </p>

              {/* Search Bar */}
              <div className="relative w-full max-w-2xl mx-auto shadow-2xl rounded-full mb-12">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-muted-foreground">
                  <Search className="h-6 w-6" />
                </div>
                <input
                  type="text"
                  placeholder="Search by skill, company, or name (e.g. 'React', 'Google')..."
                  className="w-full pl-14 pr-32 py-5 rounded-full border border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent text-lg outline-none transition-all placeholder:text-muted-foreground/60"
                  suppressHydrationWarning
                />
                <button
                  className="absolute right-2 top-2 bottom-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 rounded-full transition-colors flex items-center"
                  suppressHydrationWarning
                >
                  Search
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm font-medium text-muted-foreground">
                <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Verified Experts</span>
                <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-blue-500" /> Secure Payments</span>
                <span className="flex items-center gap-2"><Star className="w-4 h-4 text-amber-500" /> 4.9/5 Average Rating</span>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat, i) => (
              <Link key={i} href="#" className="flex items-center gap-4 p-4 bg-background border border-border rounded-xl hover:border-primary/50 hover:shadow-md transition-all group">
                <div className={`p-3 rounded-lg ${cat.color} group-hover:scale-110 transition-transform`}>
                  <cat.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">{cat.name}</h3>
                  <p className="text-xs text-muted-foreground">{cat.count}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>


      {/* Mentors Section */}
      <MentorsSection />

      {/* CTA Section */}
      <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
        <div className="container mx-auto relative z-10 text-center max-w-3xl">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-6">Share Your Expertise</h2>
          <p className="text-primary-foreground/90 text-xl mb-10 leading-relaxed">
            Join our community of mentors. Help others learn, build your personal brand, and earn income on your own schedule.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/register/teacher" className="px-8 py-4 bg-background text-foreground font-bold rounded-lg hover:bg-zinc-100 transition-colors shadow-xl inline-block text-center">
              Become a Mentor
            </Link>
            <button
              className="px-8 py-4 bg-primary-foreground/10 text-primary-foreground border border-white/20 font-bold rounded-lg hover:bg-primary-foreground/20 transition-colors"
              suppressHydrationWarning
            >
              Learn More
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
