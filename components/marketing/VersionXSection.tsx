"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { CheckCircle2, PlayCircle, BarChart3, Headphones, Image as ImageIcon, FileText, Zap, ArrowRight } from "lucide-react";

const features = [
    {
        title: "Long Lectures Draining Your Energy?",
        description: "Dive into 15% shorter video lectures, backed by animations, 3D models, and available in both हिंglish and English for faster, smarter learning.",
        image: "/marketing/versionx_lectures.png",
        icon: PlayCircle,
        color: "text-blue-500",
        bg: "bg-blue-500/10",
    },
    {
        title: "Struggling to Revise Vast Topics Quickly?",
        description: "Focus only on what matters—high-yield Treasures deliver crisp, exam-relevant summary charts to boost recall and retention.",
        image: "/marketing/versionx_treasures.png",
        icon: Zap,
        color: "text-amber-500",
        bg: "bg-amber-500/10",
    },
    {
        title: "Losing Confidence Under Exam Pressure?",
        description: "Simulate the real exam with full-length mock tests, identify your weaknesses, and fine-tune your strategy with every attempt.",
        image: "/marketing/versionx_mock_tests.png",
        icon: BarChart3,
        color: "text-emerald-500",
        bg: "bg-emerald-500/10",
    },
    {
        title: "Can't Seem to Crack MCQs?",
        description: "Practice smarter with expert-curated MCQs and revise on the go with Audio QBank—available in both हिंglish and English.",
        image: "/marketing/versionx_audio_qbank.png",
        icon: Headphones,
        color: "text-purple-500",
        bg: "bg-purple-500/10",
    },
    {
        title: "IBQs Feel Unpredictable and Tricky?",
        description: "Master them with clinical visuals and real case-based illustrations that train your eye for every IBQ twist.",
        image: "/marketing/versionx_ibqs.png",
        icon: ImageIcon,
        color: "text-rose-500",
        bg: "bg-rose-500/10",
    },
    {
        title: "Unorganized Notes Making Your Revision Harder?",
        description: "Master topics faster with visually rich notes, smart flowcharts, tables, and illustrations that simplify even the trickiest concepts.",
        image: "/marketing/versionx_notes.png",
        icon: FileText,
        color: "text-cyan-500",
        bg: "bg-cyan-500/10",
    },
];

export default function VersionXSection() {
    const scrollRef = useRef<HTMLDivElement>(null);

    const handleScroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = current.clientWidth * 0.8;
            current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth"
            });
        }
    };

    return (
        <section className="py-24 relative overflow-hidden bg-slate-50/50 dark:bg-slate-900/50">
            {/* Background Decorations */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none -z-10">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium mb-4"
                    >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>The Ultimate PG Prep Transformation</span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight"
                    >
                        What’s Holding You Back in NEET PG Prep? <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Version X Fixed It</span>
                    </motion.h2>
                </div>

                <div className="relative group/container">
                    <button
                        onClick={() => handleScroll("left")}
                        className="absolute left-0 top-1/2 -translate-y-1/2 md:-translate-x-12 z-30 p-4 rounded-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-2xl opacity-0 group-hover/container:opacity-100 transition-all duration-300 hover:scale-110 active:scale-95 hidden md:flex items-center justify-center"
                        aria-label="Scroll Left"
                    >
                        <ArrowRight className="w-6 h-6 rotate-180" />
                    </button>
                    <button
                        onClick={() => handleScroll("right")}
                        className="absolute right-0 top-1/2 -translate-y-1/2 md:translate-x-12 z-30 p-4 rounded-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-2xl opacity-0 group-hover/container:opacity-100 transition-all duration-300 hover:scale-110 active:scale-95 hidden md:flex items-center justify-center"
                        aria-label="Scroll Right"
                    >
                        <ArrowRight className="w-6 h-6" />
                    </button>

                    <div 
                        ref={scrollRef}
                        className="flex gap-8 overflow-x-auto pb-12 snap-x snap-mandatory no-scrollbar scroll-smooth cursor-grab active:cursor-grabbing select-none"
                        onMouseDown={(e) => {
                            const el = scrollRef.current;
                            if (!el) return;
                            el.style.scrollBehavior = 'auto';
                            const startX = e.pageX - el.offsetLeft;
                            const scrollLeft = el.scrollLeft;
                            const handleMouseMove = (em: MouseEvent) => {
                                const x = em.pageX - el.offsetLeft;
                                const walk = (x - startX) * 2;
                                el.scrollLeft = scrollLeft - walk;
                            };
                            const handleMouseUp = () => {
                                el.style.scrollBehavior = 'smooth';
                                window.removeEventListener('mousemove', handleMouseMove);
                                window.removeEventListener('mouseup', handleMouseUp);
                            };
                            window.addEventListener('mousemove', handleMouseMove);
                            window.addEventListener('mouseup', handleMouseUp);
                        }}
                    >
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="flex-none w-[320px] md:w-[450px] snap-center py-4"
                            >
                                <div className="group/card relative h-full flex flex-col bg-white dark:bg-slate-950 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500">
                                    {/* Image Part */}
                                    <div className="relative aspect-[16/10] overflow-hidden">
                                        <Image
                                            src={feature.image}
                                            alt={feature.title}
                                            width={600}
                                            height={400}
                                            className="w-full h-full object-cover transform transition duration-700 group-hover/card:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />
                                        
                                        <div className={`absolute top-5 left-5 p-3 rounded-2xl backdrop-blur-md ${feature.bg} ${feature.color}`}>
                                            <feature.icon className="w-5 h-5" />
                                        </div>
                                    </div>

                                    {/* Content Part */}
                                    <div className="p-8 flex-1 flex flex-col space-y-4">
                                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">
                                            {feature.title}
                                        </h3>
                                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                                            {feature.description}
                                        </p>
                                        <div className="mt-auto pt-6 flex items-center justify-between border-t border-slate-200 dark:border-slate-900">
                                            <button className="flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-blue-400 group-hover/card:text-blue-500 transition-all duration-300">
                                                Explore details
                                                <Zap className="w-4 h-4 fill-current" />
                                            </button>
                                            <div className="text-xs font-bold text-slate-300 dark:text-slate-700 tracking-widest">
                                                0{index + 1}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Gradient Fades for Scroll context */}
                    <div className="absolute top-0 bottom-12 left-0 w-20 bg-gradient-to-r from-slate-50/80 dark:from-slate-900/80 to-transparent pointer-events-none z-10 hidden md:block" />
                    <div className="absolute top-0 bottom-12 right-0 w-20 bg-gradient-to-l from-slate-50/80 dark:from-slate-900/80 to-transparent pointer-events-none z-10 hidden md:block" />
                </div>
            </div>
            
            <style jsx global>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </section>
    );
}
