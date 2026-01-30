import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { HorizontalTeacherCard } from "@/components/marketing/HorizontalTeacherCard"; // Assuming this exists or similar card

export default async function SavedTutorsPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session?.user) redirect("/login");

  const savedTutors = await prisma.studentSavedTutor.findMany({
    where: { studentId: session.user.id },
    include: {
        tutor: {
            include: {
                teacherProfile: {
                    include: {
                        _count: {
                            select: { reviews: true }
                        }
                    }
                }
            }
        }
    }
  });

  return (
    <div className="p-6 space-y-6">
        <div>
            <h1 className="text-2xl font-bold">Saved Tutors</h1>
            <p className="text-muted-foreground">Mentors you have bookmarked.</p>
        </div>

        {savedTutors.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
                You haven't saved any tutors yet.
            </div>
        ) : (
            <div className="space-y-6">
                {savedTutors.map((saved) => {
                    const profile = saved.tutor.teacherProfile;
                    if (!profile) return null;
                    
                    const cardData = {
                        id: saved.tutor.id,
                        name: saved.tutor.name || "Unknown",
                        image: saved.tutor.image || "",
                        headline: profile.bio || "Teacher",
                        rating: profile.rating || 0,
                        reviewCount: profile._count.reviews,
                        hourlyRate: profile.hourlyRate || 0,
                        teaches: profile.expertise,
                        speaks: profile.languages,
                        description: profile.bio || "",
                        country: (saved.tutor as any).country || "Unknown",
                        gender: (saved.tutor as any).gender || "Unknown",
                        experience: profile.experience || 0,
                        isVerified: profile.isVerified
                    };

                    return (
                        <HorizontalTeacherCard key={saved.id} teacher={cardData} />
                    );
                })}
            </div>
        )}
    </div>
  );
}
