
// Native fetch is available in Node 18+
import { prisma } from "../lib/db";

async function createTeacher() {
    const email = "teacher@kidokool.com";
    const password = "password123";
    const name = "Demo Teacher";

    try {
        console.log(`Checking for existing user ${email}...`);
        const existingUser = await prisma.user.findUnique({ where: { email } });

        if (existingUser) {
            console.log("User exists. Deleting to allow fresh creation...");
            await prisma.user.delete({ where: { email } });
            console.log("User deleted.");
        }

        console.log("Creating new teacher account via API...");

        const teacherData = {
            name,
            email,
            password,
            passwordConfirmation: password,
            bio: "This is a demo teacher account created for testing purposes. I am an expert in Mathematics and Physics with over 5 years of experience.",
            expertiseAreas: ["Mathematics", "Physics"],
            languages: ["English"],
            hourlyRate: "2000",
            experience: "5"
        };

        const regResponse = await fetch('http://localhost:3000/api/teacher/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(teacherData)
        });

        const regResult = await regResponse.json();
        if (regResponse.ok) {
            console.log("SUCCESS: Teacher account created!");
            console.log("Email:", email);
            console.log("Password:", password);
        } else {
            console.error("FAILED to register teacher:", regResult);
        }

    } catch (error) {
        console.error("Error:", error);
    } finally {
        await prisma.$disconnect();
    }
}

createTeacher();
