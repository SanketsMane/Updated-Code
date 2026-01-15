import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Award, Download, ExternalLink, Calendar, BookOpen, User } from "lucide-react";
import { getUserCertificates } from "@/app/data/student/get-user-certificates";
import { getSessionWithRole } from "@/app/data/auth/require-roles";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function CertificatesPage() {
    const session = await getSessionWithRole();

    if (!session) {
        redirect("/auth/login");
    }

    const certificates = await getUserCertificates(session.user.id);

    return (
        <div className="space-y-6 p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-amber-900 to-amber-600 dark:from-white dark:to-amber-100 bg-clip-text text-transparent">
                    Certificates & Awards
                </h1>
                <p className="text-muted-foreground">
                    View and download your earned course completion certificates
                </p>
            </div>

            {/* Stats Card */}
            <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200 dark:border-amber-800">
                <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-full">
                            <Award className="h-8 w-8 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-amber-900 dark:text-amber-100">{certificates.length}</p>
                            <p className="text-sm text-amber-700 dark:text-amber-300">
                                {certificates.length === 1 ? 'Certificate Earned' : 'Certificates Earned'}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Certificates Grid */}
            {certificates.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {certificates.map((cert) => (
                        <Card key={cert.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                            {/* Certificate Header with Icon */}
                            <div className="bg-gradient-to-br from-amber-500 to-orange-500 p-6 text-white">
                                <div className="flex items-center justify-between mb-4">
                                    <Award className="h-12 w-12 opacity-90" />
                                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                                        #{cert.certificateNumber}
                                    </Badge>
                                </div>
                                <h3 className="font-bold text-lg line-clamp-2">{cert.courseName}</h3>
                            </div>

                            <CardContent className="p-6 space-y-4">
                                {/* Certificate Details */}
                                <div className="space-y-3 text-sm">
                                    <div className="flex items-start gap-2">
                                        <User className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                                        <div>
                                            <p className="text-xs text-muted-foreground">Student</p>
                                            <p className="font-medium">{cert.studentName}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-2">
                                        <BookOpen className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                                        <div>
                                            <p className="text-xs text-muted-foreground">Instructor</p>
                                            <p className="font-medium">{cert.teacherName}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-2">
                                        <Calendar className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                                        <div>
                                            <p className="text-xs text-muted-foreground">Completed</p>
                                            <p className="font-medium">{format(new Date(cert.completionDate), 'MMM dd, yyyy')}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2 pt-2">
                                    <Button
                                        asChild
                                        className="flex-1 bg-amber-600 hover:bg-amber-700"
                                        size="sm"
                                    >
                                        <Link href={`/api/certificates/${cert.id}/download`}>
                                            <Download className="h-4 w-4 mr-2" />
                                            Download
                                        </Link>
                                    </Button>

                                    {cert.verificationUrl && (
                                        <Button
                                            asChild
                                            variant="outline"
                                            size="sm"
                                        >
                                            <Link href={cert.verificationUrl} target="_blank">
                                                <ExternalLink className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="p-4 bg-muted rounded-full mb-4">
                            <Award className="h-12 w-12 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">No Certificates Yet</h3>
                        <p className="text-muted-foreground mb-6 max-w-sm">
                            Complete courses to earn certificates and showcase your achievements
                        </p>
                        <Button asChild>
                            <Link href="/courses">
                                Browse Courses
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
