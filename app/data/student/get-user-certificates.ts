import "server-only";

import { prisma } from "@/lib/db";

export interface UserCertificate {
    id: string;
    certificateNumber: string;
    studentName: string;
    courseName: string;
    teacherName: string;
    completionDate: Date;
    issuedAt: Date;
    verificationUrl: string | null;
    courseId: string | null;
}

/**
 * Get all certificates for a specific user
 * Author: Sanket
 */
export async function getUserCertificates(userId: string): Promise<UserCertificate[]> {
    const certificates = await prisma.certificate.findMany({
        where: {
            userId: userId
        },
        orderBy: {
            issuedAt: 'desc'
        },
        select: {
            id: true,
            certificateNumber: true,
            studentName: true,
            courseName: true,
            teacherName: true,
            completionDate: true,
            issuedAt: true,
            verificationUrl: true,
            courseId: true
        }
    });

    return certificates;
}
