import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Star, Users, BookOpen, Clock, Award, Search, Filter, 
  ChevronDown, Heart, MessageCircle, Play, CheckCircle,
  TrendingUp, Globe, Calendar, Zap, Target, Crown,
  Shield, ArrowRight, User, MapPin, Briefcase
} from "lucide-react";
import { getPublicTeachers } from "@/app/data/teachers/get-public-teachers";
import { TeacherSearchAndFilter } from "./_components/TeacherSearchAndFilter";

const marketplaceStats = [
  { icon: Users, label: "Expert Instructors", value: "500+", color: "#6366f1" },
  { icon: BookOpen, label: "Students Taught", value: "50K+", color: "#10b981" },
  { icon: Star, label: "Average Rating", value: "4.9", color: "#f59e0b" },
  { icon: Shield, label: "Support Available", value: "24/7", color: "#ef4444" }
];

const instructorCategories = [
  { name: "Web Development", count: 85, color: "from-blue-500 to-cyan-500", popular: true },
  { name: "Data Science", count: 62, color: "from-green-500 to-emerald-500", popular: true },
  { name: "UI/UX Design", count: 48, color: "from-purple-500 to-pink-500", popular: false },
  { name: "Mobile Development", count: 39, color: "from-orange-500 to-red-500", popular: false },
  { name: "AI & Machine Learning", count: 33, color: "from-indigo-500 to-purple-500", popular: true },
  { name: "Digital Marketing", count: 27, color: "from-yellow-500 to-orange-500", popular: false }
];

const featuredInstructors = [
  {
    id: 1,
    name: "Sarah Johnson",
    title: "Senior Full Stack Developer",
    company: "Google",
    rating: 4.9,
    reviews: 1250,
    students: 15000,
    courses: 12,
    hourlyRate: "$150",
    specialties: ["React", "Node.js", "TypeScript"],
    location: "San Francisco, CA",
    experience: "8+ years",
    featured: true,
    verified: true,
    responseTime: "Within 1 hour"
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    title: "AI Research Scientist", 
    company: "MIT",
    rating: 4.8,
    reviews: 890,
    students: 12500,
    courses: 8,
    hourlyRate: "$200",
    specialties: ["Python", "TensorFlow", "Data Science"],
    location: "Boston, MA",
    experience: "12+ years",
    featured: true,
    verified: true,
    responseTime: "Within 2 hours"
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    title: "Senior UX Designer",
    company: "Apple",
    rating: 4.9,
    reviews: 756,
    students: 9800,
    courses: 6,
    hourlyRate: "$120",
    specialties: ["Figma", "Design Systems", "User Research"],
    location: "Cupertino, CA", 
    experience: "6+ years",
    featured: false,
    verified: true,
    responseTime: "Within 3 hours"
  }
];

const successStories = [
  {
    student: "Alex Thompson",
    achievement: "Landed job at Meta",
    instructor: "Sarah Johnson",
    course: "Advanced React Development",
    timeframe: "3 months"
  },
  {
    student: "Maria Garcia", 
    achievement: "Built ML startup",
    instructor: "Dr. Michael Chen",
    course: "Machine Learning Masterclass",
    timeframe: "6 months"
  },
  {
    student: "David Kim",
    achievement: "Promoted to Senior Designer",
    instructor: "Emily Rodriguez", 
    course: "UX Design Fundamentals",
    timeframe: "4 months"
  }
];

