"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  AlertCircle,
  Laptop,
  Users,
  Settings,
  Maximize,
  Monitor,
  MessageSquare,
  PhoneOff
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
// Removed server action imports - using API routes instead
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import AgoraRTC, { 
  AgoraRTCProvider, 
  useRTCClient, 
  useJoin, 
  useLocalMicrophoneTrack, 
  useLocalCameraTrack, 
  usePublish, 
  useRemoteUsers,
  RemoteUser,
  LocalVideoTrack,
  LocalAudioTrack
} from "agora-rtc-react";

const agoraClient = typeof window !== 'undefined' ? AgoraRTC.createClient({ mode: "rtc", codec: "vp8" }) : null;
const screenShareClient = typeof window !== 'undefined' ? AgoraRTC.createClient({ mode: "rtc", codec: "vp8" }) : null;

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

export default function VideoCall(props: VideoCallProps) {
  if (!agoraClient) return <div className="p-8 text-center text-white">Initializing video...</div>;
  
  return (
    <AgoraRTCProvider client={agoraClient}>
      <VideoCallContent {...props} />
    </AgoraRTCProvider>
  );
}

function VideoCallContent({ sessionId, onCallEnd }: VideoCallProps) {
  const [meetingRoom, setMeetingRoom] = useState<MeetingRoom | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [callDuration, setCallDuration] = useState(0);
  const [showChat, setShowChat] = useState(false);
  const [isSecureContext, setIsSecureContext] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  
  // Device Selection State
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [microphones, setMicrophones] = useState<MediaDeviceInfo[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>("");
  const [selectedMicrophone, setSelectedMicrophone] = useState<string>("");

  // Screen Share State
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [screenTrack, setScreenTrack] = useState<any>(null);

  // Agora RTC Hooks
  const [agoraConfig, setAgoraConfig] = useState<{ appId: string; channel: string; token: string | null; uid: string | null } | null>(null);
  const [shouldJoin, setShouldJoin] = useState(false);
  
  const { localMicrophoneTrack } = useLocalMicrophoneTrack(!loading && isConnected, {
    microphoneId: selectedMicrophone
  });
  const { localCameraTrack } = useLocalCameraTrack(!loading && isConnected, {
    cameraId: selectedCamera
  });
  const remoteUsers = useRemoteUsers();

  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);

  // Join the channel
  useJoin({
    appid: agoraConfig?.appId || "",
    channel: agoraConfig?.channel || "",
    token: agoraConfig?.token || null,
    uid: agoraConfig?.uid || null,
  }, shouldJoin && !!agoraConfig);

  // Publish tracks
  usePublish([localMicrophoneTrack, localCameraTrack]);

  useEffect(() => {
    loadMeetingRoom();
    // Check for secure context (HTTPS or localhost)
    if (typeof window !== "undefined") {
      const secure = window.isSecureContext;
      setIsSecureContext(secure);
      
      // Enumerate devices if secure
      if (secure) {
        enumerateDevices();
      } else {
        console.warn("Media access (camera/mic) is restricted in non-secure contexts (HTTP). Please use HTTPS or localhost.");
      }
    }
  }, [sessionId]);

  const enumerateDevices = async () => {
    try {
      const devices = await AgoraRTC.getDevices();
      const videoDevices = devices.filter(d => d.kind === 'videoinput');
      const audioDevices = devices.filter(d => d.kind === 'audioinput');
      
      setCameras(videoDevices);
      setMicrophones(audioDevices);

      if (videoDevices.length > 0 && !selectedCamera) {
        setSelectedCamera(videoDevices[0].deviceId);
      }
      if (audioDevices.length > 0 && !selectedMicrophone) {
        setSelectedMicrophone(audioDevices[0].deviceId);
      }
    } catch (err) {
      console.error("Error enumerating devices:", err);
    }
  };

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

  // Effect to handle video/audio toggle
  useEffect(() => {
    if (localCameraTrack) {
      localCameraTrack.setEnabled(isVideoOn);
    }
  }, [isVideoOn, localCameraTrack]);

  useEffect(() => {
    if (localMicrophoneTrack) {
      localMicrophoneTrack.setEnabled(isAudioOn);
    }
  }, [isAudioOn, localMicrophoneTrack]);

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
      // Update session status to InProgress
      await fetch("/api/video-call", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, status: "InProgress" })
      });
      
      const uid = meetingRoom.isTeacher ? "teacher" : "student";
      
      // Generate token for video call
      const tokenResponse = await fetch("/api/video-call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          action: "generateToken", 
          channelName: meetingRoom.roomId, 
          uid: uid
        })
      });
      const data = await tokenResponse.json();
      
      if (data.error) throw new Error(data.error);

      setAgoraConfig({
        appId: data.token.appId,
        channel: data.token.channelName,
        token: data.token.token,
        uid: uid
      });
      
      setIsConnected(true);
      setShouldJoin(true);
      
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
      
      setShouldJoin(false);
      setIsConnected(false);
      
      // Close local tracks
      localCameraTrack?.close();
      localMicrophoneTrack?.close();
      
      onCallEnd?.();
      
      // Redirect based on role
      if (meetingRoom.isTeacher) {
        window.location.href = "/teacher/sessions";
      } else {
        window.location.href = "/dashboard/sessions";
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to end call");
    }
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
      <Card className="w-full max-w-4xl mx-auto h-[400px] flex items-center justify-center bg-gray-900 border-gray-800">
        <CardContent className="p-8 text-center text-white">
          <div className="animate-pulse">
            <Video className="h-12 w-12 mx-auto mb-4 text-blue-500" />
            <p className="text-lg">Initializing video session...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-4xl mx-auto mt-10 bg-gray-900 border-red-900/50">
        <CardContent className="p-8 text-center text-white">
          <div className="text-red-500">
            <VideoOff className="h-12 w-12 mx-auto mb-4" />
            <p className="font-bold text-xl mb-2">Call Error</p>
            <p className="text-gray-400 max-w-md mx-auto">{error}</p>
            <Button onClick={loadMeetingRoom} variant="outline" className="mt-6 border-red-900 hover:bg-red-900/20 text-red-400">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const toggleScreenShare = async () => {
    if (!isConnected || !meetingRoom) return;

    try {
      if (!isScreenSharing) {
        // Start screen sharing
        const track = await AgoraRTC.createScreenVideoTrack({}, "auto");
        
        // Handle track array or single track
        const actualTrack = Array.isArray(track) ? track[0] : track;
        setScreenTrack(actualTrack);
        
        // Wait for connection to be ready if it's not
        if (screenShareClient) {
          const uid = (meetingRoom.isTeacher ? "teacher" : "student") + "_screen";
          
          // Generate token for screen share (using the same channel)
          const tokenResponse = await fetch("/api/video-call", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              action: "generateToken", 
              channelName: meetingRoom.roomId, 
              uid: uid
            })
          });
          const data = await tokenResponse.json();
          
          await screenShareClient.join(data.token.appId, data.token.channelName, data.token.token, uid);
          await screenShareClient.publish(actualTrack);
          
          setIsScreenSharing(true);
          toast.success("Screen sharing started");

          // Handle case where user stops sharing via browser UI
          actualTrack.on("track-ended", () => {
            stopScreenShare(actualTrack);
          });
        }
      } else {
        stopScreenShare(screenTrack);
      }
    } catch (err) {
      console.error("Screen share error:", err);
      toast.error("Failed to start screen share. Please ensure you are in a secure context (HTTPS/localhost).");
    }
  };

  const stopScreenShare = async (track: any) => {
    try {
      if (track) {
        track.stop();
        track.close();
      }
      if (screenShareClient) {
        await screenShareClient.unpublish();
        await screenShareClient.leave();
      }
      setScreenTrack(null);
      setIsScreenSharing(false);
      toast.info("Screen sharing stopped");
    } catch (err) {
      console.error("Error stopping screen share:", err);
    }
  };

  const SettingsDialog = () => (
    <Dialog open={showSettings} onOpenChange={setShowSettings}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Settings className="h-5 w-5 text-blue-500" />
            Device Settings
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-400">Camera</Label>
            <Select value={selectedCamera} onValueChange={setSelectedCamera}>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white focus:ring-blue-500">
                <SelectValue placeholder="Select Camera" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                {cameras.map((camera) => (
                  <SelectItem key={camera.deviceId} value={camera.deviceId}>
                    {camera.label || `Camera ${camera.deviceId.slice(0, 5)}...`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-400">Microphone</Label>
            <Select value={selectedMicrophone} onValueChange={setSelectedMicrophone}>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white focus:ring-blue-500">
                <SelectValue placeholder="Select Microphone" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                {microphones.map((mic) => (
                  <SelectItem key={mic.deviceId} value={mic.deviceId}>
                    {mic.label || `Mic ${mic.deviceId.slice(0, 5)}...`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="pt-4 border-t border-gray-800 flex justify-end">
            <Button onClick={() => setShowSettings(false)} className="bg-blue-600 hover:bg-blue-700 text-white px-8">
              Done
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  if (!meetingRoom) return null;

  return (
    <div className="w-full h-full flex flex-col bg-gray-950 text-white overflow-hidden">
      {/* Secure Context Warning */}
      {!isSecureContext && (
        <div className="bg-amber-600/90 text-white px-4 py-2 text-center text-sm font-medium z-50 flex items-center justify-center gap-2">
          Camera and Microphone may not work on HTTP. Use HTTPS or enable Chrome "Insecure Origins" flag.
          <Button 
            variant="link" 
            className="text-white underline p-0 h-auto text-sm" 
            onClick={() => window.open('https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts', '_blank')}
          >
            Learn more
          </Button>
        </div>
      )}

      {!isConnected ? (
        // Pre-call screen
        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl bg-gray-900 border-gray-800 shadow-2xl">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-blue-500/10 p-3 rounded-full">
                  <Video className="h-8 w-8 text-blue-500" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold tracking-tight text-white">
                {meetingRoom.sessionTitle}
              </CardTitle>
              <CardDescription className="text-gray-400">
                Ready to join your live session?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="text-center space-y-4">
                <Avatar className="h-24 w-24 mx-auto border-2 border-blue-500/30">
                  <AvatarFallback className="text-3xl bg-gray-800 text-blue-400">
                    {meetingRoom.isTeacher ? meetingRoom.teacherName.charAt(0) : meetingRoom.studentName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                
                <div>
                  <p className="font-semibold text-xl text-white">
                    {meetingRoom.isTeacher ? `Teaching ${meetingRoom.studentName}` : `Learning with ${meetingRoom.teacherName}`}
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    Scheduled {formatDistanceToNow(new Date(meetingRoom.scheduledTime), { addSuffix: true })}
                  </p>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <Badge variant="outline" className="text-blue-400 border-blue-400/30 bg-blue-400/5">
                      {meetingRoom.duration} minutes
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex justify-center gap-6">
                <div className="flex flex-col items-center gap-2">
                  <Button
                    variant={isVideoOn ? "secondary" : "destructive"}
                    size="icon"
                    className="h-14 w-14 rounded-full"
                    onClick={() => setIsVideoOn(!isVideoOn)}
                  >
                    {isVideoOn ? <Video className="h-6 w-6" /> : <VideoOff className="h-6 w-6" />}
                  </Button>
                  <span className="text-xs text-gray-400">{isVideoOn ? "Camera On" : "Camera Off"}</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Button
                    variant={isAudioOn ? "secondary" : "destructive"}
                    size="icon"
                    className="h-14 w-14 rounded-full"
                    onClick={() => setIsAudioOn(!isAudioOn)}
                  >
                    {isAudioOn ? <Mic className="h-6 w-6" /> : <MicOff className="h-6 w-6" />}
                  </Button>
                  <span className="text-xs text-gray-400">{isAudioOn ? "Mic On" : "Mic Off"}</span>
                </div>
              </div>

              <Button onClick={handleJoinCall} size="lg" className="w-full h-14 text-lg font-semibold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-900/20">
                <Phone className="h-5 w-5 mr-2" />
                Join Session Now
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        // In-call screen
        <div className="flex-1 flex flex-col relative">
          {/* Top Overlay */}
          <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-black/80 to-transparent flex items-center justify-between pointer-events-none">
            <div className="flex items-center gap-4 pointer-events-auto">
              <Badge variant="secondary" className="bg-black/40 backdrop-blur-md border-white/10 px-3 py-1 font-mono text-lg font-bold">
                {formatDuration(callDuration)}
              </Badge>
              <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md border-white/10 px-3 py-1 rounded-full">
                <Users className="h-4 w-4 text-blue-400" />
                <span className="text-sm font-medium">{remoteUsers.length + 1} Online</span>
              </div>
            </div>
            <div className="pointer-events-auto">
              <Badge className="bg-blue-600 border-none px-3 py-1 font-semibold uppercase tracking-wider text-[10px]">
                Live Session
              </Badge>
            </div>
          </div>

          {/* Video Grid */}
          <div className="flex-1 overflow-hidden">
            <div className={`h-full w-full grid gap-4 p-4 ${
              remoteUsers.length === 0 ? 'grid-cols-1' : 
              remoteUsers.length === 1 ? 'grid-cols-1 md:grid-cols-2' : 
              'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            }`}>
              {/* Local User */}
              <div className="relative rounded-2xl overflow-hidden bg-gray-900 border border-white/5 shadow-2xl group min-h-[300px]">
                {isVideoOn ? (
                  <LocalVideoTrack track={localCameraTrack} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900">
                    <Avatar className="h-24 w-24 mb-4 ring-4 ring-white/5">
                      <AvatarFallback className="text-3xl bg-gray-800 text-white font-bold">
                        {meetingRoom.isTeacher ? meetingRoom.teacherName.charAt(0) : meetingRoom.studentName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <p className="text-lg font-medium text-white/80">You (Camera Off)</p>
                  </div>
                )}
                <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 z-10 transition-opacity">
                  <span className="text-sm font-medium">You</span>
                  {!isAudioOn && <MicOff className="h-3.5 w-3.5 text-red-500" />}
                </div>
              </div>

              {/* Remote Users */}
              {remoteUsers.map((user) => (
                <div key={user.uid} className="relative rounded-2xl overflow-hidden bg-gray-900 border border-white/5 shadow-2xl min-h-[300px]">
                  <RemoteUser user={user} className="w-full h-full object-cover" />
                  <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 z-10">
                    <span className="text-sm font-medium capitalize">{user.uid}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Control Bar */}
          <div className="p-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
            <div className="max-w-screen-md mx-auto flex items-center justify-center gap-4">
              <div className="flex items-center gap-3 p-2 bg-white/10 backdrop-blur-xl rounded-full border border-white/10">
                <Button
                  variant={isAudioOn ? "secondary" : "destructive"}
                  size="icon"
                  className="h-12 w-12 rounded-full transition-all hover:scale-105"
                  onClick={() => setIsAudioOn(!isAudioOn)}
                >
                  {isAudioOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                </Button>

                <Button
                  variant={isVideoOn ? "secondary" : "destructive"}
                  size="icon"
                  className="h-12 w-12 rounded-full transition-all hover:scale-105"
                  onClick={() => setIsVideoOn(!isVideoOn)}
                >
                  {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                </Button>

                <Button
                  variant={isScreenSharing ? "default" : "secondary"}
                  size="icon"
                  className={`h-12 w-12 rounded-full transition-all hover:scale-105 ${isScreenSharing ? "bg-blue-600 text-white" : ""}`}
                  onClick={toggleScreenShare}
                >
                  <Monitor className="h-5 w-5" />
                </Button>

                <Button
                  variant={showChat ? "default" : "secondary"}
                  size="icon"
                  className="h-12 w-12 rounded-full transition-all hover:scale-105"
                  onClick={() => setShowChat(!showChat)}
                >
                  <MessageSquare className="h-5 w-5" />
                </Button>
              </div>

              <div className="w-px h-8 bg-white/10 mx-2" />

              <Button
                variant="destructive"
                size="lg"
                className="h-14 px-8 rounded-full font-bold shadow-xl shadow-red-900/20 transition-all hover:bg-red-600 hover:scale-105"
                onClick={handleEndCall}
              >
                <PhoneOff className="h-5 w-5 mr-3" />
                End Session
              </Button>

              <Button
                variant="secondary"
                size="icon"
                className="h-12 w-12 rounded-full bg-white/5 border border-white/10"
                onClick={() => setShowSettings(true)}
              >
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          <SettingsDialog />
        </div>
      )}
    </div>
  );
}