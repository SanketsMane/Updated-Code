"use client";

import React from 'react';
import { motion } from "framer-motion";

// --- Types ---
interface Testimonial {
    text: string;
    image: string;
    name: string;
    role: string;
}

// --- Data ---
const testimonials: Testimonial[] = [
    {
        text: "Learning Python on Kidokool has been amazing. The 1-on-1 attention from my tutor helped me land my first internship!",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150&h=150&fit=crop",
        name: "Priya Sharma",
        role: "Student",
    },
    {
        text: "As an instructor, the platform tools are top-notch. Managing classes and payments has never been easier.",
        image: "https://images.unsplash.com/photo-1566492031776-63065f0ad4c6?q=80&w=150&h=150&fit=crop",
        name: "Rajesh Kumar",
        role: "Mathematics Tutor",
    },
    {
        text: "I found the perfect Math tutor for my son within minutes. His grades have improved significantly in just two months.",
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&h=150&fit=crop",
        name: "Meera Reddy",
        role: "Parent",
    },
    {
        text: "The interactive live sessions make complex topics easy to understand. Highly recommend for any student!",
        image: "https://images.unsplash.com/photo-1507537297725-24a1c434b6b8?q=80&w=150&h=150&fit=crop",
        name: "Arjun Patel",
        role: "Grade 10 Student",
    },
    {
        text: "Kidokool gave me the flexibility to teach from home and connect with students globally. It's a game changer.",
        image: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?q=80&w=150&h=150&fit=crop",
        name: "Anjali Gupta",
        role: "Senior Tutor",
    },
    {
        text: "The platform is incredibly user-friendly. I was able to start my learning journey without any technical hassle.",
        image: "https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=150&h=150&fit=crop",
        name: "Vikram Singh",
        role: "Lifelong Learner",
    },
    {
        text: "Great community and resources. I've learned so much more here than in my college classes.",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150",
        name: "Sana Khan",
        role: "Design Student",
    },
    {
        text: "Teaching here has been a fulfilling experience. The students are eager and the support team is great.",
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150&h=150",
        name: "Amit Verma",
        role: "Physics Tutor",
    },
    {
        text: "Best investment for my child's education. The progress tracking specifically helps me stay updated.",
        image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150&h=150",
        name: "Neha Kapoor",
        role: "Parent",
    }
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

// --- Sub-Components ---
const TestimonialsColumn = (props: {
    className?: string;
    testimonials: Testimonial[];
    duration?: number;
}) => {
    return (
        <div className={props.className}>
            <motion.ul
                animate={{
                    translateY: "-50%",
                }}
                transition={{
                    duration: props.duration || 10,
                    repeat: Infinity,
                    ease: "linear",
                    repeatType: "loop",
                }}
                className="flex flex-col gap-6 pb-6 bg-transparent transition-colors duration-300 list-none m-0 p-0"
            >
                {[
                    ...new Array(2).fill(0).map((_, index) => (
                        <React.Fragment key={index}>
                            {props.testimonials.map(({ text, image, name, role }, i) => (
                                <motion.li
                                    key={`${index}-${i}`}
                                    aria-hidden={index === 1 ? "true" : "false"}
                                    tabIndex={index === 1 ? -1 : 0}
                                    whileHover={{
                                        scale: 1.03,
                                        y: -8,
                                        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.12), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(0, 0, 0, 0.05)",
                                        transition: { type: "spring", stiffness: 400, damping: 17 }
                                    }}
                                    whileFocus={{
                                        scale: 1.03,
                                        y: -8,
                                        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.12), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(0, 0, 0, 0.05)",
                                        transition: { type: "spring", stiffness: 400, damping: 17 }
                                    }}
                                    className="p-10 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-lg shadow-black/5 max-w-xs w-full bg-white dark:bg-neutral-900 transition-all duration-300 cursor-default select-none group focus:outline-none focus:ring-2 focus:ring-primary/30"
                                >
                                    <blockquote className="m-0 p-0">
                                        <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed font-normal m-0 transition-colors duration-300">
                                            {text}
                                        </p>
                                        <footer className="flex items-center gap-3 mt-6">
                                            <img
                                                width={40}
                                                height={40}
                                                src={image}
                                                alt={`Avatar of ${name}`}
                                                className="h-10 w-10 rounded-full object-cover ring-2 ring-neutral-100 dark:ring-neutral-800 group-hover:ring-primary/30 transition-all duration-300 ease-in-out"
                                            />
                                            <div className="flex flex-col">
                                                <cite className="font-semibold not-italic tracking-tight leading-5 text-neutral-900 dark:text-white transition-colors duration-300">
                                                    {name}
                                                </cite>
                                                <span className="text-sm leading-5 tracking-tight text-neutral-500 dark:text-neutral-500 mt-0.5 transition-colors duration-300">
                                                    {role}
                                                </span>
                                            </div>
                                        </footer>
                                    </blockquote>
                                </motion.li>
                            ))}
                        </React.Fragment>
                    )),
                ]}
            </motion.ul>
        </div>
    );
};

export const TestimonialsSectionV2 = () => {
    return (
        <section
            aria-labelledby="testimonials-heading"
            className="bg-transparent py-24 relative overflow-hidden"
        >
            <motion.div
                initial={{ opacity: 0, y: 50, rotate: -2 }}
                whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                    duration: 1.2,
                    ease: [0.16, 1, 0.3, 1],
                    opacity: { duration: 0.8 }
                }}
                className="container px-4 z-10 mx-auto"
            >
                <div className="flex flex-col items-center justify-center max-w-[540px] mx-auto mb-16">
                    <div className="flex justify-center">
                        <div className="border border-neutral-300 dark:border-neutral-700 py-1 px-4 rounded-full text-xs font-semibold tracking-wide uppercase text-neutral-600 dark:text-neutral-400 bg-neutral-100/50 dark:bg-neutral-800/50 transition-colors">
                            Testimonials
                        </div>
                    </div>

                    <h2 id="testimonials-heading" className="text-4xl md:text-5xl font-extrabold tracking-tight mt-6 text-center text-neutral-900 dark:text-white transition-colors">
                        What our users say
                    </h2>
                    <p className="text-center mt-5 text-neutral-500 dark:text-neutral-400 text-lg leading-relaxed max-w-sm transition-colors">
                        Discover how thousands of learners and tutors transform their lives with Kidokool.
                    </p>
                </div>

                <div
                    className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)] max-h-[740px] overflow-hidden"
                    role="region"
                    aria-label="Scrolling Testimonials"
                >
                    <TestimonialsColumn testimonials={firstColumn} duration={15} />
                    <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={19} />
                    <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={17} />
                </div>
            </motion.div>
        </section>
    );
};
