import { Suspense } from "react";
import Link from "next/link";
// Duplicate Link removed
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Calendar, Clock, Eye, User, BookOpen, TrendingUp, Search, Filter,
  ArrowRight, PenTool,
  Code, Palette, BarChart3, Zap, Target
} from "lucide-react";
import { getBlogPosts, getFeaturedBlogPosts } from "@/app/actions/blog";
import { formatDistanceToNow, format } from "date-fns";

interface BlogPageProps {
  searchParams: Promise<{
    page?: string;
    category?: string;
    tag?: string;
    search?: string;
  }>;
}

const blogStats = [
  { icon: BookOpen, label: "Articles Published", value: "2,500+", color: "#3b82f6" },
  { icon: User, label: "Expert Authors", value: "150+", color: "#10b981" },
  { icon: Eye, label: "Monthly Readers", value: "500K+", color: "#8b5cf6" },
  { icon: TrendingUp, label: "Topics Covered", value: "50+", color: "#f59e0b" }
];

const featuredTopics = [
  { name: "Web Development", icon: Code, count: 245, color: "from-blue-500 to-cyan-500", popular: true },
  { name: "UI/UX Design", icon: Palette, count: 189, color: "from-purple-500 to-pink-500", popular: true },
  { name: "Data Science", icon: BarChart3, count: 156, color: "from-green-500 to-emerald-500", popular: false },
  { name: "Digital Marketing", icon: TrendingUp, count: 134, color: "from-orange-500 to-red-500", popular: false },
  { name: "AI & Machine Learning", icon: Zap, count: 98, color: "from-indigo-500 to-purple-500", popular: true },
  { name: "Career Growth", icon: Target, count: 87, color: "from-yellow-500 to-orange-500", popular: false }
];

const trendingPosts = [
  {
    id: 1,
    title: "The Complete Guide to React 18 and Next.js 14",
    excerpt: "Learn the latest features and best practices for building modern web applications",
    category: "Web Development",
    author: "Sarah Johnson",
    readTime: "12 min read",
    publishedAt: "2 days ago",
    views: "15.2K",
    featured: true
  },
  {
    id: 2,
    title: "10 Essential UI/UX Design Principles for 2025",
    excerpt: "Master the fundamental design principles that create exceptional user experiences",
    category: "Design",
    author: "Michael Chen",
    readTime: "8 min read",
    publishedAt: "1 week ago",
    views: "8.9K",
    featured: false
  },
  {
    id: 3,
    title: "Building Your First Machine Learning Model",
    excerpt: "A beginner-friendly introduction to ML with practical Python examples",
    category: "AI & ML",
    author: "Dr. Emily Rodriguez",
    readTime: "15 min read",
    publishedAt: "3 days ago",
    views: "12.1K",
    featured: true
  }
];

const recentPosts = [
  {
    title: "Advanced Python Techniques Every Developer Should Know",
    category: "Programming",
    readTime: "10 min",
    publishedAt: "1 day ago"
  },
  {
    title: "The Future of Remote Work in Tech",
    category: "Career",
    readTime: "6 min",
    publishedAt: "2 days ago"
  },
  {
    title: "Mastering CSS Grid and Flexbox",
    category: "Web Development",
    readTime: "14 min",
    publishedAt: "3 days ago"
  },
  {
    title: "Digital Marketing Trends for 2025",
    category: "Marketing",
    readTime: "9 min",
    publishedAt: "5 days ago"
  }
];

