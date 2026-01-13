import { prisma } from "../lib/db";

async function seedCourse() {
    console.log("🌱 Seeding a Test Course...");

    // Get a teacher (or create one if needed, but lets assume we have a user from previous steps or use the student as creator for simplicity if loose schema/rbac, otherwise fetch admin/teacher)
    // Actually, let's find ANY user to be the owner.
    let user = await prisma.user.findFirst();
    if (!user) {
        console.error("❌ No users found at all. Run debug script first.");
        return;
    }

    const course = await prisma.course.create({
        data: {
            userId: user.id,
            title: "Introduction to React Testing",
            description: "Learn how to test React apps properly.",
            slug: "intro-react-testing-" + Date.now(),
            category: "Development",
            categoryId: null, // Optional
            price: 2900, // $29.00
            duration: 120, // 2 hours
            status: 'Published',
            isFeatured: true,
            fileKey: "dummy-key",
            smallDescription: "A test course",
            tags: ["React", "Testing"],
        }
    });

    console.log(`✅ Created Course: ${course.title} (${course.id})`);
}

seedCourse()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
