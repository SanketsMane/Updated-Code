import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanup() {
    console.log("🧹 Starting dummy data cleanup...");

    const dummyEmails = [
        "teacher@kidokool.com",
        "mike@kidokool.com",
        "test-student@example.com"
    ];

    for (const email of dummyEmails) {
        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                teacherProfile: true
            }
        });

        if (user) {
            console.log(`Deleting dummy user: ${user.name} (${email})`);
            
            // Delete user - Cascading delete in schema should handle dependencies like TeacherProfile, reviews, etc.
            await prisma.user.delete({
                where: { email }
            });
            console.log(`Successfully deleted ${email}`);
        } else {
            console.log(`User ${email} not found, skipping.`);
        }
    }

    console.log("✅ Cleanup completed.");
}

cleanup()
    .catch((e) => {
        console.error("❌ Cleanup failed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
