"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { saveBankDetails } from "@/app/actions/teacher-verification";

export function BankDetailsForm({ initialData }: { initialData?: any }) {
    const [isPending, startTransition] = useTransition();

    const handleSubmit = (formData: FormData) => {
        const data = {
            bankAccountName: formData.get("bankAccountName") as string,
            bankAccountNumber: formData.get("bankAccountNumber") as string,
            bankRoutingNumber: formData.get("bankRoutingNumber") as string,
        };

        startTransition(async () => {
            try {
                await saveBankDetails(data);
                toast.success("Bank details saved successfully");
            } catch (e) {
                toast.error("Failed to save bank details");
            }
        });
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-100 rounded-full">
                        <CreditCard className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                        <CardTitle>Bank Account Details</CardTitle>
                        <CardDescription>
                            Required for receiving payouts
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <form action={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="bankAccountName">Account Holder Name</Label>
                            <Input id="bankAccountName" name="bankAccountName" defaultValue={initialData?.bankAccountName || ""} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="bankAccountNumber">Account Number</Label>
                            <Input id="bankAccountNumber" name="bankAccountNumber" type="text" defaultValue={initialData?.bankAccountNumber || ""} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="bankRoutingNumber">Routing Number</Label>
                            <Input id="bankRoutingNumber" name="bankRoutingNumber" defaultValue={initialData?.bankRoutingNumber || ""} required />
                        </div>
                    </div>
                    <Button type="submit" disabled={isPending}>
                        {isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                        Save Bank Details
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
