"use client";

import { approveTeacher, rejectTeacher } from "@/app/actions/teacher";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface TeacherApprovalActionsProps {
    profileId: string;
    userId: string;
}

export function TeacherApprovalActions({ profileId, userId }: TeacherApprovalActionsProps) {
    const [loading, setLoading] = useState(false);

    const handleApprove = async () => {
        setLoading(true);
        try {
            await approveTeacher(profileId);
            toast.success("Teacher approved successfully");
        } catch (error) {
            toast.error("Failed to approve teacher");
        } finally {
            setLoading(false);
        }
    };

    const handleReject = async () => {
        setLoading(true);
        try {
            await rejectTeacher(profileId, userId);
            toast.success("Teacher rejected");
        } catch (error) {
            toast.error("Failed to reject teacher");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex gap-2">
            <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700"
                onClick={handleApprove}
                disabled={loading}
            >
                {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <CheckCircle className="h-4 w-4 mr-2" />}
                Approve
            </Button>
            <Button
                size="sm"
                variant="destructive"
                onClick={handleReject}
                disabled={loading}
            >
                {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <XCircle className="h-4 w-4 mr-2" />}
                Reject
            </Button>
            <Button size="sm" variant="outline" disabled={loading}>
                Request More Info
            </Button>
        </div>
    );
}
