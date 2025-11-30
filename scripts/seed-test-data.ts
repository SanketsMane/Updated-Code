import { prisma } from "../lib/db";

async function seedTestData() {
  console.log("🌱 Seeding test data...");

  try {
    // Create some test users with teacher roles
    const testUsers = [
      {
        id: crypto.randomUUID(),
        name: "Dr. Sarah Johnson",
        email: "sarah@example.com",
        emailVerified: true,
        role: "TEACHER",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: crypto.randomUUID(),
        name: "Michael Chen",
        email: "michael@example.com",
        emailVerified: true,
        role: "TEACHER",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: crypto.randomUUID(),
        name: "Emily Rodriguez",
        email: "emily@example.com",
        emailVerified: true,
        role: "TEACHER",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    const users = [];
    for (const userData of testUsers) {
      const user = await prisma.user.upsert({
        where: { email: userData.email },
        update: {},
        create: userData
      });
      users.push(user);
    }

    console.log(`✅ Created ${users.length} users`);

    // Create teacher profiles
    const teacherProfiles = [
      {
        userId: users[0].id,
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
        userId: users[1].id,
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
        userId: users[2].id,
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
    for (const profileData of teacherProfiles) {
      const profile = await prisma.teacherProfile.upsert({
        where: { userId: profileData.userId },
        update: profileData,
        create: profileData
      });
      profiles.push(profile);
    }

    console.log(`✅ Created ${profiles.length} teacher profiles`);

    // Create some live sessions
    const sessions = [
      {
        teacherId: profiles[0].id,
        title: "JavaScript Fundamentals - 1-on-1 Session",
        description: "Learn the basics of JavaScript programming with personalized guidance",
        subject: "JavaScript",
        scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        duration: 60,
        price: 7500, // $75 in cents
        status: "Scheduled" as any
      },
      {
        teacherId: profiles[1].id,
        title: "Python Data Science Bootcamp",
        description: "Comprehensive introduction to data science using Python",
        subject: "Python", 
        scheduledAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        duration: 120,
        price: 8500, // $85 in cents
        status: "Scheduled" as any
      },
      {
        teacherId: profiles[2].id,
        title: "UI/UX Design Principles",
        description: "Learn modern UI/UX design principles and best practices",
        subject: "Design",
        scheduledAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
        duration: 90,
        price: 6500, // $65 in cents
        status: "Scheduled" as any
      }
    ];

    const liveSessions = [];
    for (const sessionData of sessions) {
      const session = await prisma.liveSession.create({
        data: sessionData
      });
      liveSessions.push(session);
    }

    console.log(`✅ Created ${liveSessions.length} live sessions`);

    console.log("🎉 Test data seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding test data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedTestData();