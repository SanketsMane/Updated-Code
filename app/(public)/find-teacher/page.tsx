import { prisma } from "@/lib/db";
import { FadeIn } from "@/components/ui/fade-in";
import Link from "next/link";
import { Star, MapPin, Clock, ArrowRight, ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function FindTeacherPage() {
    const teachers = await prisma.teacherProfile.findMany({
        where: {
            isVerified: true,
        },
        include: {
            user: {
                select: {
                    name: true,
                    image: true,
                }
            }
        },
        orderBy: {
            rating: 'desc'
        }
    });

    return (
        <div className="min-h-screen bg-background font-sans text-foreground pb-20">
            {/* Hero */}
            <section className="bg-secondary/30 py-20 border-b border-border">
                <div className="container mx-auto px-6 text-center max-w-4xl">
                    <FadeIn>
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
                            Find Your Perfect <span className="text-primary">Mentor</span>
                        </h1>
                        <p className="text-xl text-muted-foreground mb-8 text-balance">
                            Connect with verified industry experts for 1-on-1 live sessions.
                            Get personalized guidance and accelerate your learning.
                        </p>
                    </FadeIn>
                </div>
            </section>

            {/* Teacher Grid */}
            <section className="container mx-auto px-6 py-16">
                {teachers.length === 0 ? (
                    <div className="text-center py-20 bg-secondary/20 rounded-xl border border-dashed border-border">
                        <h3 className="text-2xl font-bold mb-2">No Mentors Found Yet</h3>
                        <p className="text-muted-foreground">Check back soon! new experts are joining daily.</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {teachers.map((teacher) => (
                            <FadeIn key={teacher.id} className="h-full">
                                <div className="flex flex-col h-full bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all duration-300 group">
                                    {/* Header / Avatar */}
                                    <div className="p-6 flex items-start gap-4">
                                        <div className="relative">
                                            <img
                                                src={teacher.user.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${teacher.user.name}`}
                                                alt={teacher.user.name}
                                                className="w-20 h-20 rounded-full object-cover border-2 border-background shadow-md"
                                            />
                                            <div className="absolute -bottom-1 -right-1 bg-green-500 text-white p-1 rounded-full border-2 border-background" title="Verified">
                                                <ShieldCheck className="w-3 h-3" />
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                                                {teacher.user.name}
                                            </h3>
                                            <p className="text-sm text-primary font-medium mb-1">
                                                {teacher.expertise[0] || "Instructor"}
                                            </p>
                                            <div className="flex items-center gap-1 text-sm text-yellow-500">
                                                <Star className="w-4 h-4 fill-current" />
                                                <span className="font-bold">{teacher.rating?.toFixed(1) || "New"}</span>
                                                <span className="text-muted-foreground ml-1">({teacher.totalReviews} reviews)</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bio & Details */}
                                    <div className="px-6 pb-6 flex-grow">
                                        <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                                            {teacher.bio || "No bio available."}
                                        </p>

                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {teacher.expertise.slice(0, 3).map((skill, i) => (
                                                <span key={i} className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-md font-medium">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="flex items-center justify-between text-sm text-muted-foreground mt-auto pt-4 border-t border-border">
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                <span>60 min session</span>
                                            </div>
                                            <div className="text-foreground font-bold text-lg">
                                                {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format((teacher.hourlyRate || 0) / 100)}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action */}
                                    <div className="p-4 bg-secondary/30 mt-auto">
                                        <Link
                                            href={`/find-teacher/${teacher.userId}`} // Using userId for slug for now, or ID? Schema uses ID as PK but profile is linked to userId. Let's use teacher.id (profile ID) or userId. Profile ID is better for [teacherId].
                                            className="block w-full py-3 text-center font-bold bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                                        >
                                            View Profile <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
