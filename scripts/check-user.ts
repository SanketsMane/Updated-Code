
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const email = "rohandesai568@gmail.com";
    console.log(`Checking for user: ${email}...`);

    const user = await prisma.user.findUnique({
        where: { email },
        include: {
            sessions: true,
            accounts: true
        }
    });

    if (user) {
        console.log("---------------------------------------------------");
        console.log("✅ User FOUND in database.");
        console.log(`ID: ${user.id}`);
        console.log(`Role: ${user.role}`);
        console.log(`Email Verified: ${user.emailVerified}`);
        console.log(`Role matches 'teacher'?: ${user.role === 'teacher'}`);
        console.log("---------------------------------------------------");
    } else {
        console.log("❌ User NOT found.");
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
