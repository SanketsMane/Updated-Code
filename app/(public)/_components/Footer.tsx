import Link from "next/link";
import Image from "next/image";
import Logo from "@/public/logo.png";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
  BookOpen,
  Users,
  Award,
  TrendingUp,
  Globe
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const footerLinks = {
  courses: [
    { name: "Programming", href: "/courses?category=Programming" },
    { name: "Business", href: "/courses?category=Business" },
    { name: "Design", href: "/courses?category=Design" },
    { name: "Marketing", href: "/courses?category=Marketing" },
    { name: "Data Science", href: "/courses?category=Data" },
  ],
  support: [
    { name: "Help Center", href: "/help" },
    { name: "Contact Us", href: "/contact" },
    { name: "FAQ", href: "/faq" },
    { name: "Live Chat", href: "/chat" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Careers", href: "/careers" },
    { name: "Blog", href: "/blog" },
    { name: "Partnerships", href: "/partnerships" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms", href: "/terms" },
    { name: "Accessibility", href: "/accessibility" },
  ],
};

const socialLinks = [
  { name: "Facebook", href: "#", icon: Facebook },
  { name: "Twitter", href: "#", icon: Twitter },
  { name: "Instagram", href: "#", icon: Instagram },
  { name: "YouTube", href: "#", icon: Youtube },
];

export function Footer() {
  return (
    <footer className="bg-[#1C1D1F] text-white border-t border-gray-800">
      {/* Newsletter & Stats Bar */}
      <div className="border-b border-gray-700">
        <div className="container mx-auto px-4 md:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-white/10 p-3 rounded">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Teach the world online</h3>
              <p className="text-sm text-gray-400">Create an online video course, reach students across the globe, and earn money.</p>
            </div>
          </div>

          <Button suppressHydrationWarning className="bg-white text-[#1C1D1F] hover:bg-gray-100 font-bold px-6">
            Teach on KIDOKOOL
          </Button>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="container mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <Image src={Logo} alt="Logo" className="w-8 h-8" />
              <span className="font-bold text-xl">KIDOKOOL</span>
            </Link>
            <div className="flex gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <Link key={social.name} href={social.href} className="text-gray-400 hover:text-white transition-colors">
                    <Icon className="h-5 w-5" />
                  </Link>
                )
              })}
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-4">Discovery</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              {footerLinks.courses.map(link => (
                <li key={link.name}><Link href={link.href} className="hover:underline">{link.name}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Kidokool</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              {footerLinks.company.map(link => (
                <li key={link.name}><Link href={link.href} className="hover:underline">{link.name}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              {footerLinks.support.map(link => (
                <li key={link.name}><Link href={link.href} className="hover:underline">{link.name}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4 border border-white/20 px-4 py-2 rounded justify-center md:justify-start cursor-pointer hover:border-white transition-colors">
              <Globe className="h-4 w-4" />
              <span className="text-sm">English</span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Link href="/" className="font-bold text-2xl">KIDOKOOL</Link>
          </div>
          <div className="text-xs text-gray-400">
            © 2025 KIDOKOOL, Inc.
          </div>
        </div>
      </div>
    </footer>
  );
}