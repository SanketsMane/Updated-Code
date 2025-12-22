import { S3 } from "@/lib/S3Client";
import { auth } from "@/lib/auth";
import { env } from "@/lib/env";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session || (session.user.role !== "admin" && session.user.role !== "teacher")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        // Validate file type (images only for this proxy)
        if (!file.type.startsWith("image/")) {
            return NextResponse.json({ error: "Only images are allowed via this proxy" }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const fileName = file.name;
        const uniqueKey = `${uuidv4()}-${fileName}`;

        const command = new PutObjectCommand({
            Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
            Key: uniqueKey,
            Body: buffer,
            ContentType: file.type,
        });

        await S3.send(command);

        return NextResponse.json({
            key: uniqueKey,
            url: `https://${env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES}.fly.storage.tigris.dev/${uniqueKey}` // Constructing URL manually or returning key
        });

    } catch (error) {
        console.error("Proxy Upload Error:", error);
        return NextResponse.json(
            { error: "Upload failed" },
            { status: 500 }
        );
    }
}
