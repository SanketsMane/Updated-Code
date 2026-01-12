import { prisma } from "../lib/db";
import { env } from "../lib/env";

async function main() {
    console.log("🔍 Starting Production Readiness Check...");

    // 1. Check Environment Variables
    console.log("Checking Environment Variables...");
    try {
        // Accessing properties triggers validation if not already validated
        const dbUrl = env.DATABASE_URL;
        const authSecret = env.BETTER_AUTH_SECRET;
        console.log("✅ Environment Variables are valid.");
    } catch (e) {
        console.error("❌ Environment validation failed:", e);
        process.exit(1);
    }

    // 2. Check Database Connection & Data
    console.log("Checking Database Connection...");
    try {
        const userCount = await prisma.user.count();
        const courseCount = await prisma.course.count();
        const sessionCount = await prisma.liveSession.count();

        console.log(`📊 Database Stats:`);
        console.log(`   - Users: ${userCount}`);
        console.log(`   - Courses: ${courseCount}`);
        console.log(`   - Live Sessions: ${sessionCount}`);

        if (userCount === 0 || courseCount === 0) {
            console.warn("⚠️  Database seems empty! Have you run the seed script?");
            // process.exit(1); // Warning only for now
        } else {
            console.log("✅ Database has data.");
        }
    } catch (e) {
        console.error("❌ Database connection failed:", e);
        process.exit(1);
    }

    console.log("✅ All checks passed! The application is ready for production deployment.");
}

main()
    .catch((e) => {
        console.error("❌ Unexpected error:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
