import { Marquee } from "./marquee";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface Logo {
    id: string;
    description: string;
    image: string;
    className?: string;
}

interface Logos3Props {
    heading?: string;
    logos?: Logo[];
    className?: string;
}

const Logos3 = ({
    heading = "Trusted by top companies & 50,000+ learners",
    logos = [
        {
            id: "logo-1",
            description: "Google",
            image: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
            className: "h-8 w-auto grayscale opacity-70 hover:opacity-100 transition-opacity",
        },
        {
            id: "logo-3",
            description: "Microsoft",
            image: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg",
            className: "h-8 w-auto grayscale opacity-70 hover:opacity-100 transition-opacity",
        },
        {
            id: "logo-4",
            description: "Amazon",
            image: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
            className: "h-8 w-auto grayscale opacity-70 hover:opacity-100 transition-opacity",
        },
        {
            id: "logo-5",
            description: "Netflix",
            image: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
            className: "h-8 w-auto grayscale opacity-70 hover:opacity-100 transition-opacity",
        },
        {
            id: "logo-6",
            description: "Meta",
            image: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg",
            className: "h-6 w-auto grayscale opacity-70 hover:opacity-100 transition-opacity",
        },
        {
            id: "logo-7",
            description: "IBM",
            image: "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg",
            className: "h-8 w-auto grayscale opacity-70 hover:opacity-100 transition-opacity",
        },
    ],
}: Logos3Props) => {
    return (
        <section className="py-20 bg-background/50 border-y border-border">
            <div className="container flex flex-col items-center text-center">
                <h1 className="mb-12 text-lg font-semibold text-muted-foreground uppercase tracking-[0.2em]">
                    {heading}
                </h1>
            </div>

            <div className="relative flex w-full flex-col items-center justify-center overflow-hidden max-w-7xl mx-auto">
                <Marquee pauseOnHover className="[--duration:20s]">
                    {logos.map((logo) => (
                        <div key={logo.id} className="mx-12 flex items-center justify-center">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={logo.image}
                                alt={logo.description}
                                className={cn(logo.className, "h-10 w-auto opacity-70 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300")}
                            />
                        </div>
                    ))}
                </Marquee>

                {/* Gradient Fades */}
                <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-background dark:from-background"></div>
                <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-background dark:from-background"></div>
            </div>
        </section>
    );
};

export { Logos3 };
