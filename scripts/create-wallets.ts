/**
 * Migration script to create wallets for existing users
 * Run this once after adding the Wallet system
 * @author Sanket
 * 
 * Usage: npx tsx scripts/create-wallets.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🔍 Checking for users without wallets...');

    // Find all users who don't have a wallet
    const usersWithoutWallet = await prisma.user.findMany({
        where: {
            wallet: null
        },
        select: {
            id: true,
            email: true,
            name: true
        }
    });

    console.log(`📊 Found ${usersWithoutWallet.length} users without wallets`);

    if (usersWithoutWallet.length === 0) {
        console.log('✅ All users already have wallets!');
        return;
    }

    console.log('💰 Creating wallets...');

    let created = 0;
    for (const user of usersWithoutWallet) {
        try {
            await prisma.wallet.create({
                data: {
                    userId: user.id,
                    balance: 0
                }
            });
            created++;
            console.log(`  ✓ Created wallet for ${user.name} (${user.email})`);
        } catch (error) {
            console.error(`  ✗ Failed to create wallet for ${user.email}:`, error);
        }
    }

    console.log(`\n✅ Successfully created ${created} wallets`);
    console.log(`❌ Failed: ${usersWithoutWallet.length - created}`);
}

main()
    .catch((e) => {
        console.error('❌ Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
