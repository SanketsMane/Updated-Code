import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const adminEmail = "bksun170882@gmail.com";

    console.log("⚠️  DANGER: This script will delete ALL users and their data!");
    console.log(`✨ Creating new admin user: ${adminEmail}`);

    try {
        // Delete all users - due to cascade, this removes related profiles, courses, etc.
        const deletedUsers = await prisma.user.deleteMany({});
        console.log(`✅ Deleted ${deletedUsers.count} existing users.`);

        // Create the new admin user
        const newAdmin = await prisma.user.create({
            data: {
                id: `admin_${Date.now()}`,
                email: adminEmail,
                name: "Admin User",
                emailVerified: true,
                role: "admin",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        });

        console.log("✅ New Admin User Created:");
        console.log({
            id: newAdmin.id,
            email: newAdmin.email,
            role: newAdmin.role,
        });

        console.log("\n🎉 Reset complete! You can now login with this email.");

    } catch (error) {
        console.error("❌ Error resetting database:", error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
