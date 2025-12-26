const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
    console.log("Checking Prisma...");
    try {
        console.log("Checking User model...");
        const users = await prisma.user.count();
        console.log("User count:", users);

        console.log("Checking TeacherProfile model...");
        if (!prisma.teacherProfile) {
            console.error("prisma.teacherProfile is undefined!");
        } else {
            const profiles = await prisma.teacherProfile.count();
            console.log("Profile count:", profiles);
        }
    } catch (e) {
        console.error("Detailed Error:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
