
import { PrismaClient } from '../lib/generated/prisma';

const prisma = new PrismaClient();

async function main() {
    console.log("Creating/Updating Verified Teacher Profile...");

    const user = await prisma.user.findUnique({
        where: { email: 'teacher@kidokool.com' }
    });

    if (!user) {
        console.error("Teacher user not found!");
        return;
    }

    const profile = await prisma.teacherProfile.upsert({
        where: { userId: user.id },
        update: {
            isVerified: true,
            hourlyRate: 5000, // 50.00
            bio: "Experienced instructor specializing in Web Development and Cloud Architecture. I help students build real-world applications.",
            expertise: ["React", "Next.js", "Node.js"],
            rating: 4.8,
            totalReviews: 12
        },
        create: {
            userId: user.id,
            isVerified: true,
            hourlyRate: 5000,
            bio: "Experienced instructor specializing in Web Development and Cloud Architecture. I help students build real-world applications.",
            expertise: ["React", "Next.js", "Node.js"],
            rating: 4.8,
            totalReviews: 12
        }
    });

    console.log("✅ Teacher Profile secured:", profile.id);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
