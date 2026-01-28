"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { User, Calendar, Clock, DollarSign } from "lucide-react";
import { requestToJoinGroup } from "@/app/actions/groups";
import { toast } from "sonner";
import Image from "next/image";

interface PackageProps {
    packages: any[];
}

export function PackagesList({ packages }: PackageProps) {
    if (packages.length === 0) return null;

    return (
        <div className="space-y-4 mb-8">
            <h2 className="text-2xl font-bold">Featured Group Classes & Packages</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {packages.map(pkg => (
                    <Card key={pkg.id} className="overflow-hidden flex flex-col">
                        {pkg.bannerUrl ? (
                            <div className="relative h-48 w-full">
                                <Image
                                    src={pkg.bannerUrl}
                                    alt={pkg.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        ) : (
                            <div className="h-4 bg-gradient-to-r from-blue-500 to-purple-500" />
                        )}
                        <CardHeader>
                            <div className="flex justify-between items-start gap-2">
                                <CardTitle className="text-lg line-clamp-1">{pkg.title}</CardTitle>
                                <Badge variant="secondary" className="shrink-0 flex gap-1">
                                    <DollarSign className="h-3 w-3" />
                                    {pkg.price}
                                </Badge>
                            </div>
                            <CardDescription className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                {pkg.teacher.user.name}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <p className="text-sm text-gray-600 line-clamp-3 mb-4">{pkg.description}</p>
                            <div className="flex gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {formatDate(pkg.scheduledAt)}
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {pkg.duration}m
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <form action={async () => {
                                const result = await requestToJoinGroup(pkg.id);
                                if (result.success) {
                                    toast.success("Request Sent", { description: "Teacher will review your request." });
                                } else {
                                    toast.error(result.error);
                                }
                            }} className="w-full">
                                <Button className="w-full">Join Class</Button>
                            </form>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
