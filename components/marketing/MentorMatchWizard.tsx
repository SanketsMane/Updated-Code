"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronRight, Sparkles, User, BookOpen, Target, Wand2, HeartPulse, Search, BrainCircuit, ShieldCheck, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

type Step = {
    id: number;
    question: string;
    options: { label: string; icon: any }[];
};

const steps: Step[] = [
    {
        id: 1,
        question: "What subject do you want to master?",
        options: [
            { label: "Anatomy", icon: BookOpen },
            { label: "Pharmacology", icon: HeartPulse },
            { label: "Pathology", icon: Search },
            { label: "Biochemistry", icon: BrainCircuit },
        ]
    },
    {
        id: 2,
        question: "What is your current level of study?",
        options: [
            { label: "Pre-Clinical", icon: User },
            { label: "Para-Clinical", icon: ShieldCheck },
            { label: "Clinical Student", icon: GraduationCap },
            { label: "Intern / Post-Intern", icon: TrophyIcon },
        ]
    },
    {
        id: 3,
        question: "What is your primary preparation goal?",
        options: [
            { label: "NEET PG Rank", icon: Target },
            { label: "INI-CET Prep", icon: Sparkles },
            { label: "University Exams", icon: FileTextIcon },
        ]
    }
];

// Placeholder Icons for locally defined component
function CodeIcon(props: any) { return <span {...props}>💻</span> }
function CalculatorIcon(props: any) { return <span {...props}>🧮</span> }
function CloudLightningIcon(props: any) { return <span {...props}>🎸</span> }
function TrendingUpIcon(props: any) { return <span {...props}>📈</span> }
function TrophyIcon(props: any) { return <span {...props}>🏆</span> }
function SmileIcon(props: any) { return <span {...props}>🤠</span> }
function FileTextIcon(props: any) { return <span {...props}>📝</span> }

export function MentorMatchWizard() {
    const [isOpen, setIsOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);

    const handleOptionSelect = (option: string) => {
        setAnswers({ ...answers, [currentStep]: option });
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            // Finish
            setIsSearching(true);
            setTimeout(() => {
                setIsSearching(false);
                setShowResults(true);
            }, 2000);
        }
    };

    const reset = () => {
        setCurrentStep(0);
        setAnswers({});
        setShowResults(false);
        setIsSearching(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) reset(); }}>
            <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-lg shadow-violet-500/20 border-0">
                    <Wand2 className="mr-2 h-4 w-4" />
                    Match Me with a Mentor
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-white dark:bg-[#0c1220] border-0 shadow-2xl">
                <div className="relative h-[450px] w-full flex flex-col">

                    {/* Background Accents */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 rounded-full blur-[80px] -z-10" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-fuchsia-500/10 rounded-full blur-[80px] -z-10" />

                    {!isSearching && !showResults && (
                        <div className="flex-1 p-8 flex flex-col">
                            {/* Progress */}
                            <div className="flex gap-2 mb-8">
                                {steps.map((s, idx) => (
                                    <div key={s.id} className={`h-1 flex-1 rounded-full transition-all duration-500 ${idx <= currentStep ? "bg-violet-600" : "bg-gray-100 dark:bg-gray-800"}`} />
                                ))}
                            </div>

                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentStep}
                                    initial={{ x: 20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: -20, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="flex-1"
                                >
                                    <h2 className="text-2xl font-bold mb-6 text-[#011E21] dark:text-white">
                                        {steps[currentStep].question}
                                    </h2>

                                    <div className="grid gap-3">
                                        {steps[currentStep].options.map((option) => {
                                            const Icon = option.icon;
                                            return (
                                                <button
                                                    key={option.label}
                                                    onClick={() => handleOptionSelect(option.label)}
                                                    className="w-full text-left p-4 rounded-xl border border-slate-200 dark:border-gray-800 hover:border-violet-500 hover:bg-violet-50 dark:hover:bg-violet-900/10 transition-all group flex items-center gap-4"
                                                >
                                                    <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-900 flex items-center justify-center group-hover:bg-violet-100 dark:group-hover:bg-violet-900/30 transition-colors">
                                                        <Icon className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-violet-600 dark:group-hover:text-violet-400" />
                                                    </div>
                                                    <span className="font-medium text-lg text-gray-700 dark:text-gray-200 group-hover:text-violet-900 dark:group-hover:text-violet-100">
                                                        {option.label}
                                                    </span>
                                                    <ChevronRight className="ml-auto w-5 h-5 text-gray-300 group-hover:text-violet-500" />
                                                </button>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    )}

                    {isSearching && (
                        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-violet-50/50 dark:bg-violet-900/5">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                className="mb-6 relative"
                            >
                                <Sparkles className="w-12 h-12 text-violet-600" />
                            </motion.div>
                            <h3 className="text-xl font-bold mb-2">Analyzing your profile...</h3>
                            <p className="text-muted-foreground">Finding the perfect mentors for you</p>
                        </div>
                    )}

                    {showResults && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex-1 p-8 flex flex-col"
                        >
                            <div className="text-center mb-6">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600 mb-4">
                                    <Check className="w-6 h-6" />
                                </div>
                                <h2 className="text-2xl font-bold">Perfect Match Found!</h2>
                                <p className="text-muted-foreground">Based on your answers, we recommend:</p>
                            </div>

                            <div className="bg-white dark:bg-card border border-violet-100 dark:border-violet-900/30 rounded-xl p-4 shadow-sm flex items-center gap-4 mb-4">
                                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop" className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md" alt="Mentor" />
                                <div>
                                    <h4 className="font-bold text-lg">Sarah Jenkins</h4>
                                    <div className="flex items-center gap-2 mb-1">
                                        <Badge variant="secondary" className="bg-violet-100 text-violet-700">Top Match</Badge>
                                        <span className="text-xs text-muted-foreground">98% Compatibility</span>
                                    </div>
                                    <p className="text-xs text-gray-500">Expert in {answers[0] || "English"}</p>
                                </div>
                            </div>

                            <div className="mt-auto grid grid-cols-2 gap-3">
                                <Button variant="outline" onClick={reset}>Try Again</Button>
                                <Button className="bg-violet-600 hover:bg-violet-700 text-white">View Profile</Button>
                            </div>
                        </motion.div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
