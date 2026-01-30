"use client";

import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { toggleSavedTutor } from "@/app/actions/saved-tutors";
import { cn } from "@/lib/utils";

interface SaveTutorButtonProps {
    tutorId: string;
    initialSaved: boolean;
}

export function SaveTutorButton({ tutorId, initialSaved }: SaveTutorButtonProps) {
    const [isSaved, setIsSaved] = useState(initialSaved);
    const [isLoading, setIsLoading] = useState(false);

    const handleToggle = async () => {
        setIsLoading(true);
        // Optimistic update
        const newState = !isSaved;
        setIsSaved(newState);

        try {
            const result = await toggleSavedTutor(tutorId);
            if (result.error) {
                toast.error(result.error);
                setIsSaved(!newState); // Revert
            } else {
                toast.success(result.saved ? "Tutor saved to favorites" : "Tutor removed from favorites");
                setIsSaved(result.saved as boolean);
            }
        } catch {
            toast.error("Failed to update");
            setIsSaved(!newState);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={handleToggle}
            disabled={isLoading}
            className={cn(
                "gap-2 transition-colors",
                isSaved && "text-red-500 hover:text-red-600 border-red-200 bg-red-50 dark:bg-red-950/20"
            )}
        >
            <Heart className={cn("w-4 h-4", isSaved && "fill-current")} />
            {isSaved ? "Saved" : "Save Tutor"}
        </Button>
    );
}
