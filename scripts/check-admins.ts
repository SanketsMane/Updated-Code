
import { prisma } from "../lib/db";

async function main() {
    const admins = await prisma.user.findMany({
        where: {
            role: 'admin' // Note: schema says String?, exact value 'admin' used in seed
        }
    });

    if (admins.length === 0) {
        console.log("No admins found in the database.");
    } else {
        console.log("Found admins:");
        admins.forEach(u => console.log(`- ${u.email} (${u.name})`));
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
