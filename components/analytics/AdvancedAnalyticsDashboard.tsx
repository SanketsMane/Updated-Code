"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";
import {
  TrendingUp,
  TrendingDown,
  Users,
  BookOpen,
  Award,
  Clock,
  Eye,
  Play,
  MessageSquare,
  Star,
  Target,
  Activity,
  Calendar as CalendarIcon,
  Download,
  Filter,
  RefreshCw,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  Activity as ActivityIcon,
  DollarSign,
  UserCheck,
  GraduationCap,
  Video,
  FileText,
  CheckCircle,
  AlertCircle
} from "lucide-react";

interface AnalyticsData {
  overview: {
    totalStudents: number;
    totalCourses: number;
    totalRevenue: number;
    averageCompletion: number;
    studentGrowth: number;
    courseGrowth: number;
    revenueGrowth: number;
    completionGrowth: number;
  };
  enrollmentTrends: {
    date: string;
    enrollments: number;
    revenue: number;
  }[];
  coursePerformance: {
    id: string;
    title: string;
    enrollments: number;
    completionRate: number;
    averageRating: number;
    revenue: number;
    activeStudents: number;
    totalLessons: number;
    averageProgress: number;
  }[];
  studentActivity: {
    date: string;
    activeUsers: number;
    newRegistrations: number;
    courseCompletions: number;
    watchTime: number;
  }[];
  engagementMetrics: {
    totalWatchTime: number;
    averageSessionDuration: number;
    bounceRate: number;
    returnRate: number;
    forumPosts: number;
    quizAttempts: number;
    assignmentSubmissions: number;
  };
  revenueBreakdown: {
    course: string;
    revenue: number;
    enrollments: number;
  }[];
  topPerformers: {
    students: {
      id: string;
      name: string;
      email: string;
      coursesCompleted: number;
      totalWatchTime: number;
      averageScore: number;
    }[];
    instructors: {
      id: string;
      name: string;
      email: string;
      totalCourses: number;
      totalStudents: number;
      averageRating: number;
      totalRevenue: number;
    }[];
  };
  geographicData: {
    country: string;
    students: number;
    revenue: number;
  }[];
}

type DateRange = 'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom';

