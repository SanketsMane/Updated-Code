
import { prisma } from "../lib/db";

async function findAdmins() {
    console.log("Searching for ADMIN users...");

    const admins = await prisma.user.findMany({
        where: {
            role: 'admin'
        },
        take: 5
    });

    if (admins.length > 0) {
        console.log("FOUND ADMINS:");
        admins.forEach(u => {
            console.log(`Email: ${u.email} | Name: ${u.name}`);
        });
    } else {
        console.log("No ADMIN users found.");
    }
}

findAdmins();
