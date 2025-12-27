
import { prisma } from "../lib/db";

async function main() {
    const email = "newuser@test.com";
    const user = await prisma.user.findUnique({
        where: { email },
        select: { id: true, name: true, email: true, role: true, emailVerified: true }
    });

    if (user) {
        console.log("User found:");
        console.log(JSON.stringify(user, null, 2));
    } else {
        console.log("User not found:", email);
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
