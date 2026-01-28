import { prisma } from "../lib/db";

/**
 * Create Admin User Script
 * Author: Sanket
 * Creates an admin user for testing
 */

async function createAdminUser() {
    console.log("🔐 Creating admin user...\n");

    const email = "rohandesai568@gmail.com";
    const name = "Rohan Desai";

    try {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            console.log("⚠️  User already exists. Updating role to admin...");

            const updatedUser = await prisma.user.update({
                where: { email },
                data: { role: "admin" },
            });

            console.log("✅ User role updated to admin!");
            console.log(`Email: ${updatedUser.email}`);
            console.log(`Role: ${updatedUser.role}`);
            console.log(`ID: ${updatedUser.id}`);
        } else {
            console.log("Creating new admin user...");

            const newUser = await prisma.user.create({
                data: {
                    email,
                    name,
                    role: "admin",
                    emailVerified: true, // Mark as verified
                },
            });

            console.log("✅ Admin user created successfully!");
            console.log(`Email: ${newUser.email}`);
            console.log(`Name: ${newUser.name}`);
            console.log(`Role: ${newUser.role}`);
            console.log(`ID: ${newUser.id}`);
        }

        console.log("\n📧 You can now login with this email using OTP authentication.");
    } catch (error) {
        console.error("❌ Error creating admin user:", error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

createAdminUser()
    .then(() => {
        console.log("\n🎉 Done!");
        process.exit(0);
    })
    .catch((error) => {
        console.error("\n💥 Failed:", error);
        process.exit(1);
    });
