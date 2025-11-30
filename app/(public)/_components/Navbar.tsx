"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Logo from "@/public/logo.png";
import { ThemeToggle } from "@/components/ui/themeToggle";
import { authClient } from "@/lib/auth-client";
import { buttonVariants } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { UserDropdown } from "./UserDropdown";
import { 
  Menu, 
  X, 
  BookOpen, 
  Users, 
  GraduationCap, 
  BarChart3,
  ChevronDown 
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const navigationItems = [
  { 
    name: "Home", 
    href: "/",
    icon: null
  },
  { 
    name: "Courses", 
    href: "/courses",
    icon: BookOpen,
    dropdown: [
      { name: "All Courses", href: "/courses" },
      { name: "Programming", href: "/courses?category=Programming" },
      { name: "Business", href: "/courses?category=Business" },
      { name: "Design", href: "/courses?category=Design" },
      { name: "Health & Fitness", href: "/courses?category=Health" },
    ]
  },
  { 
    name: "Live Sessions", 
    href: "/live-sessions",
    icon: GraduationCap
  },
  { 
    name: "Blog", 
    href: "/blog",
    icon: BookOpen
  },
  { 
    name: "Instructors", 
    href: "/marketplace",
    icon: Users
  },
  { 
    name: "Dashboard", 
    href: "/dashboard",
    icon: BarChart3
  },
];

export function Navbar() {
  const { data: session, isPending } = authClient.useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 dark:bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-900/60 shadow-sm">
      <div className="max-w-7xl mx-auto flex h-14 lg:h-16 items-center px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 mr-4 lg:mr-8">
          <div className="relative">
            <Image src={Logo} alt="KIDOKOOL Logo" className="size-8 lg:size-10" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base lg:text-xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              KIDOKOOL
            </span>
            <div className="text-xs text-muted-foreground -mt-1 hidden sm:block">Learning Platform</div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex md:flex-1 md:items-center md:justify-between">
          <div className="flex items-center space-x-0.5 lg:space-x-1">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              
              if (item.dropdown) {
                return (
                  <DropdownMenu key={item.name}>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        className="flex items-center space-x-1 text-xs lg:text-sm font-medium hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 px-2 lg:px-3"
                      >
                        {IconComponent && <IconComponent className="h-4 w-4" />}
                        <span>{item.name}</span>
                        <ChevronDown className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-48">
                      {item.dropdown.map((dropdownItem) => (
                        <DropdownMenuItem key={dropdownItem.name} asChild>
                          <Link href={dropdownItem.href} className="cursor-pointer">
                            {dropdownItem.name}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                );
              }

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-1 px-2 lg:px-3 py-2 text-xs lg:text-sm font-medium transition-colors hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-md"
                >
                  {IconComponent && <IconComponent className="h-4 w-4" />}
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center space-x-1 lg:space-x-3">
            <ThemeToggle />

            {isPending ? (
              <div className="flex space-x-2">
                <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-9 w-16 rounded"></div>
                <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-9 w-20 rounded"></div>
              </div>
            ) : session ? (
              <div className="flex items-center space-x-1 lg:space-x-3">
                <div className="hidden xl:flex items-center space-x-1 text-xs lg:text-sm">
                  <span className="text-muted-foreground">Welcome,</span>
                  <span className="font-medium truncate max-w-20">{
                    session?.user.name && session.user.name.length > 0
                      ? session.user.name.split(' ')[0]
                      : session?.user.email.split("@")[0]
                  }</span>
                </div>
                <UserDropdown
                  email={session.user.email}
                  image={
                    session?.user.image ??
                    `https://avatar.vercel.sh/${session?.user.email}`
                  }
                  name={
                    session?.user.name && session.user.name.length > 0
                      ? session.user.name
                      : session?.user.email.split("@")[0]
                  }
                />
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className={buttonVariants({ 
                    variant: "ghost",
                    className: "font-medium hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950"
                  })}
                >
                  Login
                </Link>
                <Link 
                  href="/register" 
                  className={buttonVariants({
                    className: "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
                  })}
                >
                  Get Started Free
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-1">
          {session && (
            <UserDropdown
              email={session.user.email}
              image={
                session?.user.image ??
                `https://avatar.vercel.sh/${session?.user.email}`
              }
              name={
                session?.user.name && session.user.name.length > 0
                  ? session.user.name
                  : session?.user.email.split("@")[0]
              }
            />
          )}
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="h-8 w-8"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-white dark:bg-gray-900 shadow-lg">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 space-y-2">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center space-x-3 px-3 py-3 text-sm font-medium transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md"
                >
                  {IconComponent && <IconComponent className="h-5 w-5 text-blue-600" />}
                  <span>{item.name}</span>
                </Link>
              );
            })}
            
            <div className="pt-4 border-t">
              {session ? (
                <div className="space-y-2">
                  <div className="px-3 py-2 text-sm text-muted-foreground">
                    Welcome, {
                      session?.user.name && session.user.name.length > 0
                        ? session.user.name.split(' ')[0]
                        : session?.user.email.split("@")[0]
                    }
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full text-center px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full text-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-md hover:from-blue-700 hover:to-indigo-700 transition-all"
                  >
                    Get Started Free
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