export default function AdvancedAnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange>('month');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [customDateFrom, setCustomDateFrom] = useState<Date>();
  const [customDateTo, setCustomDateTo] = useState<Date>();
  const [activeView, setActiveView] = useState('overview');

  // Load analytics data
  useEffect(() => {
    loadAnalytics();
  }, [dateRange, customDateFrom, customDateTo]);

  const loadAnalytics = async () => {
    try {
      setIsLoading(true);
      
      const params = new URLSearchParams();
      params.append('range', dateRange);
      
      if (dateRange === 'custom' && customDateFrom && customDateTo) {
        params.append('from', customDateFrom.toISOString());
        params.append('to', customDateTo.toISOString());
      }

      const response = await fetch(`/api/analytics?${params}`);
      if (!response.ok) throw new Error('Failed to load analytics');
      
      const analyticsData = await response.json();
      setData(analyticsData);
    } catch (error) {
      console.error('Error loading analytics:', error);
      // Mock data for demo
      setData(generateMockData());
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockData = (): AnalyticsData => {
    const dates = Array.from({ length: 30 }, (_, i) => 
      format(subDays(new Date(), 29 - i), 'yyyy-MM-dd')
    );

    return {
      overview: {
        totalStudents: 12547,
        totalCourses: 234,
        totalRevenue: 458920,
        averageCompletion: 74.5,
        studentGrowth: 12.3,
        courseGrowth: 8.7,
        revenueGrowth: 24.1,
        completionGrowth: -2.4
      },
      enrollmentTrends: dates.map(date => ({
        date,
        enrollments: Math.floor(Math.random() * 100) + 50,
        revenue: Math.floor(Math.random() * 5000) + 2000
      })),
      coursePerformance: [
        {
          id: '1',
          title: 'React Complete Guide',
          enrollments: 1247,
          completionRate: 85.2,
          averageRating: 4.8,
          revenue: 62350,
          activeStudents: 892,
          totalLessons: 45,
          averageProgress: 67.3
        },
        {
          id: '2',
          title: 'Node.js Masterclass',
          enrollments: 987,
          completionRate: 78.9,
          averageRating: 4.6,
          revenue: 49350,
          activeStudents: 654,
          totalLessons: 38,
          averageProgress: 59.2
        },
        {
          id: '3',
          title: 'Python for Data Science',
          enrollments: 1456,
          completionRate: 71.4,
          averageRating: 4.7,
          revenue: 72800,
          activeStudents: 1032,
          totalLessons: 52,
          averageProgress: 45.8
        }
      ],
      studentActivity: dates.map(date => ({
        date,
        activeUsers: Math.floor(Math.random() * 500) + 200,
        newRegistrations: Math.floor(Math.random() * 50) + 10,
        courseCompletions: Math.floor(Math.random() * 20) + 5,
        watchTime: Math.floor(Math.random() * 1000) + 500
      })),
      engagementMetrics: {
        totalWatchTime: 145680,
        averageSessionDuration: 42.5,
        bounceRate: 24.7,
        returnRate: 68.3,
        forumPosts: 2341,
        quizAttempts: 5678,
        assignmentSubmissions: 1234
      },
      revenueBreakdown: [
        { course: 'React Complete Guide', revenue: 62350, enrollments: 1247 },
        { course: 'Python for Data Science', revenue: 72800, enrollments: 1456 },
        { course: 'Node.js Masterclass', revenue: 49350, enrollments: 987 },
        { course: 'Vue.js Fundamentals', revenue: 38200, enrollments: 764 },
        { course: 'Angular Advanced', revenue: 45600, enrollments: 912 }
      ],
      topPerformers: {
        students: [
          {
            id: '1',
            name: 'Alice Johnson',
            email: 'alice@example.com',
            coursesCompleted: 12,
            totalWatchTime: 1250,
            averageScore: 94.2
          },
          {
            id: '2',
            name: 'Bob Smith',
            email: 'bob@example.com',
            coursesCompleted: 8,
            totalWatchTime: 890,
            averageScore: 91.7
          }
        ],
        instructors: [
          {
            id: '1',
            name: 'Dr. Sarah Wilson',
            email: 'sarah@example.com',
            totalCourses: 15,
            totalStudents: 4562,
            averageRating: 4.9,
            totalRevenue: 228100
          }
        ]
      },
      geographicData: [
        { country: 'United States', students: 4521, revenue: 226050 },
        { country: 'United Kingdom', students: 2103, revenue: 105150 },
        { country: 'Canada', students: 1876, revenue: 93800 },
        { country: 'Australia', students: 1234, revenue: 61700 },
        { country: 'Germany', students: 987, revenue: 49350 }
      ]
    };
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? TrendingUp : TrendingDown;
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
          <p className="text-gray-600">Comprehensive insights into your learning platform</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Select value={dateRange} onValueChange={(value: DateRange) => setDateRange(value)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
          
          {dateRange === 'custom' && (
            <div className="flex items-center space-x-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-32">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    From
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={customDateFrom}
                    onSelect={setCustomDateFrom}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-32">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    To
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={customDateTo}
                    onSelect={setCustomDateTo}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}
          
          <Button variant="outline" onClick={loadAnalytics}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Tabs value={activeView} onValueChange={setActiveView} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Students</p>
                    <p className="text-2xl font-bold">{formatNumber(data.overview.totalStudents)}</p>
                    <div className={`flex items-center mt-1 ${getGrowthColor(data.overview.studentGrowth)}`}>
                      {(() => {
                        const GrowthIcon = getGrowthIcon(data.overview.studentGrowth);
                        return <GrowthIcon className="h-3 w-3 mr-1" />;
                      })()}
                      <span className="text-xs font-medium">
                        {Math.abs(data.overview.studentGrowth)}% vs last period
                      </span>
                    </div>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Courses</p>
                    <p className="text-2xl font-bold">{formatNumber(data.overview.totalCourses)}</p>
                    <div className={`flex items-center mt-1 ${getGrowthColor(data.overview.courseGrowth)}`}>
                      {(() => {
                        const GrowthIcon = getGrowthIcon(data.overview.courseGrowth);
                        return <GrowthIcon className="h-3 w-3 mr-1" />;
                      })()}
                      <span className="text-xs font-medium">
                        {Math.abs(data.overview.courseGrowth)}% vs last period
                      </span>
                    </div>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <BookOpen className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold">{formatCurrency(data.overview.totalRevenue)}</p>
                    <div className={`flex items-center mt-1 ${getGrowthColor(data.overview.revenueGrowth)}`}>
                      {(() => {
                        const GrowthIcon = getGrowthIcon(data.overview.revenueGrowth);
                        return <GrowthIcon className="h-3 w-3 mr-1" />;
                      })()}
                      <span className="text-xs font-medium">
                        {Math.abs(data.overview.revenueGrowth)}% vs last period
                      </span>
                    </div>
                  </div>
                  <div className="bg-yellow-100 p-3 rounded-full">
                    <DollarSign className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg. Completion Rate</p>
                    <p className="text-2xl font-bold">{data.overview.averageCompletion}%</p>
                    <div className={`flex items-center mt-1 ${getGrowthColor(data.overview.completionGrowth)}`}>
                      {(() => {
                        const GrowthIcon = getGrowthIcon(data.overview.completionGrowth);
                        return <GrowthIcon className="h-3 w-3 mr-1" />;
                      })()}
                      <span className="text-xs font-medium">
                        {Math.abs(data.overview.completionGrowth)}% vs last period
                      </span>
                    </div>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-full">
                    <Award className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Enrollment Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={data.enrollmentTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(date) => format(new Date(date), 'MMM d')}
                    />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(date) => format(new Date(date as string), 'MMM d, yyyy')}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="enrollments" 
                      stroke="#8884d8" 
                      fill="#8884d8" 
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={data.revenueBreakdown}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="revenue"
                      label={({ course, revenue }) => `${course}: ${formatCurrency(revenue)}`}
                    >
                      {data.revenueBreakdown.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Student Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Student Activity Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={data.studentActivity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(date) => format(new Date(date), 'MMM d')}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(date) => format(new Date(date as string), 'MMM d, yyyy')}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="activeUsers" 
                    stroke="#8884d8" 
                    name="Active Users"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="newRegistrations" 
                    stroke="#82ca9d" 
                    name="New Registrations"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="courseCompletions" 
                    stroke="#ffc658" 
                    name="Course Completions"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="courses" className="space-y-6">
          {/* Course Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Course Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.coursePerformance.map((course, index) => (
                  <div key={course.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-semibold">{course.title}</h3>
                      <div className="flex items-center space-x-6 mt-2 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>{formatNumber(course.enrollments)} enrollments</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <CheckCircle className="h-4 w-4" />
                          <span>{course.completionRate}% completion</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4" />
                          <span>{course.averageRating}/5 rating</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <DollarSign className="h-4 w-4" />
                          <span>{formatCurrency(course.revenue)} revenue</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{course.activeStudents} active</div>
                      <div className="text-xs text-gray-500">{course.averageProgress}% avg progress</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-6">
          {/* Engagement Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Watch Time</p>
                    <p className="text-2xl font-bold">{formatNumber(data.engagementMetrics.totalWatchTime)}h</p>
                  </div>
                  <Clock className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg Session Duration</p>
                    <p className="text-2xl font-bold">{data.engagementMetrics.averageSessionDuration}m</p>
                  </div>
                  <Activity className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Return Rate</p>
                    <p className="text-2xl font-bold">{data.engagementMetrics.returnRate}%</p>
                  </div>
                  <UserCheck className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Forum Posts</p>
                    <p className="text-2xl font-bold">{formatNumber(data.engagementMetrics.forumPosts)}</p>
                  </div>
                  <MessageSquare className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          {/* Top Performers */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Students</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.topPerformers.students.map((student, index) => (
                    <div key={student.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarFallback>{student.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{student.name}</div>
                          <div className="text-sm text-gray-500">{student.email}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{student.coursesCompleted} courses</div>
                        <div className="text-xs text-gray-500">{student.averageScore}% avg score</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Instructors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.topPerformers.instructors.map((instructor, index) => (
                    <div key={instructor.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarFallback>{instructor.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{instructor.name}</div>
                          <div className="text-sm text-gray-500">{instructor.email}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{formatCurrency(instructor.totalRevenue)}</div>
                        <div className="text-xs text-gray-500">{instructor.averageRating}★ rating</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}