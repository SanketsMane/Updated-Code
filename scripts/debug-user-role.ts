
import { prisma } from "../lib/db";

async function main() {
    const email = "bksun170882@gmail.com";
    const user = await prisma.user.findUnique({
        where: { email },
        select: { id: true, name: true, email: true, role: true }
    });

    if (user) {
        console.log("User found:", user);
    } else {
        console.log("User not found for email:", email);
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
