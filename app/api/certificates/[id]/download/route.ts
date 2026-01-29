import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

/**
 * Certificate Download API
 * Author: Sanket
 * Returns certificate data as JSON for client-side PDF generation
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { id } = await params;

        // Fetch certificate and verify ownership
        const certificate = await prisma.certificate.findUnique({
            where: { id },
            include: {
                course: {
                    select: {
                        title: true,
                    }
                }
            }
        });

        if (!certificate) {
            return NextResponse.json(
                { error: "Certificate not found" },
                { status: 404 }
            );
        }

        // Verify the certificate belongs to the requesting user
        if (certificate.userId !== session.user.id) {
            return NextResponse.json(
                { error: "Unauthorized access to certificate" },
                { status: 403 }
            );
        }

        // Return certificate data for client-side rendering/download
        // In a production app, you might generate a PDF here using libraries like PDFKit or Puppeteer
        return NextResponse.json({
            certificate: {
                id: certificate.id,
                certificateNumber: certificate.certificateNumber,
                studentName: certificate.studentName,
                courseName: certificate.courseName,
                teacherName: certificate.teacherName,
                completionDate: certificate.completionDate,
                issuedAt: certificate.issuedAt,
            },
            downloadUrl: `/api/certificates/${id}/pdf`, // Future endpoint for actual PDF
        });

    } catch (error) {
        console.error("Certificate download error:", error);
        return NextResponse.json(
            { error: "Failed to process certificate" },
            { status: 500 }
        );
    }
}
