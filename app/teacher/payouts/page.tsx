import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  Wallet,
  DollarSign,
  Clock,
  CheckCircle,
  TrendingUp,
  CreditCard,
  AlertCircle
} from "lucide-react";
import { requireTeacher } from "@/app/data/auth/require-roles";
import { getTeacherPayoutData } from "@/app/actions/teacher-payouts";
import { PayoutButton } from "./payout-button";

export const dynamic = "force-dynamic";

export default async function TeacherPayoutsPage() {
  await requireTeacher();

  // Fetch real data
  const data = await getTeacherPayoutData();

  const earningsData = {
    totalEarnings: data.totalEarnings,
    availableForPayout: data.availableForPayout,
    pendingPayouts: data.pendingPayouts,
    totalSessions: data.totalSessions,
    averageSessionEarning: data.averageSessionEarning
  };

  const payoutHistory = data.payoutHistory;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
      case 'Paid':
      case 'Processed':
      case 'processed':
        return <Badge className="bg-green-100 text-green-700">Processed</Badge>
      case 'Approved':
      case 'approved':
        return <Badge className="bg-blue-100 text-blue-700">Approved</Badge>
      case 'Pending':
      case 'pending':
        return <Badge className="bg-orange-100 text-orange-700">Pending</Badge>
      case 'Rejected':
      case 'rejected':
        return <Badge className="bg-red-100 text-red-700">Rejected</Badge>
      case 'Processing':
        return <Badge className="bg-purple-100 text-purple-700">Processing</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Payouts & Earnings</h1>
        <p className="text-muted-foreground">
          Manage your earnings and request payouts
        </p>
      </div>

      {/* Earnings Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${earningsData.totalEarnings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            <p className="text-xs text-muted-foreground">
              From {earningsData.totalSessions} sessions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${earningsData.availableForPayout.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            <p className="text-xs text-muted-foreground">
              Ready for payout
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payouts</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${earningsData.pendingPayouts.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            <p className="text-xs text-muted-foreground">
              Under review
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg per Session</CardTitle>
            <Wallet className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${earningsData.averageSessionEarning.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Average earning
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Payout Actions
          </CardTitle>
          <CardDescription>
            Request a payout or manage your earnings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <PayoutButton disabled={earningsData.availableForPayout < 50} />

            <Link href="/teacher/verification" passHref className="flex-1">
              <Button variant="outline" className="w-full">
                <CreditCard className="h-4 w-4 mr-2" />
                Manage Bank Details
              </Button>
            </Link>
          </div>

          {earningsData.availableForPayout < 50 && (
            <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-orange-800">Minimum payout amount</p>
                  <p className="text-orange-700">
                    You need at least $50.00 to request a payout. Current balance: ${earningsData.availableForPayout.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payout History */}
      <Card>
        <CardHeader>
          <CardTitle>Payout History</CardTitle>
          <CardDescription>
            Your recent payout requests and their status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {payoutHistory.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No payout history found.</p>
            ) : (
              payoutHistory.map((payout) => (
                <Card key={payout.id} className="border-l-4 border-l-blue-500 overflow-hidden">
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-lg">${payout.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                          {getStatusBadge(payout.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Requested on {payout.requestedAt}
                          {payout.processedAt && ` • Processed on ${payout.processedAt}`}
                        </p>
                      </div>
                      <div className="text-right">
                        {['Completed', 'Paid', 'Processed'].includes(payout.status) && (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        )}
                        {['Pending', 'UnderReview'].includes(payout.status) && (
                          <Clock className="h-5 w-5 text-orange-500" />
                        )}
                        {payout.status === 'Approved' && (
                          <div className="text-sm">
                            <p className="font-medium text-blue-600">Approved</p>
                            <p className="text-muted-foreground">Processing...</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}

          </div>
        </CardContent>
      </Card>

      {/* Earnings Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Earnings Breakdown</CardTitle>
          <CardDescription>
            Detailed view of your earnings and deductions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gross Earnings:</span>
                  <span className="font-medium">${earningsData.totalEarnings.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Platform Fee (Already Deducted):</span>
                  <span className="font-medium text-muted-foreground">N/A</span>
                  {/* Note: In our current model, totalEarnings IS net earnings. Commission table specific type. 
                      Let's clarify in UI that this is NET. */}
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  {/* Simplified for now as we don't store historical paid amount explicitly separately from processed requests */}
                </div>

                <div className="flex justify-between pt-2 border-t mt-4">
                  <span className="font-medium">Available Balance:</span>
                  <span className="font-bold text-green-600">${earningsData.availableForPayout.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground italic">
              * Earnings shown are net after platform fees.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}