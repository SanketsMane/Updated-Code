"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface CoursePurchaseButtonProps {
    courseId: string;
    price: number;
}

export const CoursePurchaseButton = ({
    courseId,
    price,
}: CoursePurchaseButtonProps) => {
    const [isLoading, setIsLoading] = useState(false);

    const onClick = async () => {
        try {
            setIsLoading(true);

            if (price === 0) {
                // Direct Enrollment for Free Courses
                const response = await fetch("/api/enroll-free", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ courseId }),
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        toast.error("Please login to enroll");
                        window.location.href = "/login";
                        return;
                    }
                    throw new Error("Enrollment failed");
                }

                toast.success("Enrolled successfully! Redirecting...");
                window.location.reload();
                return;
            } else {
                // Stripe Checkout for Paid Courses
                const response = await fetch("/api/checkout", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ courseId }),
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        toast.error("Please login to purchase");
                        window.location.href = "/login";
                        return;
                    }
                    throw new Error("Checkout failed");
                }

                const data = await response.json();
                window.location.assign(data.url);
            }
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            onClick={onClick}
            disabled={isLoading}
            className="w-full text-lg h-12 font-bold"
        >
            {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            {price === 0 ? "Enroll for Free" : `Enroll for $${price}`}
        </Button>
    );
};
