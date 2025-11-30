"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Video, 
  Star, 
  CheckCircle,
  CreditCard,
  MessageSquare,
  User
} from "lucide-react";

interface Teacher {
  id: number;
  name: string;
  avatar: string;
  rating: number;
  reviews: number;
  verified: boolean;
  hourlyRate: number;
  expertise: string[];
  bio: string;
  responseTime: string;
  totalSessions: number;
}

interface SessionBookingProps {
  teacher: Teacher;
  sessionType: "1-on-1" | "group";
}

const mockTeacher: Teacher = {
  id: 1,
  name: "Dr. Sarah Johnson",
  avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
  rating: 4.9,
  reviews: 234,
  verified: true,
  hourlyRate: 75,
  expertise: ["JavaScript", "React", "Node.js", "TypeScript"],
  bio: "Full-stack developer with 8+ years of experience in modern web technologies. Passionate about teaching and helping students master JavaScript and React.",
  responseTime: "Usually responds within 2 hours",
  totalSessions: 1520
};

const availableTimeSlots = [
  "09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM", 
  "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"
];

const sessionDurations = [
  { label: "30 minutes", value: 30, price: 37.50 },
  { label: "60 minutes", value: 60, price: 75 },
  { label: "90 minutes", value: 90, price: 112.50 }
];

export function SessionBooking({ teacher = mockTeacher, sessionType = "1-on-1" }: SessionBookingProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [duration, setDuration] = useState<number>(60);
  const [subject, setSubject] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const selectedDuration = sessionDurations.find(d => d.value === duration);
  const totalPrice = selectedDuration?.price || 0;

  const handleBookSession = () => {
    // Handle session booking logic here
    console.log({
      teacherId: teacher.id,
      date: selectedDate,
      time: selectedTime,
      duration,
      subject,
      message,
      price: totalPrice
    });
    // Close dialog and show success message
    setIsBookingOpen(false);
  };

  return (
    <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
          <Video className="mr-2 h-4 w-4" />
          Book {sessionType} Session
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Book a {sessionType} Session</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Teacher Info */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div className="relative mx-auto w-20 h-20">
                    <img
                      src={teacher.avatar}
                      alt={teacher.name}
                      className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                    {teacher.verified && (
                      <div className="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full p-1">
                        <CheckCircle className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="font-bold text-lg">{teacher.name}</h3>
                    <div className="flex items-center justify-center gap-1 mt-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-medium">{teacher.rating}</span>
                      <span className="text-sm text-muted-foreground">({teacher.reviews} reviews)</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Rate</span>
                      <span className="font-semibold">${teacher.hourlyRate}/hour</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Sessions</span>
                      <span className="font-semibold">{teacher.totalSessions}</span>
                    </div>
                    <div className="text-center">
                      <span className="text-xs text-muted-foreground">{teacher.responseTime}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Expertise</div>
                    <div className="flex flex-wrap gap-1">
                      {teacher.expertise.map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <Button variant="outline" size="sm" className="w-full">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Message Teacher
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Booking Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Date Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Select Date & Time
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Select Date</Label>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => date < new Date() || date.getDay() === 0}
                      className="rounded-md border w-full"
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label>Available Time Slots</Label>
                      <Select value={selectedTime} onValueChange={setSelectedTime}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableTimeSlots.map((time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label>Session Duration</Label>
                      <Select value={duration.toString()} onValueChange={(value) => setDuration(Number(value))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                          {sessionDurations.map((option) => (
                            <SelectItem key={option.value} value={option.value.toString()}>
                              {option.label} - ${option.price}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Session Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Session Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="subject">What would you like to learn?</Label>
                  <Select value={subject} onValueChange={setSubject}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a topic" />
                    </SelectTrigger>
                    <SelectContent>
                      {teacher.expertise.map((skill) => (
                        <SelectItem key={skill} value={skill}>
                          {skill}
                        </SelectItem>
                      ))}
                      <SelectItem value="other">Other (specify in message)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="message">Message to Teacher (Optional)</Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Let the teacher know what specific topics you'd like to cover, your current level, or any questions you have..."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
            
            {/* Booking Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Booking Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Teacher</span>
                    <span className="font-medium">{teacher.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date & Time</span>
                    <span className="font-medium">
                      {selectedDate?.toLocaleDateString()} {selectedTime}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration</span>
                    <span className="font-medium">{duration} minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Subject</span>
                    <span className="font-medium">{subject || "Not selected"}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span className="text-green-600">${totalPrice}</span>
                  </div>
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg space-y-2">
                  <div className="font-medium text-sm">What's included:</div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Live video session with screen sharing</li>
                    <li>• Session recording for review</li>
                    <li>• Pre and post-session materials</li>
                    <li>• Follow-up support via messages</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => setIsBookingOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleBookSession}
            disabled={!selectedDate || !selectedTime || !subject}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
          >
            Book Session - ${totalPrice}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}