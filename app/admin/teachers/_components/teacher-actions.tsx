"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "lucide-react";
import { Check, X, Eye, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { approveTeacher, rejectTeacher } from "@/app/actions/admin-management";
import { useRouter } from "next/navigation";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TeacherActionsProps {
    userId: string;
    isApproved: boolean;
    isVerified: boolean;
}

export function TeacherActions({ userId, isApproved, isVerified }: TeacherActionsProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleApprove = async () => {
        setLoading(true);
        try {
            await approveTeacher(userId);
            toast.success("Teacher approved");
            router.refresh();
        } catch (error) {
            toast.error("Failed to approve");
        } finally {
            setLoading(false);
        }
    };

    const handleReject = async () => {
        setLoading(true);
        try {
            await rejectTeacher(userId);
            toast.warning("Teacher approval revoked");
            router.refresh();
        } catch (error) {
            toast.error("Failed to reject");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center gap-2">
            <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/admin/teachers/${userId}`)}
            >
                <Eye className="w-4 h-4 mr-1" /> View
            </Button>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Teacher Status</DropdownMenuLabel>
                    {!isApproved ? (
                        <DropdownMenuItem onClick={handleApprove} className="text-green-600">
                            <Check className="w-4 h-4 mr-2" /> Approve Application
                        </DropdownMenuItem>
                    ) : (
                        <DropdownMenuItem onClick={handleReject} className="text-amber-600">
                            <X className="w-4 h-4 mr-2" /> Revoke Approval
                        </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
