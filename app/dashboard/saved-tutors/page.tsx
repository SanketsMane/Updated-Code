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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedTutors.map((saved) => {
                    const profile = saved.tutor.teacherProfile;
                    if (!profile) return null;
                    
                    // Transform to card props (mocking based on presumed component)
                    return (
                        <div key={saved.id} className="border rounded-lg p-4">
                            <div className="font-semibold">{saved.tutor.name}</div>
                            <div className="text-sm text-muted-foreground">{profile.subject || "Teacher"}</div>
                            {/* Ideally use a shared TeacherCard component here */}
                        </div>
                    );
                })}
            </div>
        )}
    </div>
  );
}
