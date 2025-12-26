"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import {
  Loader2,
  Mail,
  ArrowRight,
  CheckCircle2,
  Quote,
  Github,
  User
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import { MotionWrapper } from "@/components/ui/motion-wrapper";

const testimonials = [
  {
    quote: "KIDOKOOL has completely transformed the way I learn. The courses are structured, easy to follow, and the instructors are world-class.",
    author: "Sarah Jenkins",
    role: "Frontend Developer",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80"
  },
  {
    quote: "As a teacher, this platform gave me the tools to reach thousands of students globally. The analytics and support are unmatched.",
    author: "David Chen",
    role: "Senior Math Instructor",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
  },
  {
    quote: "I landed my dream job after completing the Full Stack Bootcamp here. The certificate actually carries weight in the industry.",
    author: "Emily Watson",
    role: "Software Engineer",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80"
  }
];

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState<"student" | "teacher">("student");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await authClient.emailOtp.sendVerificationOtp({
        email: email,
        type: "sign-in",
      }, {
        onSuccess: () => {
          toast.success("Email sent! Check your inbox.");
          router.push(`/verify-request?email=${email}`);
        },
        onError: (ctx) => {
          toast.error(ctx.error.message || "Error sending email");
          setIsLoading(false);
        }
      });
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred");
      setIsLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    try {
      await authClient.signIn.social({
        provider: "github",
        callbackURL: "/dashboard",
      });
    } catch (error) {
      toast.error("Failed to sign in with GitHub");
    }
  };

  return (
    <MotionWrapper className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side - Visuals */}
      <div className="hidden lg:flex flex-col relative bg-zinc-900 text-white p-12 justify-between overflow-hidden">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop"
            alt="Background"
            fill
            className="object-cover opacity-40 mix-blend-overlay"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent" />
        </div>

        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2 mb-12">
            <span className="text-2xl font-bold tracking-tight">KIDOKOOL</span>
          </Link>
          <div className="space-y-6 max-w-lg">
            <h1 className="text-4xl font-extrabold tracking-tight capitalize leading-tight">
              Welcome back to your <span className="text-primary">learning journey</span>.
            </h1>
            <div className="flex flex-col gap-3">
              {["Pick up where you left off", "Track your progress", "Connect with mentors"].map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  <span className="font-medium text-zinc-200">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Testimonials Carousel */}
        <div className="relative z-10 w-full mb-10">
          <Carousel
            opts={{ loop: true }}
            plugins={[Autoplay({ delay: 5000 })]}
            className="w-full max-w-xl"
          >
            <CarouselContent>
              {testimonials.map((t, i) => (
                <CarouselItem key={i}>
                  <div className="p-6 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl">
                    <Quote className="w-8 h-8 text-primary mb-4 opacity-50" />
                    <p className="text-lg leading-relaxed font-medium mb-6">"{t.quote}"</p>
                    <div className="flex items-center gap-4">
                      <img src={t.avatar} alt={t.author} className="w-12 h-12 rounded-full object-cover border-2 border-primary/50" />
                      <div>
                        <h4 className="font-bold">{t.author}</h4>
                        <p className="text-sm text-zinc-400">{t.role}</p>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex flex-col items-center justify-center p-6 lg:p-12 bg-background">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight">Welcome Back</h2>
            <p className="text-muted-foreground mt-2">Enter your email to receive a login code.</p>
          </div>

          {/* Role Switcher */}
          <div className="grid grid-cols-2 p-1 bg-secondary/50 rounded-xl relative">
            <button
              onClick={() => setUserType("student")}
              className={`text-sm font-semibold py-2.5 rounded-lg transition-all duration-300 ${userType === "student" ? "bg-white shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"}`}
            >
              I'm a Student
            </button>
            <button
              onClick={() => setUserType("teacher")}
              className={`text-sm font-semibold py-2.5 rounded-lg transition-all duration-300 ${userType === "teacher" ? "bg-white shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"}`}
            >
              I'm a Teacher
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-secondary/20 h-11"
                />
              </div>
            </div>

            <Button type="submit" className="w-full h-11 font-bold shadow-lg shadow-primary/20" disabled={isLoading}>
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Continue with Email"}
              {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" type="button" className="w-full h-11 font-semibold" onClick={handleGithubLogin}>
              <Github className="w-5 h-5 mr-2" />
              GitHub
            </Button>
            <Button variant="outline" type="button" className="w-full h-11 font-semibold" onClick={() => toast.info("Google Login")}>
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google
            </Button>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/register" className="font-bold text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </MotionWrapper>
  );
}
