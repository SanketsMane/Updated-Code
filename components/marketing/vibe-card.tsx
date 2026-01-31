"use client";

import Link from "next/link";
import { Sparkles, ArrowRight, Search, Code, Palette, Music, Calculator, Megaphone, Smartphone, BrainCircuit, User, GraduationCap } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SCENARIOS = [
    {
        text: "Mastering Human Anatomy...",
        resultTitle: "Anatomy Professor",
        resultSubtitle: "Pre-Clinical Specialist",
        icon: User,
        color: "bg-blue-100 text-blue-600",
        ring: "ring-blue-100",
        gradient: "from-blue-500 to-indigo-600"
    },
    {
        text: "High-yield Pharma recalled...",
        resultTitle: "Pharma Expert",
        resultSubtitle: "Para-Clinical Mentor",
        icon: BrainCircuit,
        color: "bg-amber-100 text-amber-600",
        ring: "ring-amber-100",
        gradient: "from-amber-400 to-orange-500"
    },
    {
        text: "Solving complex Pathology cases...",
        resultTitle: "Pathology Specialist",
        resultSubtitle: "Diagnostic Support",
        icon: Search,
        color: "bg-emerald-100 text-emerald-600",
        ring: "ring-emerald-100",
        gradient: "from-emerald-400 to-green-600"
    },
    {
        text: "NEET PG High-Yield Radiology...",
        resultTitle: "Radiology Consultant",
        resultSubtitle: "Visual Diagnostics",
        icon: Sparkles,
        color: "bg-pink-100 text-pink-600",
        ring: "ring-pink-100",
        gradient: "from-pink-500 to-rose-500"
    },
    {
        text: "Biochemistry simplified for INI-CET...",
        resultTitle: "Biochem Mentor",
        resultSubtitle: "Enzyme Mastery",
        icon: Calculator,
        color: "bg-purple-100 text-purple-600",
        ring: "ring-purple-100",
        gradient: "from-purple-500 to-violet-600"
    },
    {
        text: "Clinical Surgery IBQ practice...",
        resultTitle: "Surgery Specialist",
        resultSubtitle: "Clinical Excellence",
        icon: GraduationCap,
        color: "bg-cyan-100 text-cyan-600",
        ring: "ring-cyan-100",
        gradient: "from-cyan-500 to-blue-600"
    }
];

