import { prisma } from "../lib/db";

async function debugState() {
    const studentCount = await prisma.user.count({ where: { role: 'student' } });
    const publishedCourseCount = await prisma.course.count({ where: { status: 'Published' } });
    const allCoursesCount = await prisma.course.count();

    console.log(`Students: ${studentCount}`);
    console.log(`Published Courses: ${publishedCourseCount}`);
    console.log(`Total Courses: ${allCoursesCount}`);

    if (allCoursesCount > 0 && publishedCourseCount === 0) {
        console.log("Found courses but none are published. Publishing the first one...");
        const firstCourse = await prisma.course.findFirst();
        if (firstCourse) {
            await prisma.course.update({
                where: { id: firstCourse.id },
                data: { status: 'Published' }
            });
            console.log(`Published course: ${firstCourse.title}`);
        }
    }

    if (studentCount === 0) {
        console.log("No students found. Creating a test student...");
        await prisma.user.create({
            data: {
                name: "Test Student",
                email: "test-student@example.com",
                role: "student",
                emailVerified: true
            }
        });
        console.log("Created Test Student.");
    }
}

debugState()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
