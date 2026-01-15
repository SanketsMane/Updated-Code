"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea"; // Or file input
import { bulkImportUsers } from "@/app/actions/users";
import { toast } from "sonner";
import { IconUpload } from "@tabler/icons-react";
import { Papa } from "@/lib/papa-parse"; // Need to check if papaparse is installed or use simple split

export function BulkImportDialog() {
    const [open, setOpen] = useState(false);
    const [csvContent, setCsvContent] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleImport = async () => {
        setIsLoading(true);
        try {
            // Simple CSV parsing: Name, Email, Password, Role
            const lines = csvContent.trim().split("\n");
            const users = lines.map(line => {
                const [name, email, password, role] = line.split(",").map(s => s.trim());
                return { name, email, password, role };
            });

            if (users.length === 0) {
                toast.error("No data found");
                return;
            }

            const result = await bulkImportUsers(users);

            if (result.success) {
                toast.success(result.message);
                if (result.details && result.details.length > 0) {
                    toast.warning(`Some errors occurred: ${result.details.slice(0, 3).join(", ")}...`);
                }
                setOpen(false);
                setCsvContent("");
            } else {
                toast.error(result.error);
            }
        } catch (error) {
            toast.error("Failed to parse CSV");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <IconUpload className="h-4 w-4 mr-2" />
                    Bulk Import
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Bulk Import Users</DialogTitle>
                    <DialogDescription>
                        Paste CSV data below. Format: <code>Name, Email, Password, Role (student/teacher/admin)</code>
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <Textarea
                        placeholder={`John Doe, john@test.com, password123, student\nJane Smith, jane@test.com, pass456, teacher`}
                        className="min-h-[200px] font-mono text-sm"
                        value={csvContent}
                        onChange={(e) => setCsvContent(e.target.value)}
                    />
                </div>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleImport} disabled={isLoading || !csvContent}>
                        {isLoading ? "Importing..." : "Import Users"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
