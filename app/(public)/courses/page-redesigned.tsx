import { getAllCourses } from "@/app/data/course/get-all-courses";
import { PublicCourseCard, PublicCourseCardSkeleton } from "../_components/PublicCourseCard";
import { CourseFilters } from "../_components/CourseFilters";
import { CourseSearchWrapper } from "./_components/CourseSearchWrapper";
import { Suspense } from "react";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, Filter, Grid, List, Star, Clock, Users, 
  TrendingUp, Award, Play, Search, ChevronRight, Zap,
  Target, Trophy, Lightbulb, Code, Palette, BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

interface SearchParams {
  category?: string;
  level?: string;
  search?: string;
}

interface Props {
  searchParams: SearchParams;
}

const featuredCategories = [
  { name: "Programming", icon: Code, count: 245, color: "from-blue-500 to-cyan-500", popular: true },
  { name: "Design", icon: Palette, count: 189, color: "from-purple-500 to-pink-500", popular: true },
  { name: "Business", icon: BarChart3, count: 156, color: "from-green-500 to-emerald-500", popular: false },
  { name: "Marketing", icon: TrendingUp, count: 134, color: "from-orange-500 to-red-500", popular: false },
  { name: "Data Science", icon: Target, count: 98, color: "from-indigo-500 to-purple-500", popular: true },
  { name: "Photography", icon: Lightbulb, count: 87, color: "from-yellow-500 to-orange-500", popular: false }
];

const courseStats = [
  { icon: BookOpen, label: "Total Courses", value: "1,200+", color: "text-blue-600" },
  { icon: Users, label: "Active Learners", value: "45K+", color: "text-green-600" },
  { icon: Award, label: "Expert Instructors", value: "500+", color: "text-purple-600" },
  { icon: Star, label: "Average Rating", value: "4.8", color: "text-yellow-600" }
];

const trendingTopics = [
  "React & Next.js", "AI & Machine Learning", "Python Programming", 
  "UI/UX Design", "Digital Marketing", "Data Analytics", 
  "Cloud Computing", "Cybersecurity"
];

