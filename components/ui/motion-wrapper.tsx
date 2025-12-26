"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

type MotionWrapperProps = {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    duration?: number;
    variant?: "fadeIn" | "slideUp" | "scale" | "left" | "right";
    viewport?: boolean;
};

export const MotionWrapper = ({
    children,
    className,
    delay = 0,
    duration = 0.5,
    variant = "slideUp",
    viewport = true,
}: MotionWrapperProps) => {
    const variants = {
        fadeIn: {
            hidden: { opacity: 0 },
            visible: { opacity: 1 },
        },
        slideUp: {
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
        },
        scale: {
            hidden: { opacity: 0, scale: 0.95 },
            visible: { opacity: 1, scale: 1 },
        },
        left: {
            hidden: { opacity: 0, x: -30 },
            visible: { opacity: 1, x: 0 },
        },
        right: {
            hidden: { opacity: 0, x: 30 },
            visible: { opacity: 1, x: 0 },
        },
    };

    return (
        <motion.div
            initial="hidden"
            whileInView={viewport ? "visible" : undefined}
            animate={!viewport ? "visible" : undefined}
            viewport={viewport ? { once: true, margin: "-100px" } : undefined}
            variants={variants[variant]}
            transition={{ duration, delay, ease: "easeOut" }}
            className={cn(className)}
        >
            {children}
        </motion.div>
    );
};

export const StaggerContainer = ({
    children,
    className,
    delay = 0,
}: { children: React.ReactNode; className?: string; delay?: number }) => {
    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
                visible: {
                    transition: {
                        staggerChildren: 0.1,
                        delayChildren: delay,
                    },
                },
            }}
            className={cn(className)}
        >
            {children}
        </motion.div>
    );
};
