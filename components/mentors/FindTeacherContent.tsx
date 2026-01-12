"use client";

import { MotionWrapper } from "@/components/ui/motion-wrapper";
import { MentorMatchWizard } from "@/components/marketing/MentorMatchWizard";
import { HorizontalTeacherCard } from "@/components/marketing/HorizontalTeacherCard";
import { ShieldCheck, Search, SlidersHorizontal, ChevronDown, X, ArrowUp, Filter, Star } from "lucide-react";


import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { TopicTicker } from "@/components/marketing/TopicTicker";
import { FeaturedMentorCarousel } from "@/components/marketing/FeaturedMentorCarousel";
import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import { FeaturedMentor } from "@/app/data/marketing/get-marketing-data";

export interface TeacherWithProfile {
    id: string;
    name: string;
    image: string;
    headline: string;
    rating: number;
    reviewCount: number;
    hourlyRate: number;
    teaches: string[];
    speaks: string[];
    description: string;
    country: string;
    isVerified: boolean;
}

interface FindTeacherContentProps {
    teachers: TeacherWithProfile[];
    featuredMentors: FeaturedMentor[];
}

export function FindTeacherContent({ teachers, featuredMentors }: FindTeacherContentProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
    const [selectedAvailability, setSelectedAvailability] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState<[number, number]>([500, 5000]);
    const [sortBy, setSortBy] = useState("popularity");
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    const languages = ["English", "Spanish", "French", "German", "Japanese"];
    const availabilityOptions = ["Instant Booking", "Free Trial", "Weekends"];

    // Filter and search logic
    const filteredTeachers = useMemo(() => {
        return teachers.filter(teacher => {
            // Search filter
            const matchesSearch = searchQuery === "" ||
                teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                teacher.headline.toLowerCase().includes(searchQuery.toLowerCase()) ||
                teacher.teaches.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

            // Language filter
            const matchesLanguage = selectedLanguages.length === 0 ||
                selectedLanguages.some(lang =>
                    teacher.speaks.some(s => s.toLowerCase().includes(lang.toLowerCase()))
                );

            // Price filter
            const matchesPrice = teacher.hourlyRate >= priceRange[0] && teacher.hourlyRate <= priceRange[1];

            return matchesSearch && matchesLanguage && matchesPrice;
        });
    }, [searchQuery, selectedLanguages, priceRange]);

    // Scroll detection
    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 400);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const toggleLanguage = (lang: string) => {
        setSelectedLanguages(prev =>
            prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang]
        );
    };

    const toggleAvailability = (opt: string) => {
        setSelectedAvailability(prev =>
            prev.includes(opt) ? prev.filter(o => o !== opt) : [...prev, opt]
        );
    };

    const clearAllFilters = () => {
        setSearchQuery("");
        setSelectedLanguages([]);
        setSelectedAvailability([]);
        setPriceRange([500, 5000]);
    };

    const activeFiltersCount = selectedLanguages.length + selectedAvailability.length;

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-[#0f172a] font-sans text-slate-900 dark:text-slate-50 pb-20">
            {/* Hero Section with Blue Theme */}
            <div className="bg-white dark:bg-[#1e293b] pt-32 pb-24 relative overflow-hidden transition-colors duration-300 ease-in-out border-b border-slate-200 dark:border-slate-800">
                {/* Subtle Grid Pattern */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none"></div>
                <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px)',
                    backgroundSize: '32px 32px'
                }}></div>

                {/* Blue Glow Effects */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>

                <div className="container mx-auto px-6 max-w-4xl relative z-10 text-center">

                    {/* Top Badge - Blue */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 dark:bg-blue-900/30 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-sm font-semibold mb-8 backdrop-blur-sm"
                    >
                        <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        Access Top 1% Global Talent
                    </motion.div>

                    {/* Main Title */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight leading-tight"
                    >
                        Find Your Perfect <br />
                        <span className="relative inline-block text-blue-600 dark:text-blue-400">
                            Mentor
                            <svg className="absolute w-full h-3 -bottom-1 left-0 text-blue-200 dark:text-blue-800 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="none" />
                            </svg>
                        </span>
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed"
                    >
                        Connect with industry experts from top companies for 1-on-1 guidance,
                        code reviews, and career advice.
                    </motion.p>

                    {/* Search Bar - Blue Accent */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="relative max-w-2xl mx-auto"
                    >
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full opacity-20 group-hover:opacity-40 blur transition duration-500"></div>
                            <div className="relative flex items-center bg-white dark:bg-[#0f172a] rounded-full border border-slate-200 dark:border-slate-700 shadow-xl dark:shadow-2xl shadow-blue-900/5 p-2 transition-all">
                                <Search className="w-6 h-6 text-slate-400 dark:text-slate-500 ml-4" />
                                <Input
                                    type="text"
                                    placeholder="Search by skill, company, or name..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="flex-1 bg-transparent border-none text-slate-900 dark:text-white placeholder:text-slate-400 text-base h-12 focus-visible:ring-0 focus-visible:ring-offset-0 px-4"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery("")}
                                        className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                )}
                                <Button className="h-12 px-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-base transition-all shadow-lg shadow-blue-600/20">
                                    Search
                                </Button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Trust Indicators */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="flex flex-wrap items-center justify-center gap-8 mt-12 text-sm font-medium text-slate-500 dark:text-slate-400"
                    >
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-500" />
                            Verified Experts
                        </div>
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-500" />
                            Secure Payments
                        </div>
                        <div className="flex items-center gap-2">
                            <Star className="w-5 h-5 text-blue-500 fill-blue-500 dark:text-blue-400 dark:fill-blue-400" />
                            4.9/5 Average Rating
                        </div>
                    </motion.div>

                    {/* Active Filter Chips */}
                    <AnimatePresence>
                        {(activeFiltersCount > 0 || searchQuery) && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-8 flex flex-wrap items-center justify-center gap-2"
                            >
                                <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 mr-2">Active Filters:</span>
                                {selectedLanguages.map(lang => (
                                    <Badge
                                        key={lang}
                                        variant="secondary"
                                        className="bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-800 hover:bg-blue-200 cursor-pointer gap-1 pl-3 pr-2 py-1.5"
                                        onClick={() => toggleLanguage(lang)}
                                    >
                                        {lang}
                                        <X className="h-3 w-3" />
                                    </Badge>
                                ))}
                                {activeFiltersCount > 0 && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={clearAllFilters}
                                        className="text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20"
                                    >
                                        Clear All
                                    </Button>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Trending Ticker - Kept as is or simplified coloring */}
            <TopicTicker />

            <div className="container mx-auto px-6 max-w-7xl py-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Sidebar Filters */}
                    <div className="lg:col-span-3 hidden lg:block space-y-6">
                        <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 sticky top-24 shadow-sm">
                            <div className="mb-8">
                                <MentorMatchWizard />
                            </div>

                            {/* Featured Carousel in Sidebar */}
                            <div className="mb-6 pb-6 border-b border-slate-100 dark:border-slate-800">
                                <FeaturedMentorCarousel mentors={featuredMentors} />
                            </div>

                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-bold text-lg text-slate-800 dark:text-white flex items-center gap-2">
                                    <SlidersHorizontal className="w-5 h-5 text-blue-600" /> Filters
                                </h3>
                                {activeFiltersCount > 0 && (
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={clearAllFilters}
                                        className="text-xs font-semibold text-blue-600 hover:underline"
                                    >
                                        Reset ({activeFiltersCount})
                                    </motion.button>
                                )}
                            </div>

                            {/* Filter Groups */}
                            <div className="space-y-6">
                                {/* Languages */}
                                <div className="space-y-3">
                                    <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                                        Spoken Language <ChevronDown className="w-4 h-4 text-slate-400" />
                                    </h4>
                                    <div className="space-y-2">
                                        {languages.map(lang => (
                                            <motion.div
                                                key={lang}
                                                className="flex items-center space-x-2"
                                                whileHover={{ x: 2 }}
                                            >
                                                <Checkbox
                                                    id={lang}
                                                    checked={selectedLanguages.includes(lang)}
                                                    onCheckedChange={() => toggleLanguage(lang)}
                                                    className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                                                />
                                                <Label
                                                    htmlFor={lang}
                                                    className="text-sm font-normal text-slate-600 dark:text-slate-400 cursor-pointer"
                                                >
                                                    {lang}
                                                </Label>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                                <div className="h-px bg-slate-100 dark:bg-slate-800" />

                                {/* Price Range */}
                                <div className="space-y-3">
                                    <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                                        Hourly Rate <ChevronDown className="w-4 h-4 text-slate-400" />
                                    </h4>
                                    <div className="flex items-center gap-2">
                                        <div className="bg-slate-50 dark:bg-slate-800 p-2 rounded-lg text-sm flex-1 text-center font-medium">₹{priceRange[0]}</div>
                                        <span className="text-slate-400">-</span>
                                        <div className="bg-slate-50 dark:bg-slate-800 p-2 rounded-lg text-sm flex-1 text-center font-medium">₹{priceRange[1]}+</div>
                                    </div>
                                </div>

                                <div className="h-px bg-slate-100 dark:bg-slate-800" />

                                {/* Availability */}
                                <div className="space-y-3">
                                    <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                                        Availability <ChevronDown className="w-4 h-4 text-slate-400" />
                                    </h4>
                                    <div className="space-y-2">
                                        {availabilityOptions.map(opt => (
                                            <motion.div
                                                key={opt}
                                                className="flex items-center space-x-2"
                                                whileHover={{ x: 2 }}
                                            >
                                                <Checkbox
                                                    id={opt}
                                                    checked={selectedAvailability.includes(opt)}
                                                    onCheckedChange={() => toggleAvailability(opt)}
                                                    className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                                                />
                                                <Label
                                                    htmlFor={opt}
                                                    className="text-sm font-normal text-slate-600 dark:text-slate-400 cursor-pointer"
                                                >
                                                    {opt}
                                                </Label>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content: Teacher Lists */}
                    <div className="lg:col-span-9 space-y-6">
                        {/* Mobile Filter Button */}
                        <div className="lg:hidden">
                            <Button
                                onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                                variant="outline"
                                className="w-full justify-between bg-white dark:bg-[#1e293b]"
                            >
                                <span className="flex items-center gap-2">
                                    <Filter className="h-4 w-4" />
                                    Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
                                </span>
                                <ChevronDown className={`h-4 w-4 transition-transform ${mobileFiltersOpen ? 'rotate-180' : ''}`} />
                            </Button>
                        </div>

                        {/* Sort Bar */}
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#1e293b] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm"
                        >
                            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                                Showing <span className="text-slate-900 dark:text-white font-bold">1 - {filteredTeachers.length}</span> of {filteredTeachers.length} Professional Mentors
                            </p>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-slate-500">Sort By:</span>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="bg-slate-50 dark:bg-slate-800 border-none text-sm font-semibold rounded-lg px-3 py-1.5 focus:ring-1 focus:ring-blue-600"
                                >
                                    <option value="popularity">Popularity</option>
                                    <option value="newest">Newest</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="rating">Rating: High to Low</option>
                                </select>
                            </div>
                        </motion.div>

                        {/* List */}
                        <AnimatePresence mode="popLayout">
                            {filteredTeachers.length > 0 ? (
                                <div className="flex flex-col gap-6">
                                    {filteredTeachers.map((teacher, index) => (
                                        <motion.div
                                            key={teacher.id}
                                            layout
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ delay: index * 0.05 }}
                                        >
                                            <HorizontalTeacherCard teacher={teacher} />
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-center py-20"
                                >
                                    <div className="text-6xl mb-4">🔍</div>
                                    <h3 className="text-2xl font-bold mb-2">No mentors found</h3>
                                    <p className="text-slate-500 mb-4">Try adjusting your filters or search query</p>
                                    <Button onClick={clearAllFilters} variant="outline">
                                        Clear All Filters
                                    </Button>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Pagination Visual */}
                        {filteredTeachers.length > 0 && (
                            <div className="flex justify-center mt-12 gap-2">
                                <Button variant="outline" size="icon" disabled>{'<'}</Button>
                                <Button variant="default" size="icon" className="bg-blue-600 hover:bg-blue-700 text-white">1</Button>
                                <Button variant="outline" size="icon">2</Button>
                                <Button variant="outline" size="icon">3</Button>
                                <Button variant="ghost" size="icon">...</Button>
                                <Button variant="outline" size="icon">{'>'}</Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Scroll to Top Button */}
            <AnimatePresence>
                {showScrollTop && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        onClick={scrollToTop}
                        className="fixed bottom-8 right-8 p-4 bg-blue-600 text-white rounded-full shadow-2xl hover:shadow-3xl hover:bg-blue-700 hover:scale-110 transition-all z-50"
                    >
                        <ArrowUp className="h-6 w-6" />
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
}
