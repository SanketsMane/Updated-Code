"use client";

import { useEffect, useState } from "react";
import {
    Carousel,
    CarouselApi,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import { User, Quote } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
    {
        name: "Sarah Johnson",
        role: "Marketing Director",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop",
        title: "Incredible Learning Experience",
        quote: "The courses here are top-notch. I've learned so much in such a short time. The instructors are experts in their fields.",
    },
    {
        name: "Michael Chen",
        role: "Software Engineer",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop",
        title: "Career Transforming",
        quote: "Thanks to the coding bootcamps, I was able to switch careers and land my dream job. Highly recommended!",
    },
    {
        name: "Emily Davis",
        role: "Graphic Designer",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop",
        title: "Creative and Inspiring",
        quote: "The design courses gave me the confidence to start my own freelance business. The community support is amazing.",
    },
    {
        name: "David Wilson",
        role: "Project Manager",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1887&auto=format&fit=crop",
        title: "Practical Skills",
        quote: "I use the skills I learned here every day in my job. The practical approach to learning is what sets this platform apart.",
    },
    {
        name: "Lisa Brown",
        role: "Entrepreneur",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1888&auto=format&fit=crop",
        title: "Best Investment",
        quote: "Investing in these courses was the best decision for my business. The ROI has been incredible.",
    },
    {
        name: "James Lee",
        role: "Data Analyst",
        avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1887&auto=format&fit=crop",
        title: "Comprehensive Content",
        quote: "The data science track is very comprehensive. It covers everything from basics to advanced topics accurately.",
    }
];

function Testimonials() {
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        if (!api) {
            return;
        }

        setTimeout(() => {
            if (api.selectedScrollSnap() + 1 === api.scrollSnapList().length) {
                setCurrent(0);
                api.scrollTo(0);
            } else {
                api.scrollNext();
                setCurrent(current + 1);
            }
        }, 4000);
    }, [api, current]);

    return (
        <div className="w-full py-20 lg:py-40 bg-gray-50 dark:bg-black/5 border-t border-gray-100 dark:border-gray-800">
            <div className="container mx-auto px-4">
                <div className="flex flex-col gap-10">
                    <div className="text-left max-w-2xl">
                        <h2 className="text-3xl md:text-5xl tracking-tighter font-bold text-[#011E21] dark:text-white mb-4">
                            Trusted by thousands of learners worldwide
                        </h2>
                        <p className="text-muted-foreground text-lg">
                            Join our community of lifelong learners who are achieving their goals.
                        </p>
                    </div>

                    <Carousel setApi={setApi} className="w-full">
                        <CarouselContent>
                            {testimonials.map((testimonial, index) => (
                                <CarouselItem className="md:basis-1/2 lg:basis-1/3" key={index}>
                                    <div className="bg-white dark:bg-card border border-gray-100 dark:border-gray-800 rounded-2xl h-full p-8 flex justify-between flex-col shadow-sm hover:shadow-md transition-shadow">
                                        <Quote className="w-10 h-10 text-primary/20 mb-6" />
                                        <div className="flex flex-col gap-4">
                                            <div className="flex flex-col">
                                                <h3 className="text-xl font-bold text-[#011E21] dark:text-white tracking-tight mb-2">
                                                    {testimonial.title}
                                                </h3>
                                                <p className="text-muted-foreground text-base leading-relaxed">
                                                    "{testimonial.quote}"
                                                </p>
                                            </div>
                                            <div className="flex flex-row gap-3 items-center mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                                                <Avatar className="h-10 w-10 border border-gray-200 dark:border-gray-700">
                                                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} className="object-cover" />
                                                    <AvatarFallback>{testimonial.name.slice(0, 2)}</AvatarFallback>
                                                </Avatar>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-semibold text-[#011E21] dark:text-white">{testimonial.name}</span>
                                                    <span className="text-xs text-muted-foreground">{testimonial.role}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>
                </div>
            </div>
        </div>
    );
}

export { Testimonials };
