
import { prisma } from "@/lib/db";

async function main() {
    const users = await prisma.user.findMany({
        where: {
            name: {
                contains: "shrijeet",
            },
        },
        select: {
            id: true,
            name: true,
            image: true,
            email: true
        },
    });

    console.log("Users found:", users);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
