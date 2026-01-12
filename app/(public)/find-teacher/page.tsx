import { FindTeacherContent } from "@/components/mentors/FindTeacherContent";
import { prisma } from "@/lib/db";
import { getFeaturedMentors } from "@/app/data/marketing/get-marketing-data";

export const dynamic = "force-dynamic";

export default async function FindTeacherPage() {
    const teachers = await prisma.teacherProfile.findMany({
        where: {
            isVerified: true,
            isApproved: true
        },
        include: {
            user: true
        }
    });

    const featuredMentors = await getFeaturedMentors();

    const formattedTeachers = teachers.map(t => ({
        id: t.id,
        name: t.user.name || "Instructor",
        image: t.user.image || "https://github.com/shadcn.png",
        headline: t.bio ? t.bio.substring(0, 50) + "..." : "Expert Instructor",
        rating: t.rating || 5.0,
        reviewCount: t.totalReviews,
        hourlyRate: t.hourlyRate || 0,
        teaches: t.expertise,
        speaks: t.languages,
        description: t.bio || "No description available.",
        country: "Global", // Schema doesn't have country yet
        isVerified: t.isVerified
    }));

    return <FindTeacherContent teachers={formattedTeachers} featuredMentors={featuredMentors} />;
}
