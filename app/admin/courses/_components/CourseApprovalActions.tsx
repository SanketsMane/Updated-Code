"use client";

import { approveCourse, rejectCourse } from "@/app/actions/admin-course-approval";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface CourseApprovalActionsProps {
    courseId: string;
}

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function CourseApprovalActions({ courseId }: CourseApprovalActionsProps) {
    const [loading, setLoading] = useState(false);
    const [isRejectOpen, setIsRejectOpen] = useState(false);
    const [rejectionReason, setRejectionReason] = useState("");

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
        if (!rejectionReason.trim()) {
            toast.error("Please provide a reason for rejection");
            return;
        }

        setLoading(true);
        try {
            await rejectCourse(courseId, rejectionReason);
            toast.success("Course rejected (set to draft)");
            setIsRejectOpen(false);
        } catch (error) {
            toast.error("Failed to reject course");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center gap-2 mt-4 w-full">
            <Button
                onClick={handleApprove}
                disabled={loading}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                size="sm"
            >
                <CheckCircle2 className="size-4 mr-2" />
                Approve
            </Button>

            <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
                <DialogTrigger asChild>
                    <Button
                        disabled={loading}
                        variant="destructive"
                        className="flex-1"
                        size="sm"
                    >
                        <XCircle className="size-4 mr-2" />
                        Reject
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reject Course</DialogTitle>
                        <DialogDescription>
                            Please provide a reason for rejecting this course. This will be sent to the teacher.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Rejection Reason</Label>
                            <Textarea
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                placeholder="e.g. Content does not meet quality standards..."
                                rows={4}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsRejectOpen(false)} disabled={loading}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleReject} disabled={loading || !rejectionReason.trim()}>
                            Reject Course
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
