"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { requestPayout } from "@/app/actions/teacher-payouts";

export function PayoutButton({ disabled }: { disabled: boolean }) {
    const [isPending, startTransition] = useTransition();

    const handleRequest = () => {
        startTransition(async () => {
            try {
                await requestPayout();
                toast.success("Payout request submitted successfully!");
            } catch (error: any) {
                toast.error(error.message || "Failed to request payout");
            }
        });
    };

    return (
        <Button
            className="flex-1"
            onClick={handleRequest}
            disabled={disabled || isPending}
        >
            {isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
            Request Payout
        </Button>
    );
}
