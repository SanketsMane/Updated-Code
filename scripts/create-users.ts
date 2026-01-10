import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

console.log("Initializing user creation script...");

// Manual .env loading
const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
    console.log("Loading .env...");
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach(line => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
            const match = trimmed.match(/^([^=]+)=(.*)$/);
            if (match) {
                const key = match[1].trim();
                let value = match[2].trim();
                if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
                if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
                process.env[key] = value;
            }
        }
    });
} else {
    console.log("No .env file found at", envPath);
}

const prisma = new PrismaClient();

async function main() {
    // User 1: Admin
    const adminEmail = "bksun170882@gmail.com";
    console.log(`Processing Admin: ${adminEmail}`);

    const adminUser = await prisma.user.upsert({
        where: { email: adminEmail },
        update: { role: 'admin' },
        create: {
            id: crypto.randomUUID(),
            name: "Admin User",
            email: adminEmail,
            emailVerified: true,
            role: 'admin',
            createdAt: new Date(),
            updatedAt: new Date()
        }
    });
    console.log("Admin user upserted:", adminUser.id);

    // User 2: Teacher
    const teacherEmail = "contactsanket1@gmail.com";
    console.log(`Processing Teacher: ${teacherEmail}`);

    const teacherUser = await prisma.user.upsert({
        where: { email: teacherEmail },
        update: { role: 'teacher' },
        create: {
            id: crypto.randomUUID(),
            name: "Sanket Teacher",
            email: teacherEmail,
            emailVerified: true,
            role: 'teacher',
            createdAt: new Date(),
            updatedAt: new Date()
        }
    });
    console.log("Teacher user upserted:", teacherUser.id);

    // Teacher Profile
    console.log("Upserting Teacher Profile...");
    await prisma.teacherProfile.upsert({
        where: { userId: teacherUser.id },
        create: {
            userId: teacherUser.id,
            bio: "Experienced teacher available for live sessions.",
            expertise: ["Mathematics", "Science"],
            languages: ["English"],
            hourlyRate: 2000,
            isVerified: true,
            isApproved: true,
            timezone: "UTC"
        },
        update: {
            isVerified: true,
            isApproved: true
        }
    });
    console.log("Teacher Profile upserted.");
}

main()
    .catch((e) => {
        console.error("Error in script:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
