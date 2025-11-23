import { requireAdmin } from "@/app/data/admin/require-admin";
import { protectGeneral } from "@/lib/security";
import { env } from "@/lib/env";
import { S3 } from "@/lib/S3Client";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
  const session = await requireAdmin();
  try {
    // Apply rate limiting for file deletions (5 per minute)
    const securityCheck = await protectGeneral(request, session?.user.id as string, {
      maxRequests: 5,
      windowMs: 60000
    });
    
    if (!securityCheck.success) {
      return NextResponse.json({ error: securityCheck.error }, { status: securityCheck.status });
    }
    const body = await request.json();

    const key = body.key;

    if (!key) {
      return NextResponse.json(
        { error: "Missing or invalid object key" },
        { status: 400 }
      );
    }

    const command = new DeleteObjectCommand({
      Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
      Key: key,
    });

    await S3.send(command);

    return NextResponse.json(
      { message: "File deleted succesfully" },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "Missing or invalid object key" },
      { status: 500 }
    );
  }
}
