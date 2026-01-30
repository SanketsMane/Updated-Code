import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Ticket, Percent, Hash } from "lucide-react";

export function CouponStats({ total, active }: { total: number, active: number }) {
    return (
        <div className="grid gap-4 md:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Coupons</CardTitle>
                    <Ticket className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{total}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Coupons</CardTitle>
                    <div className="h-4 w-4 rounded-full bg-green-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{active}</div>
                </CardContent>
            </Card>
        </div>
    );
}
