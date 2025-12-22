"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { createReview } from "@/app/actions/reviews";
import { cn } from "@/lib/utils";

interface ReviewDialogProps {
    courseId: string;
    courseTitle: string;
}

export function ReviewDialog({ courseId, courseTitle }: ReviewDialogProps) {
    const [open, setOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [hoverRating, setHoverRating] = useState(0);
    const [pending, startTransition] = useTransition();

    const handleSubmit = () => {
        if (rating === 0) {
            toast.error("Please select a rating");
            return;
        }

        startTransition(async () => {
            const result = await createReview({
                courseId,
                rating,
                comment,
            });

            if (result.status === "success") {
                toast.success(result.message);
                setOpen(false);
                // Reset form
                setRating(0);
                setComment("");
            } else {
                toast.error(result.message);
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    Write a Review
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Review {courseTitle}</DialogTitle>
                    <DialogDescription>
                        Share your experience with other students.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="flex justify-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                className="focus:outline-none transition-transform hover:scale-110"
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                onClick={() => setRating(star)}
                            >
                                <Star
                                    className={cn(
                                        "w-8 h-8 transition-colors",
                                        (hoverRating || rating) >= star
                                            ? "fill-yellow-400 text-yellow-400"
                                            : "text-gray-300"
                                    )}
                                />
                            </button>
                        ))}
                    </div>
                    <Textarea
                        placeholder="What did you learn? Did you enjoy it?"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="min-h-[100px]"
                    />
                </div>
                <DialogFooter>
                    <Button onClick={handleSubmit} disabled={pending}>
                        {pending ? "Submitting..." : "Submit Review"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
