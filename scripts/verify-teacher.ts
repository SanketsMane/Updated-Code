
import { prisma } from "../lib/db";

async function verifyTeacher() {
    const email = "teacher@kidokool.com";
    console.log(`Force verifying user ${email}...`);

    try {
        const updatedUser = await prisma.user.update({
            where: { email },
            data: {
                emailVerified: true
            }
        });
        console.log("SUCCESS: User emailVerified set to TRUE.");
        console.log("User ID:", updatedUser.id);
    } catch (error) {
        console.error("Error verifying user:", error);
    }
}

verifyTeacher();
