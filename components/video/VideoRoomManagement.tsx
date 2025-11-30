"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "../../hooks/use-toast";
import { format } from "date-fns";
import {
  Video,
  VideoOff,
  Calendar as CalendarIcon,
  Clock,
  Users,
  Settings,
  Play,
  Square,
  Eye,
  Edit,
  Trash2,
  Copy,
  Share2,
  Download,
  Upload,
  Plus,
  Filter,
  Search,
  MoreVertical,
  Crown,
  Shield,
  User,
  Mic,
  MicOff,
  ScreenShare,
  MessageCircle,
  PenTool,
  Circle,
  Wifi,
  WifiOff
} from "lucide-react";

interface VideoRoom {
  id: string;
  roomId: string;
  title: string;
  description?: string;
  host: {
    id: string;
    name: string;
    email: string;
  };
  course?: {
    id: string;
    title: string;
  };
  chapter?: {
    id: string;
    title: string;
  };
  lesson?: {
    id: string;
    title: string;
  };
  scheduledFor?: string;
  duration: number;
  maxParticipants?: number;
  isRecordingEnabled: boolean;
  isScreenSharingEnabled: boolean;
  isWhiteboardEnabled: boolean;
  isChatEnabled: boolean;
  isPrivate: boolean;
  waitingRoomEnabled: boolean;
  requireModerator: boolean;
  autoRecord: boolean;
  quality: 'LOW' | 'MEDIUM' | 'HIGH' | 'HD';
  status: 'WAITING' | 'ACTIVE' | 'ENDED';
  startedAt?: string;
  endedAt?: string;
  participants: {
    id: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
    role: 'HOST' | 'MODERATOR' | 'PARTICIPANT';
    isVideoOn: boolean;
    isAudioOn: boolean;
    isScreenSharing: boolean;
    connectionQuality: 'POOR' | 'FAIR' | 'GOOD' | 'EXCELLENT';
    joinedAt: string;
  }[];
  recordings?: {
    id: string;
    title?: string;
    fileUrl: string;
    duration?: number;
    createdAt: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

interface CreateRoomData {
  title: string;
  description?: string;
  courseId?: string;
  chapterId?: string;
  lessonId?: string;
  scheduledFor?: Date;
  duration: number;
  maxParticipants?: number;
  isRecordingEnabled: boolean;
  isScreenSharingEnabled: boolean;
  isWhiteboardEnabled: boolean;
  isChatEnabled: boolean;
  isPrivate: boolean;
  waitingRoomEnabled: boolean;
  requireModerator: boolean;
  autoRecord: boolean;
  quality: 'LOW' | 'MEDIUM' | 'HIGH' | 'HD';
}

export default function VideoRoomManagement() {
  const [rooms, setRooms] = useState<VideoRoom[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<VideoRoom[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'WAITING' | 'ACTIVE' | 'ENDED'>('ALL');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [createData, setCreateData] = useState<CreateRoomData>({
    title: '',
    description: '',
    duration: 60,
    isRecordingEnabled: false,
    isScreenSharingEnabled: true,
    isWhiteboardEnabled: true,
    isChatEnabled: true,
    isPrivate: false,
    waitingRoomEnabled: false,
    requireModerator: false,
    autoRecord: false,
    quality: 'MEDIUM'
  });
  const { toast } = useToast();

  // Load rooms
  useEffect(() => {
    loadRooms();
  }, []);

  // Filter rooms
  useEffect(() => {
    let filtered = rooms;

    if (searchTerm) {
      filtered = filtered.filter(room =>
        room.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.host.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(room => room.status === statusFilter);
    }

    setFilteredRooms(filtered);
  }, [rooms, searchTerm, statusFilter]);

  const loadRooms = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/video-rooms');
      if (!response.ok) throw new Error('Failed to load rooms');
      const data = await response.json();
      setRooms(data);
    } catch (error) {
      console.error('Error loading rooms:', error);
      toast({
        title: "Error",
        description: "Failed to load video rooms",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createRoom = async () => {
    try {
      const response = await fetch('/api/video-rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...createData,
          scheduledFor: selectedDate?.toISOString()
        })
      });

      if (!response.ok) throw new Error('Failed to create room');
      
      const newRoom = await response.json();
      setRooms(prev => [newRoom, ...prev]);
      setShowCreateDialog(false);
      
      // Reset form
      setCreateData({
        title: '',
        description: '',
        duration: 60,
        isRecordingEnabled: false,
        isScreenSharingEnabled: true,
        isWhiteboardEnabled: true,
        isChatEnabled: true,
        isPrivate: false,
        waitingRoomEnabled: false,
        requireModerator: false,
        autoRecord: false,
        quality: 'MEDIUM'
      });
      setSelectedDate(undefined);

      toast({
        title: "Room Created",
        description: `Video room "${newRoom.title}" has been created successfully.`
      });
    } catch (error) {
      console.error('Error creating room:', error);
      toast({
        title: "Error",
        description: "Failed to create video room",
        variant: "destructive"
      });
    }
  };

  const joinRoom = (room: VideoRoom) => {
    // Navigate to video call component
    window.open(`/video-call/${room.roomId}`, '_blank');
  };

  const copyRoomLink = (room: VideoRoom) => {
    const link = `${window.location.origin}/video-call/${room.roomId}`;
    navigator.clipboard.writeText(link);
    toast({
      title: "Link Copied",
      description: "Video room link has been copied to clipboard."
    });
  };

  const deleteRoom = async (roomId: string) => {
    try {
      const response = await fetch(`/api/video-rooms/${roomId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete room');
      
      setRooms(prev => prev.filter(room => room.id !== roomId));
      toast({
        title: "Room Deleted",
        description: "Video room has been deleted successfully."
      });
    } catch (error) {
      console.error('Error deleting room:', error);
      toast({
        title: "Error",
        description: "Failed to delete video room",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'WAITING': return 'bg-yellow-500';
      case 'ACTIVE': return 'bg-green-500 animate-pulse';
      case 'ENDED': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getQualityBadge = (quality: string) => {
    const colors = {
      LOW: 'bg-red-100 text-red-800',
      MEDIUM: 'bg-yellow-100 text-yellow-800',
      HIGH: 'bg-blue-100 text-blue-800',
      HD: 'bg-green-100 text-green-800'
    };
    return colors[quality as keyof typeof colors] || colors.MEDIUM;
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Video Rooms</h1>
          <p className="text-gray-600">Manage your video conferencing sessions</p>
        </div>
        
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Room
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Video Room</DialogTitle>
              <DialogDescription>
                Set up a new video conferencing session for your course or meeting.
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-4">
                <div>
                  <Label htmlFor="title">Room Title *</Label>
                  <Input
                    id="title"
                    value={createData.title}
                    onChange={(e) => setCreateData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter room title"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={createData.description}
                    onChange={(e) => setCreateData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Optional description"
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Scheduled Date & Time</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? format(selectedDate, "PPP p") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div>
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Input
                      id="duration"
                      type="number"
                      min="5"
                      max="480"
                      value={createData.duration}
                      onChange={(e) => setCreateData(prev => ({ ...prev, duration: parseInt(e.target.value) || 60 }))}
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="settings" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="recording">Recording Enabled</Label>
                    <Switch
                      id="recording"
                      checked={createData.isRecordingEnabled}
                      onCheckedChange={(checked) => setCreateData(prev => ({ ...prev, isRecordingEnabled: checked }))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="screenshare">Screen Sharing</Label>
                    <Switch
                      id="screenshare"
                      checked={createData.isScreenSharingEnabled}
                      onCheckedChange={(checked) => setCreateData(prev => ({ ...prev, isScreenSharingEnabled: checked }))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="whiteboard">Whiteboard</Label>
                    <Switch
                      id="whiteboard"
                      checked={createData.isWhiteboardEnabled}
                      onCheckedChange={(checked) => setCreateData(prev => ({ ...prev, isWhiteboardEnabled: checked }))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="chat">Chat</Label>
                    <Switch
                      id="chat"
                      checked={createData.isChatEnabled}
                      onCheckedChange={(checked) => setCreateData(prev => ({ ...prev, isChatEnabled: checked }))}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="quality">Video Quality</Label>
                  <Select
                    value={createData.quality}
                    onValueChange={(value: any) => setCreateData(prev => ({ ...prev, quality: value }))}
                  >
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
              </TabsContent>
              
              <TabsContent value="advanced" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="private">Private Room</Label>
                    <Switch
                      id="private"
                      checked={createData.isPrivate}
                      onCheckedChange={(checked) => setCreateData(prev => ({ ...prev, isPrivate: checked }))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="waitingroom">Waiting Room</Label>
                    <Switch
                      id="waitingroom"
                      checked={createData.waitingRoomEnabled}
                      onCheckedChange={(checked) => setCreateData(prev => ({ ...prev, waitingRoomEnabled: checked }))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="moderator">Require Moderator</Label>
                    <Switch
                      id="moderator"
                      checked={createData.requireModerator}
                      onCheckedChange={(checked) => setCreateData(prev => ({ ...prev, requireModerator: checked }))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="autorecord">Auto Record</Label>
                    <Switch
                      id="autorecord"
                      checked={createData.autoRecord}
                      onCheckedChange={(checked) => setCreateData(prev => ({ ...prev, autoRecord: checked }))}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="maxparticipants">Max Participants</Label>
                  <Input
                    id="maxparticipants"
                    type="number"
                    min="2"
                    max="100"
                    value={createData.maxParticipants || ''}
                    onChange={(e) => setCreateData(prev => ({ 
                      ...prev, 
                      maxParticipants: e.target.value ? parseInt(e.target.value) : undefined 
                    }))}
                    placeholder="No limit"
                  />
                </div>
              </TabsContent>
            </Tabs>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button onClick={createRoom} disabled={!createData.title}>
                Create Room
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search rooms..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="WAITING">Waiting</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="ENDED">Ended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Room List */}
      <div className="grid gap-4">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading rooms...</p>
          </div>
        ) : filteredRooms.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Video className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">No video rooms found</h3>
              <p className="text-gray-600">
                {searchTerm || statusFilter !== 'ALL' 
                  ? 'Try adjusting your search or filters'
                  : 'Create your first video room to get started'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredRooms.map(room => (
            <Card key={room.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    {/* Room Title & Status */}
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-semibold">{room.title}</h3>
                      <Badge className={`${getStatusColor(room.status)} text-white`}>
                        {room.status}
                      </Badge>
                      <Badge variant="outline" className={getQualityBadge(room.quality)}>
                        {room.quality}
                      </Badge>
                      {room.isPrivate && (
                        <Badge variant="secondary">Private</Badge>
                      )}
                    </div>
                    
                    {/* Description */}
                    {room.description && (
                      <p className="text-gray-600 text-sm">{room.description}</p>
                    )}
                    
                    {/* Room Info */}
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>{room.host.name}</span>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{formatDuration(room.duration)}</span>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{room.participants.length}{room.maxParticipants ? `/${room.maxParticipants}` : ''}</span>
                      </div>
                      
                      {room.scheduledFor && (
                        <div className="flex items-center space-x-1">
                          <CalendarIcon className="h-4 w-4" />
                          <span>{format(new Date(room.scheduledFor), "MMM d, h:mm a")}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Features */}
                    <div className="flex items-center space-x-3">
                      {room.isRecordingEnabled && (
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <Circle className="h-3 w-3" />
                          <span>Recording</span>
                        </div>
                      )}
                      {room.isScreenSharingEnabled && (
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <ScreenShare className="h-3 w-3" />
                          <span>Screen Share</span>
                        </div>
                      )}
                      {room.isWhiteboardEnabled && (
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <PenTool className="h-3 w-3" />
                          <span>Whiteboard</span>
                        </div>
                      )}
                      {room.isChatEnabled && (
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <MessageCircle className="h-3 w-3" />
                          <span>Chat</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Active Participants */}
                    {room.status === 'ACTIVE' && room.participants.length > 0 && (
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">Active:</span>
                        <div className="flex -space-x-2">
                          {room.participants.slice(0, 5).map(participant => (
                            <Avatar key={participant.id} className="w-6 h-6 border-2 border-white">
                              <AvatarFallback className="text-xs">
                                {participant.user.name[0]}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                          {room.participants.length > 5 && (
                            <div className="w-6 h-6 bg-gray-200 rounded-full border-2 border-white flex items-center justify-center text-xs">
                              +{room.participants.length - 5}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    {room.status === 'WAITING' || room.status === 'ACTIVE' ? (
                      <Button onClick={() => joinRoom(room)}>
                        <Video className="h-4 w-4 mr-2" />
                        Join
                      </Button>
                    ) : (
                      <Button variant="outline" onClick={() => joinRoom(room)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    )}
                    
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-48 p-1">
                        <div className="space-y-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start"
                            onClick={() => copyRoomLink(room)}
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Copy Link
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Room
                          </Button>
                          
                          {room.recordings && room.recordings.length > 0 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full justify-start"
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Recordings ({room.recordings.length})
                            </Button>
                          )}
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start text-red-600 hover:text-red-700"
                            onClick={() => deleteRoom(room.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}