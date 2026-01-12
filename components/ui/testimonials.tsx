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

import { FeaturedReview } from "@/app/data/marketing/get-marketing-data";

interface TestimonialsProps {
    reviews: FeaturedReview[];
}

function Testimonials({ reviews }: TestimonialsProps) {
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

    // Fallback if no reviews
    if (!reviews || reviews.length === 0) return null;

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
                            {reviews.map((testimonial, index) => (
                                <CarouselItem className="md:basis-1/2 lg:basis-1/3" key={index}>
                                    <div className="bg-white dark:bg-card border border-gray-100 dark:border-gray-800 rounded-2xl h-full p-8 flex justify-between flex-col shadow-sm hover:shadow-md transition-shadow">
                                        <Quote className="w-10 h-10 text-primary/20 mb-6" />
                                        <div className="flex flex-col gap-4">
                                            <div className="flex flex-col">
                                                <h3 className="text-xl font-bold text-[#011E21] dark:text-white tracking-tight mb-2">
                                                    {testimonial.title}
                                                </h3>
                                                <p className="text-muted-foreground text-base leading-relaxed">
                                                    "{testimonial.comment}"
                                                </p>
                                            </div>
                                            <div className="flex flex-row gap-3 items-center mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                                                <Avatar className="h-10 w-10 border border-gray-200 dark:border-gray-700">
                                                    <AvatarImage src={testimonial.reviewerImage} alt={testimonial.reviewerName} className="object-cover" />
                                                    <AvatarFallback>{testimonial.reviewerName.slice(0, 2)}</AvatarFallback>
                                                </Avatar>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-semibold text-[#011E21] dark:text-white">{testimonial.reviewerName}</span>
                                                    <span className="text-xs text-muted-foreground">{testimonial.reviewerRole}</span>
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
