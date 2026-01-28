import Link from "next/link";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { MessageSquare } from "lucide-react";
import { createGroupChat } from "@/app/actions/groups";
import { toast } from "sonner"; // Server component, cannot toast directly, need client component for interactivity or form

export default async function StudentGroupsPage() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user) return <div>Unauthorized</div>;

    const enrollments = await prisma.groupEnrollment.findMany({
        where: { studentId: session.user.id },
        include: {
            class: {
                include: { teacher: { include: { user: true } } }
            }
        },
        orderBy: { enrolledAt: "desc" }
    });

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">My Group Classes</h1>
                    <p className="text-muted-foreground">Classes you have joined or requested to join.</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {enrollments.map(enrollment => {
                    const group = enrollment.class;
                    return (
                        <Card key={enrollment.id} className="flex flex-col">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <CardTitle className="line-clamp-1">{group.title}</CardTitle>
                                    <StatusBadge status={enrollment.status} />
                                </div>
                                <CardDescription>
                                    {group.teacher.user.name} • {formatDate(group.scheduledAt)}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1 flex flex-col justify-end">
                                {enrollment.status === "Approved" ? (
                                    <form action={async () => {
                                        "use server";
                                        const result = await createGroupChat(group.id);
                                        if (result.success) {
                                            // Normally redirect to chat page
                                            // redirect(`/dashboard/messages/${result.conversationId}`);
                                        }
                                    }}>
                                        <Link href={group.chatGroupId ? `/dashboard/messages?id=${group.chatGroupId}` : "#"} className={!group.chatGroupId ? "pointer-events-none opacity-50" : ""}>
                                            {/* Using Link to messages, assuming chatGroupId handling */}
                                            <Button className="w-full" disabled={!group.chatGroupId}>
                                                <MessageSquare className="mr-2 h-4 w-4" />
                                                Open Chat
                                            </Button>
                                        </Link>
                                        {!group.chatGroupId && <p className="text-xs text-center mt-2 text-muted-foreground">Chat not enabled by teacher yet.</p>}
                                    </form>
                                ) : (
                                    <Button variant="outline" disabled className="w-full">
                                        {enrollment.status}
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
                {enrollments.length === 0 && (
                    <div className="col-span-full text-center p-12 text-muted-foreground border border-dashed rounded-lg">
                        You haven't joined any group classes yet.
                        <br />
                        <Link href="/find-teacher" className="text-primary hover:underline">Find a Mentor</Link> to browse packages!
                    </div>
                )}
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        Pending: "bg-yellow-100 text-yellow-800",
        Approved: "bg-green-100 text-green-800",
        Rejected: "bg-red-100 text-red-800",
    };
    return <Badge variant="secondary" className={styles[status] || styles.Pending}>{status}</Badge>;
}
