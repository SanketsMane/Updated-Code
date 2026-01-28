import { requireUser } from "@/app/data/user/require-user";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Download, ExternalLink, BookOpen, File, Video } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

async function getStudentResources(userId: string) {
    // Get resources from courses the student is enrolled in
    /* 
       Schema Note: Resources are linked to Courses or Teachers.
       We need to find Enrollments -> Course -> Resources.
    */

    const enrollments = await prisma.enrollment.findMany({
        where: {
            userId,
            status: "Active"
        },
        include: {
            Course: {
                include: {
                    resources: {
                        orderBy: { createdAt: 'desc' }
                    },
                    user: { // Instructor
                        select: { name: true }
                    }
                }
            }
        }
    });

    // Flatten resources
    const resources = enrollments.flatMap(enrollment =>
        enrollment.Course.resources.map(resource => ({
            ...resource,
            courseTitle: enrollment.Course.title,
            instructorName: enrollment.Course.user.name
        }))
    );

    return resources;
}

export default async function ResourcesPage() {
    const user = await requireUser();
    const resources = await getStudentResources(user.id);

    const getFileIcon = (type: string | null) => {
        const t = type?.toLowerCase() || '';
        if (t.includes('pdf')) return <FileText className="h-5 w-5 text-red-500" />;
        if (t.includes('video') || t.includes('mp4')) return <Video className="h-5 w-5 text-blue-500" />;
        if (t.includes('image') || t.includes('png') || t.includes('jpg')) return <File className="h-5 w-5 text-purple-500" />;
        return <File className="h-5 w-5 text-gray-500" />;
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Course Resources</h1>
                <p className="text-muted-foreground">
                    Access supplementary materials, assignments, and guides from your enrolled courses.
                </p>
            </div>

            {resources.length === 0 ? (
                <Card className="text-center py-12">
                    <CardContent>
                        <div className="flex justify-center mb-4">
                            <BookOpen className="h-16 w-16 text-muted-foreground/50" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">No Resources Found</h3>
                        <p className="text-muted-foreground max-w-md mx-auto mb-6">
                            None of your enrolled courses have shared resources yet.
                            Check back later or browse new courses.
                        </p>
                        <Link href="/dashboard/courses">
                            <Button>Go to My Courses</Button>
                        </Link>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {resources.map((resource) => (
                        <Card key={resource.id} className="group hover:shadow-md transition-shadow">
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <div className="p-2 bg-muted rounded-lg group-hover:bg-primary/10 transition-colors">
                                        {getFileIcon(resource.fileType)}
                                    </div>
                                    <Badge variant="outline" className="text-xs truncate max-w-[120px]">
                                        {resource.courseTitle}
                                    </Badge>
                                </div>
                                <CardTitle className="mt-4 text-lg line-clamp-1">{resource.title}</CardTitle>
                                {resource.description && (
                                    <CardDescription className="line-clamp-2 text-xs mt-1">
                                        {resource.description}
                                    </CardDescription>
                                )}
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                                    <span>{resource.instructorName}</span>
                                    <span>{new Date(resource.createdAt).toLocaleDateString()}</span>
                                </div>
                                <Button className="w-full" variant="outline" asChild>
                                    <a href={resource.fileUrl} target="_blank" rel="noopener noreferrer">
                                        <Download className="mr-2 h-4 w-4" />
                                        Download Resource
                                    </a>
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
