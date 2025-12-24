import { PublicCourseCardSkeleton } from "../_components/PublicCourseCard";
import { CourseFilters } from "../_components/CourseFilters";

export default function Loading() {
    return (
        <div className="min-h-screen bg-background font-sans text-foreground">
            {/* Billboard Hero Section Skeleton */}
            <section className="relative overflow-hidden bg-background border-b border-border h-[500px] animate-pulse">
                <div className="container mx-auto relative z-10 py-16 lg:py-24">
                    <div className="h-10 w-1/3 bg-muted rounded mb-6"></div>
                    <div className="h-4 w-1/2 bg-muted rounded mb-8"></div>
                </div>
            </section>

            {/* Main Content: Filters & Grid */}
            <section className="py-20 container mx-auto">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border pb-6">
                        <div>
                            <div className="h-8 w-48 bg-muted rounded mb-2"></div>
                            <div className="h-4 w-64 bg-muted rounded"></div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10 items-start">
                        {/* Sidebar Filters - reused component or skeleton */}
                        <aside className="lg:sticky lg:top-24 h-fit hidden lg:block">
                            <div className="space-y-6">
                                <div className="h-64 bg-muted rounded-xl"></div>
                                <div className="h-64 bg-muted rounded-xl"></div>
                            </div>
                        </aside>

                        {/* Course Grid */}
                        <div className="flex-1">
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {Array.from({ length: 9 }).map((_, i) => (
                                    <PublicCourseCardSkeleton key={i} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
