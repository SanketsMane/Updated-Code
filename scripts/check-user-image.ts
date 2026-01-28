
import { prisma } from "@/lib/db";

async function main() {
    const user = await prisma.user.findFirst({
        where: {
            name: {
                contains: "shrijeet",
            },
        },
        select: {
            id: true,
            name: true,
            image: true,
        },
    });

    console.log("User:", user);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
