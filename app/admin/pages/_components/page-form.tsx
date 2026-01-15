"use client";

import { useActionState, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { createPage, updatePage } from "@/app/actions/pages";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { TiptapEditor } from "./tiptap-editor";
import { Page } from "@prisma/client";

interface PageFormProps {
    page?: Page;
}

export function PageForm({ page }: PageFormProps) {
    const router = useRouter();
    const [content, setContent] = useState(page?.content || "");

    const action = page ? updatePage : createPage;
    const [state, formAction, isPending] = useActionState(action, {});

    useEffect(() => {
        if (state?.success) {
            toast.success(page ? "Page updated" : "Page created");
            router.push("/admin/pages");
        } else if (state?.error) {
            toast.error(state.error);
        }
    }, [state, router, page]);

    return (
        <form action={formAction} className="space-y-6 max-w-4xl">
            {page && <input type="hidden" name="id" value={page.id} />}
            <input type="hidden" name="content" value={content} />

            <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardContent className="pt-6 space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Page Title</Label>
                                <Input id="title" name="title" defaultValue={page?.title} required placeholder="e.g. About Us" />
                            </div>

                            <div className="space-y-2">
                                <Label>Content</Label>
                                <TiptapEditor content={content} onChange={setContent} />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardContent className="pt-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Published</Label>
                                    <p className="text-xs text-muted-foreground">Visible to public</p>
                                </div>
                                <Switch name="isPublished" defaultChecked={page?.isPublished} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="slug">Slug</Label>
                                <Input id="slug" name="slug" defaultValue={page?.slug} placeholder="about-us" />
                                <p className="text-xs text-muted-foreground">URL friendly name</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6 space-y-4">
                            <Label>SEO Settings</Label>
                            <div className="space-y-2">
                                <Label htmlFor="metaTitle" className="text-xs">Meta Title</Label>
                                <Input id="metaTitle" name="metaTitle" defaultValue={page?.metaTitle || ""} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="metaDescription" className="text-xs">Meta Description</Label>
                                <Textarea id="metaDescription" name="metaDescription" defaultValue={page?.metaDescription || ""} />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex gap-2">
                        <Button type="button" variant="outline" className="w-full" onClick={() => router.back()}>Cancel</Button>
                        <Button type="submit" className="w-full" disabled={isPending}>
                            {isPending ? "Saving..." : (page ? "Update Page" : "Create Page")}
                        </Button>
                    </div>
                </div>
            </div>
        </form>
    );
}
