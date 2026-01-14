import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const userCount = await prisma.user.count();
    const courseCount = await prisma.course.count();
    const categoryCount = await prisma.category.count();
    const sessionCount = await prisma.liveSession.count();

    console.log("--- Database Verification ---");
    console.log(`Users: ${userCount}`);
    console.log(`Courses: ${courseCount}`);
    console.log(`Categories: ${categoryCount}`);
    console.log(`Live Sessions: ${sessionCount}`);

    const users = await prisma.user.findMany({
        take: 5,
        select: { email: true, role: true }
    });
    console.log("\nRecent Users:", users);

    const courses = await prisma.course.findMany({
        take: 5,
        select: { title: true, price: true }
    });
    console.log("\nRecent Courses:", courses);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
