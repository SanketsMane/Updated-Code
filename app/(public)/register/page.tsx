import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  BookOpen, 
  Users, 
  Award, 
  TrendingUp,
  Mail,
  Lock,
  User,
  ArrowRight
} from "lucide-react";

const stats = [
  { icon: BookOpen, label: "Courses", value: "1000+" },
  { icon: Users, label: "Students", value: "50K+" },
  { icon: Award, label: "Instructors", value: "500+" },
  { icon: TrendingUp, label: "Success Rate", value: "95%" }
];

const features = [
  "Access to all premium courses",
  "Learn from industry experts", 
  "Get certificates upon completion",
  "Join vibrant learning community",
  "Mobile and desktop access",
  "Lifetime access to materials"
];

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Registration Form */}
          <div className="order-2 lg:order-1">
            <Card className="shadow-2xl border-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8">
                <div className="text-center space-y-2">
                  <CardTitle className="text-3xl font-bold">Join KIDOKOOL</CardTitle>
                  <p className="text-blue-100">Start your learning journey today</p>
                </div>
              </CardHeader>
              
              <CardContent className="p-8 space-y-6">
                {/* Registration Type Selection */}
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-4">Choose your account type:</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-4 border-2 border-blue-200 bg-blue-50 rounded-lg">
                        <h3 className="font-medium text-gray-900">Student</h3>
                        <p className="text-xs text-gray-600 mt-1">Learn from expert teachers</p>
                      </div>
                      <Link href="/register/teacher">
                        <div className="p-4 border-2 border-gray-200 hover:border-emerald-200 hover:bg-emerald-50 rounded-lg cursor-pointer transition-colors">
                          <h3 className="font-medium text-gray-900">Teacher</h3>
                          <p className="text-xs text-gray-600 mt-1">Share knowledge & earn</p>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Social Login Buttons */}
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full h-12 text-sm font-medium border-2 hover:bg-blue-50 dark:hover:bg-blue-950"
                  >
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full h-12 text-sm font-medium border-2 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Continue with Facebook
                  </Button>
                </div>

                <div className="relative">
                  <Separator />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="bg-white dark:bg-gray-900 px-4 text-sm text-muted-foreground">
                      Or register with email
                    </span>
                  </div>
                </div>

                {/* Registration Form */}
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="firstName"
                          placeholder="John"
                          className="pl-10 h-12"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="lastName"
                          placeholder="Doe"
                          className="pl-10 h-12"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        className="pl-10 h-12"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10 h-12"
                        required
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-12 text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Create Account
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>

                <p className="text-center text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                    Sign in here
                  </Link>
                </p>

                <p className="text-xs text-muted-foreground text-center leading-relaxed">
                  By creating an account, you agree to our{" "}
                  <Link href="/terms" className="text-blue-600 hover:text-blue-700">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-blue-600 hover:text-blue-700">
                    Privacy Policy
                  </Link>
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Benefits */}
          <div className="order-1 lg:order-2 space-y-8">
            <div className="text-center lg:text-left">
              <Badge variant="outline" className="mb-4">
                Join 50,000+ Learners
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                Transform Your Career with 
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> Expert Learning</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Access premium courses, learn from industry experts, and advance your skills 
                with our comprehensive online learning platform.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <Card key={index} className="p-6 text-center border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-700 transition-colors">
                    <IconComponent className="h-8 w-8 mx-auto mb-3 text-blue-600" />
                    <div className="text-2xl font-bold mb-1">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </Card>
                );
              })}
            </div>

            {/* Features List */}
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-0">
              <h3 className="text-xl font-semibold mb-4">What you'll get:</h3>
              <div className="space-y-3">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="rounded-full p-1 bg-green-100 dark:bg-green-900/30">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}