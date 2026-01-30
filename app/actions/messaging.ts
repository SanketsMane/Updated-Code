"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { sendNotificationEmail } from "@/lib/email-notifications";

async function requireAdmin() {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) throw new Error("Unauthorized");
    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (user?.role !== "admin") throw new Error("Unauthorized");
    return user;
}

export async function sendMessage(prevState: any, formData: FormData) {
    try {
        const admin = await requireAdmin();

        const recipientId = formData.get("recipientId") as string;
        const subject = formData.get("subject") as string;
        const message = formData.get("message") as string;
        const isBroadcast = formData.get("isBroadcast") === "true";
        const broadcastRole = formData.get("broadcastRole") as string; // 'teacher', 'student', 'all'

        if (!subject || !message) {
            return { error: "Subject and Message are required" };
        }

        let recipients: { id: string; name: string | null; email: string | null }[] = [];

        if (isBroadcast) {
            const roleFilter = 
                broadcastRole === 'teacher' ? { role: 'teacher' as const } :
                broadcastRole === 'student' ? { role: 'student' as const } :
                {}; // all

            recipients = await prisma.user.findMany({
                where: roleFilter,
                select: { id: true, name: true, email: true }
            });
        } else {
            if (!recipientId) return { error: "Recipient is required for single message" };
            const user = await prisma.user.findUnique({
                where: { id: recipientId },
                select: { id: true, name: true, email: true }
            });
            if (user) recipients = [user];
        }

        console.log(`[MESSAGE SYSTEM] Sending to ${recipients.length} users...`);

        // Process in parallel chunks to avoid timeout
        const CHUNK_SIZE = 10;
        for (let i = 0; i < recipients.length; i += CHUNK_SIZE) {
            const chunk = recipients.slice(i, i + CHUNK_SIZE);
            await Promise.all(chunk.map(async (user) => {
                // 1. Send Email
                if (user.email && user.name) {
                    try {
                        await sendNotificationEmail(
                            user.email,
                            user.name,
                            subject, // Title
                            subject, // Message Title
                            message  // Message Body
                        );
                    } catch (e) {
                        console.error(`Failed to send email to ${user.email}`, e);
                    }
                }

                // 2. Create In-App Notification
                try {
                    await prisma.notification.create({
                        data: {
                            userId: user.id,
                            title: subject,
                            message: message,
                            type: "System",
                            isRead: false
                        }
                    });
                } catch (e) {
                    console.error(`Failed to create notification for ${user.id}`, e);
                }
            }));
        }

        return { success: true, message: `Message sent to ${recipients.length} users` };
    } catch (error: any) {
        console.error("SendMessage Error:", error);
        return { error: error.message || "Failed to send message" };
    }
}
