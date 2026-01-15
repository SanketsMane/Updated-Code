"use client";

import { useEffect, useState } from "react";
import { useActionState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit } from "lucide-react";
import { createTestimonial, updateTestimonial } from "@/app/actions/testimonials";
import { toast } from "sonner";
import { Testimonial } from "@prisma/client";

interface TestimonialDialogProps {
    testimonial?: Testimonial;
}

export function TestimonialDialog({ testimonial }: TestimonialDialogProps) {
    const [open, setOpen] = useState(false);

    const action = testimonial ? updateTestimonial : createTestimonial;
    const [state, formAction, isPending] = useActionState(action, {});

    useEffect(() => {
        if (state?.success) {
            setOpen(false);
            toast.success(testimonial ? "Testimonial updated" : "Testimonial created");
        } else if (state?.error) {
            toast.error(state.error);
        }
    }, [state, testimonial]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant={testimonial ? "ghost" : "default"} size={testimonial ? "icon" : "default"}>
                    {testimonial ? <Edit className="h-4 w-4" /> : <><Plus className="mr-2 h-4 w-4" /> Add Testimonial</>}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{testimonial ? "Edit Testimonial" : "Add Testimonial"}</DialogTitle>
                    <DialogDescription>
                        {testimonial ? "Update testimonial details." : "Add a new student review."}
                    </DialogDescription>
                </DialogHeader>

                <form action={formAction} className="space-y-4">
                    {testimonial && <input type="hidden" name="id" value={testimonial.id} />}

                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" name="name" defaultValue={testimonial?.name} required placeholder="Student Name" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Input id="role" name="role" defaultValue={testimonial?.role || "Student"} placeholder="e.g. Student, Parent" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="content">Content</Label>
                        <Textarea id="content" name="content" defaultValue={testimonial?.content} required placeholder="Feedback..." />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="image">Image URL</Label>
                        <Input id="image" name="image" defaultValue={testimonial?.image || ""} placeholder="https://..." />
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center space-x-2">
                            <Switch id="isFeatured" name="isFeatured" defaultChecked={testimonial?.isFeatured} />
                            <Label htmlFor="isFeatured">Featured</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Switch id="isActive" name="isActive" defaultChecked={testimonial?.isActive !== false} />
                            <Label htmlFor="isActive">Active</Label>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? "Saving..." : (testimonial ? "Update" : "Create")}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
