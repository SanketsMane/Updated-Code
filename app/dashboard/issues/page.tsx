import Link from "next/link";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import { PlusCircle } from "lucide-react";

export default async function IssuesPage() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user) return <div>Unauthorized</div>;

    const issues = await prisma.issue.findMany({
        where: { reporterId: session.user.id },
        orderBy: { createdAt: "desc" }
    });

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">My Issues</h1>
                    <p className="text-muted-foreground">Track your reported issues and support tickets.</p>
                </div>
                <Link href="/dashboard/issues/new">
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Report Issue
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>History</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Subject</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Priority</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {issues.map(issue => (
                                <TableRow key={issue.id}>
                                    <TableCell>{formatDate(issue.createdAt)}</TableCell>
                                    <TableCell className="font-medium">{issue.subject}</TableCell>
                                    <TableCell>{issue.category}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{issue.priority}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <StatusBadge status={issue.status} />
                                    </TableCell>
                                </TableRow>
                            ))}
                            {issues.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                                        No issues found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        Open: "bg-blue-100 text-blue-800",
        InProgress: "bg-yellow-100 text-yellow-800",
        Resolved: "bg-green-100 text-green-800",
        Closed: "bg-gray-100 text-gray-800",
        Escalated: "bg-red-100 text-red-800",
    };
    return <Badge variant="secondary" className={styles[status]}>{status}</Badge>;
}
