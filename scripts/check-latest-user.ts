
import { prisma } from "../lib/db";

async function main() {
    const user = await prisma.user.findFirst({
        orderBy: { createdAt: 'desc' },
        select: { id: true, name: true, email: true, role: true, createdAt: true }
    });

    console.log("Latest User:", user);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
