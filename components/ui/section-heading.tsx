import { cn } from "@/lib/utils";

interface SectionHeadingProps {
    title: string;
    description?: string;
    align?: "left" | "center";
    className?: string;
}

export function SectionHeading({
    title,
    description,
    align = "center",
    className,
}: SectionHeadingProps) {
    return (
        <div
            className={cn(
                "mb-12",
                align === "center" ? "text-center" : "text-left",
                className
            )}
        >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
                {title}
            </h2>
            {description && (
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                    {description}
                </p>
            )}
            <div
                className={cn(
                    "h-1.5 w-20 bg-primary mt-6 rounded-full",
                    align === "center" ? "mx-auto" : ""
                )}
            />
        </div>
    );
}
