import { CreateIssueForm } from "../_components/create-issue-form";

export default function NewIssuePage() {
    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Report a New Issue</h1>
                <p className="text-muted-foreground">
                    Please provide as much detail as possible to help us assist you.
                </p>
            </div>
            <CreateIssueForm />
        </div>
    );
}
