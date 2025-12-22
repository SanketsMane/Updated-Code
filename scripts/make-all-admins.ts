import { PrismaClient } from "../lib/generated/prisma";

const prisma = new PrismaClient();

async function main() {
    console.log("🔄 Promoting all users to admin...");

    const updateResult = await prisma.user.updateMany({
        data: {
            role: "admin",
        },
    });

    console.log(`✅ Updated ${updateResult.count} users to admin role.`);
}

main()
    .catch((e) => {
        console.error("❌ Error updating users:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
