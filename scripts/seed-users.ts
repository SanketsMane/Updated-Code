import { PrismaClient } from '../lib/generated/prisma';

const prisma = new PrismaClient();

async function seedUsers() {
  console.log('🌱 Seeding test users...');

  try {
    // Create Admin User
    const adminUser = await prisma.user.create({
      data: {
        id: 'admin-test-001',
        name: 'Admin User',
        email: 'admin@kidokool.com',
        emailVerified: true,
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Create Teacher User
    const teacherUser = await prisma.user.create({
      data: {
        id: 'teacher-test-001',
        name: 'Teacher User',
        email: 'teacher@kidokool.com',
        emailVerified: true,
        role: 'teacher',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Create Student User
    const studentUser = await prisma.user.create({
      data: {
        id: 'student-test-001',
        name: 'Student User',
        email: 'student@kidokool.com',
        emailVerified: true,
        role: 'student',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    console.log('✅ Test users created successfully!');
    console.log('\n📧 Test Credentials:');
    console.log('=====================');
    console.log('🔑 Admin Login:');
    console.log('   Email: admin@kidokool.com');
    console.log('   Role: admin');
    console.log('');
    console.log('👨‍🏫 Teacher Login:');
    console.log('   Email: teacher@kidokool.com');
    console.log('   Role: teacher');
    console.log('');
    console.log('🎓 Student Login:');
    console.log('   Email: student@kidokool.com');
    console.log('   Role: student');
    console.log('');
    console.log('💡 Use the email OTP verification to log in with these accounts.');

  } catch (error) {
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      console.log('⚠️  Test users already exist. Skipping creation.');
      console.log('\n📧 Existing Test Credentials:');
      console.log('=============================');
      console.log('🔑 Admin: admin@kidokool.com');
      console.log('👨‍🏫 Teacher: teacher@kidokool.com');  
      console.log('🎓 Student: student@kidokool.com');
    } else {
      console.error('❌ Error seeding users:', error);
      throw error;
    }
  } finally {
    await prisma.$disconnect();
  }
}

seedUsers()
  .catch((error) => {
    console.error('💥 Seed script failed:', error);
    process.exit(1);
  });