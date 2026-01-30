"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Flag } from "lucide-react";
import { toast } from "sonner";
import { createIssue } from "@/app/actions/issues";

interface ReportTeacherButtonProps {
    teacherId: string;
    teacherName: string;
}

export function ReportTeacherButton({ teacherId, teacherName }: ReportTeacherButtonProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [reason, setReason] = useState("");
    const [description, setDescription] = useState("");

    const handleSubmit = async () => {
        if (!reason || !description) {
            toast.error("Please fill in all fields");
            return;
        }

        setLoading(true);
        try {
            const formData = {
                subject: `Report against Teacher: ${teacherName}`,
                description: description,
                category: "Dispute", // Default category for reports
                priority: "High" as const,
                metadata: {
                    reportedEntity: "Teacher",
                    teacherId: teacherId,
                    reason: reason
                }
            };

            const result = await createIssue(formData);

            if (result.success) {
                toast.success("Report submitted successfully");
                setOpen(false);
                setDescription("");
                setReason("");
            } else {
                toast.error(result.error || "Failed to submit report");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" className="w-full text-red-500 hover:text-red-600 hover:bg-red-50">
                    <Flag className="mr-2 h-4 w-4" />
                    Report this Teacher
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Report {teacherName}</DialogTitle>
                    <DialogDescription>
                        Please provide details about the issue. This will be reviewed by our admin team urgently.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label>Reason</Label>
                        <Select value={reason} onValueChange={setReason}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a reason" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="inappropriate_behavior">Inappropriate Behavior</SelectItem>
                                <SelectItem value="no_show">No Show / Late Arrival</SelectItem>
                                <SelectItem value="quality_issues">Teaching Quality Issues</SelectItem>
                                <SelectItem value="fraud">Fraud / Scam</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label>Detailed Description</Label>
                        <Textarea 
                            value={description} 
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Please describe what happened..."
                            className="min-h-[100px]"
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>Cancel</Button>
                    <Button variant="destructive" onClick={handleSubmit} disabled={loading}>
                        {loading ? "Submitting..." : "Submit Report"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
