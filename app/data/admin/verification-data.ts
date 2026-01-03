import { prisma } from "@/lib/db";

export async function getVerificationStats() {
  try {
    const [pendingVerifications, pendingPayouts, verifiedTeachers, monthlyPayouts] = await Promise.all([
      // Pending verifications
      prisma.teacherVerification.count({
        where: { status: 'Pending' }
      }),
      
      // Pending payouts  
      prisma.payoutRequest.count({
        where: { status: 'Pending' }
      }),
      
      // Verified teachers
      prisma.teacherProfile.count({
        where: { isVerified: true }
      }),
      
      // Monthly payouts
      prisma.payoutRequest.aggregate({
        where: {
          status: 'Completed',
          processedAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        },
        _sum: {
          requestedAmount: true
        }
      })
    ]);

    return {
      pendingVerifications,
      pendingPayouts, 
      verifiedTeachers,
      monthlyPayouts: Number(monthlyPayouts._sum.requestedAmount || 0)
    };
  } catch (error) {
    console.error('Error fetching verification stats:', error);
    return {
      pendingVerifications: 0,
      pendingPayouts: 0,
      verifiedTeachers: 0,
      monthlyPayouts: 0
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