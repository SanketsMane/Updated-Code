import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const email = "bksun170882@gmail.com";

    try {
        const verification = await prisma.verification.findFirst({
            where: {
                identifier: email,
            },
            orderBy: {
                createdAt: 'desc', // Get the most recent one
            },
        });

        if (verification) {
            console.log("\n🔐 LATEST LOGIN CODE:");
            console.log("=====================");
            console.log(`Email: ${verification.identifier}`);
            console.log(`Code:  ${verification.value}`);
            console.log(`Expires: ${verification.expiresAt}`);
            console.log("=====================\n");
        } else {
            console.log("❌ No verification code found for this email.");
        }
    } catch (error) {
        console.error("❌ Error fetching OTP:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