export default async function PublicCoursesRoute({ searchParams }: Props) {
  const categories = await prisma.category.findMany({
    include: {
      courses: {
        select: {
          id: true
        }
      }
    }
  });

  const formattedCategories = categories.map(c => ({
    id: c.id,
    label: c.name,
    count: c.courses.length
  }));

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', backgroundColor: '#fafafa', minHeight: '100vh' }}>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '4rem 2rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Floating Elements */}
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: '100px',
          height: '100px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '50%',
          animation: 'float 6s ease-in-out infinite'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '20%',
          right: '15%',
          width: '150px',
          height: '150px',
          background: 'rgba(255,255,255,0.08)',
          borderRadius: '50%',
          animation: 'float 8s ease-in-out infinite reverse'
        }}></div>

        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 10 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            padding: '0.5rem 1rem',
            borderRadius: '999px',
            color: 'white',
            fontSize: '0.9rem',
            marginBottom: '1.5rem',
            backdropFilter: 'blur(10px)'
          }}>
            <BookOpen style={{ width: '1rem', height: '1rem' }} />
            Course Marketplace
          </div>

          <h1 style={{
            fontSize: 'clamp(2.5rem, 8vw, 4rem)',
            fontWeight: '800',
            color: 'white',
            marginBottom: '1rem',
            lineHeight: '1.1'
          }}>
            Master Skills That
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #ffeaa7, #fab1a0)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>Drive Success</span>
          </h1>

          <p style={{
            fontSize: '1.2rem',
            color: 'rgba(255,255,255,0.9)',
            maxWidth: '600px',
            margin: '0 auto 2rem auto',
            lineHeight: '1.6'
          }}>
            Discover 1,200+ premium courses from industry experts. Learn practical skills, 
            earn certificates, and advance your career with hands-on projects.
          </p>

          {/* Search Bar */}
          <div style={{
            maxWidth: '600px',
            margin: '0 auto',
            position: 'relative'
          }}>
            <CourseSearchWrapper placeholder="Search courses, instructors, topics..." />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{
        padding: '3rem 2rem',
        backgroundColor: 'white',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2rem',
            textAlign: 'center'
          }}>
            {courseStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} style={{
                  padding: '1.5rem',
                  backgroundColor: '#f8fafc',
                  borderRadius: '1rem',
                  border: '1px solid #e2e8f0',
                  transition: 'all 0.3s ease'
                }}>
                  <Icon style={{ 
                    width: '2.5rem', 
                    height: '2.5rem', 
                    margin: '0 auto 1rem auto',
                    color: stat.color.replace('text-', '#')
                  }} />
                  <div style={{
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    color: '#1f2937',
                    marginBottom: '0.5rem'
                  }}>
                    {stat.value}
                  </div>
                  <div style={{
                    color: '#6b7280',
                    fontWeight: '500'
                  }}>
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section style={{
        padding: '4rem 2rem',
        backgroundColor: '#fafafa'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{
              fontSize: 'clamp(2rem, 5vw, 2.5rem)',
              fontWeight: 'bold',
              color: '#1f2937',
              marginBottom: '1rem'
            }}>
              Popular Categories
            </h2>
            <p style={{
              fontSize: '1.1rem',
              color: '#6b7280',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Explore our most in-demand course categories and find your perfect learning path.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem'
          }}>
            {featuredCategories.map((category, index) => {
              const Icon = category.icon;
              return (
                <Link
                  key={index}
                  href={`/courses?category=${category.name}`}
                  style={{
                    display: 'block',
                    padding: '2rem',
                    backgroundColor: 'white',
                    borderRadius: '1rem',
                    border: category.popular ? '2px solid #667eea' : '1px solid #e2e8f0',
                    textDecoration: 'none',
                    position: 'relative',
                    transition: 'all 0.3s ease',
                    overflow: 'hidden'
                  }}
                >
                  {category.popular && (
                    <div style={{
                      position: 'absolute',
                      top: '1rem',
                      right: '1rem',
                      backgroundColor: '#667eea',
                      color: 'white',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '999px',
                      fontSize: '0.75rem',
                      fontWeight: '600'
                    }}>
                      POPULAR
                    </div>
                  )}
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '1rem'
                  }}>
                    <div style={{
                      width: '3rem',
                      height: '3rem',
                      background: `linear-gradient(135deg, ${category.color.replace('from-', '').replace(' to-', ', ')})`,
                      borderRadius: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '1rem'
                    }}>
                      <Icon style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} />
                    </div>
                    <div>
                      <h3 style={{
                        fontSize: '1.25rem',
                        fontWeight: '600',
                        color: '#1f2937',
                        margin: 0
                      }}>
                        {category.name}
                      </h3>
                      <p style={{
                        color: '#6b7280',
                        fontSize: '0.9rem',
                        margin: 0
                      }}>
                        {category.count} courses
                      </p>
                    </div>
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    color: '#667eea',
                    fontSize: '0.9rem',
                    fontWeight: '500'
                  }}>
                    Explore Courses
                    <ChevronRight style={{ width: '1rem', height: '1rem', marginLeft: '0.5rem' }} />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trending Topics */}
      <section style={{
        padding: '3rem 2rem',
        backgroundColor: 'white'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.5rem'
          }}>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#1f2937',
              margin: 0
            }}>
              Trending Topics
            </h3>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1rem',
              justifyContent: 'center'
            }}>
              {trendingTopics.map((topic, index) => (
                <Link
                  key={index}
                  href={`/courses?search=${encodeURIComponent(topic)}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '999px',
                    color: '#374151',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <Zap style={{ width: '1rem', height: '1rem', marginRight: '0.5rem', color: '#667eea' }} />
                  {topic}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Filters and Course Grid */}
      <section style={{
        padding: '4rem 2rem',
        backgroundColor: '#fafafa'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <h2 style={{
              fontSize: '1.8rem',
              fontWeight: '600',
              color: '#1f2937',
              margin: 0
            }}>
              All Courses
            </h2>
            <div style={{
              display: 'flex',
              gap: '1rem',
              alignItems: 'center'
            }}>
              <CourseFilters categories={formattedCategories} />
            </div>
          </div>

          {/* Course Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            <Suspense fallback={
              Array.from({ length: 8 }).map((_, i) => (
                <PublicCourseCardSkeleton key={i} />
              ))
            }>
              <CoursesGrid searchParams={searchParams} />
            </Suspense>
          </div>
        </div>
      </section>
    </div>
  );
}

async function CoursesGrid({ searchParams }: { searchParams: SearchParams }) {
  const courses = await getAllCourses();
  
  // Filter courses based on search parameters
  let filteredCourses = courses;
  
  if (searchParams.search) {
    filteredCourses = filteredCourses.filter(course =>
      course.title.toLowerCase().includes(searchParams.search!.toLowerCase()) ||
      course.smallDescription?.toLowerCase().includes(searchParams.search!.toLowerCase())
    );
  }
  
  if (searchParams.category) {
    filteredCourses = filteredCourses.filter(course =>
      course.category?.toLowerCase() === searchParams.category!.toLowerCase()
    );
  }
  
  if (searchParams.level) {
    filteredCourses = filteredCourses.filter(course =>
      course.level?.toLowerCase() === searchParams.level!.toLowerCase()
    );
  }

  if (filteredCourses.length === 0) {
    return (
      <div style={{
        gridColumn: '1 / -1',
        textAlign: 'center',
        padding: '4rem 2rem',
        color: '#6b7280'
      }}>
        <Search style={{ width: '4rem', height: '4rem', margin: '0 auto 1rem auto', color: '#d1d5db' }} />
        <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
          No courses found
        </h3>
        <p style={{ marginBottom: '2rem' }}>
          Try adjusting your search criteria or browse our popular categories.
        </p>
        <Link
          href="/courses"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '0.75rem 1.5rem',
            backgroundColor: '#667eea',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '0.5rem',
            fontWeight: '500'
          }}
        >
          Browse All Courses
        </Link>
      </div>
    );
  }

  return (
    <>
      {filteredCourses.map((course) => (
        <PublicCourseCard key={course.id} data={course} />
      ))}
    </>
  );
}