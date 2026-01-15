"use client";

import { useActionState, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { createBlogPost, updateBlogPost } from "@/app/actions/blog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { TiptapEditor } from "@/app/admin/pages/_components/tiptap-editor";
import { BlogPost } from "@prisma/client";

interface BlogFormProps {
    post?: BlogPost;
}

export function BlogForm({ post }: BlogFormProps) {
    const router = useRouter();
    const [content, setContent] = useState(post?.content || "");

    const action = post ? updateBlogPost : createBlogPost;
    const [state, formAction, isPending] = useActionState(action, {});

    useEffect(() => {
        if (state?.success) {
            toast.success(post ? "Post updated" : "Post created");
            router.push("/admin/blog");
        } else if (state?.error) {
            toast.error(state.error);
        }
    }, [state, router, post]);

    return (
        <form action={formAction} className="space-y-6 max-w-4xl">
            {post && <input type="hidden" name="id" value={post.id} />}
            <input type="hidden" name="content" value={content} />

            <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardContent className="pt-6 space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <Input id="title" name="title" defaultValue={post?.title} required placeholder="Post Title" />
                            </div>

                            <div className="space-y-2">
                                <Label>Content</Label>
                                <TiptapEditor content={content} onChange={setContent} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="excerpt">Excerpt (Optional)</Label>
                                <Textarea id="excerpt" name="excerpt" defaultValue={post?.excerpt || ""} placeholder="Short summary..." />
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
                                <Switch name="isPublished" defaultChecked={post?.isPublished} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="slug">Slug</Label>
                                <Input id="slug" name="slug" defaultValue={post?.slug} placeholder="post-slug" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="coverImage">Cover Image URL</Label>
                                <Input id="coverImage" name="coverImage" defaultValue={post?.featuredImage || ""} placeholder="https://..." />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex gap-2">
                        <Button type="button" variant="outline" className="w-full" onClick={() => router.back()}>Cancel</Button>
                        <Button type="submit" className="w-full" disabled={isPending}>
                            {isPending ? "Saving..." : (post ? "Update Post" : "Create Post")}
                        </Button>
                    </div>
                </div>
            </div>
        </form>
    );
}
