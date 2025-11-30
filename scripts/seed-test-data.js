const { PrismaClient } = require("../lib/generated/prisma");

const prisma = new PrismaClient();

async function seedTestData() {
  console.log("🌱 Seeding test data...");

  try {
    // Check if we have any existing users we can use
    const existingUsers = await prisma.user.findMany({
      take: 3
    });

    if (existingUsers.length === 0) {
      console.log("❌ No existing users found. Please create some users first through the app registration.");
      return;
    }

    console.log(`✅ Found ${existingUsers.length} existing users to use as teachers`);

    // Create teacher profiles
    const teacherProfilesData = [
      {
        userId: existingUsers[0]?.id,
        bio: "Full-Stack Developer & Tech Lead with 8+ years of experience in JavaScript, React, and Node.js",
        expertise: ["JavaScript", "React", "Node.js", "Python"],
        languages: ["English", "Spanish"],
        hourlyRate: 7500, // $75 in cents
        isVerified: true,
        isApproved: true,
        rating: 4.9,
        totalReviews: 234,
        totalStudents: 1520,
        website: "https://sarahtech.dev",
        linkedin: "https://linkedin.com/in/sarahjohnson"
      },
      {
        userId: existingUsers[1]?.id,
        bio: "Data Scientist & AI Expert specializing in Machine Learning and Python development",
        expertise: ["Python", "Machine Learning", "TensorFlow", "Data Analysis"],
        languages: ["English", "Mandarin"],
        hourlyRate: 8500, // $85 in cents
        isVerified: true,
        isApproved: true,
        rating: 4.8,
        totalReviews: 189,
        totalStudents: 890,
        website: "https://michaelchen.ai"
      },
      {
        userId: existingUsers[2]?.id,
        bio: "UX/UI Designer & Creative Director with expertise in modern design systems",
        expertise: ["Figma", "Adobe Creative Suite", "Design Systems", "Prototyping"],
        languages: ["English", "French"],
        hourlyRate: 6500, // $65 in cents
        isVerified: true,
        isApproved: true,
        rating: 5.0,
        totalReviews: 156,
        totalStudents: 654,
        twitter: "https://twitter.com/emilyux"
      }
    ];

    const profiles = [];
    for (const profileData of teacherProfilesData.filter(p => p.userId)) {
      const profile = await prisma.teacherProfile.upsert({
        where: { userId: profileData.userId },
        update: profileData,
        create: profileData
      });
      profiles.push(profile);
    }

    console.log(`✅ Created ${profiles.length} teacher profiles`);

    console.log("ℹ️  Skipping live sessions creation (studentId is required in current schema)");

    console.log("🎉 Test data seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding test data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedTestData();