"use client";
import React from "react";
import { motion } from "motion/react";
import { TestimonialsColumn, Testimonial } from "./testimonials-columns-1";

interface TestimonialUserInfo {
    name: string | null;
    image: string | null;
    role: string | null;
}

interface ReviewWithUser {
    id: string;
    comment: string | null;
    rating: number;
    title: string | null; // Added title to interface
    reviewer: TestimonialUserInfo;
}

const defaultTestimonials = [
    {
        text: "This ERP revolutionized our operations, streamlining finance and inventory. The cloud-based platform keeps us productive, even remotely.",
        image: "https://randomuser.me/api/portraits/women/1.jpg",
        name: "Briana Patton",
        role: "Operations Manager",
    },
    {
        text: "Implementing this ERP was smooth and quick. The customizable, user-friendly interface made team training effortless.",
        image: "https://randomuser.me/api/portraits/men/2.jpg",
        name: "Bilal Ahmed",
        role: "IT Manager",
    },
    {
        text: "The support team is exceptional, guiding us through setup and providing ongoing assistance, ensuring our satisfaction.",
        image: "https://randomuser.me/api/portraits/women/3.jpg",
        name: "Saman Malik",
        role: "Customer Support Lead",
    },
    {
        text: "This ERP's seamless integration enhanced our business operations and efficiency. Highly recommend for its intuitive interface.",
        image: "https://randomuser.me/api/portraits/men/4.jpg",
        name: "Omar Raza",
        role: "CEO",
    },
    {
        text: "Its robust features and quick support have transformed our workflow, making us significantly more efficient.",
        image: "https://randomuser.me/api/portraits/women/5.jpg",
        name: "Zainab Hussain",
        role: "Project Manager",
    },
    {
        text: "The smooth implementation exceeded expectations. It streamlined processes, improving overall business performance.",
        image: "https://randomuser.me/api/portraits/women/6.jpg",
        name: "Aliza Khan",
        role: "Business Analyst",
    },
    {
        text: "Our business functions improved with a user-friendly design and positive customer feedback.",
        image: "https://randomuser.me/api/portraits/men/7.jpg",
        name: "Farhan Siddiqui",
        role: "Marketing Director",
    },
    {
        text: "They delivered a solution that exceeded expectations, understanding our needs and enhancing our operations.",
        image: "https://randomuser.me/api/portraits/women/8.jpg",
        name: "Sana Sheikh",
        role: "Sales Manager",
    },
    {
        text: "Using this ERP, our online presence and conversions significantly improved, boosting business performance.",
        image: "https://randomuser.me/api/portraits/men/9.jpg",
        name: "Hassan Ali",
        role: "E-commerce Manager",
    },
];

export function TestimonialsSection({ reviews = [] }: { reviews?: ReviewWithUser[] }) {
    // Map Real DB Reviews
    const realReviews: Testimonial[] = reviews.map(r => ({
        text: r.comment || "No comment provided.",
        image: r.reviewer.image || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + (r.reviewer.name || "User"),
        name: r.reviewer.name || "Anonymous",
        role: r.title || r.reviewer.role || "Student"
    }));

    // Combine Real + Default
    const formattedReviews: Testimonial[] = [...realReviews, ...defaultTestimonials];

    // Distribute reviews evenly across 3 columns
    const firstColCount = Math.ceil(formattedReviews.length / 3);
    const secondColCount = Math.ceil((formattedReviews.length - firstColCount) / 2);

    const firstColumn = formattedReviews.slice(0, firstColCount);
    const secondColumn = formattedReviews.slice(firstColCount, firstColCount + secondColCount);
    const thirdColumn = formattedReviews.slice(firstColCount + secondColCount);

    return (
        <section className="bg-background my-20 relative overflow-hidden">
            <div className="container z-10 mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center justify-center max-w-[540px] mx-auto mb-10"
                >
                    <div className="flex justify-center">
                        <div className="inline-block bg-primary/10 border border-primary/20 text-primary px-4 py-1.5 rounded-full text-sm font-semibold mb-6">Testimonials</div>
                    </div>

                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground text-center mb-6">
                        What our users say
                    </h2>
                    <p className="text-lg text-muted-foreground text-center">
                        See what our customers have to say about us.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)] max-h-[740px] overflow-hidden">
                    <TestimonialsColumn testimonials={firstColumn} duration={15} />
                    <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={19} />
                    <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={17} />
                </div>
            </div>
        </section>
    );
}

