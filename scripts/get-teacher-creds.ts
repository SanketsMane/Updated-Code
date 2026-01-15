
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Fetching teacher credentials...');

    const teachers = await prisma.teacherProfile.findMany({
        include: {
            user: {
                include: {
                    accounts: true
                }
            }
        }
    });

    if (teachers.length === 0) {
        console.log('No teacher profiles found.');
    } else {
        console.log('Found teacher profiles:');
        teachers.forEach(t => {
            console.log(`Name: ${t.user.name}`);
            console.log(`Email: ${t.user.email}`);
            console.log(`Role: ${t.user.role}`);
            console.log(`Profile ID: ${t.id}`);
            // Check if they have a password-based account
            const passwordAccount = t.user.accounts.find(a => a.password);
            if (passwordAccount) {
                console.log(`Has Password Account: Yes (Password: ${passwordAccount.password})`);
            } else {
                console.log(`Has Password Account: No (Likely OAuth or no account linked)`);
            }
            console.log('---');
        });
    }

    // Also users with role 'teacher' who might not have a profile yet
    const teacherUsers = await prisma.user.findMany({
        where: {
            role: 'teacher',
            teacherProfile: {
                is: null
            }
        },
        include: {
            accounts: true
        }
    });

    if (teacherUsers.length > 0) {
        console.log('Users with role "teacher" but NO profile:');
        teacherUsers.forEach(u => {
            console.log(`Name: ${u.name}`);
            console.log(`Email: ${u.email}`);
            const passwordAccount = u.accounts.find(a => a.password);
            if (passwordAccount) {
                console.log(`Has Password Account: Yes (Password: ${passwordAccount.password})`);
            } else {
                console.log(`Has Password Account: No`);
            }
            console.log('---');
        });
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
