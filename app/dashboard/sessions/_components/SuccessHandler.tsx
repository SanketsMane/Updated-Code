"use strict";
"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
// @ts-ignore
import confetti from "canvas-confetti";

export function SuccessHandler() {
    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        if (searchParams.get("booking") === "success") {
            toast.success("Booking Confirmed!", {
                description: "Your session has been successfully scheduled."
            });

            // Celebration confetti
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });

            // Clean up URL
            const newParams = new URLSearchParams(searchParams.toString());
            newParams.delete("booking");
            router.replace(`/dashboard/sessions?${newParams.toString()}`);
            router.refresh();
        }
    }, [searchParams, router]);

    return null;
}
