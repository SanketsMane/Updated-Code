"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "../../hooks/use-toast";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  ScreenShare,
  ScreenShareOff,
  Settings,
  MessageCircle,
  Users,
  Circle,
  StopCircle,
  Camera,
  CameraOff,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  PenTool,
  Download,
  Upload,
  Grid3x3,
  Monitor,
  Smartphone,
  User,
  Crown,
  Shield,
  Eye,
  MoreVertical
} from "lucide-react";

interface VideoParticipant {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
  role: 'HOST' | 'MODERATOR' | 'PARTICIPANT';
  isVideoOn: boolean;
  isAudioOn: boolean;
  isScreenSharing: boolean;
  isHandRaised: boolean;
  connectionQuality: 'POOR' | 'FAIR' | 'GOOD' | 'EXCELLENT';
  joinedAt: Date;
}

interface ChatMessage {
  id: string;
  userId: string;
  user: {
    name: string;
    image?: string;
  };
  message: string;
  timestamp: Date;
  type: 'MESSAGE' | 'SYSTEM' | 'FILE';
  fileUrl?: string;
  fileName?: string;
}

interface EnhancedVideoCallProps {
  roomId: string;
  isHost?: boolean;
  onLeave?: () => void;
  onError?: (error: string) => void;
}

export default function EnhancedVideoCall({
  roomId,
  isHost = false,
  onLeave,
  onError
}: EnhancedVideoCallProps) {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideosRef = useRef<Map<string, HTMLVideoElement>>(new Map());
  const peerConnectionsRef = useRef<Map<string, RTCPeerConnection>>(new Map());
  const localStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();

  // Call state
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [participants, setParticipants] = useState<VideoParticipant[]>([]);
  const [currentUser, setCurrentUser] = useState<VideoParticipant | null>(null);

  // Media controls
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  // UI state
  const [layout, setLayout] = useState<'grid' | 'speaker' | 'sidebar'>('grid');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showWhiteboard, setShowWhiteboard] = useState(false);

  // Chat
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);

  // Settings
  const [selectedCamera, setSelectedCamera] = useState<string>('');
  const [selectedMicrophone, setSelectedMicrophone] = useState<string>('');
  const [videoQuality, setVideoQuality] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'HD'>('MEDIUM');
  const [devices, setDevices] = useState<{
    cameras: MediaDeviceInfo[];
    microphones: MediaDeviceInfo[];
    speakers: MediaDeviceInfo[];
  }>({ cameras: [], microphones: [], speakers: [] });

  // Call statistics
  const [stats, setStats] = useState<{
    bitrate: number;
    packetLoss: number;
    jitter: number;
    rtt: number;
  }>({ bitrate: 0, packetLoss: 0, jitter: 0, rtt: 0 });

  // Initialize media devices
  useEffect(() => {
    const initializeDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        
        setDevices({
          cameras: devices.filter(device => device.kind === 'videoinput'),
          microphones: devices.filter(device => device.kind === 'audioinput'),
          speakers: devices.filter(device => device.kind === 'audiooutput')
        });

        // Set default devices
        const defaultCamera = devices.find(device => 
          device.kind === 'videoinput' && device.deviceId === 'default'
        );
        const defaultMicrophone = devices.find(device => 
          device.kind === 'audioinput' && device.deviceId === 'default'
        );

        if (defaultCamera) setSelectedCamera(defaultCamera.deviceId);
        if (defaultMicrophone) setSelectedMicrophone(defaultMicrophone.deviceId);
        
      } catch (error) {
        console.error('Error enumerating devices:', error);
        onError?.('Failed to access media devices');
      }
    };

    initializeDevices();
  }, [onError]);

  // Get user media
  const getUserMedia = useCallback(async () => {
    try {
      const constraints: MediaStreamConstraints = {
        video: isVideoOn ? {
          deviceId: selectedCamera ? { exact: selectedCamera } : undefined,
          width: { ideal: videoQuality === 'HD' ? 1920 : videoQuality === 'HIGH' ? 1280 : 640 },
          height: { ideal: videoQuality === 'HD' ? 1080 : videoQuality === 'HIGH' ? 720 : 480 },
          frameRate: { ideal: videoQuality === 'HD' ? 30 : videoQuality === 'HIGH' ? 24 : 15 }
        } : false,
        audio: isAudioOn ? {
          deviceId: selectedMicrophone ? { exact: selectedMicrophone } : undefined,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } : false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      
      localStreamRef.current = stream;
      return stream;
      
    } catch (error) {
      console.error('Error accessing media:', error);
      onError?.('Failed to access camera/microphone');
      throw error;
    }
  }, [isVideoOn, isAudioOn, selectedCamera, selectedMicrophone, videoQuality, onError]);

  // Screen sharing
  const startScreenShare = useCallback(async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          frameRate: { ideal: 15 }
        },
        audio: true
      });

      screenStreamRef.current = screenStream;
      setIsScreenSharing(true);

      // Handle screen share end
      screenStream.getVideoTracks()[0].addEventListener('ended', () => {
        stopScreenShare();
      });

      // Replace video track in peer connections
      const videoTrack = screenStream.getVideoTracks()[0];
      peerConnectionsRef.current.forEach((peerConnection, participantId) => {
        const sender = peerConnection.getSenders().find(s => 
          s.track && s.track.kind === 'video'
        );
        if (sender) {
          sender.replaceTrack(videoTrack);
        }
      });

      toast({
        title: "Screen Sharing Started",
        description: "Your screen is now being shared with participants."
      });

    } catch (error) {
      console.error('Error starting screen share:', error);
      onError?.('Failed to start screen sharing');
    }
  }, [onError, toast]);

  const stopScreenShare = useCallback(async () => {
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach(track => track.stop());
      screenStreamRef.current = null;
    }

    setIsScreenSharing(false);

    // Switch back to camera
    if (localStreamRef.current && isVideoOn) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      peerConnectionsRef.current.forEach((peerConnection, participantId) => {
        const sender = peerConnection.getSenders().find(s => 
          s.track && s.track.kind === 'video'
        );
        if (sender && videoTrack) {
          sender.replaceTrack(videoTrack);
        }
      });
    }

    toast({
      title: "Screen Sharing Stopped",
      description: "Screen sharing has been ended."
    });
  }, [isVideoOn, toast]);

  // Recording
  const startRecording = useCallback(async () => {
    try {
      // This would integrate with a recording service
      setIsRecording(true);
      
      toast({
        title: "Recording Started",
        description: "This session is now being recorded."
      });
    } catch (error) {
      console.error('Error starting recording:', error);
      onError?.('Failed to start recording');
    }
  }, [onError, toast]);

  const stopRecording = useCallback(async () => {
    try {
      setIsRecording(false);
      
      toast({
        title: "Recording Stopped",
        description: "Recording has been saved."
      });
    } catch (error) {
      console.error('Error stopping recording:', error);
    }
  }, [toast]);

  // Media controls
  const toggleVideo = useCallback(async () => {
    if (localStreamRef.current) {
      const videoTracks = localStreamRef.current.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = !isVideoOn;
      });
    }
    setIsVideoOn(!isVideoOn);
  }, [isVideoOn]);

  const toggleAudio = useCallback(async () => {
    if (localStreamRef.current) {
      const audioTracks = localStreamRef.current.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !isAudioOn;
      });
    }
    setIsAudioOn(!isAudioOn);
  }, [isAudioOn]);

  // Chat functions
  const sendMessage = useCallback(() => {
    if (!newMessage.trim()) return;

    const message: ChatMessage = {
      id: `msg_${Date.now()}`,
      userId: currentUser?.user.id || '',
      user: {
        name: currentUser?.user.name || 'Unknown',
        image: currentUser?.user.image
      },
      message: newMessage,
      timestamp: new Date(),
      type: 'MESSAGE'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Send via WebSocket or API
    // TODO: Implement real-time chat
  }, [newMessage, currentUser]);

  // Layout functions
  const getParticipantGridClass = () => {
    const count = participants.length;
    if (count <= 1) return 'grid-cols-1';
    if (count <= 4) return 'grid-cols-2';
    if (count <= 9) return 'grid-cols-3';
    return 'grid-cols-4';
  };

  const handleLeave = useCallback(() => {
    // Clean up streams
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach(track => track.stop());
    }

    // Close peer connections
    peerConnectionsRef.current.forEach(pc => pc.close());
    peerConnectionsRef.current.clear();

    setIsConnected(false);
    onLeave?.();
  }, [onLeave]);

  // Connection quality indicator
  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'EXCELLENT': return 'text-green-500';
      case 'GOOD': return 'text-yellow-500';
      case 'FAIR': return 'text-orange-500';
      case 'POOR': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getQualityBars = (quality: string) => {
    const bars = quality === 'EXCELLENT' ? 4 : 
                 quality === 'GOOD' ? 3 :
                 quality === 'FAIR' ? 2 : 1;
    
    return Array.from({ length: 4 }, (_, i) => (
      <div
        key={i}
        className={`w-1 h-${2 + i} ${i < bars ? 'bg-current' : 'bg-gray-300'}`}
      />
    ));
  };

  return (
    <TooltipProvider>
      <div className="flex h-screen bg-gray-900 text-white">
        {/* Main Video Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="bg-gray-800 p-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold">Video Call</h1>
              <Badge variant={isConnected ? "default" : "destructive"}>
                {isConnected ? 'Connected' : 'Connecting...'}
              </Badge>
              {isRecording && (
                <Badge variant="destructive" className="animate-pulse">
                  <Circle className="h-3 w-3 mr-1" />
                  Recording
                </Badge>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              {/* Layout Controls */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setLayout(layout === 'grid' ? 'speaker' : 'grid')}
                  >
                    <Grid3x3 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Switch Layout</TooltipContent>
              </Tooltip>

              {/* Settings */}
              <Dialog open={showSettings} onOpenChange={setShowSettings}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Call Settings</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Camera</Label>
                      <Select value={selectedCamera} onValueChange={setSelectedCamera}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select camera" />
                        </SelectTrigger>
                        <SelectContent>
                          {devices.cameras.map(camera => (
                            <SelectItem key={camera.deviceId} value={camera.deviceId}>
                              {camera.label || 'Camera'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label>Microphone</Label>
                      <Select value={selectedMicrophone} onValueChange={setSelectedMicrophone}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select microphone" />
                        </SelectTrigger>
                        <SelectContent>
                          {devices.microphones.map(mic => (
                            <SelectItem key={mic.deviceId} value={mic.deviceId}>
                              {mic.label || 'Microphone'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Video Quality</Label>
                      <Select value={videoQuality} onValueChange={(value: any) => setVideoQuality(value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="LOW">Low (480p)</SelectItem>
                          <SelectItem value="MEDIUM">Medium (720p)</SelectItem>
                          <SelectItem value="HIGH">High (1080p)</SelectItem>
                          <SelectItem value="HD">HD (1440p)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Connection Stats */}
                    <div className="pt-4 border-t">
                      <Label>Connection Stats</Label>
                      <div className="mt-2 text-sm space-y-1">
                        <div className="flex justify-between">
                          <span>Bitrate:</span>
                          <span>{stats.bitrate} kbps</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Packet Loss:</span>
                          <span>{stats.packetLoss}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Latency:</span>
                          <span>{stats.rtt}ms</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Video Grid */}
          <div className="flex-1 p-4">
            {layout === 'grid' && (
              <div className={`grid ${getParticipantGridClass()} gap-4 h-full`}>
                {/* Local Video */}
                <Card className="relative bg-gray-800 border-gray-700 overflow-hidden">
                  <div className="absolute inset-0">
                    {isVideoOn ? (
                      <video
                        ref={localVideoRef}
                        autoPlay
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                        <div className="text-center">
                          <Avatar className="w-16 h-16 mx-auto mb-2">
                            <AvatarImage src={currentUser?.user.image} />
                            <AvatarFallback>
                              {currentUser?.user.name?.[0] || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <p className="text-sm">{currentUser?.user.name || 'You'}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Video Controls Overlay */}
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <Badge variant="secondary" className="text-xs">
                        You
                      </Badge>
                      {!isAudioOn && (
                        <MicOff className="h-3 w-3 text-red-500" />
                      )}
                      {isScreenSharing && (
                        <ScreenShare className="h-3 w-3 text-blue-500" />
                      )}
                    </div>
                    
                    <div className={`flex items-center space-x-1 ${getQualityColor('EXCELLENT')}`}>
                      {getQualityBars('EXCELLENT')}
                    </div>
                  </div>
                </Card>

                {/* Remote Videos */}
                {participants.map(participant => (
                  <Card key={participant.id} className="relative bg-gray-800 border-gray-700 overflow-hidden">
                    <div className="absolute inset-0">
                      {participant.isVideoOn ? (
                        <video
                          ref={el => {
                            if (el) {
                              remoteVideosRef.current.set(participant.id, el);
                            }
                          }}
                          autoPlay
                          playsInline
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                          <div className="text-center">
                            <Avatar className="w-16 h-16 mx-auto mb-2">
                              <AvatarImage src={participant.user.image} />
                              <AvatarFallback>
                                {participant.user.name?.[0] || 'U'}
                              </AvatarFallback>
                            </Avatar>
                            <p className="text-sm">{participant.user.name}</p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Participant Info Overlay */}
                    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <Badge variant="secondary" className="text-xs">
                          {participant.user.name}
                        </Badge>
                        {participant.role === 'HOST' && (
                          <Crown className="h-3 w-3 text-yellow-500" />
                        )}
                        {participant.role === 'MODERATOR' && (
                          <Shield className="h-3 w-3 text-blue-500" />
                        )}
                        {!participant.isAudioOn && (
                          <MicOff className="h-3 w-3 text-red-500" />
                        )}
                        {participant.isScreenSharing && (
                          <ScreenShare className="h-3 w-3 text-blue-500" />
                        )}
                        {participant.isHandRaised && (
                          <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse" />
                        )}
                      </div>
                      
                      <div className={`flex items-center space-x-1 ${getQualityColor(participant.connectionQuality)}`}>
                        {getQualityBars(participant.connectionQuality)}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Bottom Controls */}
          <div className="bg-gray-800 p-4 flex items-center justify-center space-x-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={isAudioOn ? "default" : "destructive"}
                  size="lg"
                  onClick={toggleAudio}
                  className="rounded-full"
                >
                  {isAudioOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{isAudioOn ? 'Mute' : 'Unmute'}</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={isVideoOn ? "default" : "destructive"}
                  size="lg"
                  onClick={toggleVideo}
                  className="rounded-full"
                >
                  {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{isVideoOn ? 'Stop Video' : 'Start Video'}</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={isScreenSharing ? "default" : "ghost"}
                  size="lg"
                  onClick={isScreenSharing ? stopScreenShare : startScreenShare}
                  className="rounded-full"
                >
                  {isScreenSharing ? <ScreenShareOff className="h-5 w-5" /> : <ScreenShare className="h-5 w-5" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{isScreenSharing ? 'Stop Sharing' : 'Share Screen'}</TooltipContent>
            </Tooltip>

            {isHost && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={isRecording ? "destructive" : "ghost"}
                    size="lg"
                    onClick={isRecording ? stopRecording : startRecording}
                    className="rounded-full"
                  >
                    {isRecording ? <StopCircle className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{isRecording ? 'Stop Recording' : 'Start Recording'}</TooltipContent>
              </Tooltip>
            )}

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={() => setShowChat(!showChat)}
                  className="rounded-full relative"
                >
                  <MessageCircle className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 px-1 min-w-5 h-5 text-xs">
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Toggle Chat</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={() => setShowParticipants(!showParticipants)}
                  className="rounded-full"
                >
                  <Users className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Participants</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="destructive"
                  size="lg"
                  onClick={handleLeave}
                  className="rounded-full"
                >
                  <PhoneOff className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Leave Call</TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Side Panels */}
        {(showChat || showParticipants) && (
          <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
            {/* Panel Tabs */}
            <div className="p-4 border-b border-gray-700">
              <div className="flex space-x-2">
                <Button
                  variant={showChat ? "default" : "ghost"}
                  size="sm"
                  onClick={() => { setShowChat(true); setShowParticipants(false); }}
                  className="flex-1"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Chat
                  {unreadCount > 0 && (
                    <Badge className="ml-2 px-1 min-w-5 h-5 text-xs">
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
                <Button
                  variant={showParticipants ? "default" : "ghost"}
                  size="sm"
                  onClick={() => { setShowParticipants(true); setShowChat(false); }}
                  className="flex-1"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Participants
                </Button>
              </div>
            </div>

            {/* Chat Panel */}
            {showChat && (
              <>
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map(message => (
                      <div key={message.id} className="flex space-x-2">
                        <Avatar className="w-8 h-8 flex-shrink-0">
                          <AvatarImage src={message.user.image} />
                          <AvatarFallback>{message.user.name?.[0] || 'U'}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium">{message.user.name}</span>
                            <span className="text-xs text-gray-400">
                              {message.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-300 mt-1">{message.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                
                <div className="p-4 border-t border-gray-700">
                  <div className="flex space-x-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                      className="flex-1"
                    />
                    <Button onClick={sendMessage} size="sm">
                      Send
                    </Button>
                  </div>
                </div>
              </>
            )}

            {/* Participants Panel */}
            {showParticipants && (
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Participants ({participants.length + 1})</h3>
                  </div>
                  
                  {/* Current User */}
                  {currentUser && (
                    <div className="flex items-center justify-between p-2 bg-gray-700 rounded">
                      <div className="flex items-center space-x-2">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={currentUser.user.image} />
                          <AvatarFallback>{currentUser.user.name?.[0] || 'U'}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-sm font-medium">{currentUser.user.name} (You)</div>
                          <div className="text-xs text-gray-400">{currentUser.role}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        {currentUser.role === 'HOST' && (
                          <Crown className="h-4 w-4 text-yellow-500" />
                        )}
                        {!isAudioOn && <MicOff className="h-4 w-4 text-red-500" />}
                        {!isVideoOn && <VideoOff className="h-4 w-4 text-red-500" />}
                      </div>
                    </div>
                  )}
                  
                  {/* Other Participants */}
                  {participants.map(participant => (
                    <div key={participant.id} className="flex items-center justify-between p-2 hover:bg-gray-700 rounded">
                      <div className="flex items-center space-x-2">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={participant.user.image} />
                          <AvatarFallback>{participant.user.name?.[0] || 'U'}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-sm font-medium">{participant.user.name}</div>
                          <div className="text-xs text-gray-400">{participant.role}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        {participant.role === 'HOST' && (
                          <Crown className="h-4 w-4 text-yellow-500" />
                        )}
                        {participant.role === 'MODERATOR' && (
                          <Shield className="h-4 w-4 text-blue-500" />
                        )}
                        {!participant.isAudioOn && (
                          <MicOff className="h-4 w-4 text-red-500" />
                        )}
                        {!participant.isVideoOn && (
                          <VideoOff className="h-4 w-4 text-red-500" />
                        )}
                        {isHost && (
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}