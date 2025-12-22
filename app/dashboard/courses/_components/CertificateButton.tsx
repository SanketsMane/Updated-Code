"use client";

import { Button } from "@/components/ui/button";
import { Award, Loader2 } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import { generateCertificate } from "@/app/actions/certificates";

export function CertificateButton({ courseId }: { courseId: string }) {
    const [pending, startTransition] = useTransition();

    const handleClaim = () => {
        startTransition(async () => {
            const result = await generateCertificate(courseId);
            if (result.status === "success") {
                toast.success(result.message);
                // In a real app, we would redirect to the certificate view page
                // window.location.href = `/certificates/${result.id}`;
            } else {
                toast.error(result.message);
            }
        });
    };

    return (
        <Button
            onClick={handleClaim}
            disabled={pending}
            className="flex-1 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-white border-0"
        >
            {pending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <Award className="mr-2 h-4 w-4" />
            )}
            Get Certificate
        </Button>
    );
}
