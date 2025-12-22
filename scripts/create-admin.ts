
import { prisma } from "../lib/db";
import { auth } from "../lib/auth"; // Using auth lib might be complex with headers, let's use direct Prisma if password hashing is handled or use the API route approach?
// Actually simpler to use the API route approach if possible, OR just use the same logic as create-teacher which hit the API.
// BUT the API /api/teacher/register creates a TEACHER. 
// I should probably manually create it in DB using better-auth's underlying utilities OR just update an existing user to ADMIN.
// Let's create a user and then manually update role to 'admin'.

async function createAdmin() {
    const email = "admin@kidokool.com";
    const password = "password123";
    const name = "Admin User";

    console.log(`Creating Admin ${email}...`);

    // 1. Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        console.log("User exists. Deleting...");
        await prisma.user.delete({ where: { email } });
    }

    // 2. We need to create a user with a password. Better-auth stores hashed passwords.
    // Since I can't easily import the hashing function from better-auth without the full setup, 
    // I will use a fetch to the signup endpoint (generic signup?) or just creating a teacher and promoting them.
    // The generic /register endpoint usually makes a student. Let's try that.

    // Actually, I can just use the auth library's API if I mock headers, OR simpler:
    // Create a teacher using the API I know works, then update role.

    console.log("Registering as Student/Default via API (simulated)...");
    // Wait, I don't have a generic register API endpoint handy in my memory? 
    // app/(auth)/register/...
    // Let's look at app/api/auth/[...all]/route.ts or similar.
    // actually simpler approach: Use the /api/teacher/register endpoint I KNOW works, it creates a user. 
    // Then immediately update their role to 'admin' in the DB.

    const response = await fetch("http://localhost:3000/api/teacher/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name,
            email,
            password,
            bio: "I am the super administrator of this platform and I possess full control over all content.", // > 50 chars
            expertiseAreas: ["Administration"],     // required by teacher schema
            hourlyRate: "1000",
            experience: "10"
        }),
    });

    if (!response.ok) {
        const text = await response.text();
        console.error("Failed to register base user:", text);
        return;
    }

    console.log("User created. Elevating to ADMIN...");

    // 3. Update to ADMIN and Verified
    // Note: Prisma schema likely uses 'admin' (lowercase) or 'ADMIN' (uppercase). 
    // Checking schema file now... (I will assume 'admin' based on previous checks, but will correct if tool output says otherwise).
    // Schema check is parallel to this. I'll use 'admin' for now, usually lowercase in better-auth.

    await prisma.user.update({
        where: { email },
        data: {
            role: "admin",
            emailVerified: true
        }
    });

    console.log("SUCCESS: Created admin@kidokool.com / password123");
}

createAdmin();