export default function MarketplacePage() {
  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', backgroundColor: '#fafafa', minHeight: '100vh' }}>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        padding: '4rem 2rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Floating Elements */}
        <div style={{
          position: 'absolute',
          top: '15%',
          left: '10%',
          width: '120px',
          height: '120px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '50%',
          animation: 'float 6s ease-in-out infinite'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '20%',
          right: '15%',
          width: '100px',
          height: '100px',
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
            <Crown style={{ width: '1rem', height: '1rem' }} />
            Expert Marketplace
          </div>

          <h1 style={{
            fontSize: 'clamp(2.5rem, 8vw, 4rem)',
            fontWeight: '800',
            color: 'white',
            marginBottom: '1rem',
            lineHeight: '1.1'
          }}>
            Learn from
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>Industry Experts</span>
          </h1>

          <p style={{
            fontSize: '1.2rem',
            color: 'rgba(255,255,255,0.9)',
            maxWidth: '700px',
            margin: '0 auto 2.5rem auto',
            lineHeight: '1.6'
          }}>
            Connect with top-rated instructors and mentors from leading companies. 
            Get personalized guidance and accelerate your career growth.
          </p>

          {/* Search Bar */}
          <div style={{
            maxWidth: '600px',
            margin: '0 auto',
            position: 'relative',
            backgroundColor: 'rgba(255,255,255,0.1)',
            borderRadius: '50px',
            padding: '0.75rem',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Search style={{ 
                width: '1.2rem', 
                height: '1.2rem', 
                color: 'rgba(255,255,255,0.7)', 
                marginLeft: '1rem',
                marginRight: '0.75rem'
              }} />
              <input
                type="text"
                placeholder="Search instructors, skills, companies..."
                style={{
                  flex: 1,
                  padding: '0.5rem 0',
                  backgroundColor: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'white',
                  fontSize: '1rem'
                }}
              />
              <button style={{
                padding: '0.5rem 1.5rem',
                backgroundColor: 'white',
                color: '#6366f1',
                border: 'none',
                borderRadius: '999px',
                fontWeight: '600',
                cursor: 'pointer'
              }}>
                Find Experts
              </button>
            </div>
          </div>

          {/* Quick Filters */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem',
            marginTop: '2rem',
            flexWrap: 'wrap'
          }}>
            {['Web Development', 'Data Science', 'Design', 'AI/ML'].map((category, index) => (
              <button
                key={index}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.3)',
                  borderRadius: '999px',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  backdropFilter: 'blur(10px)'
                }}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{
        padding: '3rem 2rem',
        backgroundColor: 'white'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2rem',
            textAlign: 'center'
          }}>
            {marketplaceStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} style={{
                  padding: '2rem 1.5rem',
                  backgroundColor: '#f8fafc',
                  borderRadius: '1rem',
                  border: '1px solid #e2e8f0',
                  transition: 'all 0.3s ease'
                }}>
                  <Icon style={{ 
                    width: '2.5rem', 
                    height: '2.5rem', 
                    margin: '0 auto 1rem auto',
                    color: stat.color
                  }} />
                  <div style={{
                    fontSize: '2.25rem',
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

      {/* Categories Section */}
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
              Browse by Expertise
            </h2>
            <p style={{
              fontSize: '1.1rem',
              color: '#6b7280',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Find the perfect instructor for your learning goals across various domains.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}>
            {instructorCategories.map((category, index) => (
              <Link
                key={index}
                href={`/marketplace?category=${encodeURIComponent(category.name)}`}
                style={{
                  display: 'block',
                  padding: '2rem',
                  backgroundColor: 'white',
                  borderRadius: '1rem',
                  border: category.popular ? '2px solid #6366f1' : '1px solid #e2e8f0',
                  textDecoration: 'none',
                  position: 'relative',
                  transition: 'all 0.3s ease'
                }}
              >
                {category.popular && (
                  <div style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    backgroundColor: '#6366f1',
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
                    <Users style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} />
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
                      {category.count} instructors
                    </p>
                  </div>
                </div>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  color: '#6366f1',
                  fontSize: '0.9rem',
                  fontWeight: '500'
                }}>
                  Browse Instructors
                  <ArrowRight style={{ width: '1rem', height: '1rem', marginLeft: '0.5rem' }} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Instructors */}
      <section style={{
        padding: '4rem 2rem',
        backgroundColor: 'white'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '3rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <h2 style={{
                fontSize: 'clamp(2rem, 5vw, 2.5rem)',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '0.5rem'
              }}>
                Featured Instructors
              </h2>
              <p style={{
                color: '#6b7280',
                fontSize: '1.1rem'
              }}>
                Top-rated experts ready to help you succeed
              </p>
            </div>
            <Link
              href="/marketplace/all"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '0.75rem 1.5rem',
                backgroundColor: '#6366f1',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '0.75rem',
                fontWeight: '600'
              }}
            >
              View All Instructors
            </Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '2rem'
          }}>
            {featuredInstructors.map((instructor, index) => (
              <div key={index} style={{
                padding: '2rem',
                backgroundColor: '#f8fafc',
                borderRadius: '1.5rem',
                border: instructor.featured ? '2px solid #6366f1' : '1px solid #e2e8f0',
                position: 'relative',
                transition: 'all 0.3s ease'
              }}>
                {instructor.featured && (
                  <div style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    backgroundColor: '#f59e0b',
                    color: 'white',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '999px',
                    fontSize: '0.75rem',
                    fontWeight: '600'
                  }}>
                    FEATURED
                  </div>
                )}

                {/* Profile Header */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '1.5rem'
                }}>
                  <div style={{
                    width: '4rem',
                    height: '4rem',
                    backgroundColor: '#e5e7eb',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '1rem',
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: '#6b7280'
                  }}>
                    {instructor.name.charAt(0)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <h3 style={{
                        fontSize: '1.25rem',
                        fontWeight: '600',
                        color: '#1f2937',
                        margin: 0
                      }}>
                        {instructor.name}
                      </h3>
                      {instructor.verified && (
                        <CheckCircle style={{ width: '1rem', height: '1rem', color: '#10b981' }} />
                      )}
                    </div>
                    <p style={{
                      color: '#6b7280',
                      fontSize: '0.9rem',
                      margin: 0
                    }}>
                      {instructor.title}
                    </p>
                    <p style={{
                      color: '#6366f1',
                      fontSize: '0.85rem',
                      fontWeight: '500',
                      margin: 0
                    }}>
                      {instructor.company}
                    </p>
                  </div>
                </div>

                {/* Rating & Stats */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  marginBottom: '1.5rem',
                  fontSize: '0.9rem',
                  color: '#6b7280'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Star style={{ width: '1rem', height: '1rem', color: '#f59e0b', fill: '#f59e0b' }} />
                    <span style={{ fontWeight: '600', color: '#1f2937' }}>{instructor.rating}</span>
                    <span>({instructor.reviews.toLocaleString()})</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Users style={{ width: '1rem', height: '1rem' }} />
                    <span>{(instructor.students / 1000).toFixed(0)}k students</span>
                  </div>
                </div>

                {/* Specialties */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.5rem'
                  }}>
                    {instructor.specialties.map((specialty, idx) => (
                      <span
                        key={idx}
                        style={{
                          padding: '0.25rem 0.75rem',
                          backgroundColor: '#ddd6fe',
                          color: '#5b21b6',
                          borderRadius: '999px',
                          fontSize: '0.75rem',
                          fontWeight: '500'
                        }}
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Quick Info */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1rem',
                  marginBottom: '1.5rem',
                  fontSize: '0.85rem',
                  color: '#6b7280'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <MapPin style={{ width: '1rem', height: '1rem' }} />
                    <span>{instructor.location}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Briefcase style={{ width: '1rem', height: '1rem' }} />
                    <span>{instructor.experience}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Clock style={{ width: '1rem', height: '1rem' }} />
                    <span>{instructor.responseTime}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <BookOpen style={{ width: '1rem', height: '1rem' }} />
                    <span>{instructor.courses} courses</span>
                  </div>
                </div>

                {/* Pricing & Actions */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '1rem',
                  borderTop: '1px solid #e5e7eb'
                }}>
                  <div>
                    <span style={{
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      color: '#1f2937'
                    }}>
                      {instructor.hourlyRate}
                    </span>
                    <span style={{
                      color: '#6b7280',
                      fontSize: '0.9rem'
                    }}>
                      /hour
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button style={{
                      padding: '0.5rem',
                      backgroundColor: '#f3f4f6',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      cursor: 'pointer'
                    }}>
                      <Heart style={{ width: '1rem', height: '1rem', color: '#6b7280' }} />
                    </button>
                    <Link
                      href={`/marketplace/instructor/${instructor.id}`}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#6366f1',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '0.5rem',
                        fontSize: '0.9rem',
                        fontWeight: '500'
                      }}
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
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
              Success Stories
            </h2>
            <p style={{
              fontSize: '1.1rem',
              color: '#6b7280',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Real results from students who learned with our expert instructors.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            {successStories.map((story, index) => (
              <div key={index} style={{
                padding: '2rem',
                backgroundColor: 'white',
                borderRadius: '1rem',
                border: '1px solid #e2e8f0',
                textAlign: 'center'
              }}>
                <Award style={{ 
                  width: '3rem', 
                  height: '3rem', 
                  color: '#f59e0b',
                  margin: '0 auto 1.5rem auto'
                }} />
                
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '0.5rem'
                }}>
                  {story.achievement}
                </h3>
                
                <p style={{
                  color: '#6b7280',
                  marginBottom: '1rem'
                }}>
                  {story.student} completed <strong>{story.course}</strong> with {story.instructor}
                </p>
                
                <div style={{
                  display: 'inline-block',
                  padding: '0.25rem 0.75rem',
                  backgroundColor: '#ecfdf5',
                  color: '#065f46',
                  borderRadius: '999px',
                  fontSize: '0.85rem',
                  fontWeight: '500'
                }}>
                  Success in {story.timeframe}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All Instructors Grid */}
      <section style={{
        padding: '4rem 2rem',
        backgroundColor: 'white'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: '#1f2937',
              marginBottom: '0.5rem'
            }}>
              All Instructors
            </h2>
            <p style={{
              color: '#6b7280',
              fontSize: '1.1rem'
            }}>
              Browse our complete collection of expert instructors
            </p>
          </div>

          <Suspense fallback={<InstructorsLoadingSkeleton />}>
            <InstructorsGrid />
          </Suspense>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: '4rem 2rem',
        background: 'linear-gradient(135deg, #1f2937, #374151)',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 5vw, 2.5rem)',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '1rem'
          }}>
            Ready to Start Learning?
          </h2>
          <p style={{
            fontSize: '1.1rem',
            color: '#d1d5db',
            marginBottom: '2rem',
            lineHeight: '1.6'
          }}>
            Join thousands of students who are advancing their careers with personalized mentorship from industry experts.
          </p>
          
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <Link
              href="/marketplace/search"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '0.75rem 2rem',
                backgroundColor: '#6366f1',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '0.5rem',
                fontWeight: '600',
                fontSize: '1rem'
              }}
            >
              Find Your Instructor
              <ArrowRight style={{ width: '1rem', height: '1rem', marginLeft: '0.5rem' }} />
            </Link>
            <Link
              href="/register"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '0.75rem 2rem',
                backgroundColor: 'transparent',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '0.5rem',
                fontWeight: '600',
                fontSize: '1rem',
                border: '2px solid rgba(255,255,255,0.3)'
              }}
            >
              Become an Instructor
            </Link>
          </div>
          
          <p style={{
            fontSize: '0.9rem',
            color: '#9ca3af',
            marginTop: '2rem'
          }}>
            30-day money-back guarantee • No setup fees
          </p>
        </div>
      </section>
    </div>
  );
}

