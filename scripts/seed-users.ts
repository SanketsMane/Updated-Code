import { PrismaClient } from "../lib/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database with admin and teacher accounts...");

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