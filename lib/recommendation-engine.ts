/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { prisma } from "./db";

export interface UserPreference {
  userId: string;
  categories: string[];
  difficulty: string[];
  priceRange: [number, number];
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'reading';
  timeAvailability: 'low' | 'medium' | 'high';
  goals: string[];
}

export interface CourseRecommendation {
  courseId: string;
  title: string;
  description: string;
  thumbnail?: string;
  price: number;
  rating: number;
  category: string;
  difficulty: string;
  duration: string;
  instructor: {
    name: string;
    image?: string;
  };
  confidence: number; // 0-100 confidence score
  reasons: string[]; // Why this course is recommended
  tags: string[];
}

export interface RecommendationContext {
  userId: string;
  currentCourse?: string;
  recentActivity: Array<{
    type: 'view' | 'enroll' | 'complete' | 'search' | 'like';
    courseId?: string;
    category?: string;
    timestamp: Date;
  }>;
  completedCourses: string[];
  enrolledCourses: string[];
  searchHistory: string[];
  preferences: UserPreference;
}

class RecommendationEngine {
  private readonly WEIGHTS = {
    categoryMatch: 0.25,
    difficultyProgression: 0.20,
    collaborativeFiltering: 0.20,
    contentBased: 0.15,
    popularity: 0.10,
    recency: 0.10
  };

  async getPersonalizedRecommendations(
    context: RecommendationContext,
    limit: number = 10
  ): Promise<CourseRecommendation[]> {
    try {
      // Get all available courses
      const allCourses = await this.getAllCourses(context.userId);

      // Calculate scores for each course
      const scoredCourses = await Promise.all(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        allCourses.map((course: any) => this.calculateCourseScore(course, context))
      );

      // Sort by confidence score and return top recommendations
      return scoredCourses
        .sort((a: any, b: any) => b.confidence - a.confidence)
        .slice(0, limit);
    } catch (error) {
      console.error('Error generating recommendations:', error);
      return [];
    }
  }

  async getTrendingRecommendations(limit: number = 10): Promise<CourseRecommendation[]> {
    try {
      // Get courses with high enrollment and rating in last 30 days
      const courses = await prisma.course.findMany({
        include: {
          user: true,
          enrollment: {
            where: {
              createdAt: {
                gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
              }
            }
          },
          _count: {
            select: {
              enrollment: true,
              reviews: true
            }
          }
        },
        orderBy: [
          { enrollment: { _count: 'desc' } },
          { averageRating: 'desc' }
        ],
        take: limit
      });

      return courses.map((course: any) => ({
        courseId: course.id,
        title: course.title,
        description: course.description || '',
        thumbnail: course.imageUrl || undefined,
        price: course.price,
        rating: course.averageRating || 0,
        category: course.categoryId || 'General',
        difficulty: course.level || 'Beginner',
        duration: `${Math.ceil((course.duration || 0) / 60)} hours`,
        instructor: {
          name: course.teacher.name || 'Unknown',
          image: course.teacher.image || undefined
        },
        confidence: 85, // High confidence for trending courses
        reasons: ['Trending course', 'High enrollment rate', 'Excellent ratings'],
        tags: ['trending', 'popular']
      }));
    } catch (error) {
      console.error('Error getting trending recommendations:', error);
      return [];
    }
  }

  async getSimilarCourses(courseId: string, limit: number = 5): Promise<CourseRecommendation[]> {
    try {
      const baseCourse = await prisma.course.findUnique({
        where: { id: courseId },
        include: { user: true }
      });

      if (!baseCourse) return [];

      // Find courses with similar category, level, and tags
      const similarCourses = await prisma.course.findMany({
        where: {
          id: { not: courseId },
          OR: [
            { categoryId: baseCourse.categoryId },
            { level: baseCourse.level },
            // Add more similarity criteria
          ]
        },
        include: {
          user: true,
          _count: {
            select: { enrollment: true }
          }
        },
        orderBy: {
          averageRating: 'desc'
        },
        take: limit
      });

      return similarCourses.map((course: any) => ({
        courseId: course.id,
        title: course.title,
        description: course.description || '',
        thumbnail: course.imageUrl || undefined,
        price: course.price,
        rating: course.averageRating || 0,
        category: course.categoryId || 'General',
        difficulty: course.level || 'Beginner',
        duration: `${Math.ceil((course.duration || 0) / 60)} hours`,
        instructor: {
          name: course.teacher.name || 'Unknown',
          image: course.teacher.image || undefined
        },
        confidence: 75,
        reasons: ['Similar category', 'Same difficulty level'],
        tags: ['similar']
      }));
    } catch (error) {
      console.error('Error getting similar courses:', error);
      return [];
    }
  }

