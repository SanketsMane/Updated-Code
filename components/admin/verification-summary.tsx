import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  UserCheck, 
  Wallet, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  TrendingUp
} from "lucide-react";
import Link from "next/link";
import { getVerificationStats } from "@/app/data/admin/verification-data";

export default async function VerificationSummary() {
  const stats = await getVerificationStats();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCheck className="h-5 w-5" />
          Verification Center Overview
        </CardTitle>
        <CardDescription>
          Quick overview of pending verifications and payouts
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Pending Verifications</span>
              <Badge variant="outline" className="bg-orange-100 text-orange-700">
                {stats.pendingVerifications}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Pending Payouts</span>
              <Badge variant="outline" className="bg-blue-100 text-blue-700">
                {stats.pendingPayouts}
              </Badge>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Verified Teachers</span>
              <span className="text-sm font-medium">{stats.verifiedTeachers}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Monthly Payouts</span>
              <span className="text-sm font-medium">${stats.monthlyPayouts.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button asChild size="sm" className="flex-1">
            <Link href="/admin/verification">
              View All
            </Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="flex-1">
            <Link href="/admin/verification/profiles">
              Review Profiles
            </Link>
          </Button>
        </div>

        {/* Recent Activity Indicator */}
        {stats.pendingVerifications > 0 || stats.pendingPayouts > 0 ? (
          <div className="flex items-center gap-2 p-2 bg-orange-50 border border-orange-200 rounded-lg">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <span className="text-sm text-orange-700">
              {stats.pendingVerifications + stats.pendingPayouts} items need your attention
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-sm text-green-700">
              All verifications and payouts are up to date
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}