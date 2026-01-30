"use client";

// import { Broadcast } from "@prisma/client"; // Linking error
import { BroadcastData } from "./broadcast-form";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { BroadcastForm } from "./broadcast-form";
import { deleteBroadcast, toggleBroadcastStatus } from "@/app/actions/broadcasts";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface BroadcastClientProps {
    initialBroadcasts: BroadcastData[];
}

export function BroadcastClient({ initialBroadcasts }: BroadcastClientProps) {
    const router = useRouter();
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingBroadcast, setEditingBroadcast] = useState<BroadcastData | null>(null);

    const onToggle = async (id: string, current: boolean) => {
        try {
            await toggleBroadcastStatus(id, !current);
            toast.success("Status updated");
            router.refresh();
        } catch {
            toast.error("Failed to update status");
        }
    };

    const onDelete = async (id: string) => {
        if(!confirm("Are you sure?")) return;
        try {
            await deleteBroadcast(id);
            toast.success("Deleted");
            router.refresh();
        } catch {
            toast.error("Failed to delete");
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button><Plus className="w-4 h-4 mr-2" /> New Broadcast</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create Broadcast</DialogTitle>
                        </DialogHeader>
                        <BroadcastForm onSuccess={() => setIsCreateOpen(false)} />
                    </DialogContent>
                </Dialog>
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Message</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Priority</TableHead>
                            <TableHead>Active</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {initialBroadcasts.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium max-w-md truncate">
                                    {item.text}
                                    {item.couponCode && <div className="text-xs text-muted-foreground">Code: {item.couponCode}</div>}
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline">{item.type}</Badge>
                                </TableCell>
                                <TableCell>{item.priority}</TableCell>
                                <TableCell>
                                    <Switch 
                                        checked={item.isActive} 
                                        onCheckedChange={() => onToggle(item.id, item.isActive)}
                                    />
                                </TableCell>
                                <TableCell className="text-right flex gap-2 justify-end">
                                    <Button variant="ghost" size="icon" onClick={() => setEditingBroadcast(item)}>
                                        <Pencil className="w-4 h-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="text-red-500" onClick={() => onDelete(item.id)}>
                                        <Trash className="w-4 h-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {initialBroadcasts.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                                    No broadcasts found. Create one to display on the home page.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={!!editingBroadcast} onOpenChange={(open) => !open && setEditingBroadcast(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Broadcast</DialogTitle>
                    </DialogHeader>
                    {editingBroadcast && (
                        <BroadcastForm 
                            initialData={editingBroadcast} 
                            onSuccess={() => setEditingBroadcast(null)} 
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
