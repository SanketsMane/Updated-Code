"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { TeacherProfileForm } from "@/components/teacher/teacher-profile-form";
import { 
  User, 
  MapPin, 
  Clock, 
  DollarSign, 
  Star, 
  Users, 
  BookOpen, 
  Globe, 
  Linkedin, 
  Twitter, 
  Youtube,
  Edit,
  Plus,
  TrendingUp
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface TeacherProfile {
  id: string;
  userId: string;
  bio: string;
  expertise: string[];
  languages: string[];
  hourlyRate?: number;
  timezone?: string;
  website?: string;
  linkedin?: string;
  twitter?: string;
  youtube?: string;
  qualifications?: string[];
  certifications?: string[];
  totalEarnings: number;
  rating?: number;
  totalStudents: number;
  isVerified: boolean;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    name: string | null;
    email: string;
    image: string | null;
  };
}

export default function TeacherProfilePage() {
  const [profile, setProfile] = useState<TeacherProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/teacher/profile");
      const data = await response.json();
      
      if (response.ok) {
        setProfile(data.profile);
        setIsEditing(!data.profile); // Auto-open edit form if no profile exists
      } else {
        console.error("Error fetching profile:", data.error);
        setIsEditing(true); // Open edit form to create profile
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileSave = (updatedProfile: TeacherProfile) => {
    setProfile(updatedProfile);
    setIsEditing(false);
    toast.success("Profile saved successfully!");
  };

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (isEditing || !profile) {
    return (
      <div className="container mx-auto py-6 px-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Teacher Profile</h1>
            <p className="text-muted-foreground">
              {profile ? "Edit your teaching profile" : "Create your teaching profile to get started"}
            </p>
          </div>
          {profile && (
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          )}
        </div>
        <TeacherProfileForm 
          existingProfile={profile || undefined} 
          onSave={handleProfileSave}
        />
      </div>
    );
  }

  const socialLinks = [
    { icon: Globe, url: profile.website, label: "Website" },
    { icon: Linkedin, url: profile.linkedin, label: "LinkedIn" },
    { icon: Twitter, url: profile.twitter, label: "Twitter" },
    { icon: Youtube, url: profile.youtube, label: "YouTube" },
  ].filter(link => link.url);

  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Teacher Profile</h1>
          <p className="text-muted-foreground">Manage your teaching profile and settings</p>
        </div>
        <Button onClick={() => setIsEditing(true)}>
          <Edit className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-2xl font-bold">${profile.totalEarnings.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Total Earnings</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center space-x-2">
              <Star className="h-4 w-4 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold">
                  {profile.avgRating ? profile.avgRating.toFixed(1) : "N/A"}
                </p>
                <p className="text-xs text-muted-foreground">Average Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{profile.totalStudents}</p>
                <p className="text-xs text-muted-foreground">Total Students</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{profile.totalCourses}</p>
                <p className="text-xs text-muted-foreground">Courses Created</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Profile Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Profile */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={profile.user?.image || ""} />
                <AvatarFallback className="text-lg">
                  {profile.user?.name?.charAt(0) || "T"}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{profile.user?.name}</CardTitle>
                <CardDescription className="flex items-center space-x-4">
                  <span>{profile.user?.email}</span>
                  {profile.isVerified && (
                    <Badge variant="secondary" className="text-xs">
                      <Star className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Bio</h3>
              <p className="text-muted-foreground">{profile.bio}</p>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-2">Areas of Expertise</h3>
              <div className="flex flex-wrap gap-2">
                {profile.expertise.map((area) => (
                  <Badge key={area} variant="outline">
                    {area}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Languages</h3>
              <div className="flex flex-wrap gap-2">
                {profile.languages.map((lang) => (
                  <Badge key={lang} variant="secondary">
                    {lang}
                  </Badge>
                ))}
              </div>
            </div>

            {profile.qualifications && profile.qualifications.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Qualifications</h3>
                <ul className="list-disc list-inside space-y-1">
                  {profile.qualifications.map((qual, index) => (
                    <li key={index} className="text-muted-foreground">{qual}</li>
                  ))}
                </ul>
              </div>
            )}

            {profile.certifications && profile.certifications.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Certifications</h3>
                <ul className="list-disc list-inside space-y-1">
                  {profile.certifications.map((cert, index) => (
                    <li key={index} className="text-muted-foreground">{cert}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Rate & Availability */}
          <Card>
            <CardHeader>
              <CardTitle>Teaching Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {profile.hourlyRate && (
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    <span className="font-semibold">${profile.hourlyRate}/hour</span> for 1-on-1 sessions
                  </span>
                </div>
              )}
              {profile.timezone && (
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{profile.timezone}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Social Links */}
          {socialLinks.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Connect</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {socialLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-sm hover:text-primary transition-colors"
                    >
                      <link.icon className="h-4 w-4" />
                      <span>{link.label}</span>
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Profile Completion */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Profile Completion</span>
                  <span className="font-semibold">
                    {Math.round(calculateProfileCompletion(profile))}%
                  </span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${calculateProfileCompletion(profile)}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Complete your profile to attract more students
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function calculateProfileCompletion(profile: TeacherProfile): number {
  const fields = [
    profile.bio,
    profile.expertise?.length > 0,
    profile.languages?.length > 0,
    profile.hourlyRate,
    profile.timezone,
    profile.qualifications?.length > 0,
    profile.certifications?.length > 0,
    profile.website || profile.linkedin || profile.twitter || profile.youtube,
  ];
  
  const completed = fields.filter(Boolean).length;
  return (completed / fields.length) * 100;
}

function ProfileSkeleton() {
  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-16 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Skeleton className="h-16 w-16 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-64" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-16 w-full" />
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <Skeleton className="h-24 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}