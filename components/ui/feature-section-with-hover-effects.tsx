import { cn } from "@/lib/utils";
import {
    IconCode,
    IconChartBar,
    IconPalette,
    IconRobot,
    IconActivity,
    IconWorld,
    IconCamera,
    IconMusic,
} from "@tabler/icons-react";

interface CategoryWithCount {
    name: string;
    _count: { courses: number };
    icon: string | null;
}

export function FeaturesSectionWithHoverEffects({ categories }: { categories: CategoryWithCount[] }) {
    const features = categories.map(cat => ({
        title: cat.name,
        description: `${cat._count.courses} courses`,
        icon: <span className="text-2xl">{cat.icon || "📚"}</span>, // Use DB icon or default
        popular: cat._count.courses > 5 // Simple logic for "popular"
    }));

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative z-10 py-10 max-w-7xl mx-auto">
            {features.map((feature, index) => (
                <Feature key={feature.title} {...feature} index={index} />
            ))}
        </div>
    );
}

const Feature = ({
    title,
    description,
    icon,
    index,
    popular,
}: {
    title: string;
    description: string;
    icon: React.ReactNode;
    index: number;
    popular: boolean;
}) => {
    return (
        <div
            className={cn(
                "flex flex-col lg:border-r py-10 relative group/feature dark:border-neutral-800 bg-transparent dark:bg-card/30 hover:dark:bg-card/50 transition-colors",
                (index === 0 || index === 4) && "lg:border-l dark:border-neutral-800",
                index < 4 && "lg:border-b dark:border-neutral-800"
            )}
        >
            {index < 4 && (
                <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
            )}
            {index >= 4 && (
                <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
            )}
            <div className="mb-4 relative z-10 px-10 text-neutral-600 dark:text-neutral-400">
                {icon}
            </div>
            <div className="text-lg font-bold mb-2 relative z-10 px-10">
                <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-300 dark:bg-neutral-700 group-hover/feature:bg-primary transition-all duration-200 origin-center" />
                <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-neutral-800 dark:text-neutral-100">
                    {title}
                </span>
                {popular && (
                    <span className="ml-2 inline-block bg-yellow-100 text-yellow-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider align-middle">
                        Popular
                    </span>
                )}
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-xs relative z-10 px-10">
                {description}
            </p>
        </div>
    );
};
