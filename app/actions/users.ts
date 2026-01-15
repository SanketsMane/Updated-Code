"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { hash } from "bcryptjs";

async function requireAdmin() {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) throw new Error("Unauthorized");
    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (user?.role !== "admin") throw new Error("Unauthorized");
    return user;
}

export async function createUser(prevState: any, formData: FormData) {
    try {
        await requireAdmin();

        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const role = formData.get("role") as string;

        if (!name || !email || !password || !role) {
            return { error: "All fields are required" };
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return { error: "User with this email already exists" };
        }

        const hashedPassword = await hash(password, 10);

        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: role as any,
                emailVerified: true, // Auto-verify manually created users
            },
        });

        revalidatePath("/admin/users");
        return { success: true, message: "User created successfully" };
    } catch (error: any) {
        return { error: error.message };
    }
}

export async function bulkImportUsers(users: any[]) {
    try {
        await requireAdmin();

        let successCount = 0;
        let errorCount = 0;
        const errors: string[] = [];

        for (const user of users) {
            try {
                if (!user.name || !user.email || !user.password || !user.role) {
                    throw new Error(`Missing fields for ${user.email || 'unknown user'}`);
                }

                const existing = await prisma.user.findUnique({ where: { email: user.email } });
                if (existing) {
                    throw new Error(`Email ${user.email} already exists`);
                }

                const hashedPassword = await hash(user.password, 10);

                await prisma.user.create({
                    data: {
                        name: user.name,
                        email: user.email,
                        password: hashedPassword,
                        role: user.role.toLowerCase(), // Ensure lowercase role
                        emailVerified: true
                    }
                });
                successCount++;
            } catch (err: any) {
                errorCount++;
                errors.push(err.message);
            }
        }

        revalidatePath("/admin/users");
        return {
            success: true,
            message: `Imported ${successCount} users. ${errorCount} failed.`,
            details: errors
        };
    } catch (error: any) {
        return { error: error.message };
    }
}
