import { MotionWrapper } from "@/components/ui/motion-wrapper";
import { MentorMatchWizard } from "@/components/marketing/MentorMatchWizard";
import { HorizontalTeacherCard } from "@/components/marketing/HorizontalTeacherCard";
import { ShieldCheck, Search, SlidersHorizontal, ChevronDown } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { TopicTicker } from "@/components/marketing/TopicTicker";
import { FeaturedMentorCarousel } from "@/components/marketing/FeaturedMentorCarousel";

export const dynamic = "force-dynamic";

// Rich Mock Data for Yo-Coach Fidelity
const mockTeachers = [
    {
        id: "1",
        name: "Sarah Jenkins",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
        headline: "Expert Business English Coach & IELTS Trainer",
        rating: 4.9,
        reviewCount: 128,
        hourlyRate: 2500,
        teaches: ["English", "Business Comms"],
        speaks: ["English (Native)", "French (B2)"],
        description: "Certified TEFL teacher with 10 years of experience helping professionals master Business English. Specialized in IELTS preparation and corporate communication skills. My interactive sessions focus on real-world usage and confidence building.",
        country: "United Kingdom",
        isVerified: true,
    },
    {
        id: "2",
        name: "Hiroshi田中",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
        headline: "Certified Japanese Tutor | JLPT N1-N5",
        rating: 5.0,
        reviewCount: 85,
        hourlyRate: 3000,
        teaches: ["Japanese", "Calligraphy"],
        speaks: ["Japanese (Native)", "English (Fluent)"],
        description: "Native Japanese speaker with a passion for sharing my culture. I structure lessons based on your goals, whether it's passing the JLPT, watching anime without subtitles, or business etiquette. Let's make learning Japanese fun together!",
        country: "Japan",
        isVerified: true,
    },
    {
        id: "3",
        name: "Elena Rodriguez",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
        headline: "Spanish for Travelers and Professionals",
        rating: 4.8,
        reviewCount: 210,
        hourlyRate: 1800,
        teaches: ["Spanish", "Culture"],
        speaks: ["Spanish (Native)", "English (Advanced)"],
        description: "Hola! I am a professional language teacher from Madrid. My methodology involves total immersion and conversation from day one. I have extensive materials for grammar, vocabulary, and cultural nuances tailored to your level.",
        country: "Spain",
        isVerified: true,
    },
    {
        id: "4",
        name: "David Chen",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
        headline: "Math & Physics Tutor for High School & College",
        rating: 4.9,
        reviewCount: 156,
        hourlyRate: 2200,
        teaches: ["Mathematics", "Physics", "Calculus"],
        speaks: ["English (Native)", "Mandarin (Native)"],
        description: "MSc in Physics from MIT. I help students grasp complex concepts through simple analogies. Whether you're struggling with high school algebra or college-level quantum mechanics, I can guide you to academic success.",
        country: "USA",
        isVerified: true,
    }
];

