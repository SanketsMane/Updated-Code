import { prisma } from "../lib/db";

async function main() {
    const email = "rohandesaicgpi@gmail.com";
    console.log(`Checking for user with email: ${email}`);

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        console.log("User NOT found. Cannot promote.");
        return;
    }

    console.log(`Found user: ${user.id} (${user.name})`);
    console.log(`Current Role: ${user.role}`);

    // 1. Update User Role
    const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: { role: "teacher" }
    });
    console.log(`Updated user role to: ${updatedUser.role}`);

    // 2. Upsert Teacher Profile
    // We need to check if one exists or create a default one
    const teacherProfile = await prisma.teacherProfile.upsert({
        where: { userId: user.id },
        create: {
            userId: user.id,
            isApproved: true,
            bio: "New teacher account",
            expertise: [],
            languages: ["English"],
            experience: 0,
        },
        update: {
            isApproved: true
        }
    });

    console.log(`Teacher Profile created/updated for user ${user.id}`);
    console.log("Operation successful.");
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
