import { Suspense } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Calendar, Clock, Video, Star, Users, Globe, CheckCircle, Play,
  Zap, Target, Award, MessageSquare, UserCheck, BookOpen,
  TrendingUp, Timer, MapPin, Wifi, Shield, HeartHandshake
} from "lucide-react";
import Link from "next/link";
import { getPublicLiveSessions, LiveSession } from "@/app/data/live-sessions/get-public-live-sessions";

const sessionFeatures = [
  {
    icon: Video,
    title: "HD Video Quality",
    description: "Crystal clear video and audio for the best learning experience"
  },
  {
    icon: MessageSquare,
    title: "Interactive Q&A",
    description: "Ask questions in real-time and get instant feedback from experts"
  },
  {
    icon: Award,
    title: "Certificates",
    description: "Earn completion certificates for attended sessions"
  },
  {
    icon: Users,
    title: "Small Groups",
    description: "Maximum 10 students per session for personalized attention"
  }
];

const sessionTypes = [
  {
    icon: UserCheck,
    title: "1-on-1 Mentoring",
    description: "Private sessions with expert instructors for personalized guidance",
    features: ["Customized curriculum", "Flexible scheduling", "Direct feedback", "Career guidance"],
    price: "From $50/hour",
    popular: true,
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: Users,
    title: "Group Sessions",
    description: "Join interactive group classes with peers from around the world",
    features: ["Collaborative learning", "Group projects", "Peer networking", "Cost effective"],
    price: "From $15/hour",
    popular: false,
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: BookOpen,
    title: "Workshop Series",
    description: "Multi-day intensive workshops on specialized topics",
    features: ["Hands-on projects", "Industry case studies", "Resource materials", "Follow-up support"],
    price: "From $99/workshop",
    popular: true,
    color: "from-green-500 to-emerald-500"
  }
];

const upcomingHighlights = [
  {
    title: "React 18 & Next.js 14 Masterclass",
    instructor: "Sarah Johnson",
    date: "Dec 2, 2025",
    time: "2:00 PM EST",
    duration: "2 hours",
    participants: 8,
    maxParticipants: 10,
    level: "Intermediate",
    price: "$45",
    rating: 4.9
  },
  {
    title: "AI & Machine Learning Fundamentals",
    instructor: "Dr. Michael Chen",
    date: "Dec 3, 2025",
    time: "10:00 AM EST",
    duration: "3 hours",
    participants: 15,
    maxParticipants: 15,
    level: "Beginner",
    price: "$65",
    rating: 5.0
  },
  {
    title: "Advanced Python for Data Science",
    instructor: "Emma Rodriguez",
    date: "Dec 5, 2025",
    time: "6:00 PM EST",
    duration: "2.5 hours",
    participants: 6,
    maxParticipants: 12,
    level: "Advanced",
    price: "$55",
    rating: 4.8
  }
];

const stats = [
  { icon: Video, label: "Live Sessions Completed", value: "12,000+", color: "#10b981" },
  { icon: Users, label: "Active Instructors", value: "200+", color: "#3b82f6" },
  { icon: Globe, label: "Students Worldwide", value: "25,000+", color: "#8b5cf6" },
  { icon: Star, label: "Average Rating", value: "4.9/5", color: "#f59e0b" }
];

