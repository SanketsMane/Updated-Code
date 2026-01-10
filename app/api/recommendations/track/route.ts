import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { recommendationEngine } from "@/lib/recommendation-engine";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await import('next/headers').then(h => h.headers())
    });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { type, courseId, category, searchQuery, duration } = body;

    // Validate interaction type
    const validTypes = ['View', 'Enroll', 'Complete', 'Search', 'Like', 'Share', 'Download', 'Rate', 'Comment'];
    if (!validTypes.includes(type)) {
      return NextResponse.json({ error: "Invalid interaction type" }, { status: 400 });
    }

    // Track the interaction using the recommendation engine
    await recommendationEngine.trackUserInteraction(session.user.id, {
      type: type.toLowerCase(),
      courseId,
      category,
      searchQuery,
      duration
    });

    // Update recommendation clicked/viewed status if applicable
    if (courseId && (type === 'View' || type === 'Enroll')) {
      await prisma.courseRecommendation.updateMany({
        where: {
          userId: session.user.id,
          courseId: courseId
        },
        data: {
          viewed: type === 'View' || undefined,
          clicked: true,
          enrolled: type === 'Enroll' || undefined
        }
      });
    }

    // Special handling for course completion
    if (type === 'Complete' && courseId) {
      await prisma.enrollment.updateMany({
        where: {
          userId: session.user.id,
          courseId: courseId
        },
        data: {
          status: 'Active'
        }
      });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Error tracking interaction:", error);
    return NextResponse.json(
      { error: "Failed to track interaction" },
      { status: 500 }
    );
  }
}

// Get user interaction analytics
export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await import('next/headers').then(h => h.headers())
    });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const interactions = await prisma.userInteraction.findMany({
      where: {
        userId: session.user.id,
        timestamp: { gte: startDate }
      },
      orderBy: { timestamp: 'desc' },
      include: {
        course: {
          select: {
            title: true,
            category: true
          }
        }
      }
    });

    // Aggregate statistics
    const stats = {
      totalInteractions: interactions.length,
      byType: interactions.reduce((acc, interaction) => {
        acc[interaction.type] = (acc[interaction.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      byCategory: interactions
        .filter(i => i.category || i.course?.category)
        .reduce((acc, interaction) => {
          const category = interaction.category || interaction.course?.category || 'Unknown';
          acc[category] = (acc[category] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
      recentSearches: interactions
        .filter(i => i.type === 'Search' && i.searchQuery)
        .slice(0, 10)
        .map(i => ({
          query: i.searchQuery,
          timestamp: i.timestamp
        })),
      engagementScore: calculateEngagementScore(interactions)
    };

    return NextResponse.json({
      interactions: interactions.slice(0, 100), // Limit to last 100
      stats
    });

  } catch (error) {
    console.error("Error getting interaction analytics:", error);
    return NextResponse.json(
      { error: "Failed to get interaction analytics" },
      { status: 500 }
    );
  }
}

function calculateEngagementScore(interactions: any[]): number {
  // Simple engagement scoring algorithm
  const weights = {
    View: 1,
    Search: 1,
    Like: 2,
    Share: 3,
    Enroll: 5,
    Complete: 10,
    Rate: 4,
    Comment: 3,
    Download: 2
  };

  const totalScore = interactions.reduce((score, interaction) => {
    const weight = weights[interaction.type as keyof typeof weights] || 1;
    return score + weight;
  }, 0);

  // Normalize to 0-100 scale (assuming max 1000 points for very active users)
  return Math.min(100, Math.round((totalScore / 1000) * 100));
}