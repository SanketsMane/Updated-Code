"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Loader2, Users, Award, IndianRupee, Globe, ArrowLeft, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export const dynamic = "force-dynamic";

const benefits = [
  "Earn up to ₹4000/hour teaching students",
  "Flexible schedule - teach when you want",
  "Global reach - students worldwide",
  "Professional tools and support",
  "Marketing and student acquisition help",
  "Secure payments and analytics"
];

export default function TeacherRegisterPage() {
  // Author: Sanket - All hooks must be declared at the top of the component
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [isLoading, setIsLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedExpertise, setSelectedExpertise] = useState("");
  const [formData, setFormData] = useState({
    bio: "",
    expertiseAreas: [] as string[],
    languages: [] as string[],
    hourlyRate: "",
  });
  const [metadata, setMetadata] = useState<{ expertise: { id: string, name: string }[], languages: { id: string, name: string }[] }>({ expertise: [], languages: [] });
  const [loadingMetadata, setLoadingMetadata] = useState(true);

  // Load metadata on mount
  useEffect(() => {
    async function loadMetadata() {
      try {
        const { getMetadata } = await import("@/app/actions/metadata");
        const data = await getMetadata();
        setMetadata(data);
      } catch (error) {
        console.error("Failed to load metadata:", error);
        toast.error("Failed to load options. Please refresh the page.");
      } finally {
        setLoadingMetadata(false);
      }
    }
    loadMetadata();
  }, []);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isPending && !session) {
      router.push("/register");
    }
  }, [isPending, session, router]);

  // Handler functions
  const handleLanguageAddFromSelect = (value: string) => {
    if (value && !formData.languages.includes(value)) {
      setFormData(prev => ({
        ...prev,
        languages: [...prev.languages, value]
      }));
      setSelectedLanguage(""); // Reset selection
    }
  };

  const handleExpertiseAddFromSelect = (value: string) => {
    if (value && !formData.expertiseAreas.includes(value)) {
      setFormData(prev => ({
        ...prev,
        expertiseAreas: [...prev.expertiseAreas, value]
      }));
      setSelectedExpertise(""); // Reset selection
    }
  };



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

    // Validation
    const missingFields = [];
    if (!formData.bio.trim()) missingFields.push("Bio");
    if (formData.expertiseAreas.length === 0) missingFields.push("Expertise Areas");
    if (formData.languages.length === 0) missingFields.push("Languages");
    if (!formData.hourlyRate) missingFields.push("Hourly Rate");

    if (missingFields.length > 0) {
      toast.error(`Please fill in the following fields: ${missingFields.join(", ")}`);
      return;
    }

    setIsLoading(true);

    try {
      // For authenticated users, create teacher profile
      // Author: Sanket
      const response = await fetch("/api/teacher/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bio: formData.bio,
          expertise: formData.expertiseAreas,
          languages: formData.languages,
          hourlyRate: parseInt(formData.hourlyRate),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create teacher profile");
      }

      toast.success("Teacher profile created successfully!");
      toast.success("Teacher profile created successfully!");
      // Force hard navigation to refresh session and get new role
      window.location.href = "/teacher/verification";

    } catch (error) {
      console.error("Profile creation error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to create profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

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
                    {/* Professional Bio */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Professional Bio</h3>

                      <div>
                        <Label htmlFor="bio">Tell us about yourself *</Label>
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

                      {loadingMetadata ? (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Loader2 className="h-4 w-4 animate-spin" /> Loading options...
                        </div>
                      ) : (
                        <div className="space-y-4 pt-2">
                          <div className="flex gap-2 max-w-sm">
                            <Select
                              value={selectedExpertise}
                              onValueChange={(val) => handleExpertiseAddFromSelect(val)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select a subject" />
                              </SelectTrigger>
                              <SelectContent>
                                {metadata.expertise
                                  .filter(e => !formData.expertiseAreas.includes(e.name))
                                  .map((item) => (
                                    <SelectItem key={item.id} value={item.name}>
                                      {item.name}
                                    </SelectItem>
                                  ))
                                }
                                {metadata.expertise.length === 0 && (
                                  <div className="p-2 text-center text-sm text-muted-foreground">No subjects available</div>
                                )}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {formData.expertiseAreas.map((area) => (
                              <Badge key={area} className="cursor-pointer" onClick={() => handleExpertiseToggle(area)}>
                                {area} ×
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <Separator />

                    {/* Teaching Details */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Teaching Details</h3>

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
                        <Label htmlFor="languages">Languages You Speak *</Label>
                        <p className="text-xs text-gray-500">Add at least one language you can teach in</p>
                        <div className="space-y-4 pt-2">
                          <div className="flex gap-2 max-w-sm">
                            <Select
                              value={selectedLanguage}
                              onValueChange={(val) => handleLanguageAddFromSelect(val)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select a language" />
                              </SelectTrigger>
                              <SelectContent>
                                {loadingMetadata ? (
                                  <div className="p-2 text-center text-sm text-muted-foreground">Loading...</div>
                                ) : (
                                  metadata.languages
                                    .filter(l => !formData.languages.includes(l.name))
                                    .map((lang) => (
                                      <SelectItem key={lang.id} value={lang.name}>
                                        {lang.name}
                                      </SelectItem>
                                    ))
                                )}
                                {!loadingMetadata && metadata.languages.length === 0 && (
                                  <div className="p-2 text-center text-sm text-muted-foreground">No languages available</div>
                                )}
                              </SelectContent>
                            </Select>
                          </div>

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
                        disabled={isLoading}
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