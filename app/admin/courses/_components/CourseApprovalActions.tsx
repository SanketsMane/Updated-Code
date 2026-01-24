"use client";

import { approveCourse, rejectCourse } from "@/app/actions/admin-course-approval";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface CourseApprovalActionsProps {
    courseId: string;
}

export function CourseApprovalActions({ courseId }: CourseApprovalActionsProps) {
    const [loading, setLoading] = useState(false);

    const handleApprove = async () => {
        setLoading(true);
        try {
            await approveCourse(courseId);
            toast.success("Course approved successfully");
        } catch (error) {
            toast.error("Failed to approve course");
        } finally {
            setLoading(false);
        }
    };

    const handleReject = async () => {
        setLoading(true);
        try {
            await rejectCourse(courseId);
            toast.success("Course rejected (set to draft)");
        } catch (error) {
            toast.error("Failed to reject course");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center gap-2 mt-2 w-full">
            <Button
                onClick={handleApprove}
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                size="sm"
            >
                <CheckCircle2 className="size-4 mr-2" />
                Approve
            </Button>
            <Button
                onClick={handleReject}
                disabled={loading}
                variant="destructive"
                className="w-full"
                size="sm"
            >
                <XCircle className="size-4 mr-2" />
                Reject
            </Button>
        </div>
    );
}
