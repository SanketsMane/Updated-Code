import { prisma } from "../lib/db";

async function main() {
    try {
        console.log("Testing database connection...");
        const userCount = await prisma.user.count();
        console.log(`Successfully connected! User count: ${userCount}`);
    } catch (error) {
        console.error("Database connection failed:", error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
