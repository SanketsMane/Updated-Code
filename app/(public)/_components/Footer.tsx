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
  TrendingUp
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
    { name: "Community", href: "/community" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Careers", href: "/careers" },
    { name: "Press", href: "/press" },
    { name: "Blog", href: "/blog" },
    { name: "Partnerships", href: "/partnerships" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Cookie Policy", href: "/cookies" },
    { name: "Accessibility", href: "/accessibility" },
    { name: "Refund Policy", href: "/refunds" },
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
    <footer className="bg-gray-900 text-gray-300">
      {/* Newsletter Section */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              Stay Updated with Our Latest Courses
            </h3>
            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
              Subscribe to our newsletter and be the first to know about new courses, 
              special offers, and learning tips from industry experts.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input 
                type="email" 
                placeholder="Enter your email address"
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500"
              />
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 whitespace-nowrap">
                Subscribe
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center space-y-2">
              <div className="bg-blue-600/10 p-3 rounded-full">
                <BookOpen className="h-6 w-6 text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-white">1,000+</div>
              <div className="text-sm text-gray-400">Courses Available</div>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="bg-green-600/10 p-3 rounded-full">
                <Users className="h-6 w-6 text-green-400" />
              </div>
              <div className="text-2xl font-bold text-white">50,000+</div>
              <div className="text-sm text-gray-400">Happy Students</div>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="bg-purple-600/10 p-3 rounded-full">
                <Award className="h-6 w-6 text-purple-400" />
              </div>
              <div className="text-2xl font-bold text-white">500+</div>
              <div className="text-sm text-gray-400">Expert Instructors</div>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="bg-orange-600/10 p-3 rounded-full">
                <TrendingUp className="h-6 w-6 text-orange-400" />
              </div>
              <div className="text-2xl font-bold text-white">95%</div>
              <div className="text-sm text-gray-400">Success Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-3 mb-6">
              <Image src={Logo} alt="KIDOKOOL Logo" className="size-10" />
              <div>
                <span className="font-bold text-xl text-white">KIDOKOOL</span>
                <div className="text-xs text-gray-400">Learning Platform</div>
              </div>
            </Link>
            
            <p className="text-gray-400 mb-6 leading-relaxed">
              Empowering learners worldwide with high-quality online education. 
              Learn from industry experts, advance your career, and achieve your goals 
              with our comprehensive learning platform.
            </p>

            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-blue-400" />
                <span className="text-sm">San Francisco, CA 94105</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-blue-400" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-blue-400" />
                <span className="text-sm">hello@kidokool.com</span>
              </div>
            </div>

            <div className="flex space-x-4 mt-6">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <Link
                    key={social.name}
                    href={social.href}
                    className="bg-gray-800 p-2 rounded-lg hover:bg-gray-700 transition-colors"
                    aria-label={social.name}
                  >
                    <IconComponent className="h-5 w-5" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Popular Courses */}
          <div>
            <h4 className="font-semibold text-white mb-4">Popular Courses</h4>
            <ul className="space-y-3">
              {footerLinks.courses.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-blue-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-blue-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-blue-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-blue-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 bg-gray-950">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4 text-sm text-gray-500">
              <span>© 2025 KIDOKOOL Learning Platform. All rights reserved.</span>
              <div className="flex items-center space-x-4">
                <Badge variant="outline" className="text-xs border-gray-700 text-gray-400">
                  🔒 SSL Secured
                </Badge>
                <Badge variant="outline" className="text-xs border-gray-700 text-gray-400">
                  ✅ GDPR Compliant
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>Made with ❤️ for learners worldwide</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}