export function VibeCard() {
    const [scenarioIndex, setScenarioIndex] = useState(0);
    const [step, setStep] = useState(0);

    // Animation Sequence State
    // 0: Start Typing
    // 1: Search Click / Processing
    // 2: Show Result
    // 3: Pause

    const currentScenario = SCENARIOS[scenarioIndex];

    useEffect(() => {
        let timeout: NodeJS.Timeout;

        const runSequence = () => {
            // Step 0: Start Typing
            setStep(0);

            // Step 1: Search Click (wait for typing)
            const typingDuration = 2000;
            timeout = setTimeout(() => {
                setStep(1);

                // Step 2: Show Result
                timeout = setTimeout(() => {
                    setStep(2);

                    // Step 3: Switch Scenario
                    timeout = setTimeout(() => {
                        setStep(0);
                        setScenarioIndex((prev) => (prev + 1) % SCENARIOS.length);
                    }, 3500); // 3.5s pause to read result

                }, 800); // 800ms processing delay

            }, typingDuration);
        };

        runSequence();

        return () => clearTimeout(timeout);
    }, [scenarioIndex]);

    return (
        <section className="py-12 md:py-16 bg-background">
            <div className="container mx-auto px-4">
                {/*
          Main Banner
          Dynamic Background changing subtly based on active scenario gradient
        */}
                <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 p-8 md:p-12 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20 font-sans shadow-2xl transition-colors duration-1000">

                    {/* Animated Gradient Background Layer */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${currentScenario.gradient} opacity-90 transition-all duration-1000 ease-in-out`} />

                    {/* Decorative Orb Elements */}
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none animate-pulse" style={{ animationDuration: '8s' }} />
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-black/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />


                    {/* Left Content */}
                    <div className="relative z-10 flex-1 max-w-xl text-center lg:text-left">
                        <h2 className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-white tracking-tight leading-[1.1] mb-6 drop-shadow-sm">
                            Find the perfect <br className="hidden md:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/70">
                                Mentor for You
                            </span>
                        </h2>
                        <p className="text-lg md:text-xl text-white/90 font-medium leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0">
                            From Anatomy to Surgery, get matched with expert medical mentors who fit your preparation style.
                        </p>

                        <Link
                            href="/register"
                            className="group inline-flex items-center justify-center px-8 py-4 bg-white text-slate-900 rounded-2xl font-bold text-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20 active:translate-y-0"
                        >
                            Get Started
                            <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>

                    {/* Right Content - The "Window" Card Animation */}
                    <div className="relative z-10 w-full max-w-lg lg:w-[500px]">

                        <div className="relative group perspective-[1200px]">
                            {/* The Browser Window */}
                            <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-500 hover:rotate-1 hover:shadow-[0_30px_60px_rgba(0,0,0,0.3)] border border-slate-200 dark:border-white/50">

                                {/* Window Title Bar */}
                                <div className="h-10 bg-slate-50/80 border-b border-slate-200 flex items-center px-4 gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-400/80" />
                                    <div className="w-3 h-3 rounded-full bg-amber-400/80" />
                                    <div className="w-3 h-3 rounded-full bg-green-400/80" />
                                </div>

                                {/* Window Content Area */}
                                <div className="h-[340px] w-full relative flex flex-col items-center justify-center overflow-hidden p-6 bg-slate-50/50">

                                    {/* Dynamic Background Gradients inside window */}
                                    <div className="absolute inset-0 z-0 opacity-40 transition-opacity duration-1000">
                                        <div className={`absolute top-[-20%] left-[-20%] w-[120%] h-[120%] bg-gradient-to-br ${currentScenario.gradient} blur-[80px] opacity-40`} />
                                    </div>

                                    {/* Animated Search Bar */}
                                    <div className={`relative z-10 w-full max-w-[380px] mb-8 transaction-all duration-300 ${step >= 2 ? '-translate-y-4' : ''}`}>
                                        <div className={`bg-white rounded-2xl p-2 shadow-lg border-2 flex items-center gap-3 pr-2 transition-all duration-300 ${step >= 1 ? currentScenario.ring + ' border-transparent' : 'border-transparent ring-1 ring-slate-100'}`}>

                                            {/* Text Input Area */}
                                            <div className="flex-1 px-4 py-3 text-slate-600 font-medium h-14 flex items-center overflow-hidden whitespace-nowrap text-lg">
                                                <TypewriterText
                                                    key={scenarioIndex}
                                                    text={currentScenario.text}
                                                    startDelay={300}
                                                />
                                                <span className={`w-0.5 h-6 ml-0.5 animate-blink ${step >= 1 ? 'bg-transparent' : 'bg-slate-400'}`} />
                                            </div>

                                            {/* The Search Button */}
                                            <div className={`h-12 w-12 rounded-xl flex items-center justify-center transition-all duration-500 ${step >= 1 ? 'scale-105 shadow-md ' + currentScenario.color.replace('text-', 'bg-').split(' ')[0] + ' text-white' : 'bg-slate-100 text-slate-400'
                                                }`}>
                                                <Sparkles className={`w-6 h-6 ${step >= 1 ? 'animate-pulse' : ''}`} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Result Card - Pops in with effect */}
                                    <div className="h-28 w-full max-w-[380px] relative">
                                        <AnimatePresence mode="wait">
                                            {step >= 2 && (
                                                <motion.div
                                                    key={scenarioIndex}
                                                    initial={{ opacity: 0, y: 40, scale: 0.9, filter: 'blur(10px)' }}
                                                    animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                                                    exit={{ opacity: 0, y: -40, scale: 0.95, filter: 'blur(5px)' }}
                                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                                    className="absolute inset-0 z-0"
                                                >
                                                    <div className="bg-white rounded-2xl p-4 shadow-xl border border-slate-200 flex items-center gap-5 relative overflow-hidden group/card">

                                                        {/* Result Shine Effect */}
                                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent translate-x-[-150%] animate-shine" />

                                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${currentScenario.color} shadow-sm shrink-0`}>
                                                            <currentScenario.icon className="w-7 h-7" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="text-lg font-bold text-slate-900 truncate">{currentScenario.resultTitle}</h4>
                                                            <p className="text-sm text-slate-500 truncate font-medium">{currentScenario.resultSubtitle}</p>
                                                        </div>
                                                        <div className="flex flex-col items-end gap-1">
                                                            <div className="flex -space-x-2">
                                                                {[1, 2, 3].map(i => (
                                                                    <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-200" />
                                                                ))}
                                                            </div>
                                                            <span className="text-xs text-slate-400 font-semibold">120+ Doctors</span>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </section>
    );
}

// Internal component for typing effect
function TypewriterText({ text, startDelay }: { text: string, startDelay: number }) {
    const [displayedText, setDisplayedText] = useState("");

    useEffect(() => {
        setDisplayedText("");
        let timeout: NodeJS.Timeout;

        const type = (index: number) => {
            if (index < text.length) {
                setDisplayedText(text.substring(0, index + 1));
                timeout = setTimeout(() => type(index + 1), 30 + Math.random() * 40);
            }
        };

        const initialTimeout = setTimeout(() => {
            type(0);
        }, startDelay);

        return () => {
            clearTimeout(timeout);
            clearTimeout(initialTimeout);
        };
    }, [text, startDelay]);

    return <span>{displayedText}</span>;
}
