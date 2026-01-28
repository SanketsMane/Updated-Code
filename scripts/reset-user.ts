
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    const email = "rohandesaicgpi@gmail.com";

    console.log(`Checking for user: ${email}...`);
    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        console.log("User found. Deleting...");
        await prisma.user.delete({
            where: { email },
        });
        console.log("User deleted.");
    } else {
        console.log("User does not exist.");
    }

    console.log("Creating new user...");
    const hashedPassword = await hash("123456", 10);

    await prisma.$transaction(async (tx) => {
        const newUser = await tx.user.create({
            data: {
                email,
                name: "Rohan",
                role: "student",
                emailVerified: true,
            }
        });

        await tx.account.create({
            data: {
                userId: newUser.id,
                accountId: newUser.id,
                providerId: "credential",
                password: hashedPassword,
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        });
    });

    console.log("User created successfully.");
    console.log("Email: rohandesaicgpi@gmail.com");
    console.log("Password: 123456");
    console.log("Role: admin");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
