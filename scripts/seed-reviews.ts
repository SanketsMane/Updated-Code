
import { prisma } from "../lib/db";

async function main() {
    console.log("🌱 Seeding Reviews...");

    // 1. Find or Create a Student (Reviewer)
    let student = await prisma.user.findFirst({
        where: { email: "student@kidokool.com" },
    });

    if (!student) {
        console.log("Creating student...");
        student = await prisma.user.create({
            data: {
                id: "student-1",
                name: "Sarah Student",
                email: "student@kidokool.com",
                emailVerified: true,
                role: "student",
                image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        });
    }

    // 2. Find or Create a Teacher (Reviewee)
    // We try to find ANY teacher profile first
    let teacherProfile = await prisma.teacherProfile.findFirst({
        include: { user: true },
    });

    if (!teacherProfile) {
        console.log("No teacher found. Creating one...");
        // Check if user exists first to avoid "Account already exists" error
        let teacherUser = await prisma.user.findFirst({ where: { email: "teacher@kidokool.com" } });

        if (!teacherUser) {
            teacherUser = await prisma.user.create({
                data: {
                    id: "teacher-1",
                    name: "Prof. Smith",
                    email: "teacher@kidokool.com",
                    emailVerified: true,
                    role: "teacher",
                    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Smith",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            });
        }

        teacherProfile = await prisma.teacherProfile.create({
            data: {
                userId: teacherUser.id,
                bio: "Expert Instructor",
                expertise: ["Coding", "Math"],
                isVerified: true,
            },
            include: { user: true }
        });
    }

    // 3. Create Reviews
    console.log(`Adding reviews for Teacher: ${teacherProfile.user.name}`);

    const reviews = [
        {
            rating: 5,
            comment: "Absolutely amazing course! The instructor explained everything clearly.",
            title: "Great Experience",
        },
        {
            rating: 5,
            comment: "KIDOKOOL is the best platform I've used. Highly recommended!",
            title: "Love it",
        },
        {
            rating: 4,
            comment: "Very helpful content, though the pace was a bit fast.",
            title: "Good learning",
        },
    ];

    for (const review of reviews) {
        await prisma.review.create({
            data: {
                rating: review.rating,
                comment: review.comment,
                title: review.title,
                reviewerId: student.id,
                teacherId: teacherProfile.id,
                courseId: null, // General teacher review
            },
        });
    }

    console.log("✅ Successfully added 3 reviews!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