  private async calculateCourseScore(
    course: any,
    context: RecommendationContext
  ): Promise<CourseRecommendation> {
    let totalScore = 0;
    const reasons: string[] = [];

    // Category matching score
    const categoryScore = this.calculateCategoryScore(course, context);
    totalScore += categoryScore * this.WEIGHTS.categoryMatch;
    if (categoryScore > 0.7) reasons.push('Matches your interests');

    // Difficulty progression score
    const difficultyScore = this.calculateDifficultyScore(course, context);
    totalScore += difficultyScore * this.WEIGHTS.difficultyProgression;
    if (difficultyScore > 0.8) reasons.push('Perfect for your skill level');

    // Collaborative filtering score
    const collaborativeScore = await this.calculateCollaborativeScore(course, context);
    totalScore += collaborativeScore * this.WEIGHTS.collaborativeFiltering;
    if (collaborativeScore > 0.6) reasons.push('Popular with similar learners');

    // Content-based score
    const contentScore = this.calculateContentScore(course, context);
    totalScore += contentScore * this.WEIGHTS.contentBased;
    if (contentScore > 0.7) reasons.push('Matches your learning style');

    // Popularity score
    const popularityScore = this.calculatePopularityScore(course);
    totalScore += popularityScore * this.WEIGHTS.popularity;

    // Recency score
    const recencyScore = this.calculateRecencyScore(course);
    totalScore += recencyScore * this.WEIGHTS.recency;
    if (recencyScore > 0.8) reasons.push('Recently updated content');

    // Convert to 0-100 scale
    const confidence = Math.min(100, Math.max(0, totalScore * 100));

    return {
      courseId: course.id,
      title: course.title,
      description: course.description || '',
      thumbnail: course.imageUrl || undefined,
      price: course.price,
      rating: course.averageRating || 0,
      category: course.categoryId || 'General',
      difficulty: course.level || 'Beginner',
      duration: `${Math.ceil((course.duration || 0) / 60)} hours`,
      instructor: {
        name: course.teacher.name || 'Unknown',
        image: course.teacher.image || undefined
      },
      confidence,
      reasons: reasons.length > 0 ? reasons : ['Recommended for you'],
      tags: this.generateTags(course, confidence)
    };
  }

