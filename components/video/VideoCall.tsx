"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff, 
  Monitor, 
  MessageSquare,
  Users,
  Settings,
  Maximize
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// Removed server action imports - using API routes instead
import { formatDistanceToNow } from "date-fns";

interface VideoCallProps {
  sessionId: string;
  onCallEnd?: () => void;
}

interface MeetingRoom {
  sessionId: string;
  roomId: string;
  isTeacher: boolean;
  isStudent: boolean;
  teacherName: string;
  studentName: string;
  sessionTitle: string;
  scheduledTime: string;
  duration: number;
  status: string;
}

export default function VideoCall({ sessionId, onCallEnd }: VideoCallProps) {
  const [meetingRoom, setMeetingRoom] = useState<MeetingRoom | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [callDuration, setCallDuration] = useState(0);
  const [showChat, setShowChat] = useState(false);
  const [participants, setParticipants] = useState<string[]>([]);

  useEffect(() => {
    loadMeetingRoom();
  }, [sessionId]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isConnected) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isConnected]);

  const loadMeetingRoom = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/video-call?sessionId=${sessionId}`);
      const room = await response.json();
      setMeetingRoom(room);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load meeting room");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinCall = async () => {
    if (!meetingRoom) return;

    try {
      // Update session status to in progress
      await fetch("/api/video-call", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, status: "InProgress" })
      });
      
      // Generate token for video call
      const tokenResponse = await fetch("/api/video-call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          action: "generateToken", 
          channelName: meetingRoom.roomId, 
          uid: meetingRoom.isTeacher ? "teacher" : "student"
        })
      });
      const tokenData = await tokenResponse.json();
      
      // In a real implementation, you would initialize the video SDK here
      // For now, we'll simulate the connection
      setIsConnected(true);
      setParticipants([meetingRoom.isTeacher ? meetingRoom.teacherName : meetingRoom.studentName]);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to join call");
    }
  };

  const handleEndCall = async () => {
    if (!meetingRoom) return;

    try {
      // Update session status to completed
      await fetch("/api/video-call", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, status: "Completed" })
      });
      setIsConnected(false);
      onCallEnd?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to end call");
    }
  };

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn);
  };

  const toggleAudio = () => {
    setIsAudioOn(!isAudioOn);
  };

  const toggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing);
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-8 text-center">
          <div className="animate-pulse">
            <Video className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p>Loading video call...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-8 text-center">
          <div className="text-red-500">
            <VideoOff className="h-12 w-12 mx-auto mb-4" />
            <p className="font-medium mb-2">Call Error</p>
            <p className="text-sm">{error}</p>
            <Button onClick={loadMeetingRoom} className="mt-4">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!meetingRoom) return null;

  return (
    <div className="w-full h-full flex flex-col bg-gray-900 text-white">
      {!isConnected ? (
        // Pre-call screen
        <Card className="w-full max-w-2xl mx-auto mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5" />
              {meetingRoom.sessionTitle}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <Avatar className="h-20 w-20 mx-auto">
                <AvatarFallback className="text-2xl">
                  {meetingRoom.isTeacher ? meetingRoom.teacherName.charAt(0) : meetingRoom.studentName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              
              <div>
                <p className="font-medium">
                  {meetingRoom.isTeacher ? `Teaching ${meetingRoom.studentName}` : `Learning with ${meetingRoom.teacherName}`}
                </p>
                <p className="text-sm text-muted-foreground">
                  Scheduled {formatDistanceToNow(new Date(meetingRoom.scheduledTime), { addSuffix: true })}
                </p>
                <p className="text-sm text-muted-foreground">
                  Duration: {meetingRoom.duration} minutes
                </p>
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <Button
                variant={isVideoOn ? "default" : "destructive"}
                size="lg"
                onClick={toggleVideo}
              >
                {isVideoOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
              </Button>
              <Button
                variant={isAudioOn ? "default" : "destructive"}
                size="lg"
                onClick={toggleAudio}
              >
                {isAudioOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
              </Button>
            </div>

            <Button onClick={handleJoinCall} size="lg" className="w-full">
              <Phone className="h-4 w-4 mr-2" />
              Join Call
            </Button>
          </CardContent>
        </Card>
      ) : (
        // In-call screen
        <div className="flex-1 flex flex-col">
          {/* Call header */}
          <div className="bg-black/50 p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Badge variant="secondary">
                {formatDuration(callDuration)}
              </Badge>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="text-sm">{participants.length} participant(s)</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant={meetingRoom.status === "InProgress" ? "default" : "secondary"}>
                {meetingRoom.status}
              </Badge>
            </div>
          </div>

          {/* Video area */}
          <div className="flex-1 relative bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
            <div className="text-center">
              <Avatar className="h-32 w-32 mx-auto mb-4">
                <AvatarFallback className="text-4xl">
                  {meetingRoom.isTeacher ? meetingRoom.teacherName.charAt(0) : meetingRoom.studentName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-medium">
                {meetingRoom.isTeacher ? meetingRoom.teacherName : meetingRoom.studentName}
              </h3>
              <p className="text-blue-200">
                {meetingRoom.isTeacher ? "Teacher" : "Student"}
              </p>
              
              {isScreenSharing && (
                <Badge className="mt-2 bg-green-600">
                  <Monitor className="h-3 w-3 mr-1" />
                  Screen Sharing
                </Badge>
              )}
            </div>

            {/* Video preview (self) */}
            <div className="absolute bottom-4 right-4 w-32 h-24 bg-black/50 rounded-lg flex items-center justify-center">
              {isVideoOn ? (
                <div className="text-center">
                  <Video className="h-6 w-6 mx-auto mb-1" />
                  <span className="text-xs">You</span>
                </div>
              ) : (
                <VideoOff className="h-6 w-6 text-gray-400" />
              )}
            </div>
          </div>

          {/* Call controls */}
          <div className="bg-black p-4">
            <div className="flex items-center justify-center gap-4">
              <Button
                variant={isAudioOn ? "secondary" : "destructive"}
                size="lg"
                className="rounded-full w-12 h-12"
                onClick={toggleAudio}
              >
                {isAudioOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
              </Button>

              <Button
                variant={isVideoOn ? "secondary" : "destructive"}
                size="lg"
                className="rounded-full w-12 h-12"
                onClick={toggleVideo}
              >
                {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
              </Button>

              <Button
                variant={isScreenSharing ? "default" : "secondary"}
                size="lg"
                className="rounded-full w-12 h-12"
                onClick={toggleScreenShare}
              >
                <Monitor className="h-5 w-5" />
              </Button>

              <Button
                variant="secondary"
                size="lg"
                className="rounded-full w-12 h-12"
                onClick={() => setShowChat(!showChat)}
              >
                <MessageSquare className="h-5 w-5" />
              </Button>

              <Button
                variant="secondary"
                size="lg"
                className="rounded-full w-12 h-12"
              >
                <Settings className="h-5 w-5" />
              </Button>

              <Button
                variant="destructive"
                size="lg"
                className="rounded-full w-12 h-12"
                onClick={handleEndCall}
              >
                <PhoneOff className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}