"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createIssue } from "@/app/actions/issues";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function CreateIssueForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function onSubmit(formData: FormData) {
        setLoading(true);

        const subject = formData.get("subject") as string;
        const description = formData.get("description") as string;
        const category = formData.get("category") as string;
        const priority = formData.get("priority") as "Low" | "Medium" | "High" | "Critical";

        if (!subject || !description || !category || !priority) {
            toast.error("Please fill in all fields");
            setLoading(false);
            return;
        }

        try {
            const result = await createIssue({
                subject,
                description,
                category,
                priority
            });

            if (result.error) {
                toast.error("Error", { description: result.error });
            } else {
                toast.success("Issue Reported", { description: "We have received your report." });
                router.push("/dashboard/issues");
                router.refresh();
            }
        } catch {
            toast.error("Error", { description: "Something went wrong" });
        } finally {
            setLoading(false);
        }
    }

    return (
        <form action={onSubmit} className="space-y-6 max-w-2xl">
            <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select name="category" required>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Technical">Technical Issue</SelectItem>
                        <SelectItem value="Billing">Billing & Payments</SelectItem>
                        <SelectItem value="Content">Course Content</SelectItem>
                        <SelectItem value="Account">Account Support</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select name="priority" required defaultValue="Medium">
                    <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Critical">Critical</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" name="subject" required placeholder="Brief summary of the issue" />
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    name="description"
                    required
                    placeholder="Please provide details..."
                    className="min-h-[150px]"
                />
            </div>

            <div className="flex gap-4">
                <Button variant="outline" type="button" onClick={() => router.back()}>
                    Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Submit Report
                </Button>
            </div>
        </form>
    );
}
