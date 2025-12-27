import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const v = await prisma.verification.findFirst({
        orderBy: { createdAt: 'desc' },
    });

    if (v) {
        console.log(`__OTP_START__ ${v.value} __OTP_END__`);
        console.log(`Identifier: ${v.identifier}`);
    } else {
        console.log("NO_OTP_FOUND");
    }
    await prisma.$disconnect();
}

main();
