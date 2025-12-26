"use client";

import { motion } from "framer-motion";
import { Star, Clock, BookOpen, ChevronRight, ChevronLeft } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const categories = [
    "Business Development",
    "Finance & Accounting",
    "Teaching & Academics",
    "Software Development",
    "Marketing",
    "IT & Softwares"
];

const courses = [
    {
        title: "Microsoft Power BI Desktop for Business Intelligence",
        rating: 0.0,
        reviews: 0,
        duration: "13h 45m",
        lectures: "122 Lectures",
        price: 990.00,
        instructor: { name: "Mack Tremblay", avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
        image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1000&auto=format&fit=crop"
    },
    {
        title: "An Entire MBA in 1 Course: Award Winning...",
        rating: 5.0,
        reviews: 1,
        duration: "10h 41m",
        lectures: "99 Lectures",
        price: 803.00,
        instructor: { name: "Devin Abernathy", avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1000&auto=format&fit=crop"
    },
    {
        title: "Become a Product Manager | Learn the Skills & Get the Job",
        rating: 0.0,
        reviews: 0,
        duration: "18h 51m",
        lectures: "164 Lectures",
        price: 636.00,
        instructor: { name: "Ariel Bednar", avatar: "https://randomuser.me/api/portraits/men/85.jpg" },
        image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1000&auto=format&fit=crop"
    },
    {
        title: "Design Thinking for Beginners: Develop Innovative Ideas",
        rating: 0.0,
        reviews: 0,
        duration: "4h 11m",
        lectures: "38 Lectures",
        price: 539.00,
        instructor: { name: "Marlene Reilly", avatar: "https://randomuser.me/api/portraits/women/65.jpg" },
        image: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=1000&auto=format&fit=crop"
    }
];

export function FeaturedCourses() {
    const [activeTab, setActiveTab] = useState(categories[0]);

    return (
        <section className="py-24 bg-gray-50/50 dark:bg-background border-t border-gray-100 dark:border-gray-800">
            <div className="container mx-auto px-4">
                <div className="text-center mb-10">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#011E21] dark:text-white mb-8">
                        The world's best online courses at one place
                    </h2>

                    {/* Tabs */}
                    <div className="flex flex-wrap justify-center gap-3 mb-12">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                suppressHydrationWarning
                                onClick={() => setActiveTab(cat)}
                                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${activeTab === cat
                                    ? "bg-[#333] dark:bg-primary text-white shadow-lg"
                                    : "bg-gray-100 dark:bg-card dark:text-gray-300 text-gray-600 hover:bg-white dark:hover:bg-gray-800 hover:shadow-md"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid */}
                <div className="relative">
                    {/* Arrow Buttons (Visual only for now) - Update to transparent/dark compatible */}
                    <button suppressHydrationWarning className="absolute left-[-20px] top-1/2 -translate-y-1/2 w-10 h-10 bg-white dark:bg-card border border-gray-100 dark:border-gray-800 rounded-full shadow-lg flex items-center justify-center z-10 hover:scale-110 transition-transform hidden lg:flex">
                        <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    </button>
                    <button suppressHydrationWarning className="absolute right-[-20px] top-1/2 -translate-y-1/2 w-10 h-10 bg-[#4FB5C6] rounded-full shadow-lg flex items-center justify-center z-10 hover:scale-110 transition-transform hidden lg:flex">
                        <ChevronRight className="w-5 h-5 text-white" />
                    </button>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {courses.map((course, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                                className="bg-white dark:bg-card rounded-[2rem] p-4 shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-all group"
                            >
                                {/* Image */}
                                <div className="relative aspect-[16/10] rounded-[1.5rem] overflow-hidden mb-4">
                                    <Image
                                        src={course.image}
                                        alt={course.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    {/* Overlay Gradient */}
                                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/40 to-transparent opacity-60" />
                                </div>

                                {/* Content */}
                                <div className="px-1 space-y-3">
                                    <div className="flex items-center gap-1 text-blue-400 text-xs font-bold">
                                        <Star className="w-3.5 h-3.5 fill-current" />
                                        <span>{course.rating.toFixed(2)}</span>
                                        <span className="text-gray-400 font-normal">({course.reviews})</span>
                                    </div>

                                    <h3 className="font-bold text-[#011E21] dark:text-white text-lg leading-snug line-clamp-2 h-[3.2em]">
                                        {course.title}
                                    </h3>

                                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 font-medium">
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="w-4 h-4" />
                                            {course.duration}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <BookOpen className="w-4 h-4" />
                                            {course.lectures}
                                        </div>
                                    </div>

                                    <div className="pt-3 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between">
                                        <span className="text-xl font-bold text-[#011E21] dark:text-white">
                                            ₹{course.price.toLocaleString('en-IN')}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2 pt-1">
                                        <div className="relative w-8 h-8 rounded-full overflow-hidden border border-gray-100 dark:border-gray-700">
                                            <Image src={course.instructor.avatar} alt={course.instructor.name} fill className="object-cover" />
                                        </div>
                                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                            {course.instructor.name}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <div className="text-center mt-12">
                    <button suppressHydrationWarning className="bg-[#4FB5C6] hover:bg-[#3da3b4] text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-cyan-200/50 transition-all hover:scale-105">
                        View All Courses
                    </button>
                </div>
            </div>
        </section>
    );
}
