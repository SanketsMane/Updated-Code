
import { prisma } from "../lib/db";

async function main() {
    const email = 'teacher@kidokool.com';
    console.log(`Removing user with email: ${email}`);

    try {
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            console.log("User not found.");
            return;
        }

        // Delete the user. Cascading deletes should handle the profile if set up correctly.
        // If not, we might need to delete profile first.
        // Let's try deleting user directly.
        // Actually, to be safe, let's delete TeacherProfile explicitly if it exists.

        await prisma.teacherProfile.deleteMany({
            where: { userId: user.id }
        });
        console.log("Deleted TeacherProfile.");

        await prisma.user.delete({
            where: { id: user.id }
        });
        console.log("Deleted User.");

    } catch (error) {
        console.error("Error removing user:", error);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
