"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { CreditCard, RefreshCcw } from "lucide-react";

export default function PaymentsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const isRefunds = pathname?.includes("/refunds");

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4">
                <h1 className="text-3xl font-bold tracking-tight">Payments & Financials</h1>
                <p className="text-muted-foreground">
                    Manage teacher payouts and student refund requests.
                </p>
            </div>

            <div className="flex items-center gap-4 border-b">
                <Link
                    href="/admin/payments/payouts"
                    className={cn(
                        "flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium transition-colors hover:text-primary",
                        !isRefunds
                            ? "border-primary text-primary"
                            : "border-transparent text-muted-foreground"
                    )}
                >
                    <CreditCard className="h-4 w-4" />
                    Withdraw Requests
                </Link>
                <Link
                    href="/admin/payments/refunds"
                    className={cn(
                        "flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium transition-colors hover:text-primary",
                        isRefunds
                            ? "border-primary text-primary"
                            : "border-transparent text-muted-foreground"
                    )}
                >
                    <RefreshCcw className="h-4 w-4" />
                    Refund Requests
                </Link>
            </div>

            <div className="min-h-[400px]">
                {children}
            </div>
        </div>
    );
}
