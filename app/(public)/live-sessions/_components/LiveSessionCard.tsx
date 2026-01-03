import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, DollarSign, Users, Star, Video } from "lucide-react";
import Link from "next/link";
import { format, formatDistance } from "date-fns";

interface LiveSessionCardProps {
  session: {
    id: string;
    title: string;
    description: string | null;
    subject: string;
    scheduledAt: Date | null;
    duration: number;
    price: number;
    maxParticipants: number | null;
    studentRating: number | null;
    _count: {
      bookings: number;
    };
    teacher: {
      user: {
        name: string;
        image: string | null;
      };
      profile: {
        bio: string | null;
      } | null;
    };
  };
}

export function LiveSessionCard({ session }: LiveSessionCardProps) {
  const spotsLeft = session.maxParticipants 
    ? session.maxParticipants - session._count.bookings 
    : null;
  
  const isFull = spotsLeft !== null && spotsLeft <= 0;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <Badge variant="secondary" className="font-medium">
            {session.subject}
          </Badge>
          {session.studentRating && (
            <div className="flex items-center gap-1 text-sm">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">{session.studentRating.toFixed(1)}</span>
            </div>
          )}
        </div>
        
        <h3 className="font-bold text-lg leading-tight line-clamp-2">
          {session.title}
        </h3>
        
        {session.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
            {session.description}
          </p>
        )}
      </CardHeader>

      <CardContent className="space-y-3 pb-3">
        {/* Instructor */}
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={session.teacher.user.image || undefined} />
            <AvatarFallback>
              {session.teacher.user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{session.teacher.user.name}</p>
            <p className="text-xs text-muted-foreground">Instructor</p>
          </div>
        </div>

        {/* Session Details */}
        <div className="space-y-2">
          {session.scheduledAt && (
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{format(session.scheduledAt, "MMM dd, yyyy")}</span>
              <span className="text-muted-foreground">•</span>
              <span>{format(session.scheduledAt, "h:mm a")}</span>
            </div>
          )}
          
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{session.duration} minutes</span>
          </div>

          {session.maxParticipants && (
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>
                {session._count.bookings}/{session.maxParticipants} enrolled
              </span>
              {spotsLeft !== null && spotsLeft > 0 && spotsLeft <= 3 && (
                <Badge variant="destructive" className="text-xs">
                  Only {spotsLeft} left!
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Price */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-1">
            <DollarSign className="h-5 w-5 text-green-600" />
            <span className="text-2xl font-bold">${(session.price / 100).toFixed(0)}</span>
          </div>
          
          {session.scheduledAt && (
            <div className="text-xs text-muted-foreground">
              {formatDistance(session.scheduledAt, new Date(), { addSuffix: true })}
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-3">
        <Link href={`/live-sessions/${session.id}`} className="w-full">
          <Button 
            className="w-full" 
            disabled={isFull}
            variant={isFull ? "secondary" : "default"}
          >
            {isFull ? (
              <>
                <Users className="mr-2 h-4 w-4" />
                Session Full
              </>
            ) : (
              <>
                <Video className="mr-2 h-4 w-4" />
                View Details
              </>
            )}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