export default async function BlogPage({ searchParams }: BlogPageProps) {
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
          top: '20%',
          left: '15%',
          width: '100px',
          height: '100px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '50%',
          animation: 'float 6s ease-in-out infinite'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '25%',
          right: '10%',
          width: '120px',
          height: '120px',
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
            <PenTool style={{ width: '1rem', height: '1rem' }} />
            Knowledge Hub
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
            }}>Expert Insights</span>
          </h1>

          <p style={{
            fontSize: '1.2rem',
            color: 'rgba(255,255,255,0.9)',
            maxWidth: '700px',
            margin: '0 auto 2.5rem auto',
            lineHeight: '1.6'
          }}>
            Discover the latest trends, tutorials, and insights from industry experts.
            Stay ahead with actionable knowledge and practical tips.
          </p>

          {/* Search Bar */}
          <div style={{
            maxWidth: '500px',
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
                placeholder="Search articles, topics, authors..."
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
                Search
              </button>
            </div>
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
            {blogStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} style={{
                  padding: '1.5rem',
                  backgroundColor: '#f8fafc',
                  borderRadius: '1rem',
                  border: '1px solid #e2e8f0'
                }}>
                  <Icon style={{
                    width: '2.5rem',
                    height: '2.5rem',
                    margin: '0 auto 1rem auto',
                    color: stat.color
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

      {/* Featured Topics */}
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
              Explore Topics
            </h2>
            <p style={{
              fontSize: '1.1rem',
              color: '#6b7280',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Browse articles by category and discover content tailored to your interests.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}>
            {featuredTopics.map((topic, index) => {
              const Icon = topic.icon;
              return (
                <Link
                  key={index}
                  href={`/blog?category=${encodeURIComponent(topic.name)}`}
                  style={{
                    display: 'block',
                    padding: '2rem',
                    backgroundColor: 'white',
                    borderRadius: '1rem',
                    border: topic.popular ? '2px solid #6366f1' : '1px solid #e2e8f0',
                    textDecoration: 'none',
                    position: 'relative',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {topic.popular && (
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
                      background: `linear-gradient(135deg, ${topic.color.replace('from-', '').replace(' to-', ', ')})`,
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
                        {topic.name}
                      </h3>
                      <p style={{
                        color: '#6b7280',
                        fontSize: '0.9rem',
                        margin: 0
                      }}>
                        {topic.count} articles
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
                    Read Articles
                    <ArrowRight style={{ width: '1rem', height: '1rem', marginLeft: '0.5rem' }} />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Posts */}
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
                Featured Articles
              </h2>
              <p style={{
                color: '#6b7280',
                fontSize: '1.1rem'
              }}>
                Hand-picked articles from our top contributors
              </p>
            </div>
            <Link
              href="/blog/all"
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
              View All Articles
            </Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '2rem'
          }}>
            {trendingPosts.map((post, index) => (
              <article key={index} style={{
                backgroundColor: '#f8fafc',
                borderRadius: '1.5rem',
                overflow: 'hidden',
                border: '1px solid #e2e8f0',
                transition: 'all 0.3s ease',
                position: 'relative'
              }}>
                {post.featured && (
                  <div style={{
                    position: 'absolute',
                    top: '1rem',
                    left: '1rem',
                    backgroundColor: '#f59e0b',
                    color: 'white',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '999px',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    zIndex: 10
                  }}>
                    FEATURED
                  </div>
                )}

                <div style={{
                  width: '100%',
                  height: '200px',
                  backgroundColor: '#e5e7eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#6b7280'
                }}>
                  <BookOpen style={{ width: '3rem', height: '3rem' }} />
                </div>

                <div style={{ padding: '2rem' }}>
                  <div style={{
                    display: 'inline-block',
                    padding: '0.25rem 0.75rem',
                    backgroundColor: '#ddd6fe',
                    color: '#5b21b6',
                    borderRadius: '999px',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    marginBottom: '1rem'
                  }}>
                    {post.category}
                  </div>

                  <h3 style={{
                    fontSize: '1.3rem',
                    fontWeight: '600',
                    color: '#1f2937',
                    marginBottom: '1rem',
                    lineHeight: '1.4'
                  }}>
                    <Link
                      href={`/blog/${post.id}`}
                      style={{
                        color: 'inherit',
                        textDecoration: 'none'
                      }}
                    >
                      {post.title}
                    </Link>
                  </h3>

                  <p style={{
                    color: '#6b7280',
                    lineHeight: '1.6',
                    marginBottom: '1.5rem'
                  }}>
                    {post.excerpt}
                  </p>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.9rem',
                    color: '#6b7280'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <User style={{ width: '1rem', height: '1rem' }} />
                        <span>{post.author}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Clock style={{ width: '1rem', height: '1rem' }} />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Eye style={{ width: '1rem', height: '1rem' }} />
                      <span>{post.views}</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Posts Sidebar */}
      <section style={{
        padding: '4rem 2rem',
        backgroundColor: '#fafafa'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr',
            gap: '4rem',
            alignItems: 'flex-start'
          }}>
            {/* Main Content */}
            <div>
              <h2 style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '2rem'
              }}>
                Latest Articles
              </h2>

              <Suspense fallback={<BlogPostsSkeleton />}>
                <BlogPostsList searchParams={searchParams} />
              </Suspense>
            </div>

            {/* Sidebar */}
            <div style={{
              padding: '2rem',
              backgroundColor: 'white',
              borderRadius: '1.5rem',
              border: '1px solid #e2e8f0',
              position: 'sticky',
              top: '2rem'
            }}>
              <h3 style={{
                fontSize: '1.3rem',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '1.5rem'
              }}>
                Recent Posts
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {recentPosts.map((post, index) => (
                  <div key={index} style={{
                    paddingBottom: '1rem',
                    borderBottom: index < recentPosts.length - 1 ? '1px solid #e5e7eb' : 'none'
                  }}>
                    <h4 style={{
                      fontSize: '0.95rem',
                      fontWeight: '500',
                      color: '#1f2937',
                      marginBottom: '0.5rem',
                      lineHeight: '1.4'
                    }}>
                      <Link
                        href={`/blog/${index + 1}`}
                        style={{
                          color: 'inherit',
                          textDecoration: 'none'
                        }}
                      >
                        {post.title}
                      </Link>
                    </h4>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      fontSize: '0.8rem',
                      color: '#6b7280'
                    }}>
                      <span style={{
                        padding: '0.125rem 0.5rem',
                        backgroundColor: '#f3f4f6',
                        borderRadius: '999px'
                      }}>
                        {post.category}
                      </span>
                      <span>{post.readTime}</span>
                      <span>{post.publishedAt}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid #e5e7eb' }}>
                <h4 style={{
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '1rem'
                }}>
                  Popular Tags
                </h4>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.5rem'
                }}>
                  {['React', 'JavaScript', 'Python', 'Design', 'AI', 'Career', 'Tutorial', 'Tips'].map((tag, index) => (
                    <Link
                      key={index}
                      href={`/blog?tag=${tag}`}
                      style={{
                        display: 'inline-block',
                        padding: '0.25rem 0.75rem',
                        backgroundColor: '#f3f4f6',
                        color: '#374151',
                        fontSize: '0.8rem',
                        borderRadius: '999px',
                        textDecoration: 'none',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
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
            Stay Updated
          </h2>
          <p style={{
            fontSize: '1.1rem',
            color: '#d1d5db',
            marginBottom: '2rem',
            lineHeight: '1.6'
          }}>
            Get the latest articles, tutorials, and industry insights delivered to your inbox weekly.
          </p>

          <div style={{
            display: 'flex',
            gap: '1rem',
            maxWidth: '400px',
            margin: '0 auto',
            flexWrap: 'wrap'
          }}>
            <input
              type="email"
              placeholder="Enter your email"
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
                borderRadius: '0.5rem',
                border: '1px solid #4b5563',
                backgroundColor: 'rgba(255,255,255,0.1)',
                color: 'white',
                fontSize: '1rem',
                minWidth: '200px'
              }}
            />
            <button style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#6366f1',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontWeight: '600',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}>
              Subscribe
            </button>
          </div>

          <p style={{
            fontSize: '0.85rem',
            color: '#9ca3af',
            marginTop: '1rem'
          }}>
            No spam. Unsubscribe anytime.
          </p>
        </div>
      </section>
    </div>
  );
}

function BlogPostsSkeleton() {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '2rem'
    }}>
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} style={{
          padding: '2rem',
          backgroundColor: 'white',
          borderRadius: '1rem',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{
            width: '100%',
            height: '12rem',
            backgroundColor: '#f3f4f6',
            borderRadius: '0.5rem',
            marginBottom: '1rem'
          }}></div>
          <div style={{
            width: '60%',
            height: '1rem',
            backgroundColor: '#f3f4f6',
            borderRadius: '0.25rem',
            marginBottom: '1rem'
          }}></div>
          <div style={{
            width: '100%',
            height: '1.5rem',
            backgroundColor: '#f3f4f6',
            borderRadius: '0.25rem',
            marginBottom: '0.5rem'
          }}></div>
          <div style={{
            width: '80%',
            height: '1rem',
            backgroundColor: '#f3f4f6',
            borderRadius: '0.25rem'
          }}></div>
        </div>
      ))}
    </div>
  );
}

async function BlogPostsList({ searchParams }: { searchParams: BlogPageProps['searchParams'] }) {
  const params = await searchParams;
  const result = await getBlogPosts(
    parseInt(params.page || '1'),
    10,
    params.category,
    params.tag
  );

  if (!result || !result.posts || result.posts.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '3rem',
        color: '#6b7280'
      }}>
        <BookOpen style={{ width: '4rem', height: '4rem', margin: '0 auto 1rem auto', color: '#d1d5db' }} />
        <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
          No articles found
        </h3>
        <p>Try adjusting your search or browse by category.</p>
      </div>
    );
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '2rem'
    }}>
      {result.posts.map((post: any) => (
        <article key={post.id} style={{
          padding: '2rem',
          backgroundColor: 'white',
          borderRadius: '1rem',
          border: '1px solid #e2e8f0',
          transition: 'all 0.3s ease'
        }}>
          <div style={{
            display: 'inline-block',
            padding: '0.25rem 0.75rem',
            backgroundColor: '#ddd6fe',
            color: '#5b21b6',
            borderRadius: '999px',
            fontSize: '0.75rem',
            fontWeight: '600',
            marginBottom: '1rem'
          }}>
            {post.category?.name || 'General'}
          </div>

          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#1f2937',
            marginBottom: '1rem',
            lineHeight: '1.4'
          }}>
            <Link
              href={`/blog/${post.slug || post.id}`}
              style={{
                color: 'inherit',
                textDecoration: 'none'
              }}
            >
              {post.title}
            </Link>
          </h3>

          <p style={{
            color: '#6b7280',
            lineHeight: '1.6',
            marginBottom: '1.5rem'
          }}>
            {post.excerpt || post.content?.substring(0, 150) + '...'}
          </p>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.9rem',
            color: '#6b7280'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar style={{ width: '1rem', height: '1rem' }} />
              <span>{formatDistanceToNow(new Date(post.publishedAt || post.createdAt), { addSuffix: true })}</span>
            </div>
            <Link
              href={`/blog/${post.slug || post.id}`}
              style={{
                color: '#6366f1',
                textDecoration: 'none',
                fontWeight: '500'
              }}
            >
              Read More →
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}