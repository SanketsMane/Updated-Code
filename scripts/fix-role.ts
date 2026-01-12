
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const email = "rohandesai568@gmail.com";
    console.log(`Updating role for: ${email}...`);

    const user = await prisma.user.update({
        where: { email },
        data: { role: "teacher" }
    });

    console.log("---------------------------------------------------");
    console.log("✅ User Role UPDATED to 'teacher'.");
    console.log(`ID: ${user.id}`);
    console.log(`New Role: ${user.role}`);
    console.log("---------------------------------------------------");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
