"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Calendar,
  Clock,
  DollarSign,
  Video,
  ArrowLeft,
  Mail,
  User,
  Users,
  AlertCircle,
  Clock3,
  CheckCircle2,
  XCircle,
  FileText,
  ChevronRight
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { MotionWrapper } from "@/components/ui/motion-wrapper";

interface Session {
  id: string;
  title: string;
  description?: string;
  subject?: string;
  scheduledAt: string;
  duration: number;
  price: number;
  status: string;
  timezone: string;
  meetingUrl?: string;
  notes?: string;
  student?: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
}

export default function SessionDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await fetch(`/api/teacher/sessions/${id}`);
        if (!response.ok) {
          if (response.status === 404) {
            toast.error("Session not found");
            router.push("/teacher/sessions");
            return;
          }
          throw new Error("Failed to fetch session details");
        }
        const data = await response.json();
        setSession(data.session);
      } catch (error) {
        console.error("Error fetching session:", error);
        toast.error("Could not load session details");
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [id, router]);

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(cents / 100);
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6 max-w-5xl mx-auto">
        <Skeleton className="h-8 w-48" />
        <Card>
          <CardHeader>
            <Skeleton className="h-10 w-2/3" />
            <Skeleton className="h-6 w-1/3" />
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-32 w-full" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-40 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!session) return null;

  const isScheduled = session.status.toLowerCase() === "scheduled";
  const isCompleted = session.status.toLowerCase() === "completed";
  const isCancelled = session.status.toLowerCase() === "cancelled";

  return (
    <MotionWrapper className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <Link href="/teacher/sessions" className="hover:text-primary transition-colors">
          Live Sessions
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium">Session Details</span>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <Link href="/teacher/sessions" className="flex items-center text-sm text-muted-foreground hover:text-primary mb-2 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Sessions
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">{session.title}</h1>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <Badge variant={isScheduled ? "default" : isCompleted ? "secondary" : "destructive"} className="px-3 py-1">
              {isScheduled && <Clock3 className="w-3.5 h-3.5 mr-1.5" />}
              {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />}
              {isCancelled && <XCircle className="w-3.5 h-3.5 mr-1.5" />}
              {session.status}
            </Badge>
            {session.subject && <Badge variant="outline" className="px-3 py-1">{session.subject}</Badge>}
          </div>
        </div>

        <div className="flex gap-3">
          {isScheduled && (
            <Link href={`/video-call/${session.id}`}>
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/20">
                <Video className="w-5 h-5 mr-2" />
                Start Live Session
              </Button>
            </Link>
          )}
          {isScheduled && !session.student && (
            <Link href={`/teacher/sessions/${session.id}/edit`}>
              <Button variant="outline" size="lg">Edit Session</Button>
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden border-none shadow-sm bg-muted/30">
            <CardHeader className="bg-muted/50 pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Session Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold text-[10px]">Scheduled Date</p>
                    <p className="font-semibold text-lg">{format(new Date(session.scheduledAt), "EEEE, MMMM dd, yyyy")}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <Clock className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold text-[10px]">Start Time</p>
                    <p className="font-semibold text-lg">{format(new Date(session.scheduledAt), "hh:mm a")} ({session.timezone})</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <Clock3 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold text-[10px]">Duration</p>
                    <p className="font-semibold text-lg">{session.duration} Minutes</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                    <DollarSign className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold text-[10px]">Earnings</p>
                    <p className="font-semibold text-lg text-orange-600">{formatCurrency(session.price)}</p>
                  </div>
                </div>
              </div>

              {session.description && (
                <div className="pt-4 border-t border-muted">
                  <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold text-[10px] mb-2">Description</p>
                  <p className="text-foreground leading-relaxed italic">"{session.description}"</p>
                </div>
              )}
            </CardContent>
          </Card>

          {isScheduled && new Date(session.scheduledAt) > new Date() && (
            <Card className="border-blue-100 bg-blue-50/30 dark:border-blue-900/30 dark:bg-blue-900/10">
              <CardContent className="p-4 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600" />
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  This session starts in <strong>{formatDistanceToNow(new Date(session.scheduledAt))}</strong>. 
                  Please ensure you join 5 minutes early for a better experience.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar - Student Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Student Profile
              </CardTitle>
              <CardDescription>Attendee for this session</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {session.student ? (
                <div className="space-y-6">
                  <div className="flex flex-col items-center text-center space-y-3">
                    <Avatar className="h-24 w-24 border-4 border-background shadow-xl">
                      <AvatarImage src={session.student.image} />
                      <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
                        {session.student.name?.substring(0, 2).toUpperCase() || "ST"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <h3 className="font-bold text-xl">{session.student.name}</h3>
                      <p className="text-sm text-muted-foreground flex items-center justify-center">
                        <Mail className="w-3.5 h-3.5 mr-1.5" />
                        {session.student.email}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <Button variant="outline" className="w-full" size="sm">
                      <Mail className="w-4 h-4 mr-2" />
                      Email
                    </Button>
                    <Button variant="outline" className="w-full" size="sm" disabled>
                      View Profile
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 space-y-3">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                    <Users className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold">No student booked yet</p>
                    <p className="text-sm text-muted-foreground px-4">
                      This session is currently available for booking in the marketplace.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {isCompleted && (
            <Card className="bg-green-50/50 dark:bg-green-900/10 border-green-100 dark:border-green-900/30">
              <CardHeader>
                <CardTitle className="text-sm font-bold text-green-700 dark:text-green-400">Post-Session Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {session.notes || "No notes recorded for this session."}
                </p>
                <Button variant="outline" size="sm" className="w-full border-green-200 hover:bg-green-100">
                  Update Notes
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </MotionWrapper>
  );
}
