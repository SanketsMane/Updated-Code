import { PageForm } from "../_components/page-form";
import { FileText } from "lucide-react";

export default function AdminCreatePagePage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <FileText className="h-8 w-8" />
                    Create New Page
                </h1>
                <p className="text-muted-foreground">Add a new static page to the website.</p>
            </div>
            <PageForm />
        </div>
    );
}
