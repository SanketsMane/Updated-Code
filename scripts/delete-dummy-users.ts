
import { prisma } from "../lib/db";

async function main() {
    const dummyNames = [
        "Sarah Jenkins",
        "David Chen",
        "Emily Watson",
        "John Doe",
        "Jane Doe",
        "Instructor",
        "Teacher"
    ];

    console.log("Starting cleanup of dummy users...");

    for (const name of dummyNames) {
        try {
            const users = await prisma.user.findMany({
                where: {
                    name: {
                        contains: name,
                        mode: 'insensitive'
                    }
                }
            });

            console.log(`Found ${users.length} users matching "${name}"`);

            for (const user of users) {
                // Delete related data first
                try { await prisma.teacherProfile.deleteMany({ where: { userId: user.id } }); } catch (e) { }
                try { await prisma.review.deleteMany({ where: { reviewerId: user.id } }); } catch (e) { }
                try { await prisma.blogPost.deleteMany({ where: { authorId: user.id } }); } catch (e) { } // Fixed model name
                try { await prisma.account.deleteMany({ where: { userId: user.id } }); } catch (e) { }
                try { await prisma.session.deleteMany({ where: { userId: user.id } }); } catch (e) { }

                // Delete user
                await prisma.user.delete({ where: { id: user.id } });
                console.log(`Deleted user: ${user.name} (${user.id})`);
            }
        } catch (error) {
            console.error(`Failed to cleanup ${name}:`, error);
        }
    }

    // Also clean reviews that might have null reviewers but dummy content
    try {
        await prisma.review.deleteMany({
            where: {
                OR: [
                    { comment: { contains: "Sarah Jenkins" } },
                    { title: { contains: "Dummy" } }
                ]
            }
        });
    } catch (e) {
        console.error("Failed to clean reviews", e);
    }

    console.log("Cleanup complete.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
