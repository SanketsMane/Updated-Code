"use client";

import { FadeIn } from "@/components/ui/fade-in";
import { SessionCard } from "@/components/ui/session-card";
import {
  Video, Users, Globe, Star, MessageSquare, Award,
  CheckCircle, Play, Calendar, Zap, ArrowRight, Shield
} from "lucide-react";
import Link from "next/link";

const forthcomingSessions = [
  {
    id: "1",
    title: "React 18 & Next.js 14 Masterclass",
    instructor: "Sarah Johnson",
    date: "Dec 2, 2025",
    time: "2:00 PM EST",
    duration: "2 hours",
    participants: 8,
    maxParticipants: 10,
    level: "Intermediate",
    price: "₹1499",
    rating: 4.9
  },
  {
    id: "2",
    title: "AI & Machine Learning Fundamentals",
    instructor: "Dr. Michael Chen",
    date: "Dec 3, 2025",
    time: "10:00 AM EST",
    duration: "3 hours",
    participants: 15,
    maxParticipants: 15,
    level: "Beginner",
    price: "₹2499",
    rating: 5.0
  },
  {
    id: "3",
    title: "Advanced Python for Data Science",
    instructor: "Emma Rodriguez",
    date: "Dec 5, 2025",
    time: "6:00 PM EST",
    duration: "2.5 hours",
    participants: 6,
    maxParticipants: 12,
    level: "Advanced",
    price: "₹1999",
    rating: 4.8
  }
];

const stats = [
  { icon: Video, label: "Sessions Completed", value: "12k+" },
  { icon: Users, label: "Active Instructors", value: "200+" },
  { icon: Globe, label: "Global Learners", value: "25k+" },
  { icon: Star, label: "Average Rating", value: "4.9" }
];

const benefitFeatures = [
  {
    icon: Video,
    title: "HD Video Quality",
    desc: "Crystal clear video for immersive learning"
  },
  {
    icon: MessageSquare,
    title: "Real-time Q&A",
    desc: "Get your doubts resolved instantly"
  },
  {
    icon: Shield,
    title: "Verified Experts",
    desc: "Learn from industry professionals"
  },
  {
    icon: Award,
    title: "Certification",
    desc: "Earn valid certificates upon completion"
  }
];

export default function LiveSessionsPage() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      {/* Hero Section - Dark Gradient Pulse */}
      <section className="relative overflow-hidden bg-slate-50 dark:bg-slate-950 text-foreground dark:text-white py-20 lg:py-28">
        {/* Ambient Background */}
        <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-primary/5 dark:from-primary/20 to-transparent opacity-30" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 dark:bg-primary/30 rounded-full blur-[128px] opacity-50" />

        <div className="container mx-auto relative z-10 text-center max-w-4xl">
          <FadeIn>
            <div className="inline-flex items-center gap-2 rounded-full bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 px-4 py-1.5 text-sm font-medium text-slate-700 dark:text-white mb-8 backdrop-blur-md shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <span>Live Learning Now Available</span>
            </div>

            <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight mb-8 leading-tight text-slate-900 dark:text-white">
              Interactive Learning, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">
                Real-Time Results
              </span>
            </h1>

            <p className="text-lg lg:text-xl text-muted-foreground dark:text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Break the barrier of recorded videos. Join live sessions, interact with experts,
              and get personalized feedback to accelerate your growth.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="#upcoming"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-bold bg-primary text-primary-foreground rounded-lg shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all hover:-translate-y-1"
              >
                Find a Session
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-bold bg-white dark:bg-white/10 text-slate-900 dark:text-white border border-slate-200 dark:border-white/20 rounded-lg hover:bg-slate-50 dark:hover:bg-white/20 transition-all shadow-sm"
              >
                Become a Mentor
              </Link>
            </div>
          </FadeIn>
        </div>

        {/* Stats Row within Hero */}
        <div className="container mx-auto mt-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-slate-200 dark:border-white/10 pt-10">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{stat.value}</div>
                <div className="text-sm text-slate-600 dark:text-white/60 flex items-center justify-center gap-2">
                  <stat.icon className="w-4 h-4" />
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-secondary/30 border-b border-border">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-6">
            {benefitFeatures.map((feat, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-xl hover:bg-background transition-colors">
                <div className="bg-primary/10 p-3 rounded-lg text-primary shrink-0">
                  <feat.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-1">{feat.title}</h3>
                  <p className="text-sm text-muted-foreground leading-snug">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Upcoming Sessions Grid */}
      <section id="upcoming" className="py-24 container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">Upcoming Featured Sessions</h2>
            <p className="text-muted-foreground text-lg">Book your spot before they fill up</p>
          </div>
          <Link href="/live-sessions/all" className="text-primary font-bold hover:underline flex items-center gap-1">
            View Full Calendar <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="flex flex-wrap justify-center gap-8">
          {forthcomingSessions.map((session, index) => (
            <SessionCard
              key={session.id}
              {...session}
              index={index}
            />
          ))}
        </div>
      </section>

      {/* Legacy "Session Types" Section - Refed to new Style */}
      <section className="py-24 bg-secondary">
        <div className="container text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Ways to Learn Live</h2>
          <p className="text-muted-foreground mb-12">Choose the format that fits your learning style.</p>

          <div className="grid md:grid-cols-3 gap-6 text-left">
            {/* Card 1 */}
            <div className="bg-background p-6 rounded-xl border border-border shadow-sm hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg mb-2">Group Classes</h3>
              <p className="text-sm text-muted-foreground">Collaborative learning with peers. Best for discussions.</p>
            </div>
            {/* Card 2 */}
            <div className="bg-background p-6 rounded-xl border-2 border-primary shadow-lg scale-105 relative z-10">
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">POPULAR</div>
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg mb-2">1-on-1 Mentorship</h3>
              <p className="text-sm text-muted-foreground">Private sessions for personalized guidance and code review.</p>
            </div>
            {/* Card 3 */}
            <div className="bg-background p-6 rounded-xl border border-border shadow-sm hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg mb-2">Workshops</h3>
              <p className="text-sm text-muted-foreground">Intensive deep-dives into specific technologies.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}