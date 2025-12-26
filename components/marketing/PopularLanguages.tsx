"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

const languages = [
    { name: "Finnish", code: "fi" },
    { name: "German", code: "de" },
    { name: "Hebrew", code: "il" },
    { name: "Italian", code: "it" },
    { name: "English", code: "gb" },
    { name: "Chinese", code: "cn" },
    { name: "Spanish", code: "es" },
    { name: "Hindi", code: "in" },
    { name: "Arabic", code: "sa" },
    { name: "Portuguese", code: "pt" },
    { name: "Russian", code: "ru" },
    { name: "French", code: "fr" },
];

export function PopularLanguages() {
    return (
        <section className="py-20 bg-white dark:bg-background border-t border-gray-100 dark:border-gray-800">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-[#011E21] dark:text-white mb-2">Popular languages</h2>
                    <div className="w-16 h-1 bg-primary mx-auto rounded-full opacity-0" /> {/* Spacer */}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ staggerChildren: 0.05 }}
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                >
                    {languages.map((lang, idx) => (
                        <motion.button
                            key={idx}
                            suppressHydrationWarning
                            variants={{
                                hidden: { opacity: 0, x: -20 },
                                visible: { opacity: 1, x: 0 }
                            }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="bg-white dark:bg-card border border-gray-100 dark:border-gray-800 rounded-full py-3 px-2 pl-3 flex items-center justify-between shadow-sm hover:shadow-md transition-all group hover:border-primary/30 dark:hover:border-primary/30"
                        >
                            <div className="flex items-center gap-4">
                                <div className="relative w-10 h-10 rounded-full overflow-hidden shadow-inner border border-gray-100 dark:border-gray-700">
                                    <Image
                                        src={`https://flagcdn.com/w80/${lang.code}.png`}
                                        alt={lang.name}
                                        fill
                                        className="object-cover"
                                    />
                                    {/* Glass sheen overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-tr from-black/10 to-transparent pointer-events-none" />
                                </div>
                                <span className="font-bold text-[#011E21] dark:text-gray-200 text-base">{lang.name}</span>
                            </div>
                            <div className="mr-2">
                                <ArrowRight className="w-5 h-5 text-gray-300 dark:text-gray-600 group-hover:text-primary transition-colors" />
                            </div>
                        </motion.button>
                    ))}
                </motion.div>

                <div className="text-center mt-12">
                    <button suppressHydrationWarning className="text-gray-600 dark:text-gray-400 font-semibold flex items-center gap-2 mx-auto hover:text-primary transition-colors group">
                        <span className="underline underline-offset-4 decoration-gray-300 dark:decoration-gray-700 group-hover:decoration-primary">Explore all languages</span>
                        <div className="w-8 h-8 rounded-full bg-gray-800 dark:bg-secondary text-white dark:text-secondary-foreground flex items-center justify-center group-hover:bg-primary transition-colors">
                            <ArrowRight className="w-4 h-4" />
                        </div>
                    </button>
                </div>
            </div>
        </section >
    );
}
