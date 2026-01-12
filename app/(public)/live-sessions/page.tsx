import { FadeIn } from "@/components/ui/fade-in";
import { SessionCard } from "@/components/ui/session-card";
import { Video, Users, Globe, Star } from "lucide-react";
import Link from "next/link";
import { getAllSessions } from "@/app/data/live-session/get-all-sessions";
import { LiveSessionFeatures } from "@/components/marketing/live-session-features";
import { LiveNowTray } from "@/components/marketing/LiveNowTray";
import { SessionCalendarView } from "@/components/marketing/SessionCalendarView";

export const dynamic = "force-dynamic";

// Moved to dynamic fetch
/* const stats = [
  { icon: Video, label: "Sessions Completed", value: "12k+" },
  { icon: Users, label: "Active Instructors", value: "200+" },
  { icon: Globe, label: "Global Learners", value: "25k+" },
  { icon: Star, label: "Average Rating", value: "4.9" }
]; */

export default async function LiveSessionsPage() {
  const rawSessions = await getAllSessions();

  // Transform sessions to plain objects to avoid Decimal serialization issues
  const sessions = rawSessions.map(session => ({
    ...session,
    price: Number(session.price),
    teacher: {
      ...session.teacher,
      hourlyRate: Number(session.teacher.hourlyRate),
      totalEarnings: Number(session.teacher.totalEarnings)
    }
  }));

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      {/* Live Now Tray - Using latest sessions as "Live" for demo */}
      <LiveNowTray sessions={sessions.slice(0, 3).map(s => ({
        id: s.id,
        title: s.title,
        instructor: s.teacher.user.name || "Instructor",
        image: s.teacher.user.image || "/placeholder-user.jpg",
        viewers: Math.floor(Math.random() * 50) + 10, // Mock viewers for now
        topic: "Education"
      }))} />

      {/* Clean Hero Section */}
      <section className="relative overflow-hidden bg-white dark:bg-black py-20 lg:py-28 border-b border-gray-100 dark:border-gray-800">
        <div className="container mx-auto px-4 relative z-10 text-center">
          <FadeIn>
            <div className="inline-flex items-center gap-2 rounded-full bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 px-4 py-1.5 text-sm font-medium text-red-600 dark:text-red-400 mb-6 mx-auto">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <span>Live Now</span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight mb-6 text-[#011E21] dark:text-white">
              Interactive <span className="text-primary">Live Sessions</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Join expert-led live classes, interact in real-time, and accelerate your learning journey with personalized guidance.
            </p>

            <div className="flex justify-center gap-12 pt-8 border-t border-gray-100 dark:border-gray-800 max-w-4xl mx-auto">
              {[
                { icon: Video, label: "Sessions Available", value: `${sessions.length}+` },
                { icon: Users, label: "Active Instructors", value: `${new Set(sessions.map(s => s.teacherId)).size}+` },
                { icon: Globe, label: "Global Learners", value: "250+" },
                { icon: Star, label: "Average Rating", value: "4.9" }
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl font-bold text-[#011E21] dark:text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground flex items-center justify-center gap-1.5">
                    <stat.icon className="w-3.5 h-3.5" />
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Features Grid */}
      <LiveSessionFeatures />

      {/* Upcoming Sessions Grid */}
      <section id="upcoming" className="py-24 container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-2 text-[#011E21] dark:text-white">Upcoming Sessions</h2>
            <p className="text-muted-foreground text-lg">Book your spot before they fill up</p>
          </div>
          <Link href="/live-sessions/all" className="text-primary font-bold hover:underline flex items-center gap-1">
            View Calendar
          </Link>
        </div>

        <SessionCalendarView sessions={sessions}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sessions.map((session, index) => (
              <SessionCard
                key={session.id}
                id={session.id}
                title={session.title}
                instructor={session.teacher.user.name}
                date={new Date(session.scheduledAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                time={new Date(session.scheduledAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZoneName: 'short' })}
                duration={`${session.duration} min`}
                participants={session.studentId ? 1 : 0} // Temporary logic
                maxParticipants={20} // Temporary logic
                level="Intermediate" // Missing in schema for Session, using default
                price={`₹${(session.price / 100).toFixed(0)}`}
                rating={session.teacher.rating || 4.8}
                index={index}
              />
            ))}
            {sessions.length === 0 && (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                No upcoming sessions scheduled at the moment.
              </div>
            )}
          </div>
        </SessionCalendarView>
      </section>
    </div>
  );
}