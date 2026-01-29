import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Hash password for all users (default: "password123")
  const hashedPassword = await hash("password123", 10);

  // Create Admin User
  const admin = await prisma.user.upsert({
    where: { email: "contactsanket1@gmail.com" },
    update: {
      role: "admin",
    },
    create: {
      id: "admin-user-001",
      name: "Admin User",
      email: "contactsanket1@gmail.com",
      emailVerified: true,
      role: "admin",
      image: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
  console.log("✅ Admin user created:", admin.email);

  // Create Teacher User
  const teacher = await prisma.user.upsert({
    where: { email: "contactsanet2@gmail.com" },
    update: {
      role: "teacher",
    },
    create: {
      id: "teacher-user-001",
      name: "Teacher User",
      email: "contactsanet2@gmail.com",
      emailVerified: true,
      role: "teacher",
      image: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
  console.log("✅ Teacher user created:", teacher.email);

  // Create Student User
  const student = await prisma.user.upsert({
    where: { email: "hackable3030@gmail.com" },
    update: {
      role: "student",
    },
    create: {
      id: "student-user-001",
      name: "Student User",
      email: "hackable3030@gmail.com",
      emailVerified: true,
      role: "student",
      image: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
  console.log("✅ Student user created:", student.email);

  console.log("🎉 Database seeding completed!");
  console.log("\n📝 Login Credentials:");
  console.log("Admin:   contactsanket1@gmail.com");
  console.log("Teacher: contactsanet2@gmail.com");
  console.log("Student: hackable3030@gmail.com");
  console.log("Password for all: password123");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
