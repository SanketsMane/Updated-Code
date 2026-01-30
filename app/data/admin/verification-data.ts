import { prisma } from "@/lib/db";

export async function getVerificationStats() {
  try {
    const [
      pendingVerifications, 
      pendingPayouts, 
      verifiedTeachers, 
      monthlyPayouts,
      // Granular Verification Stats
      identityPending,
      qualificationsPending,
      experiencePending,
      backgroundPending,
      // Granular Payout Stats
      payoutsUnderReview,
      payoutsApproved,
      payoutsTotalValue,
      payoutsTotalCount
    ] = await Promise.all([
      // 1. Pending verifications
      prisma.teacherVerification.count({ where: { status: 'Pending' } }),
      
      // 2. Pending payouts  
      prisma.payoutRequest.count({ where: { status: 'Pending' } }),
      
      // 3. Verified teachers
      prisma.teacherProfile.count({ where: { isVerified: true } }),
      
      // 4. Monthly payouts (paid this month)
      prisma.payoutRequest.aggregate({
        where: {
          status: 'Completed',
          processedAt: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
        },
        _sum: { requestedAmount: true }
      }),

      // 5. Identity Pending (Pending status + has doc + not verified)
      prisma.teacherVerification.count({
        where: {
          status: 'Pending',
          identityDocumentUrl: { not: null },
          identityVerifiedAt: null
        }
      }),

      // 6. Qualifications Pending
      prisma.teacherVerification.count({
        where: {
          status: 'Pending',
          qualificationDocuments: { isEmpty: false },
          qualificationsVerifiedAt: null
        }
      }),

      // 7. Experience Pending
      prisma.teacherVerification.count({
        where: {
          status: 'Pending',
          experienceDocuments: { isEmpty: false },
          experienceVerifiedAt: null
        }
      }),

      // 8. Background Pending
      prisma.teacherVerification.count({
        where: {
          status: 'Pending',
          backgroundCheckStatus: 'Pending'
        }
      }),

      // 9. Payouts Under Review
      prisma.payoutRequest.count({ where: { status: 'UnderReview' } }),

      // 10. Payouts Approved
      prisma.payoutRequest.count({ where: { status: 'Approved' } }),

      // 11. Total Pending Payout Value
      prisma.payoutRequest.aggregate({
        where: { status: 'Pending' },
        _sum: { requestedAmount: true }
      }),

      // 12. Total Pending Payout Count (for avg calc)
       prisma.payoutRequest.count({ where: { status: 'Pending' } })
    ]);

    const totalPendingPayoutVal = Number(payoutsTotalValue._sum.requestedAmount || 0);
    const avgPayoutRequest = payoutsTotalCount > 0 ? totalPendingPayoutVal / payoutsTotalCount : 0;

    return {
      pendingVerifications,
      pendingPayouts, 
      verifiedTeachers, 
      monthlyPayouts: Number(monthlyPayouts._sum.requestedAmount || 0),
      // Breakdown
      verificationBreakdown: {
        identity: identityPending,
        qualifications: qualificationsPending,
        experience: experiencePending,
        background: backgroundPending
      },
      payoutBreakdown: {
        underReview: payoutsUnderReview,
        approved: payoutsApproved,
        totalValue: totalPendingPayoutVal,
        avgRequest: avgPayoutRequest
      }
    };
  } catch (error) {
    console.error('Error fetching verification stats:', error);
    return {
      pendingVerifications: 0,
      pendingPayouts: 0,
      verifiedTeachers: 0,
      monthlyPayouts: 0,
      verificationBreakdown: { identity: 0, qualifications: 0, experience: 0, background: 0 },
      payoutBreakdown: { underReview: 0, approved: 0, totalValue: 0, avgRequest: 0 }
    };
  }
}

export async function getPendingVerifications() {
  try {
    return await prisma.teacherVerification.findMany({
      where: { status: 'Pending' },
      include: {
        teacher: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true
              }
            }
          }
        }
      },
      orderBy: { submittedAt: 'desc' }
    });
  } catch (error) {
    console.error('Error fetching pending verifications:', error);
    return [];
  }
}

export async function getPendingPayouts() {
  try {
    return await prisma.payoutRequest.findMany({
      where: { status: 'Pending' },
      include: {
        teacher: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    console.error('Error fetching pending payouts:', error);
    return [];
  }
}

export async function getRecentVerificationActivity() {
  try {
    const [recentVerifications, recentPayouts] = await Promise.all([
      prisma.teacherVerification.findMany({
        where: {
          status: { in: ['Approved', 'Rejected'] },
          reviewedAt: { not: null }
        },
        include: {
          teacher: {
            include: {
              user: {
                select: {
                  name: true
                }
              }
            }
          }
        },
        orderBy: { reviewedAt: 'desc' },
        take: 5
      }),
      
      prisma.payoutRequest.findMany({
        where: {
          status: { in: ['Completed', 'Approved'] },
          processedAt: { not: null }
        },
        include: {
          teacher: {
            include: {
              user: {
                select: {
                  name: true
                }
              }
            }
          }
        },
        orderBy: { processedAt: 'desc' },
        take: 5
      })
    ]);

    // Combine and sort by timestamp
    const activity = [
      ...recentVerifications.map(v => ({
        type: 'verification',
        status: v.status,
        teacherName: v.teacher.user.name,
        timestamp: v.reviewedAt,
        amount: null
      })),
      ...recentPayouts.map(p => ({
        type: 'payout',
        status: p.status,
        teacherName: p.teacher.user.name,
        timestamp: p.processedAt,
        amount: Number(p.requestedAmount)
      }))
    ].sort((a, b) => new Date(b.timestamp!).getTime() - new Date(a.timestamp!).getTime());

    return activity.slice(0, 4);
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    return [];
  }
}