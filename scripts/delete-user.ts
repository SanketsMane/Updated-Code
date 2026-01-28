import { prisma } from "../lib/db";

/**
 * Delete a user and all related data from the database
 * Author: Sanket
 */
async function deleteUser(email: string) {
    console.log(`\n🔍 Looking for user: ${email}`);

    const user = await prisma.user.findUnique({
        where: { email },
        include: {
            sessions: true,
            accounts: true,
            enrollments: true,
            wallet: true,
        },
    });

    if (!user) {
        console.log(`❌ User not found: ${email}`);
        return;
    }

    console.log(`\n✅ Found user:`);
    console.log(`   ID: ${user.id}`);
    console.log(`   Name: ${user.name}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Created: ${user.createdAt}`);
    console.log(`\n📊 Related data:`);
    console.log(`   Sessions: ${user.sessions.length}`);
    console.log(`   Accounts: ${user.accounts.length}`);
    console.log(`   Enrollments: ${user.enrollments.length}`);
    console.log(`   Wallet: ${user.wallet ? "Yes" : "No"}`);

    console.log(`\n🗑️  Deleting user and all related data...`);

    try {
        // Delete in correct order to respect foreign key constraints
        await prisma.$transaction(async (tx) => {
            // Delete sessions
            if (user.sessions.length > 0) {
                await tx.session.deleteMany({ where: { userId: user.id } });
                console.log(`   ✓ Deleted ${user.sessions.length} sessions`);
            }

            // Delete accounts
            if (user.accounts.length > 0) {
                await tx.account.deleteMany({ where: { userId: user.id } });
                console.log(`   ✓ Deleted ${user.accounts.length} accounts`);
            }

            // Delete wallet transactions
            if (user.wallet) {
                const transactions = await tx.walletTransaction.deleteMany({
                    where: { walletId: user.wallet.id },
                });
                console.log(`   ✓ Deleted ${transactions.count} wallet transactions`);

                // Delete wallet
                await tx.wallet.delete({ where: { id: user.wallet.id } });
                console.log(`   ✓ Deleted wallet`);
            }

            // Delete enrollments
            if (user.enrollments.length > 0) {
                await tx.enrollment.deleteMany({ where: { userId: user.id } });
                console.log(`   ✓ Deleted ${user.enrollments.length} enrollments`);
            }

            // Delete progress records
            const progress = await tx.progress.deleteMany({
                where: { userId: user.id },
            });
            console.log(`   ✓ Deleted ${progress.count} progress records`);

            // Delete notifications
            const notifications = await tx.notification.deleteMany({
                where: { userId: user.id },
            });
            console.log(`   ✓ Deleted ${notifications.count} notifications`);

            // Delete user preferences
            await tx.userPreferences.deleteMany({ where: { userId: user.id } });
            console.log(`   ✓ Deleted user preferences`);

            // Finally, delete the user
            await tx.user.delete({ where: { id: user.id } });
            console.log(`   ✓ Deleted user account`);
        });

        console.log(`\n✅ Successfully deleted user: ${email}`);
    } catch (error) {
        console.error(`\n❌ Error deleting user:`, error);
        throw error;
    }
}

// Run the script
const emailToDelete = "rohandesai2930@gmail.com";

deleteUser(emailToDelete)
    .then(() => {
        console.log("\n✅ Script completed successfully");
        process.exit(0);
    })
    .catch((error) => {
        console.error("\n❌ Script failed:", error);
        process.exit(1);
    });
