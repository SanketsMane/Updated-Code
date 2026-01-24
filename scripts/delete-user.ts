
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const email = 'rohandesai2930@gmail.com';
    console.log(`Looking for user with email: ${email}`);

    const user = await prisma.user.findUnique({
        where: { email },
        include: {
            accounts: true,
            teacherProfile: true,
            courses: true,
        }
    });

    if (!user) {
        console.log('User not found.');
        return;
    }

    console.log('User found:', user.id, user.name);
    console.log('Related data:', {
        accounts: user.accounts.length,
        teacherProfile: user.teacherProfile ? 'Yes' : 'No',
        coursesByUser: user.courses ? user.courses.length : 0
    });

    // Delete the user
    console.log('Deleting user...');
    await prisma.user.delete({
        where: { email }
    });
    console.log('User deleted successfully.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
