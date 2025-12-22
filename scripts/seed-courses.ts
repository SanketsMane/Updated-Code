
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("Seeding authentic course data...");

    const courses = [
        {
            title: "Complete Python Mastery: From Beginner to Pro",
            slug: "complete-python-mastery",
            smallDescription: "Master Python programming with this comprehensive guide covering data structures, algorithms, and web development with Django.",
            description: "Detailed description of the python course...",
            price: 49.99,
            level: "Beginner",
            category: "Programming & Development",
            duration: "12",
            status: "Published",
            fileKey: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5", // Python/Code image
        },
        {
            title: "UI/UX Design Bootcamp 2024",
            slug: "ui-ux-design-bootcamp",
            smallDescription: "Learn to design beautiful user interfaces and user experiences using Figma. Build a real-world portfolio project.",
            description: "Detailed description of the design course...",
            price: 89.99,
            level: "Intermediate",
            category: "Design & Creative",
            duration: "24",
            status: "Published",
            fileKey: "https://images.unsplash.com/photo-1586717791821-3f44a5638d48", // Design image
        },
        {
            title: "Advanced React & Next.js Pattern",
            slug: "advanced-react-nextjs",
            smallDescription: "Take your React skills to the next level with Server Components, Suspense, and advanced hooks in Next.js 14.",
            description: "Detailed description...",
            price: 69.99,
            level: "Advanced",
            category: "Programming & Development",
            duration: "15",
            status: "Published",
            fileKey: "https://images.unsplash.com/photo-1633356122544-f134324a6cee", // React image
        },
        {
            title: "Digital Marketing Strategy Masterclass",
            slug: "digital-marketing-masterclass",
            smallDescription: "Learn how to build a comprehensive digital marketing strategy including SEO, Social Media, and Email Marketing.",
            description: "Detailed description...",
            price: 39.99,
            level: "Beginner",
            category: "Business & Marketing",
            duration: "8",
            status: "Published",
            fileKey: "https://images.unsplash.com/photo-1533750349088-cd871a92f312", // Marketing image
        },
        {
            title: "Data Science with R and Python",
            slug: "data-science-r-python",
            smallDescription: "Analyze data, create visualizations, and build machine learning models using the power of R and Python.",
            description: "Detailed description...",
            price: 99.99,
            level: "Advanced",
            category: "Data Science",
            duration: "30",
            status: "Published",
            fileKey: "https://images.unsplash.com/photo-1551288049-bebda4e38f71", // Data image
        }
    ];

    // Upsert a teacher user
    const teacher = await prisma.user.upsert({
        where: { email: 'teacher@demo.com' },
        update: {},
        create: {
            email: 'teacher@demo.com',
            name: 'Demo Teacher',
            role: 'TEACHER' as any // Casting as any to avoid enum import issues if strict
        }
    });

    for (const course of courses) {
        await prisma.course.upsert({
            where: { slug: course.slug },
            update: course,
            create: {
                ...course,
                userId: teacher.id
            },
        });
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