  private calculateCategoryScore(course: any, context: RecommendationContext): number {
    const userCategories = context.preferences.categories;
    if (userCategories.length === 0) return 0.5; // Neutral if no preferences

    // Check if course category matches user preferences
    if (userCategories.includes(course.categoryId)) return 1.0;

    // Check activity-based category preferences
    const activityCategories = context.recentActivity
      .filter(activity => activity.category)
      .map(activity => activity.category);

    const categoryFrequency = activityCategories.reduce((acc, cat) => {
      acc[cat!] = (acc[cat!] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topCategory = Object.keys(categoryFrequency)[0];
    if (topCategory === course.categoryId) return 0.8;

    return 0.3; // Low score for unmatched categories
  }

  private calculateDifficultyScore(course: any, context: RecommendationContext): number {
    const userLevels = context.preferences.difficulty;
    const courseDifficulty = course.level;

    // Direct match
    if (userLevels.includes(courseDifficulty)) return 1.0;

    // Progressive difficulty based on completed courses
    const completedLevels = context.completedCourses.map(courseId => {
      // This would need to be fetched from database in real implementation
      return 'Beginner'; // Placeholder
    });

    // Logic for progressive difficulty recommendation
    const difficultyOrder = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
    const userMaxLevel = completedLevels.reduce((max, level) => {
      const currentIndex = difficultyOrder.indexOf(level);
      const maxIndex = difficultyOrder.indexOf(max);
      return currentIndex > maxIndex ? level : max;
    }, 'Beginner');

    const userMaxIndex = difficultyOrder.indexOf(userMaxLevel);
    const courseIndex = difficultyOrder.indexOf(courseDifficulty);

    // Recommend next level or same level
    if (courseIndex <= userMaxIndex + 1) return 0.8;
    if (courseIndex === userMaxIndex) return 0.9;

    return 0.2; // Too advanced or too easy
  }

  private async calculateCollaborativeScore(course: any, context: RecommendationContext): Promise<number> {
    // Find users with similar enrollment patterns
    try {
      const similarUsers = await prisma.enrollment.findMany({
        where: {
          courseId: { in: context.enrolledCourses },
          userId: { not: context.userId }
        },
        select: { userId: true },
        distinct: ['userId']
      });

      if (similarUsers.length === 0) return 0.5;

      // Check how many similar users enrolled in this course
      const enrolledSimilarUsers = await prisma.enrollment.count({
        where: {
          courseId: course.id,
          userId: { in: similarUsers.map((u: any) => u.userId) }
        }
      });

      return Math.min(1.0, enrolledSimilarUsers / similarUsers.length);
    } catch (error) {
      console.error('Error calculating collaborative score:', error);
      return 0.5;
    }
  }

  private calculateContentScore(course: any, context: RecommendationContext): number {
    let score = 0.5;

    // Learning style matching
    const learningStyle = context.preferences.learningStyle;

    // This would need more sophisticated content analysis
    // For now, using basic heuristics
    if (learningStyle === 'visual' && course.hasVideo) score += 0.3;
    if (learningStyle === 'reading' && course.hasText) score += 0.3;
    if (learningStyle === 'auditory' && course.hasAudio) score += 0.3;

    // Time availability matching
    const timeAvail = context.preferences.timeAvailability;
    const courseDuration = course.duration || 0;

    if (timeAvail === 'low' && courseDuration < 180) score += 0.2; // < 3 hours
    if (timeAvail === 'medium' && courseDuration >= 180 && courseDuration < 600) score += 0.2;
    if (timeAvail === 'high' && courseDuration >= 600) score += 0.2;

    return Math.min(1.0, score);
  }

  private calculatePopularityScore(course: any): number {
    const enrollmentCount = course._count?.enrollments || 0;
    const rating = course.averageRating || 0;

    // Normalize enrollment count (assuming max 1000 enrollments)
    const enrollmentScore = Math.min(1.0, enrollmentCount / 1000);

    // Normalize rating (0-5 scale)
    const ratingScore = rating / 5;

    return (enrollmentScore + ratingScore) / 2;
  }

  private calculateRecencyScore(course: any): number {
    const now = new Date();
    const updatedAt = new Date(course.updatedAt);
    const daysSinceUpdate = (now.getTime() - updatedAt.getTime()) / (1000 * 60 * 60 * 24);

    // Higher score for more recently updated courses
    if (daysSinceUpdate <= 30) return 1.0;
    if (daysSinceUpdate <= 90) return 0.8;
    if (daysSinceUpdate <= 180) return 0.6;
    return 0.4;
  }

  private generateTags(course: any, confidence: number): string[] {
    const tags: string[] = [];

    if (confidence >= 90) tags.push('highly-recommended');
    if (confidence >= 70) tags.push('recommended');
    if (course.averageRating >= 4.5) tags.push('top-rated');
    if (course._count?.enrollments > 500) tags.push('bestseller');
    if (course.price === 0) tags.push('free');

    return tags;
  }

  private async getAllCourses(excludeUserId: string) {
    return await prisma.course.findMany({
      where: {
        // published: true,
        // Exclude courses user is already enrolled in
        enrollment: {
          none: {
            userId: excludeUserId
          }
        }
      },
      include: {
        user: true,
        _count: {
          select: {
            enrollment: true,
            reviews: true
          }
        }
      }
    });
  }

  // Track user interactions for improving recommendations
  async trackUserInteraction(userId: string, interaction: {
    type: 'view' | 'enroll' | 'complete' | 'search' | 'like' | 'share';
    courseId?: string;
    category?: string;
    searchQuery?: string;
    duration?: number; // Time spent
  }) {
    try {
      // Store interaction in database or analytics system
      await prisma.userInteraction.create({
        data: {
          userId,
          type: interaction.type.toUpperCase() as any,
          courseId: interaction.courseId,
          category: interaction.category,
          searchQuery: interaction.searchQuery,
          duration: interaction.duration,
          timestamp: new Date()
        }
      });

      // Update user preferences based on interactions
      await this.updateUserPreferences(userId, interaction);
    } catch (error) {
      console.error('Error tracking user interaction:', error);
    }
  }

  private async updateUserPreferences(userId: string, interaction: any) {
    // Logic to dynamically update user preferences based on behavior
    // This would analyze patterns and adjust the preference weights
  }
}

export const recommendationEngine = new RecommendationEngine();