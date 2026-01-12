import Link from "next/link";
import Image from "next/image";
import Logo from "@/public/logo.png";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  MapPin,
  Phone,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const footerLinks = {
  learn: [
    { name: "Find Tutors", href: "/find-teacher" }, // Was /marketplace
    { name: "Online Courses", href: "/courses" },
    { name: "Live Sessions", href: "/live-sessions" },
    { name: "Group Classes", href: "/live-sessions" }, // Reusing live-sessions for now or creating later
  ],
  teach: [
    { name: "Become a Tutor", href: "/teacher/register" },
    { name: "Teacher Rules", href: "/teacher/rules" },
    { name: "Success Stories", href: "/teacher/stories" },
    { name: "Teacher Verify", href: "/teacher/verify" },
  ],
  support: [
    { name: "Help Center", href: "/help" },
    { name: "Contact Us", href: "/contact" },
    { name: "FAQs", href: "/faq" },
    { name: "Report Issue", href: "/report" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Careers", href: "/careers" },
    { name: "Blog", href: "/blog" },
    { name: "Privacy Policy", href: "/privacy" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-[#0b1120] text-slate-300 border-t border-slate-800/50 font-sans">
      {/* Top Section: Newsletter */}
      <div className="border-b border-slate-800">
        <div className="container mx-auto px-4 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-4 max-w-lg">
              <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                <Mail className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">Subscribe to our Newsletter</h3>
                <p className="text-slate-400 text-sm">Get the latest news, updates and special offers delivered directly to your inbox.</p>
              </div>
            </div>

            <div className="flex w-full md:w-auto gap-2">
              <Input
                placeholder="Enter your email"
                className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-primary h-11 min-w-[280px]"
              />
              <Button className="h-11 px-6 font-bold bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Links Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="flex items-center gap-2">
              <Image src={Logo} alt="KIDOKOOL" width={40} height={40} className="w-10 h-10" />
              <span className="text-2xl font-bold text-white tracking-tight">KIDOKOOL</span>
            </Link>
            <p className="text-slate-400 leading-relaxed max-w-sm">
              The world's leading online learning platform. Join millions of learners and instructors gathering to master new skills.
            </p>

            <div className="flex items-center gap-4 text-sm text-slate-400 pt-4">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <span>support@kidokool.com</span>
              </div>
            </div>

            <div className="flex gap-4 pt-2">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <div key={i} className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white transition-all cursor-pointer">
                  <Icon className="h-5 w-5" />
                </div>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-white font-bold mb-6">Learn</h4>
              <ul className="space-y-3 text-sm">
                {footerLinks.learn.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="hover:text-primary transition-colors block py-1">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6">Teach</h4>
              <ul className="space-y-3 text-sm">
                {footerLinks.teach.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="hover:text-primary transition-colors block py-1">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6">Company</h4>
              <ul className="space-y-3 text-sm">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="hover:text-primary transition-colors block py-1">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800 bg-[#060a15]">
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <p>© 2025 KIDOKOOL Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/cookies" className="hover:text-white transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}