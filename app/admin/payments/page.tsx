import { requireUser } from "@/app/data/user/require-user";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IconCreditCard, IconTrendingUp, IconDownload } from "@tabler/icons-react";
import { prisma as db } from "@/lib/db";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

export default async function PaymentsPage() {
  await requireUser();

  const enrollments = await db.enrollment.findMany({
    include: {
      User: true,
      Course: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  const totalRevenue = enrollments
    .filter(e => e.status === 'Active')
    .reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <IconCreditCard className="h-8 w-8" />
            Payments & Transactions
          </h1>
          <p className="text-muted-foreground">Monitor platform revenue and transactions</p>
        </div>
        <Button>
          <IconDownload className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(totalRevenue / 100).toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{enrollments.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{enrollments.filter(e => e.status === 'Active').length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{enrollments.filter(e => e.status === 'Pending').length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>View all payment transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {enrollments.map((enrollment) => (
              <div key={enrollment.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">{enrollment.Course.title}</p>
                  <p className="text-sm text-muted-foreground">User: {enrollment.User.name}</p>
                  <p className="text-xs text-muted-foreground">{format(new Date(enrollment.createdAt), 'PPP p')}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="font-medium">₹{(enrollment.amount / 100).toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Course Enrollment</p>
                  </div>
                  <Badge variant={enrollment.status === 'Active' ? 'default' : enrollment.status === 'Pending' ? 'secondary' : 'destructive'}>
                    {enrollment.status}
                  </Badge>
                </div>
              </div>
            ))}
            {enrollments.length === 0 && (
              <p className="text-center text-muted-foreground py-8">No transactions found</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
