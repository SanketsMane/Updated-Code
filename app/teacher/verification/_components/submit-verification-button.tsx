"use client";

import { Button } from "@/components/ui/button";
import { submitVerification } from "@/app/actions/teacher-verification";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2, Send } from "lucide-react";

export function SubmitVerificationButton() {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            await submitVerification();
            toast.success("Verification request submitted successfully! Admins have been notified.");
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Failed to submit verification");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button onClick={handleSubmit} disabled={isLoading} size="lg" className="w-full md:w-auto bg-green-600 hover:bg-green-700">
            {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
            Submit Verification Request
        </Button>
    );
}
