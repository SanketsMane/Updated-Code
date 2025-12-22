"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { approveTeacher, rejectTeacher } from "@/app/actions/teacher";
import { Loader2, Check, X } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface TeacherActionsProps {
    profileId: string;
    userId: string;
}

export function TeacherActions({ profileId, userId }: TeacherActionsProps) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleApprove = async () => {
        setIsLoading(true);
        try {
            const res = await approveTeacher(profileId);
            if (res.error) throw new Error(res.error);
            toast.success("Teacher approved");
            router.refresh();
        } catch {
            toast.error("Failed to approve");
        } finally {
            setIsLoading(false);
        }
    };

    const handleReject = async () => {
        setIsLoading(true);
        try {
            const res = await rejectTeacher(profileId, userId);
            if (res.error) throw new Error(res.error);
            toast.success("Teacher rejected");
            router.refresh();
        } catch {
            toast.error("Failed to reject");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center gap-2">
            <Button
                size="sm"
                onClick={handleApprove}
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700 text-white"
            >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4 mr-1" />}
                Approve
            </Button>
            <Button
                size="sm"
                variant="destructive"
                onClick={handleReject}
                disabled={isLoading}
            >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4 mr-1" />}
                Reject
            </Button>
        </div>
    );
}