export default function LiveSessionsPage() {
  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', backgroundColor: '#fafafa', minHeight: '100vh' }}>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        padding: '4rem 2rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Animated Elements */}
        <div style={{
          position: 'absolute',
          top: '15%',
          left: '8%',
          width: '120px',
          height: '120px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '50%',
          animation: 'float 7s ease-in-out infinite'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '15%',
          right: '12%',
          width: '80px',
          height: '80px',
          background: 'rgba(255,255,255,0.08)',
          borderRadius: '50%',
          animation: 'float 5s ease-in-out infinite reverse'
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
            <Video style={{ width: '1rem', height: '1rem' }} />
            Live Learning Sessions
          </div>

          <h1 style={{
            fontSize: 'clamp(2.5rem, 8vw, 4rem)',
            fontWeight: '800',
            color: 'white',
            marginBottom: '1rem',
            lineHeight: '1.1'
          }}>
            Learn Live with
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>Expert Instructors</span>
          </h1>

          <p style={{
            fontSize: '1.2rem',
            color: 'rgba(255,255,255,0.9)',
            maxWidth: '700px',
            margin: '0 auto 2.5rem auto',
            lineHeight: '1.6'
          }}>
            Join interactive live sessions, get personalized mentoring, and accelerate your learning 
            with real-time feedback from industry experts.
          </p>

          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <Link
              href="#book-session"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '1rem 2rem',
                backgroundColor: 'white',
                color: '#059669',
                borderRadius: '50px',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '1.1rem',
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                transition: 'all 0.3s ease'
              }}
            >
              Book a Session
              <Calendar style={{ marginLeft: '0.5rem', width: '1.2rem', height: '1.2rem' }} />
            </Link>
            
            <Link
              href="#browse-sessions"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '1rem 2rem',
                backgroundColor: 'rgba(255,255,255,0.1)',
                color: 'white',
                border: '2px solid rgba(255,255,255,0.3)',
                borderRadius: '50px',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '1.1rem',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease'
              }}
            >
              <Play style={{ marginRight: '0.5rem', width: '1rem', height: '1rem' }} />
              Browse Sessions
            </Link>
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
            {stats.map((stat, index) => {
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

      {/* Session Types */}
      <section style={{
        padding: '4rem 2rem',
        backgroundColor: '#fafafa'
      }} id="session-types">
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{
              fontSize: 'clamp(2rem, 5vw, 2.5rem)',
              fontWeight: 'bold',
              color: '#1f2937',
              marginBottom: '1rem'
            }}>
              Choose Your Learning Style
            </h2>
            <p style={{
              fontSize: '1.1rem',
              color: '#6b7280',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Whether you prefer personalized attention or collaborative learning, we have the perfect session type for you.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '2rem'
          }}>
            {sessionTypes.map((type, index) => {
              const Icon = type.icon;
              return (
                <div key={index} style={{
                  padding: '2.5rem',
                  backgroundColor: 'white',
                  borderRadius: '1.5rem',
                  border: type.popular ? '2px solid #10b981' : '1px solid #e2e8f0',
                  position: 'relative',
                  boxShadow: type.popular ? '0 10px 30px rgba(16, 185, 129, 0.2)' : '0 4px 15px rgba(0,0,0,0.08)',
                  transition: 'all 0.3s ease'
                }}>
                  {type.popular && (
                    <div style={{
                      position: 'absolute',
                      top: '-0.75rem',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      backgroundColor: '#10b981',
                      color: 'white',
                      padding: '0.5rem 1rem',
                      borderRadius: '999px',
                      fontSize: '0.8rem',
                      fontWeight: '600'
                    }}>
                      MOST POPULAR
                    </div>
                  )}

                  <div style={{
                    width: '4rem',
                    height: '4rem',
                    background: `linear-gradient(135deg, ${type.color})`,
                    borderRadius: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.5rem'
                  }}>
                    <Icon style={{ width: '2rem', height: '2rem', color: 'white' }} />
                  </div>

                  <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: '600',
                    color: '#1f2937',
                    marginBottom: '1rem'
                  }}>
                    {type.title}
                  </h3>

                  <p style={{
                    color: '#6b7280',
                    lineHeight: '1.6',
                    marginBottom: '1.5rem'
                  }}>
                    {type.description}
                  </p>

                  <ul style={{
                    listStyle: 'none',
                    padding: 0,
                    marginBottom: '2rem'
                  }}>
                    {type.features.map((feature, featureIndex) => (
                      <li key={featureIndex} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        marginBottom: '0.75rem',
                        color: '#374151'
                      }}>
                        <CheckCircle style={{ 
                          width: '1rem', 
                          height: '1rem', 
                          color: '#10b981',
                          flexShrink: 0
                        }} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1.5rem'
                  }}>
                    <span style={{
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      color: '#1f2937'
                    }}>
                      {type.price}
                    </span>
                  </div>

                  <Link
                    href="/register"
                    style={{
                      display: 'block',
                      width: '100%',
                      padding: '1rem',
                      textAlign: 'center',
                      backgroundColor: type.popular ? '#10b981' : 'transparent',
                      color: type.popular ? 'white' : '#10b981',
                      border: '2px solid #10b981',
                      borderRadius: '0.75rem',
                      textDecoration: 'none',
                      fontWeight: '600',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Get Started
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Sessions */}
      <section style={{
        padding: '4rem 2rem',
        backgroundColor: 'white'
      }} id="browse-sessions">
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
                Upcoming Featured Sessions
              </h2>
              <p style={{
                color: '#6b7280',
                fontSize: '1.1rem'
              }}>
                Join these highly-rated sessions from top instructors
              </p>
            </div>
            <Link
              href="/live-sessions/all"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '0.75rem 1.5rem',
                backgroundColor: '#10b981',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '0.75rem',
                fontWeight: '600'
              }}
            >
              View All Sessions
            </Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '2rem'
          }}>
            {upcomingHighlights.map((session, index) => (
              <div key={index} style={{
                padding: '2rem',
                backgroundColor: '#f8fafc',
                borderRadius: '1.5rem',
                border: '1px solid #e2e8f0',
                transition: 'all 0.3s ease'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '1rem'
                }}>
                  <div style={{
                    display: 'inline-block',
                    padding: '0.25rem 0.75rem',
                    backgroundColor: session.level === 'Beginner' ? '#dcfce7' : session.level === 'Intermediate' ? '#fef3c7' : '#fce7f3',
                    color: session.level === 'Beginner' ? '#166534' : session.level === 'Intermediate' ? '#92400e' : '#be185d',
                    borderRadius: '999px',
                    fontSize: '0.75rem',
                    fontWeight: '600'
                  }}>
                    {session.level}
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    fontSize: '0.9rem',
                    color: '#6b7280'
                  }}>
                    <Star style={{ width: '1rem', height: '1rem', color: '#fbbf24', fill: '#fbbf24' }} />
                    {session.rating}
                  </div>
                </div>

                <h3 style={{
                  fontSize: '1.3rem',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '1rem',
                  lineHeight: '1.4'
                }}>
                  {session.title}
                </h3>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '1rem',
                  color: '#6b7280',
                  fontSize: '0.9rem'
                }}>
                  <UserCheck style={{ width: '1rem', height: '1rem' }} />
                  <span>by {session.instructor}</span>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1rem',
                  marginBottom: '1.5rem',
                  fontSize: '0.9rem',
                  color: '#6b7280'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Calendar style={{ width: '1rem', height: '1rem' }} />
                    <span>{session.date}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Clock style={{ width: '1rem', height: '1rem' }} />
                    <span>{session.time}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Timer style={{ width: '1rem', height: '1rem' }} />
                    <span>{session.duration}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Users style={{ width: '1rem', height: '1rem' }} />
                    <span>{session.participants}/{session.maxParticipants} spots</span>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: '#10b981'
                  }}>
                    {session.price}
                  </div>
                  <Link
                    href={`/live-sessions/${index + 1}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '0.75rem 1.5rem',
                      backgroundColor: session.participants < session.maxParticipants ? '#10b981' : '#9ca3af',
                      color: 'white',
                      textDecoration: 'none',
                      borderRadius: '0.75rem',
                      fontWeight: '600',
                      fontSize: '0.9rem'
                    }}
                  >
                    {session.participants < session.maxParticipants ? 'Book Now' : 'Full'}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
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
              Why Choose Live Sessions?
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem'
          }}>
            {sessionFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} style={{
                  padding: '2rem',
                  backgroundColor: 'white',
                  borderRadius: '1rem',
                  textAlign: 'center',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{
                    width: '3rem',
                    height: '3rem',
                    backgroundColor: '#10b981',
                    borderRadius: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1rem auto'
                  }}>
                    <Icon style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} />
                  </div>
                  <h3 style={{
                    fontSize: '1.2rem',
                    fontWeight: '600',
                    color: '#1f2937',
                    marginBottom: '0.5rem'
                  }}>
                    {feature.title}
                  </h3>
                  <p style={{
                    color: '#6b7280',
                    fontSize: '0.9rem'
                  }}>
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: '4rem 2rem',
        background: 'linear-gradient(135deg, #1f2937, #374151)',
        textAlign: 'center'
      }} id="book-session">
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 6vw, 3rem)',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '1rem'
          }}>
            Ready to Start Learning Live?
          </h2>
          <p style={{
            fontSize: '1.2rem',
            color: '#d1d5db',
            marginBottom: '2rem',
            lineHeight: '1.6'
          }}>
            Book your first live session today and experience personalized, interactive learning like never before.
          </p>
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <Link
              href="/register"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '1rem 2rem',
                backgroundColor: '#10b981',
                color: 'white',
                borderRadius: '50px',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '1.1rem',
                boxShadow: '0 10px 30px rgba(16, 185, 129, 0.3)'
              }}
            >
              Book Your Session
              <Calendar style={{ marginLeft: '0.5rem', width: '1.2rem', height: '1.2rem' }} />
            </Link>
          </div>
        </div>
      </section>

      {/* Live Sessions List */}
      <section style={{ padding: '2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Suspense fallback={<div>Loading sessions...</div>}>
            <LiveSessionsList />
          </Suspense>
        </div>
      </section>
    </div>
  );
}

async function LiveSessionsList() {
  const sessions = await getPublicLiveSessions();
  
  if (sessions.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
        <Video style={{ width: '4rem', height: '4rem', margin: '0 auto 1rem auto', color: '#d1d5db' }} />
        <h3>No live sessions available at the moment</h3>
        <p>Check back soon for upcoming sessions!</p>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem', textAlign: 'center' }}>
        All Available Sessions
      </h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem'
      }}>
        {sessions.map((session: LiveSession) => (
          <div key={session.id} style={{
            padding: '1.5rem',
            backgroundColor: 'white',
            borderRadius: '1rem',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '1rem' }}>
              {session.title}
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#6b7280' }}>
              <Calendar style={{ width: '1rem', height: '1rem' }} />
              <span>{new Date(session.scheduledAt).toLocaleDateString()}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontSize: '0.9rem', color: '#6b7280' }}>
              <Clock style={{ width: '1rem', height: '1rem' }} />
              <span>{new Date(session.scheduledAt).toLocaleTimeString()}</span>
            </div>
            <Link
              href={`/live-sessions/${session.id}`}
              style={{
                display: 'inline-block',
                padding: '0.5rem 1rem',
                backgroundColor: '#10b981',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '0.5rem',
                fontSize: '0.9rem',
                fontWeight: '500'
              }}
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}