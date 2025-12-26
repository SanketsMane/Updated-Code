
const { PrismaClient } = require("@prisma/client");
const { randomUUID } = require("crypto");

const prisma = new PrismaClient();

async function main() {
    console.log("Seeding authentic course data...");

    const courses = [
        {
            title: "Complete Python Mastery: From Beginner to Pro",
            slug: "complete-python-mastery",
            smallDescription: "Master Python programming with this comprehensive guide covering data structures, algorithms, and web development with Django.",
            description: "Detailed description of the python course...",
            price: 4999, // Cents
            level: "Beginner",
            category: "Programming & Development",
            duration: 12,
            status: "Published",
            fileKey: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
        },
        {
            title: "UI/UX Design Bootcamp 2024",
            slug: "ui-ux-design-bootcamp",
            smallDescription: "Learn to design beautiful user interfaces and user experiences using Figma. Build a real-world portfolio project.",
            description: "Detailed description of the design course...",
            price: 8999,
            level: "Intermediate",
            category: "Design & Creative",
            duration: 24,
            status: "Published",
            fileKey: "https://images.unsplash.com/photo-1586717791821-3f44a5638d48",
        },
        {
            title: "Advnaced React & Next.js Pattern",
            slug: "advanced-react-nextjs",
            smallDescription: "Take your React skills to the next level with Server Components, Suspense, and advanced hooks in Next.js 14.",
            description: "Detailed description...",
            price: 6999,
            level: "Advanced",
            category: "Programming & Development",
            duration: 15,
            status: "Published",
            fileKey: "https://images.unsplash.com/photo-1633356122544-f134324a6cee",
        },
        {
            title: "Digital Marketing Strategy Masterclass",
            slug: "digital-marketing-masterclass",
            smallDescription: "Learn how to build a comprehensive digital marketing strategy including SEO, Social Media, and Email Marketing.",
            description: "Detailed description...",
            price: 3999,
            level: "Beginner",
            category: "Business & Marketing",
            duration: 8,
            status: "Published",
            fileKey: "https://images.unsplash.com/photo-1533750349088-cd871a92f312",
        },
        {
            title: "Data Science with R and Python",
            slug: "data-science-r-python",
            smallDescription: "Analyze data, create visualizations, and build machine learning models using the power of R and Python.",
            description: "Detailed description...",
            price: 9999,
            level: "Advanced",
            category: "Data Science",
            duration: 30,
            status: "Published",
            fileKey: "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
        }
    ];

    // Create Teachers and Profiles
    const teachers = [
        {
            email: 'sarah.j@demo.com',
            name: 'Sarah Johnson',
            role: 'TEACHER',
            bio: 'Senior React Developer with 8 years of experience building enterprise applications.',
            expertise: ['React', 'Next.js', 'TypeScript', 'Frontend Architecture'],
            hourlyRate: 5000, // Cents
            image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
        },
        {
            email: 'michael.c@demo.com',
            name: 'Dr. Michael Chen',
            role: 'TEACHER',
            bio: 'PhD in Computer Science, specializing in AI and Machine Learning curricula.',
            expertise: ['AI', 'Machine Learning', 'Python', 'TensorFlow'],
            hourlyRate: 8000,
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
        },
        {
            email: 'emma.r@demo.com',
            name: 'Emma Rodriguez',
            role: 'TEACHER',
            bio: 'Data Scientist and Python Expert. improving data literacy for everyone.',
            expertise: ['Python', 'Data Science', 'Pandas', 'Visualization'],
            hourlyRate: 6000,
            image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2",
        }
    ];

    const createdTeachers = [];

    for (const t of teachers) {
        console.log(`Upserting user ${t.email}...`);
        const user = await prisma.user.upsert({
            where: { email: t.email },
            update: { image: t.image },
            create: {
                id: randomUUID(),
                email: t.email,
                name: t.name,
                role: t.role,
                image: t.image,
                emailVerified: true,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        });
        console.log(`User ${user.id} upserted.`);

        console.log(`Upserting profile for ${t.email}...`);
        // Upsert Profile
        const profile = await prisma.teacherProfile.upsert({
            where: { userId: user.id },
            update: {},
            create: {
                userId: user.id,
                bio: t.bio,
                expertise: t.expertise,
                hourlyRate: t.hourlyRate,
                isVerified: true,
                isApproved: true,
                rating: 4.8 + (Math.random() * 0.2), // Random high rating
                totalReviews: Math.floor(Math.random() * 50) + 10,
                totalStudents: Math.floor(Math.random() * 500) + 50
            }
        });
        console.log(`Profile ${profile.id} upserted.`);
        createdTeachers.push({ ...user, profileId: profile.id });
    }

    console.log("Seeding courses...");
    // Seed Courses (assigning to first teacher for now, or random)
    for (const [index, course] of courses.entries()) {
        const teacher = createdTeachers[index % createdTeachers.length];
        await prisma.course.upsert({
            where: { slug: course.slug },
            update: course,
            create: {
                ...course,
                userId: teacher.id
            },
        });
    }

    console.log("Seeding sessions...");
    // Seed Live Sessions
    const sessions = [
        {
            title: "React 18 & Next.js 14 Masterclass",
            description: "Deep dive into Server Components and the new App Router.",
            scheduledAt: new Date(Date.now() + 86400000 * 2), // 2 days from now
            duration: 120,
            price: 149900, // Cents
            teacherIndex: 0
        },
        {
            title: "AI & Machine Learning Fundamentals",
            description: "Understanding the basics of Neural Networks and Transformers.",
            scheduledAt: new Date(Date.now() + 86400000 * 3),
            duration: 180,
            price: 249900,
            teacherIndex: 1
        },
        {
            title: "Advanced Python for Data Science",
            description: "Pandas, NumPy, and real-world data analysis patterns.",
            scheduledAt: new Date(Date.now() + 86400000 * 5),
            duration: 150,
            price: 199900,
            teacherIndex: 2
        }
    ];

    for (const s of sessions) {
        const teacher = createdTeachers[s.teacherIndex];
        // Check if session exists (by title for simplicity in seeding)
        const existing = await prisma.liveSession.findFirst({ where: { title: s.title } });

        if (!existing) {
            console.log(`Creating session ${s.title}...`);
            await prisma.liveSession.create({
                data: {
                    title: s.title,
                    description: s.description,
                    scheduledAt: s.scheduledAt,
                    duration: s.duration,
                    price: s.price,
                    teacherId: teacher.profileId
                }
            });
        }
    }

    console.log("Seeding completed successfully.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
