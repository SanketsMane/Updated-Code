
import { prisma } from "../lib/db";

async function main() {
    const sarah = await prisma.user.findFirst({
        where: {
            name: {
                contains: "Sarah Jenkins"
            }
        },
        include: {
            teacherProfile: true
        }
    });

    if (sarah) {
        console.log("FOUND SARAH JENKINS IN DB:", sarah.id);
    } else {
        console.log("SARAH JENKINS NOT FOUND IN DB");
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
