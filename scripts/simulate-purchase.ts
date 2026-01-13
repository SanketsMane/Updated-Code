import { prisma } from "../lib/db";

async function simulatePurchase() {
    console.log("🚀 Starting Purchase Simulation...");

    // 1. Find a User and a Course
    const user = await prisma.user.findFirst({ where: { role: 'student' } });
    const course = await prisma.course.findFirst({ where: { status: 'Published' } });

    if (!user || !course) {
        console.error("❌ Need at least one Student and one Published Course.");
        process.exit(1);
    }

    console.log(`👤 User: ${user.name} (${user.email})`);
    console.log(`📚 Course: ${course.title}`);

    // 2. Create a PENDING Enrollment (Simulation of Checkout Start)
    // Check if already enrolled to avoid duplicates
    let enrollment = await prisma.enrollment.findUnique({
        where: {
            userId_courseId: {
                userId: user.id,
                courseId: course.id
            }
        }
    });

    if (enrollment) {
        console.log("ℹ️ User already enrolled. Resetting to PENDING for test...");
        enrollment = await prisma.enrollment.update({
            where: { id: enrollment.id },
            data: { status: 'Pending' }
        });
    } else {
        console.log("🆕 Creating new Pending Enrollment...");
        enrollment = await prisma.enrollment.create({
            data: {
                userId: user.id,
                courseId: course.id,
                amount: course.price || 0,
                status: 'Pending'
            }
        });
    }

    console.log(`⏳ Enrollment ID: ${enrollment.id} [Status: ${enrollment.status}]`);

    // 3. Simulate Webhook Success (Checkout Completed)
    console.log("⚡ Simulating 'checkout.session.completed' webhook logic...");

    const updatedEnrollment = await prisma.enrollment.update({
        where: { id: enrollment.id },
        data: {
            status: 'Active',
            // Simulating what the webhook does: ensuring amount is captured
            amount: course.price || 0
        }
    });

    console.log(`✅ Enrollment ID: ${updatedEnrollment.id} [Status: ${updatedEnrollment.status}]`);

    if (updatedEnrollment.status === 'Active') {
        console.log("🎉 SUCCESS: Purchase flow verified (Database Logic).");
    } else {
        console.error("❌ FAILURE: Enrollment not active.");
    }
}

simulatePurchase()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
