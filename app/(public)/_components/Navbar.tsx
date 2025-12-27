"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Logo from "@/public/logo.png";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { authClient } from "@/lib/auth-client";
import { UserDropdown } from "./UserDropdown";
import { Search, Menu as MenuIcon, X } from "lucide-react";
import Menu, { IMenu } from "@/components/ui/navbar";

const navigationItems: IMenu[] = [
  {
    id: 1,
    title: "Home",
    url: "/",
  },
  {
    id: 2,
    title: "Courses",
    url: "/courses",
    dropdown: true,
    items: [
      { id: 21, title: "All Courses", url: "/courses" },
      { id: 22, title: "Programming", url: "/courses?category=Programming" },
      { id: 23, title: "Business", url: "/courses?category=Business" },
      { id: 24, title: "Design", url: "/courses?category=Design" },
      { id: 25, title: "Health & Fitness", url: "/courses?category=Health" },
    ]
  },
  {
    id: 3,
    title: "Live Sessions",
    url: "/live-sessions",
  },
  {
    id: 4,
    title: "Mentors",
    url: "/find-teacher",
  },
];

export function Navbar() {
  const { data: session, isPending } = authClient.useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto flex h-16 items-center px-4 md:px-8 gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 mr-4 shrink-0">
          <Image src={Logo} alt="KIDOKOOL" className="w-8 h-8 md:w-10 md:h-10" />
          <span className="font-bold text-xl text-foreground hidden sm:block">
            KIDOKOOL
          </span>
        </Link>

        {/* Categories / Desktop Nav */}
        <div className="hidden md:flex flex-1 items-center gap-6">
          {/* Simple functional search bar placeholder - Udemy Style */}
          <div className="flex-1 max-w-xl relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                suppressHydrationWarning
                placeholder="Search for anything"
                className="w-full pl-10 pr-4 py-2.5 rounded-full border border-gray-300 bg-gray-50 text-sm focus:outline-none focus:border-primary focus:bg-white transition-all placeholder:text-gray-500 text-gray-800"
              />
            </div>
          </div>

          {/* Integrated New Menu Component */}
          <div className="flex items-center text-sm font-medium text-foreground">
            <Menu list={navigationItems} />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3 md:gap-4 shrink-0">
          {/* Mobile Search Trigger (Visible only on small screens) */}
          <button suppressHydrationWarning className="md:hidden text-gray-600 hover:text-primary">
            <Search className="h-5 w-5" />
          </button>

          <div className="hidden sm:block">
            <ThemeToggle />
          </div>

          {session ? (
            <UserDropdown
              email={session.user.email}
              name={session.user.name || session.user.email.split('@')[0]}
              image={session.user.image || `https://avatar.vercel.sh/${session.user.email}`}
              role={session.user.role || undefined}
            />
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-sm font-bold text-foreground border border-input hover:bg-accent hover:text-accent-foreground rounded transition-all"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-bold text-primary-foreground bg-primary hover:bg-primary/90 rounded transition-all shadow-none"
              >
                Sign up
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            suppressHydrationWarning
            className="md:hidden p-1 text-gray-700 hover:bg-gray-100 rounded"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background p-4 absolute top-16 left-0 right-0 shadow-lg">
          <nav className="flex flex-col space-y-4">
            {navigationItems.map(item => (
              <Link
                key={item.id}
                href={item.url}
                className="flex items-center justify-between text-foreground font-medium py-2 border-b border-border last:border-0"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.title}
              </Link>
            ))}
            {!session && (
              <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-gray-100">
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-center py-2.5 font-bold text-foreground border border-input rounded hover:bg-accent">
                  Log in
                </Link>
                <Link href="/register" onClick={() => setIsMobileMenuOpen(false)} className="text-center py-2.5 font-bold text-primary-foreground bg-primary rounded hover:bg-primary/90">
                  Sign up
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
