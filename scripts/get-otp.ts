
import { prisma } from "../lib/db";

async function getOTP() {
    console.log(`Fetching ALL OTPs...`);

    const verifications = await prisma.verification.findMany({
        where: {
            identifier: { contains: 'admin' }
        },
        orderBy: {
            expiresAt: 'desc'
        },
        take: 5
    });

    if (verifications.length > 0) {
        console.log("FOUND ADMIN OTPS:");
        verifications.forEach(v => {
            console.log(`\n>>> CODE: ${v.value} <<<\nFor: ${v.identifier} | Expires: ${v.expiresAt}\n`);
        });
    } else {
        console.log("No ADMIN verifications found.");
    }
}

getOTP();
