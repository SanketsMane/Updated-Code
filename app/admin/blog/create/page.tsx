import { BlogForm } from "../_components/blog-form";
import { FileText } from "lucide-react";

export default function AdminCreateBlogPostPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <FileText className="h-8 w-8" />
                    Create New Post
                </h1>
                <p className="text-muted-foreground">Write a new blog post.</p>
            </div>
            <BlogForm />
        </div>
    );
}
