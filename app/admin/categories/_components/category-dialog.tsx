"use client";

import { useEffect, useState } from "react";
import { useActionState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit } from "lucide-react";
import { createCategory, updateCategory } from "@/app/actions/categories";
import { toast } from "sonner";
import { Category } from "@prisma/client";

interface CategoryDialogProps {
    category?: Category;
    parentCategories?: Category[]; // For selecting parent
    trigger?: React.ReactNode;
}

export function CategoryDialog({ category, parentCategories = [], trigger }: CategoryDialogProps) {
    const [open, setOpen] = useState(false);

    // Choose action based on whether we are editing or creating
    const action = category ? updateCategory : createCategory;

    const [state, formAction, isPending] = useActionState(action, {});

    useEffect(() => {
        if (state.success) {
            setOpen(false);
            toast.success(category ? "Category updated" : "Category created");
        } else if (state.error) {
            toast.error(state.error);
        }
    }, [state, category]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant={category ? "ghost" : "default"} size={category ? "icon" : "default"}>
                        {category ? <Edit className="h-4 w-4" /> : <><Plus className="mr-2 h-4 w-4" /> Add Category</>}
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{category ? "Edit Category" : "Add New Category"}</DialogTitle>
                    <DialogDescription>
                        {category ? "Update category details." : "Create a new category for courses."}
                    </DialogDescription>
                </DialogHeader>

                <form action={formAction} className="space-y-4">
                    {category && <input type="hidden" name="id" value={category.id} />}

                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" name="name" defaultValue={category?.name} required placeholder="e.g. Web Development" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description (Optional)</Label>
                        <Textarea id="description" name="description" defaultValue={category?.description || ""} placeholder="Short description..." />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="icon">Icon (Optional)</Label>
                        <Input id="icon" name="icon" defaultValue={category?.icon || ""} placeholder="Lucide icon name or emoji" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="parentId">Parent Category (Optional)</Label>
                        <Select name="parentId" defaultValue={category?.parentId || ""}>
                            <SelectTrigger>
                                <SelectValue placeholder="None (Top Level)" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="null">None (Top Level)</SelectItem>
                                {parentCategories
                                    .filter(c => c.id !== category?.id) // Prevent self-parenting
                                    .map((c) => (
                                        <SelectItem key={c.id} value={c.id}>
                                            {c.name}
                                        </SelectItem>
                                    ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? "Saving..." : (category ? "Update" : "Create")}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
