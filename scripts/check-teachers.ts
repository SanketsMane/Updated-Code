
import { prisma } from "../lib/db";
import fs from 'fs';

async function main() {
    const teachers = await prisma.teacherProfile.findMany({
        include: {
            user: true
        }
    });

    const lines = teachers.map(t => `ID: ${t.id}, Name: ${t.user?.name}, Email: ${t.user?.email}, Verified: ${t.isVerified}`).join('\n');
    fs.writeFileSync('teachers-list.txt', lines);
    console.log("Wrote list to teachers-list.txt");
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
