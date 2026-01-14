import { prisma } from "../lib/db";

/**
 * Database Cleanup Script
 * Author: Sanket
 * Removes all data from the database while preserving the schema
 * Use this to start fresh with testing
 */

async function cleanDatabase() {
    console.log("🧹 Starting database cleanup...\n");

    try {
        // Delete in order to respect foreign key constraints
        console.log("Deleting PayoutCommissions...");
        await prisma.payoutCommission.deleteMany({});

        console.log("Deleting PayoutRequests...");
        await prisma.payoutRequest.deleteMany({});

        console.log("Deleting Commissions...");
        await prisma.commission.deleteMany({});

        console.log("Deleting Certificates...");
        await prisma.certificate.deleteMany({});

        console.log("Deleting LessonProgress...");
        await prisma.lessonProgress.deleteMany({});

        console.log("Deleting Messages...");
        await prisma.message.deleteMany({});

        console.log("Deleting Conversations...");
        await prisma.conversation.deleteMany({});

        console.log("Deleting Notifications...");
        await prisma.notification.deleteMany({});

        console.log("Deleting Reviews...");
        await prisma.review.deleteMany({});


        console.log("Deleting LiveSessions...");
        await prisma.liveSession.deleteMany({});

        console.log("Deleting Enrollments...");
        await prisma.enrollment.deleteMany({});

        console.log("Deleting Lessons...");
        await prisma.lesson.deleteMany({});

        console.log("Deleting Chapters...");
        await prisma.chapter.deleteMany({});

        console.log("Deleting Courses...");
        await prisma.course.deleteMany({});

        console.log("Deleting BlogPosts...");
        await prisma.blogPost.deleteMany({});

        console.log("Deleting TeacherVerifications...");
        await prisma.teacherVerification.deleteMany({});

        console.log("Deleting TeacherProfiles...");
        await prisma.teacherProfile.deleteMany({});

        console.log("Deleting Categories...");
        await prisma.category.deleteMany({});

        console.log("Deleting Sessions...");
        await prisma.session.deleteMany({});

        console.log("Deleting Accounts...");
        await prisma.account.deleteMany({});

        console.log("Deleting Verifications...");
        await prisma.verification.deleteMany({});

        console.log("Deleting Users...");
        await prisma.user.deleteMany({});

        console.log("\n✅ Database cleaned successfully!");
        console.log("All data has been removed. The database is now empty and ready for fresh testing.");
    } catch (error) {
        console.error("❌ Error cleaning database:", error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

cleanDatabase()
    .then(() => {
        console.log("\n🎉 Cleanup complete!");
        process.exit(0);
    })
    .catch((error) => {
        console.error("\n💥 Cleanup failed:", error);
        process.exit(1);
    });
