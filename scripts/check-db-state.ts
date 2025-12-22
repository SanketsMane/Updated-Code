
import { prisma } from "../lib/db";

async function main() {
    const userCount = await prisma.user.count();
    const teacherCount = await prisma.teacherProfile.count();
    const reviewCount = await prisma.review.count();
    const courseCount = await prisma.course.count();

    console.log("Database Status:");
    console.log(`- Users: ${userCount}`);
    console.log(`- Teachers: ${teacherCount}`);
    console.log(`- Courses: ${courseCount}`);
    console.log(`- Reviews: ${reviewCount}`);

    if (reviewCount === 0) {
        console.log("No reviews found. This is why the section is missing.");
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
