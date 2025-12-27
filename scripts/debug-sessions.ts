
import { prisma } from "../lib/db";

async function main() {
    const sessions = await prisma.session.findMany({
        include: {
            user: {
                select: { email: true, role: true }
            }
        },
        orderBy: { createdAt: 'desc' },
        take: 5
    });

    console.log("Active Sessions:", JSON.stringify(sessions, null, 2));
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
