import { prisma } from "../lib/db";

async function main() {
    console.log("--- Latest 5 Courses ---");
    const courses = await prisma.course.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: { id: true, title: true, status: true, isFeatured: true }
    });
    console.log(JSON.stringify(courses, null, 2));

    console.log("\n--- Latest 5 Teachers ---");
    const teachers = await prisma.teacherProfile.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            isVerified: true,
            isApproved: true,
            hourlyRate: true,
            user: { select: { name: true } }
        }
    });
    console.log(JSON.stringify(teachers, null, 2));
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
