"use client";

import { motion, Variants, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { Button, type ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import React, { useEffect, useRef } from 'react';
import Link from 'next/link';

// Define the props for reusability
interface StatProps {
    value: string;
    label: string;
    icon: React.ReactNode;
}

interface ActionProps {
    text: string;
    href: string;
    variant?: ButtonProps['variant'];
    className?: string;
}

interface HeroSectionProps {
    title: React.ReactNode;
    subtitle: string;
    actions: ActionProps[];
    stats: StatProps[];
    images: string[];
    className?: string;
}

// Animation variants
const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1
        },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20, filter: "blur(5px)" },
    visible: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: {
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1]
        },
    },
};

const HeroSection = ({ title, subtitle, actions, stats, images, className }: HeroSectionProps) => {
    // Parallax & Mouse Move Interaction
    const ref = useRef<HTMLDivElement>(null);
    const { scrollY } = useScroll();

    // Mouse movement values
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth physics for mouse movement
    const springConfig = { damping: 25, stiffness: 150 };
    const springX = useSpring(mouseX, springConfig);
    const springY = useSpring(mouseY, springConfig);

    // Transform mouse values for different layers (Parallax)
    const moveX1 = useTransform(springX, [-0.5, 0.5], [-15, 15]);
    const moveY1 = useTransform(springY, [-0.5, 0.5], [-15, 15]);

    const moveX2 = useTransform(springX, [-0.5, 0.5], [10, -10]);
    const moveY2 = useTransform(springY, [-0.5, 0.5], [10, -10]);

    const moveX3 = useTransform(springX, [-0.5, 0.5], [-25, 25]);
    const moveY3 = useTransform(springY, [-0.5, 0.5], [-25, 25]);

    // Scroll opacity fade
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);

    const handleMouseMove = (e: React.MouseEvent) => {
        const { clientX, clientY, currentTarget } = e;
        const { width, height, left, top } = currentTarget.getBoundingClientRect();

        // Calculate normalized position (-0.5 to 0.5)
        const x = (clientX - left) / width - 0.5;
        const y = (clientY - top) / height - 0.5;

        mouseX.set(x);
        mouseY.set(y);
    };

    return (
        <section
            ref={ref}
            onMouseMove={handleMouseMove}
            className={cn('w-full relative overflow-hidden bg-background py-10 sm:py-20 perspective-[1000px]', className)} // Reduced padding
        >
            {/* Ambient Background Glows */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <motion.div
                    className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-primary/10 blur-[100px]" // Smaller glow
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] rounded-full bg-indigo-500/10 blur-[80px]" // Smaller glow
                    animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                />
            </div>

            <div className="container relative z-10 mx-auto grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12 px-4 md:px-6"> {/* Adjusted grid gap */}
                {/* Left Column: Text Content */}
                <motion.div
                    className="flex flex-col items-center text-center lg:items-start lg:text-left"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    style={{ opacity }}
                >
                    <motion.div variants={itemVariants} className="mb-4 inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
                        <span className="flex h-1.5 w-1.5 rounded-full bg-primary mr-2 animate-pulse"></span>
                        New v2.0 is Live
                    </motion.div>

                    <motion.h1
                        className="text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl leading-[1.1] max-w-[95%]" // Reduced font size
                        variants={itemVariants}
                    >
                        {/* We can enhance the title prop rendering here, but for now passing it through */}
                        {/* To add specific effects, we'd need to parse the ReactNode which is complex. */}
                        {/* Assuming the user passes formatted components */}
                        {title}
                    </motion.h1>

                    <motion.p className="mt-4 max-w-lg text-lg text-muted-foreground leading-relaxed" variants={itemVariants}> {/* Reduced top margin */}
                        {subtitle}
                    </motion.p>

                    <motion.div className="mt-8 flex flex-wrap justify-center gap-4 lg:justify-start" variants={itemVariants}>
                        {actions.map((action, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Button asChild variant={action.variant} size="lg" className={`rounded-full px-6 text-base h-12 ${action.className}`}>
                                    <Link href={action.href}>
                                        {action.text}
                                    </Link>
                                </Button>
                            </motion.div>
                        ))}
                    </motion.div>

                    <motion.div
                        className="mt-10 flex flex-wrap justify-center gap-8 lg:justify-start border-t border-border/50 pt-6" // Reduced margin and padding
                        variants={itemVariants}
                    >
                        {stats.map((stat, index) => (
                            <div key={index} className="flex items-center gap-3 group cursor-default">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                                    {stat.icon}
                                </div>
                                <div className="text-left">
                                    <p className="text-xl font-bold text-foreground leading-none mb-0.5">{stat.value}</p>
                                    <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </motion.div>

                {/* Right Column: 3D Parallax Image Collage */}
                <motion.div
                    className="relative h-[400px] w-full sm:h-[500px] perspective-[2000px] mt-8 lg:mt-0" // Adjusted height and margin
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    style={{ opacity }}
                >
                    {/* 
                       Logic: We apply different parallax values (moveX/moveY) to different elements 
                       to create a sense of depth as the mouse moves.
                   */}

                    {/* Background Decorative Shapes - Furthest Depth */}
                    <motion.div
                        className="absolute top-10 left-10 h-20 w-20 rounded-full bg-blue-400/20 blur-xl"
                        style={{ x: moveX1, y: moveY1 }}
                    />
                    <motion.div
                        className="absolute bottom-20 right-10 h-28 w-28 rounded-full bg-purple-400/20 blur-xl"
                        style={{ x: moveX2, y: moveY2 }}
                    />

                    {/* Main Images - Mid Depth */}
                    <motion.div
                        className="absolute left-1/2 top-4 h-56 w-56 -translate-x-1/2 rounded-3xl bg-white p-2 shadow-2xl shadow-indigo-500/10 sm:h-72 sm:w-72 z-20" // Reduced size
                        initial={{ opacity: 0, y: 50, rotate: -5 }}
                        animate={{ opacity: 1, y: 0, rotate: -3 }}
                        style={{
                            x: moveX3,
                            y: moveY3,
                            rotate: -3
                        }}
                        transition={{ duration: 1, delay: 0.2 }}
                        whileHover={{ scale: 1.02, rotate: 0, zIndex: 50 }}
                    >
                        <img src={images[0]} alt="Hero 1" className="h-full w-full rounded-2xl object-cover shadow-sm" />

                        {/* Floating Badge on Image */}
                        <div className="absolute -right-6 top-10 bg-white rounded-xl shadow-lg p-2 flex items-center gap-2 animate-bounce-slow">
                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase">Success</p>
                                <p className="text-sm font-bold text-gray-900">98%</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Secondary Images - Closer Depth */}
                    <motion.div
                        className="absolute right-4 top-1/3 h-40 w-40 rounded-3xl bg-white p-2 shadow-xl sm:h-56 sm:w-56 z-10" // Reduced size
                        initial={{ opacity: 0, x: 50, rotate: 5 }}
                        animate={{ opacity: 1, x: 0, rotate: 6 }}
                        style={{
                            x: moveX2,
                            y: moveY2,
                            rotate: 6
                        }}
                        transition={{ duration: 1, delay: 0.4 }}
                        whileHover={{ scale: 1.05, rotate: 0, zIndex: 50 }}
                    >
                        <img src={images[1]} alt="Hero 2" className="h-full w-full rounded-2xl object-cover shadow-sm" />
                    </motion.div>

                    <motion.div
                        className="absolute bottom-8 left-4 h-32 w-32 rounded-3xl bg-white p-2 shadow-xl sm:h-48 sm:w-48 z-30" // Reduced size
                        initial={{ opacity: 0, y: 50, rotate: -10 }}
                        animate={{ opacity: 1, y: 0, rotate: -6 }}
                        style={{
                            x: moveX1,
                            y: moveY1,
                            rotate: -6
                        }}
                        transition={{ duration: 1, delay: 0.6 }}
                        whileHover={{ scale: 1.05, rotate: 0, zIndex: 50 }}
                    >
                        <img src={images[2]} alt="Hero 3" className="h-full w-full rounded-2xl object-cover shadow-sm" />
                        {/* Floating Badge on Image */}
                        <div className="absolute -left-4 -bottom-4 bg-white rounded-xl shadow-lg p-2.5 flex items-center gap-3">
                            <div className="flex -space-x-2">
                                <div className="w-6 h-6 rounded-full border-2 border-white bg-gray-200" />
                                <div className="w-6 h-6 rounded-full border-2 border-white bg-gray-300" />
                                <div className="w-6 h-6 rounded-full border-2 border-white bg-gray-400" />
                            </div>
                            <p className="text-[10px] font-bold text-gray-600">1k+ Joined</p>
                        </div>
                    </motion.div>

                </motion.div>
            </div>
        </section>
    );
};

export default HeroSection;
