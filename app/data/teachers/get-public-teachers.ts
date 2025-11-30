import { prisma } from "@/lib/db";

export interface Teacher {
  id: string;
  name: string;
  title: string;
  avatar: string;
  rating: number;
  reviews: number;
  students: number;
  courses: number;
  languages: string[];
  specialties: string[];
  hourlyRate: number;
  responseTime: string;
  verified: boolean;
  bio?: string;
  website?: string;
  linkedin?: string;
  twitter?: string;
  youtube?: string;
}

export async function getPublicTeachers(): Promise<Teacher[]> {
  try {
    const teachers = await prisma.teacherProfile.findMany({
      where: {
        isVerified: true,
        isApproved: true,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        _count: {
          select: {
            liveSessions: true,
          },
        },
      },
      orderBy: [
        { rating: "desc" },
        { totalStudents: "desc" },
      ],
      take: 50,
    });

    return teachers.map(teacher => ({
      id: teacher.user.id,
      name: teacher.user.name || "Unknown Teacher",
      title: teacher.bio ? teacher.bio.substring(0, 50) + "..." : "Professional Educator",
      avatar: teacher.user.image || "/placeholder-avatar.svg",
      rating: teacher.rating || 0,
      reviews: teacher.totalReviews || 0,
      students: teacher.totalStudents || 0,
      courses: teacher._count.liveSessions || 0,
      languages: teacher.languages || ["English"],
      specialties: teacher.expertise || [],
      hourlyRate: teacher.hourlyRate ? Math.round(teacher.hourlyRate / 100) : 50,
      responseTime: "Usually responds within 2 hours",
      verified: teacher.isVerified,
      bio: teacher.bio || undefined,
      website: teacher.website || undefined,
      linkedin: teacher.linkedin || undefined,
      twitter: teacher.twitter || undefined,
      youtube: teacher.youtube || undefined,
    }));
  } catch (error) {
    console.error("Error fetching teachers:", error);
    return [];
  }
}