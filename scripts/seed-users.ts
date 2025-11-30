import { PrismaClient } from "../lib/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database with admin, teacher, and student accounts...");

  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email: "bksun170882@gmail.com" },
    update: {
      role: "admin",
      name: "Admin User",
    },
    create: {
      id: `admin_${Date.now()}`,
      email: "bksun170882@gmail.com",
      name: "Admin User",
      emailVerified: true,
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  // Create teacher user
  const teacherUser = await prisma.user.upsert({
    where: { email: "contactsanket1@gmail.com" },
    update: {
      role: "teacher",
      name: "Teacher User",
    },
    create: {
      id: `teacher_${Date.now()}`,
      email: "contactsanket1@gmail.com",
      name: "Teacher User", 
      emailVerified: true,
      role: "teacher",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  console.log("✅ Admin user created/updated:", {
    id: adminUser.id,
    email: adminUser.email,
    role: adminUser.role,
  });

  console.log("✅ Teacher user created/updated:", {
    id: teacherUser.id,
    email: teacherUser.email,
    role: teacherUser.role,
  });

  // Create teacher profile for the teacher user
  const teacherProfile = await prisma.teacherProfile.upsert({
    where: { userId: teacherUser.id },
    update: {
      bio: "Experienced teacher ready to help students learn and grow",
      expertise: ["Mathematics", "Science", "Programming"],
      languages: ["English", "Spanish"],
      hourlyRate: 2500, // $25.00 per hour
      isVerified: true,
      isApproved: true,
      timezone: "America/New_York",
      rating: 4.8,
      totalReviews: 25,
      totalStudents: 150,
    },
    create: {
      userId: teacherUser.id,
      bio: "Experienced teacher ready to help students learn and grow",
      expertise: ["Mathematics", "Science", "Programming"],
      languages: ["English", "Spanish"],
      hourlyRate: 2500, // $25.00 per hour
      isVerified: true,
      isApproved: true,
      timezone: "America/New_York",
      rating: 4.8,
      totalReviews: 25,
      totalStudents: 150,
    },
  });

  console.log("✅ Teacher profile created/updated:", {
    id: teacherProfile.id,
    userId: teacherProfile.userId,
    isVerified: teacherProfile.isVerified,
    isApproved: teacherProfile.isApproved,
  });

  // Create student user
  const studentUser = await prisma.user.upsert({
    where: { email: "student@example.com" },
    update: {
      role: "student",
      name: "Student User",
    },
    create: {
      id: `student_${Date.now()}`,
      email: "student@example.com",
      name: "Student User",
      emailVerified: true,
      role: "student",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  console.log("✅ Student user created/updated:", {
    id: studentUser.id,
    email: studentUser.email,
    role: studentUser.role,
  });

  console.log("🎉 Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });