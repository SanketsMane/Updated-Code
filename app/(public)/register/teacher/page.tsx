"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Loader2, Users, Award, IndianRupee, Globe, ArrowLeft, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export const dynamic = "force-dynamic";

const benefits = [
  "Earn up to ₹4000/hour teaching students",
  "Flexible schedule - teach when you want",
  "Global reach - students worldwide",
  "Professional tools and support",
  "Marketing and student acquisition help",
  "Secure payments and analytics"
];

const expertise = [
  "Mathematics", "Science", "Programming", "Languages", "Arts", "Music",
  "Business", "Engineering", "Medicine", "Law", "History", "Literature"
];

export default function TeacherRegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirmation: "",
    bio: "",
    expertiseAreas: [] as string[],
    languages: [] as string[],
    hourlyRate: "",
    experience: "",
  });

  const handleExpertiseToggle = (area: string) => {
    setFormData(prev => ({
      ...prev,
      expertiseAreas: prev.expertiseAreas.includes(area)
        ? prev.expertiseAreas.filter(e => e !== area)
        : [...prev.expertiseAreas, area]
    }));
  };

  const handleLanguageAdd = (language: string) => {
    if (language && !formData.languages.includes(language)) {
      setFormData(prev => ({
        ...prev,
        languages: [...prev.languages, language]
      }));
    }
  };

  const handleLanguageRemove = (language: string) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.filter(l => l !== language)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/teacher/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.details && Array.isArray(result.details)) {
          // Construct a detailed error message from Zod errors
          const errorDetails = result.details.map((err: any) => err.message).join(", ");
          throw new Error(errorDetails);
        }
        throw new Error(result.error || "Registration failed");
      }

      toast.success("Registration successful! Please check your email to verify your account.");
      router.push("/login?message=teacher-registered");

    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error instanceof Error ? error.message : "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <Link
              href="/"
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Home
            </Link>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Become a Teacher
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Share your knowledge and earn while teaching students worldwide
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Benefits Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-blue-600" />
                    Why Teach With Us?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{benefit}</span>
                    </div>
                  ))}

                  <Separator />

                  <div className="text-center space-y-2">
                    <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>50K+ Students</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <IndianRupee className="h-4 w-4" />
                        <span>₹20Cr+ Earned</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Registration Form */}
            <div className="lg:col-span-2">
              <Card className="shadow-xl border-0">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                  <CardTitle className="text-2xl">Teacher Registration</CardTitle>
                  <p className="text-blue-100">Fill out the form below to start your teaching journey</p>
                </CardHeader>

                <CardContent className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Basic Information</h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Full Name *</Label>
                          <Input
                            id="name"
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Your full name"
                          />
                        </div>

                        <div>
                          <Label htmlFor="email">Email Address *</Label>
                          <Input
                            id="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                            placeholder="your@email.com"
                          />
                        </div>

                        <div>
                          <Label htmlFor="password">Password *</Label>
                          <Input
                            id="password"
                            type="password"
                            required
                            value={formData.password}
                            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                            placeholder="••••••••"
                          />
                        </div>

                        <div>
                          <Label htmlFor="passwordConfirmation">Confirm Password *</Label>
                          <Input
                            id="passwordConfirmation"
                            type="password"
                            required
                            value={formData.passwordConfirmation}
                            onChange={(e) => setFormData(prev => ({ ...prev, passwordConfirmation: e.target.value }))}
                            placeholder="••••••••"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="bio">Professional Bio *</Label>
                        <Textarea
                          id="bio"
                          required
                          value={formData.bio}
                          onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                          placeholder="Tell students about yourself, your background, and teaching experience..."
                          rows={4}
                        />
                      </div>
                    </div>

                    <Separator />

                    {/* Expertise Areas */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Expertise Areas *</h3>
                      <p className="text-sm text-gray-600">Select the subjects you can teach (minimum 1)</p>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {expertise.map((area) => (
                          <Badge
                            key={area}
                            variant={formData.expertiseAreas.includes(area) ? "default" : "outline"}
                            className={`cursor-pointer justify-center py-2 ${formData.expertiseAreas.includes(area) ? "bg-blue-600 hover:bg-blue-700" : "hover:bg-blue-100"}`}
                            onClick={() => handleExpertiseToggle(area)}
                          >
                            {area}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    {/* Teaching Details */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Teaching Details</h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="hourlyRate">Hourly Rate (INR, ₹) *</Label>
                          <Input
                            id="hourlyRate"
                            type="number"
                            min="100"
                            max="50000"
                            required
                            value={formData.hourlyRate}
                            onChange={(e) => setFormData(prev => ({ ...prev, hourlyRate: e.target.value }))}
                            placeholder="1000"
                          />
                          <p className="text-xs text-gray-500 mt-1">Recommended: ₹500-5000/hour</p>
                        </div>

                        <div>
                          <Label htmlFor="experience">Years of Experience *</Label>
                          <Input
                            id="experience"
                            type="number"
                            min="0"
                            required
                            value={formData.experience}
                            onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                            placeholder="3"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="languages">Languages You Speak</Label>
                        <div className="space-y-2">
                          <Input
                            placeholder="Add a language (press Enter)"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleLanguageAdd(e.currentTarget.value);
                                e.currentTarget.value = '';
                              }
                            }}
                          />
                          <div className="flex flex-wrap gap-2">
                            {formData.languages.map((lang) => (
                              <Badge key={lang} variant="secondary" className="cursor-pointer" onClick={() => handleLanguageRemove(lang)}>
                                {lang} ×
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Submit */}
                    <div className="space-y-4">
                      <Button
                        type="submit"
                        disabled={isLoading || formData.expertiseAreas.length === 0}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        size="lg"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating Account...
                          </>
                        ) : (
                          "Register as Teacher"
                        )}
                      </Button>

                      <p className="text-xs text-gray-500 text-center">
                        By registering, you agree to our Terms of Service and Privacy Policy.
                        Your account will be reviewed and approved within 24-48 hours.
                      </p>

                      <div className="text-center">
                        <span className="text-sm text-gray-600">
                          Already have an account?{" "}
                          <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                            Sign in here
                          </Link>
                        </span>
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div >
      </div >
    </div >
  );
}