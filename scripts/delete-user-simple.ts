import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function deleteUser() {
    const email = "rohandesai2930@gmail.com";

    console.log(`Looking for user: ${email}`);

    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            console.log("User not found");
            return;
        }

        console.log(`Found user: ${user.name} (${user.email})`);
        console.log(`Deleting user...`);

        // Delete user (cascade will handle related records if configured)
        await prisma.user.delete({
            where: { email },
        });

        console.log("✅ User deleted successfully");
    } catch (error: any) {
        console.error("Error:", error.message);
        console.error("Full error:", error);
    } finally {
        await prisma.$disconnect();
    }
}

deleteUser();
