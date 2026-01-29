"use client";

import { useActionState, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { sendMessage } from "@/app/actions/messaging";
import { toast } from "sonner";
import { IconSend } from "@tabler/icons-react";

export function BroadcastForm() {
    const [state, formAction, isPending] = useActionState(sendMessage, { success: false, message: "" });

    useEffect(() => {
        if (state?.success) {
            toast.success(state.message);
            // Optional: Reset form
        } else if (state?.error) {
            toast.error(state.error);
        }
    }, [state]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Compose Broadcast</CardTitle>
                <CardDescription>Send a message to a group of users.</CardDescription>
            </CardHeader>
            <CardContent>
                <form action={formAction} className="space-y-6">
                    <input type="hidden" name="isBroadcast" value="true" />

                    <div className="space-y-2">
                        <Label htmlFor="broadcastRole">Recipient Group</Label>
                        <Select name="broadcastRole" required defaultValue="all">
                            <SelectTrigger>
                                <SelectValue placeholder="Select group" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Users</SelectItem>
                                <SelectItem value="teacher">All Teachers</SelectItem>
                                <SelectItem value="student">All Students</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input id="subject" name="subject" required placeholder="Important Announcement" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="message">Message Content</Label>
                        <Textarea
                            id="message"
                            name="message"
                            required
                            placeholder="Type your announcement here..."
                            className="min-h-[200px]"
                        />
                    </div>

                    <Button type="submit" disabled={isPending} className="w-full">
                        <IconSend className="h-4 w-4 mr-2" />
                        {isPending ? "Sending Broadcast..." : "Send Broadcast Message"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
