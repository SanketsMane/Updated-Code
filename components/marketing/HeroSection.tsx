"use client";

import { motion } from "framer-motion";
import { Search, MapPin, Globe, CheckCircle2, Star, ShieldCheck, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";

export function HeroSection() {
    const [typedText, setTypedText] = useState("");
    const fullText = "Expert Tutors";
    const [isDeleting, setIsDeleting] = useState(false);
    const [loopNum, setLoopNum] = useState(0);
    const [typingSpeed, setTypingSpeed] = useState(150);
    const [searchType, setSearchType] = useState<"tutors" | "courses">("tutors");

    const texts = ["Expert Tutors", "New Languages", "Music Skills", "Academic Success"];

    useEffect(() => {
        const handleTyping = () => {
            const i = loopNum % texts.length;
            const currentText = texts[i];

            setTypedText(
                isDeleting
                    ? currentText.substring(0, typedText.length - 1)
                    : currentText.substring(0, typedText.length + 1)
            );

            if (!isDeleting && typedText === currentText) {
                setTimeout(() => setIsDeleting(true), 1500);
                setTypingSpeed(150);
            } else if (isDeleting && typedText === "") {
                setIsDeleting(false);
                setLoopNum(loopNum + 1);
                setTypingSpeed(100);
            }
        };

        const timer = setTimeout(handleTyping, isDeleting ? 50 : typingSpeed);
        return () => clearTimeout(timer);
    }, [typedText, isDeleting, loopNum, texts, typingSpeed]);

    return (
        <section className="relative w-full min-h-[600px] lg:min-h-[700px] overflow-hidden bg-[#F5F9FA] flex items-center justify-center pt-20 pb-16">
            {/* Background Decor - Blobs */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#4FB5C6]/10 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute bottom-[0%] left-[-10%] w-[500px] h-[500px] bg-yellow-400/10 rounded-full blur-[100px] delay-1000" />
            </div>

            <div className="container mx-auto px-4 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
                {/* Left Content */}
                <div className="flex flex-col gap-6 z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent-foreground text-sm font-medium mb-4 border border-accent/20">
                            <Star className="w-4 h-4 fill-accent text-accent" />
                            <span>Trusted by 50,000+ Students</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#011E21] leading-[1.15] tracking-tight">
                            Find The Perfect <br />
                            <span className="text-primary relative inline-block min-w-[300px]">
                                {typedText}
                                <span className="w-1 h-12 bg-primary absolute top-2 -right-2 animate-pulse" />
                            </span>
                        </h1>

                        <p className="text-lg text-muted-foreground mt-4 max-w-xl leading-relaxed">
                            Master any subject with personalized 1-on-1 lessons from expert tutors.
                            Language learning, academic support, and skill development made easy.
                        </p>
                    </motion.div>

                    {/* Search Box - Yo-Coach Style Floating Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-white p-3 md:p-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-200 mt-8 max-w-2xl relative"
                    >
                        {/* Field Type Tabs */}
                        <div className="absolute -top-12 left-4 flex gap-2">
                            <button
                                onClick={() => setSearchType("tutors")}
                                className={`px-6 py-2 rounded-t-xl font-bold text-sm transition-all ${searchType === 'tutors' ? 'bg-white text-primary shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]' : 'bg-white/50 text-muted-foreground hover:bg-white/80'}`}
                            >
                                Find Tutors
                            </button>
                            <button
                                onClick={() => setSearchType("courses")}
                                className={`px-6 py-2 rounded-t-xl font-bold text-sm transition-all ${searchType === 'courses' ? 'bg-white text-primary shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]' : 'bg-white/40 text-white hover:bg-white/60'}`}
                            >
                                Find Courses
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr_auto] gap-3 items-center">
                            {/* Subject Input */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                <Input
                                    placeholder="What do you want to learn?"
                                    className="pl-9 bg-transparent border-none shadow-none focus-visible:ring-0 text-base h-12"
                                />
                                <div className="hidden md:block absolute right-0 top-3 bottom-3 w-[1px] bg-border" />
                            </div>

                            {/* Language Dropdown */}
                            <div className="relative">
                                <Select>
                                    <SelectTrigger className="border-none shadow-none focus:ring-0 h-12 bg-transparent text-muted-foreground font-normal pl-2">
                                        <div className="flex items-center gap-2">
                                            <Globe className="w-4 h-4" />
                                            <SelectValue placeholder="Language" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="en">English</SelectItem>
                                        <SelectItem value="es">Spanish</SelectItem>
                                        <SelectItem value="fr">French</SelectItem>
                                        <SelectItem value="de">German</SelectItem>
                                    </SelectContent>
                                </Select>
                                <div className="hidden md:block absolute right-0 top-3 bottom-3 w-[1px] bg-border" />
                            </div>

                            {/* Teacher Type Dropdown */}
                            <div className="relative">
                                <Select>
                                    <SelectTrigger className="border-none shadow-none focus:ring-0 h-12 bg-transparent text-muted-foreground font-normal pl-2">
                                        <div className="flex items-center gap-2">
                                            <ShieldCheck className="w-4 h-4" />
                                            <SelectValue placeholder="Tutor Type" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="native">Native Speaker</SelectItem>
                                        <SelectItem value="certified">Certified Pro</SelectItem>
                                        <SelectItem value="community">Community Tutor</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Search Button */}
                            <Button size="lg" className="h-12 px-8 rounded-xl font-bold text-base shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all">
                                Search
                            </Button>
                        </div>
                    </motion.div>

                    <div className="flex items-center gap-6 mt-4 text-sm font-medium text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                            <span>Verified Tutors</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                            <span>Pay per Lesson</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                            <span>Secure Payment</span>
                        </div>
                    </div>
                </div>

                {/* Right Content - Visuals */}
                <div className="relative hidden lg:block h-full min-h-[500px]">
                    {/* Main Image Container */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7 }}
                        className="absolute right-0 top-1/2 -translate-y-1/2 w-[90%] h-[90%] bg-gradient-to-b from-blue-100 to-transparent rounded-[3rem] overflow-hidden"
                    >
                        {/* Abstract Placeholder for Teacher Image - Using a nice colored div structure if no image */}
                        <div className="w-full h-full bg-[#f0f4f8] relative overflow-hidden flex items-end justify-center">
                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-90 hover:scale-105 transition-transform duration-700" />
                        </div>
                    </motion.div>

                    {/* Floating Cards */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                        className="absolute top-[20%] -left-[5%] bg-white p-4 rounded-2xl shadow-lg border border-border/40 backdrop-blur-sm bg-white/90 max-w-[200px]"
                    >
                        <div className="flex items-center gap-3">
                            <div className="bg-yellow-100 p-2 rounded-lg text-yellow-600">
                                <Star className="w-5 h-5 fill-current" />
                            </div>
                            <div>
                                <p className="font-bold text-lg">4.9/5</p>
                                <p className="text-xs text-muted-foreground">Student Rating</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7, duration: 0.5 }}
                        className="absolute bottom-[15%] -right-[5%] bg-white p-4 rounded-2xl shadow-lg border border-border/40 backdrop-blur-sm bg-white/90 max-w-[220px]"
                    >
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                                <Users className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-bold text-lg">10k+ Tutors</p>
                                <p className="text-xs text-muted-foreground">Active Experts</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div >
        </section >
    );
}
