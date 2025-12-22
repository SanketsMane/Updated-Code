import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface MentorProps {
    name: string;
    role: string;
    company?: string;
    companyLogo?: string; // URL or path
    rating: number;
    reviews: number;
    students: string;
    experience: string;
    skills: string[];
    hourlyRate: number;
    image: string;
    featured?: boolean;
}

export function MentorCard({
    name,
    role,
    company,
    companyLogo,
    rating,
    reviews,
    students,
    experience,
    skills,
    hourlyRate,
    image,
    featured = false,
}: MentorProps) {
    return (
        <div className="relative group bg-[#0F1115] border border-white/5 rounded-[24px] p-6 hover:border-orange-500/50 transition-colors duration-300 w-full max-w-sm">
            {/* Featured Badge */}
            {featured && (
                <div className="absolute top-6 right-6">
                    <span className="bg-[#FFA500] text-black text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wider">
                        Featured
                    </span>
                </div>
            )}

            {/* Avatar Section */}
            <div className="flex flex-col items-center mt-2">
                <div className="relative">
                    <div className="w-[100px] h-[100px] rounded-full overflow-hidden border-2 border-[#1A1D21] p-1">
                        <Image
                            src={image}
                            alt={name}
                            width={100}
                            height={100}
                            className="rounded-full object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all duration-300"
                        />
                    </div>
                    {/* Company Logo Badge - Only show if provided */}
                    {companyLogo && (
                        <div className="absolute bottom-0 right-0 translate-x-1 translate-y-1 bg-[#1E2128] rounded-full p-1.5 border border-[#0F1115]">
                            <img src={companyLogo} alt={company || "Company"} className="w-5 h-5 object-contain" />
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="text-center mt-4 space-y-1">
                    <h3 className="text-white text-xl font-bold">{name}</h3>
                    <p className="text-gray-400 text-sm">{role}</p>
                    {company && <p className="text-[#FF5722] text-sm font-medium">{company}</p>}
                </div>

                {/* Stats Row */}
                <div className="flex items-center justify-center gap-6 mt-6 w-full px-2">
                    {/* Rating */}
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-white font-bold">
                            <Star className="w-4 h-4 fill-[#FFA500] text-[#FFA500]" />
                            {rating}
                        </div>
                        <p className="text-[11px] text-gray-500 mt-0.5">{reviews} reviews</p>
                    </div>

                    <div className="w-px h-8 bg-white/10" />

                    {/* Students */}
                    <div className="text-center">
                        <div className="text-white font-bold">{students}</div>
                        <p className="text-[11px] text-gray-500 mt-0.5">Students</p>
                    </div>

                    <div className="w-px h-8 bg-white/10" />

                    {/* Experience */}
                    <div className="text-center">
                        <div className="text-white font-bold">{experience}</div>
                        <p className="text-[11px] text-gray-500 mt-0.5">Exp.</p>
                    </div>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
                    {skills.map((skill) => (
                        <span
                            key={skill}
                            className="bg-[#1A1D21] text-gray-400 text-[11px] px-3 py-1.5 rounded-full border border-white/5"
                        >
                            {skill}
                        </span>
                    ))}
                </div>

                {/* Buttons */}
                <div className="flex items-center gap-3 w-full mt-8">
                    <Link href={`/marketplace/mentors/${name.toLowerCase().replace(" ", "-")}`} className="flex-1 block text-center bg-transparent hover:bg-white/5 text-white text-sm font-medium py-3 rounded-xl border border-white/10 transition-colors">
                        View Profile
                    </Link>
                    <Link href="/book" className="flex-1 block text-center bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white text-sm font-bold py-3 rounded-xl transition-colors">
                        Book ${hourlyRate}/hr
                    </Link>
                </div>
            </div>
        </div>
    );
}