async function InstructorsGrid() {
  const teachers = await getPublicTeachers();
  return <TeacherSearchAndFilter teachers={teachers} />;
}

function InstructorsLoadingSkeleton() {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '2rem'
    }}>
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} style={{
          padding: '2rem',
          backgroundColor: '#f8fafc',
          borderRadius: '1rem',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '1.5rem'
          }}>
            <div style={{
              width: '4rem',
              height: '4rem',
              backgroundColor: '#e5e7eb',
              borderRadius: '50%',
              marginRight: '1rem'
            }}></div>
            <div style={{ flex: 1 }}>
              <div style={{
                width: '60%',
                height: '1rem',
                backgroundColor: '#e5e7eb',
                borderRadius: '0.25rem',
                marginBottom: '0.5rem'
              }}></div>
              <div style={{
                width: '80%',
                height: '0.75rem',
                backgroundColor: '#e5e7eb',
                borderRadius: '0.25rem'
              }}></div>
            </div>
          </div>
          
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            marginBottom: '1rem'
          }}>
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} style={{
                width: '4rem',
                height: '1.5rem',
                backgroundColor: '#e5e7eb',
                borderRadius: '999px'
              }}></div>
            ))}
          </div>
          
          <div style={{
            width: '100%',
            height: '3rem',
            backgroundColor: '#e5e7eb',
            borderRadius: '0.5rem'
          }}></div>
        </div>
      ))}
    </div>
  );
}