export default function FindTeacherPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-black font-sans text-foreground pb-20">
            {/* Header Section */}
            <div className="bg-white dark:bg-card border-b border-gray-100 dark:border-gray-800 pt-32 pb-10 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                <div className="container mx-auto px-6 max-w-7xl relative z-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-extrabold text-[#011E21] dark:text-white mb-4 tracking-tight">
                                Find a <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-teal-500">Super Tutor</span>
                            </h1>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                                <ChevronDown className="w-3 h-3 -rotate-90" />
                                <span className="text-primary font-medium bg-primary/10 px-2 py-0.5 rounded-md">Find a Teacher</span>
                            </div>
                        </div>

                        <div className="hidden md:flex items-center gap-2 bg-white dark:bg-black/20 backdrop-blur-md border border-gray-200 dark:border-gray-700 px-4 py-2 rounded-full shadow-sm animate-pulse">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                            </span>
                            <span className="text-xs font-bold text-foreground">124 students booking now</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Trending Ticker */}
            <TopicTicker />

            <div className="container mx-auto px-6 max-w-7xl py-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Sidebar Filters (Static Visual for UI Fidelity) */}
                    <div className="lg:col-span-3 hidden lg:block space-y-6">
                        <div className="bg-white dark:bg-card p-6 rounded-2xl border border-gray-100 dark:border-gray-800 sticky top-24 shadow-sm">
                            <div className="mb-8">
                                <MentorMatchWizard />
                            </div>

                            {/* Featured Carousel in Sidebar */}
                            <div className="mb-6 pb-6 border-b border-gray-100 dark:border-gray-800">
                                <FeaturedMentorCarousel />
                            </div>

                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-bold text-lg flex items-center gap-2">
                                    <SlidersHorizontal className="w-5 h-5 text-primary" /> Filters
                                </h3>
                                <button className="text-xs font-semibold text-primary hover:underline">Reset</button>
                            </div>

                            {/* Filter Groups */}
                            <div className="space-y-6">
                                {/* Languages */}
                                <div className="space-y-3">
                                    <h4 className="text-sm font-bold flex items-center justify-between">
                                        Spoken Language <ChevronDown className="w-4 h-4 text-gray-400" />
                                    </h4>
                                    <div className="space-y-2">
                                        {["English", "Spanish", "French", "German", "Japanese"].map(lang => (
                                            <div key={lang} className="flex items-center space-x-2">
                                                <Checkbox id={lang} />
                                                <Label htmlFor={lang} className="text-sm font-normal text-muted-foreground">{lang}</Label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="h-px bg-gray-100 dark:bg-gray-800" />

                                {/* Price Range */}
                                <div className="space-y-3">
                                    <h4 className="text-sm font-bold flex items-center justify-between">
                                        Hourly Rate <ChevronDown className="w-4 h-4 text-gray-400" />
                                    </h4>
                                    <div className="flex items-center gap-2">
                                        <div className="bg-gray-50 dark:bg-muted p-2 rounded-lg text-sm flex-1 text-center">₹500</div>
                                        <span className="text-gray-400">-</span>
                                        <div className="bg-gray-50 dark:bg-muted p-2 rounded-lg text-sm flex-1 text-center">₹5000+</div>
                                    </div>
                                </div>

                                <div className="h-px bg-gray-100 dark:bg-gray-800" />

                                {/* Availability */}
                                <div className="space-y-3">
                                    <h4 className="text-sm font-bold flex items-center justify-between">
                                        Availability <ChevronDown className="w-4 h-4 text-gray-400" />
                                    </h4>
                                    <div className="space-y-2">
                                        {["Instant Booking", "Free Trial", "Weekends"].map(opt => (
                                            <div key={opt} className="flex items-center space-x-2">
                                                <Checkbox id={opt} />
                                                <Label htmlFor={opt} className="text-sm font-normal text-muted-foreground">{opt}</Label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content: Teacher Lists */}
                    <div className="lg:col-span-9 space-y-6">
                        {/* Sort Bar */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-card p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
                            <p className="text-sm text-muted-foreground font-medium">
                                Showing <span className="text-foreground font-bold">1 - 4</span> of 156 Professional Mentors
                            </p>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">Sort By:</span>
                                <select className="bg-gray-50 dark:bg-muted border-none text-sm font-semibold rounded-lg px-3 py-1.5 focus:ring-1 focus:ring-primary">
                                    <option>Popularity</option>
                                    <option>Newest</option>
                                    <option>Price: Low to High</option>
                                    <option>Rating: High to Low</option>
                                </select>
                            </div>
                        </div>

                        {/* List */}
                        <div className="flex flex-col gap-6">
                            {mockTeachers.map((teacher, index) => (
                                <MotionWrapper key={teacher.id} delay={index * 0.1} variant="slideUp">
                                    <HorizontalTeacherCard teacher={teacher} />
                                </MotionWrapper>
                            ))}
                        </div>

                        {/* Pagination Visual */}
                        <div className="flex justify-center mt-12 gap-2">
                            <Button variant="outline" size="icon" disabled>{'<'}</Button>
                            <Button variant="default" size="icon" className="bg-primary text-white">1</Button>
                            <Button variant="outline" size="icon">2</Button>
                            <Button variant="outline" size="icon">3</Button>
                            <Button variant="ghost" size="icon">...</Button>
                            <Button variant="outline" size="icon">{'>'}</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
