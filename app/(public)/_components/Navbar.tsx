"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import Logo from "@/public/logo.png";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { authClient } from "@/lib/auth-client";
import { UserDropdown } from "./UserDropdown";
import { Search, Menu as MenuIcon, Video, Home, BookOpen, Users } from "lucide-react";
import Menu, { IMenu } from "@/components/ui/navbar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

const navigationItems: IMenu[] = [
  {
    id: 1,
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    id: 2,
    title: "Courses",
    url: "/courses",
    icon: BookOpen,
  },
  {
    id: 3,
    title: "Live Sessions",
    url: "/live-sessions",
    icon: Video,
  },
  {
    id: 4,
    title: "Mentors",
    url: "/find-teacher",
    icon: Users,
  },
];

export function Navbar() {
  const { data: session, isPending } = authClient.useSession();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto flex h-16 items-center px-4 md:px-8 gap-4 justify-between">
        {/* Left Side: Logo */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Image src={Logo} alt="Examsphere" className="w-9 h-9 md:w-10 md:h-10" />
            <span className="font-bold text-xl text-foreground tracking-tight">
              Examsphere
            </span>
          </Link>
        </div>

        {/* Center: Desktop Navigation */}
        <div className="hidden md:flex flex-1 items-center justify-center">
          <Menu list={navigationItems} />
        </div>

        {/* Right Side: Actions */}
        <div className="flex items-center gap-2 md:gap-4 shrink-0">
          {/* Mobile Search - Visible only on mobile */}
          <Button variant="ghost" size="icon" className="md:hidden text-muted-foreground">
            <Search className="h-5 w-5" />
          </Button>

          {/* Theme Toggle - Hidden on very small screens to save space, visible in menu */}
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>

          {/* Desktop Auth Buttons / User Dropdown */}
          <div className="hidden md:flex items-center gap-3">
            {session ? (
              <UserDropdown
                email={session.user.email}
                name={session.user.name || session.user.email.split('@')[0]}
                image={session.user.image || `https://avatar.vercel.sh/${session.user.email}`}
                role={(session.user as any).role || undefined}
              />
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="font-semibold">Log in</Button>
                </Link>
                <Link href="/register">
                  <Button className="font-bold shadow-md">Sign up</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Trigger & Content */}
          <div className="md:hidden flex items-center">
            {session && (
              <div className="mr-2">
                <UserDropdown
                    email={session.user.email}
                    name={session.user.name || session.user.email.split('@')[0]}
                    image={session.user.image || `https://avatar.vercel.sh/${session.user.email}`}
                    role={(session.user as any).role || undefined}
                />
              </div>
            )}
            
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-foreground">
                  <MenuIcon className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[350px] p-0 flex flex-col">
                <SheetHeader className="p-6 border-b border-border bg-muted/20">
                    <SheetTitle className="flex items-center gap-2">
                        <Image src={Logo} alt="Examsphere" className="w-8 h-8" />
                        <span className="font-bold text-lg">Examsphere</span>
                    </SheetTitle>
                </SheetHeader>
                
                <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-6">
                    {/* Navigation Links */}
                    <nav className="flex flex-col gap-2">
                        {navigationItems.map((item) => (
                            <Link
                                key={item.id}
                                href={item.url}
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-muted text-foreground transition-colors font-medium text-base"
                            >
                                {item.icon && <item.icon className="w-5 h-5 text-muted-foreground" />}
                                {item.title}
                            </Link>
                        ))}
                    </nav>

                    <Separator className="my-2" />

                    {/* Mobile Only: Theme Toggle Row */}
                    <div className="flex items-center justify-between px-4 py-2">
                        <span className="font-medium text-sm">Theme</span>
                        <ThemeToggle />
                    </div>

                    {/* Mobile Only: Auth Buttons (if not logged in) */}
                    {!session && (
                        <div className="mt-auto flex flex-col gap-3 px-2">
                            <Link href="/login" onClick={() => setIsOpen(false)}>
                                <Button variant="outline" className="w-full justify-center text-base py-5">
                                    Log in
                                </Button>
                            </Link>
                            <Link href="/register" onClick={() => setIsOpen(false)}>
                                <Button className="w-full justify-center text-base font-bold py-5 shadow-lg">
                                    Sign up for free
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
