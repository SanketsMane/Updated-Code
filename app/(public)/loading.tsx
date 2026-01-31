import { Loader2 } from "lucide-react";

export default function Loading() {
    return (
        <div className="w-full min-h-screen bg-background">
            {/* Nav height placeholder */}
            <div className="h-16 w-full border-b border-border bg-background animate-pulse" />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-12">
                {/* Hero Skeleton */}
                <div className="space-y-6 text-center">
                    <div className="h-12 w-3/4 mx-auto bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse" />
                    <div className="h-6 w-1/2 mx-auto bg-slate-100 dark:bg-slate-900 rounded-full animate-pulse" />
                    <div className="h-14 w-48 mx-auto bg-blue-100 dark:bg-blue-900/30 rounded-xl animate-pulse" />
                </div>

                {/* Grid Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-64 w-full bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-border animate-pulse" />
                    ))}
                </div>
            </div>
        </div>
    );
}
