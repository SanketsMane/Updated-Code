"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  ResponsiveContainer,
  Legend
} from "recharts";
import {
  Shield,
  Zap,
  Activity,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Server,
  Database,
  Globe,
  Users,
  Lock,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Eye,
  FileText,
  HardDrive,
  Cpu,
  MemoryStick
} from "lucide-react";

interface PerformanceMetrics {
  responseTime: { endpoint: string; avg: number; max: number; min: number }[];
  throughput: { time: string; requests: number }[];
  errorRate: { endpoint: string; rate: number; total: number }[];
  systemHealth: {
    cpu: number;
    memory: number;
    disk: number;
    uptime: number;
  };
  webVitals: {
    lcp: number;
    fid: number;
    cls: number;
    ttfb: number;
  };
}

interface SecurityMetrics {
  threatsPrevented: number;
  rateLimitHits: number;
  suspiciousActivity: { type: string; count: number; severity: 'low' | 'medium' | 'high' }[];
  authFailures: number;
  csrfAttempts: number;
  ipBlacklist: string[];
  recentIncidents: { 
    time: string; 
    type: string; 
    description: string; 
    severity: 'low' | 'medium' | 'high';
    ip?: string;
  }[];
}

interface SystemStatus {
  overall: 'healthy' | 'degraded' | 'down';
  services: {
    name: string;
    status: 'up' | 'down' | 'degraded';
    responseTime: number;
    uptime: number;
  }[];
  lastUpdate: string;
}

export default function PerformanceSecurityDashboard() {
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics>({
    responseTime: [],
    throughput: [],
    errorRate: [],
    systemHealth: { cpu: 0, memory: 0, disk: 0, uptime: 0 },
    webVitals: { lcp: 0, fid: 0, cls: 0, ttfb: 0 }
  });

  const [securityMetrics, setSecurityMetrics] = useState<SecurityMetrics>({
    threatsPrevented: 0,
    rateLimitHits: 0,
    suspiciousActivity: [],
    authFailures: 0,
    csrfAttempts: 0,
    ipBlacklist: [],
    recentIncidents: []
  });

  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    overall: 'healthy',
    services: [],
    lastUpdate: new Date().toISOString()
  });

  const [isLoading, setIsLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    loadMetrics();
    
    if (autoRefresh) {
      const interval = setInterval(loadMetrics, 30000); // 30 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const loadMetrics = async () => {
    setIsLoading(true);
    try {
      // Simulate loading metrics (replace with actual API calls)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data - replace with actual API calls
      setPerformanceMetrics({
        responseTime: [
          { endpoint: '/api/courses', avg: 150, max: 300, min: 50 },
          { endpoint: '/api/users', avg: 120, max: 250, min: 80 },
          { endpoint: '/api/auth', avg: 200, max: 400, min: 100 },
          { endpoint: '/api/analytics', avg: 300, max: 600, min: 150 }
        ],
        throughput: Array.from({ length: 24 }, (_, i) => ({
          time: `${i}:00`,
          requests: Math.floor(Math.random() * 1000) + 500
        })),
        errorRate: [
          { endpoint: '/api/courses', rate: 0.02, total: 5000 },
          { endpoint: '/api/users', rate: 0.01, total: 3000 },
          { endpoint: '/api/auth', rate: 0.05, total: 2000 }
        ],
        systemHealth: {
          cpu: Math.random() * 80 + 10,
          memory: Math.random() * 70 + 20,
          disk: Math.random() * 60 + 30,
          uptime: 99.8
        },
        webVitals: {
          lcp: Math.random() * 2000 + 1000,
          fid: Math.random() * 100 + 50,
          cls: Math.random() * 0.2 + 0.05,
          ttfb: Math.random() * 500 + 200
        }
      });

      setSecurityMetrics({
        threatsPrevented: 127,
        rateLimitHits: 45,
        suspiciousActivity: [
          { type: 'SQL Injection Attempt', count: 12, severity: 'high' },
          { type: 'Brute Force Login', count: 8, severity: 'medium' },
          { type: 'Suspicious Bot Activity', count: 23, severity: 'low' }
        ],
        authFailures: 34,
        csrfAttempts: 3,
        ipBlacklist: ['192.168.1.100', '10.0.0.5', '172.16.0.10'],
        recentIncidents: [
          {
            time: '2 hours ago',
            type: 'Rate Limit Exceeded',
            description: 'Multiple rapid requests from IP 192.168.1.100',
            severity: 'medium',
            ip: '192.168.1.100'
          },
          {
            time: '4 hours ago', 
            type: 'Failed Authentication',
            description: 'Multiple login attempts with invalid credentials',
            severity: 'low'
          },
          {
            time: '6 hours ago',
            type: 'CSRF Token Validation Failed',
            description: 'Invalid CSRF token in form submission',
            severity: 'medium'
          }
        ]
      });

      setSystemStatus({
        overall: 'healthy',
        services: [
          { name: 'API Gateway', status: 'up', responseTime: 45, uptime: 99.9 },
          { name: 'Database', status: 'up', responseTime: 23, uptime: 99.8 },
          { name: 'Redis Cache', status: 'up', responseTime: 12, uptime: 99.7 },
          { name: 'File Storage', status: 'up', responseTime: 67, uptime: 99.6 },
          { name: 'Video Service', status: 'degraded', responseTime: 156, uptime: 98.5 },
          { name: 'Email Service', status: 'up', responseTime: 89, uptime: 99.4 }
        ],
        lastUpdate: new Date().toISOString()
      });

    } catch (error) {
      console.error('Failed to load metrics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSeverityColor = (severity: 'low' | 'medium' | 'high') => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300';
      case 'low': return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'up':
      case 'healthy':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'degraded':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'down':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">System Monitor</h1>
          <p className="text-muted-foreground">Performance, Security & System Health</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadMetrics}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            variant={autoRefresh ? "default" : "outline"}
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            <Activity className="h-4 w-4 mr-2" />
            Auto Refresh
          </Button>
        </div>
      </div>

      {/* System Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              {getStatusIcon(systemStatus.overall)}
              <div>
                <p className="text-sm font-medium">Overall Status</p>
                <p className="text-lg font-bold capitalize">{systemStatus.overall}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Threats Blocked</p>
                <p className="text-lg font-bold">{securityMetrics.threatsPrevented}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm font-medium">Avg Response Time</p>
                <p className="text-lg font-bold">
                  {Math.round(performanceMetrics.responseTime.reduce((acc, item) => acc + item.avg, 0) / performanceMetrics.responseTime.length || 0)}ms
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-sm font-medium">System Uptime</p>
                <p className="text-lg font-bold">{performanceMetrics.systemHealth.uptime}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard */}
      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Server className="h-4 w-4" />
            System Health
          </TabsTrigger>
          <TabsTrigger value="services" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Services
          </TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Response Time Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Response Time by Endpoint</CardTitle>
                <CardDescription>Average response times across different API endpoints</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={performanceMetrics.responseTime}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="endpoint" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="avg" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Throughput Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Request Throughput</CardTitle>
                <CardDescription>Requests per hour over the last 24 hours</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={performanceMetrics.throughput}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="requests" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Web Vitals */}
          <Card>
            <CardHeader>
              <CardTitle>Core Web Vitals</CardTitle>
              <CardDescription>Key performance metrics for user experience</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <Clock className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                  <p className="text-sm font-medium">LCP (Largest Contentful Paint)</p>
                  <p className="text-2xl font-bold">{Math.round(performanceMetrics.webVitals.lcp)}ms</p>
                  <Badge variant={performanceMetrics.webVitals.lcp < 2500 ? "default" : "destructive"}>
                    {performanceMetrics.webVitals.lcp < 2500 ? "Good" : "Needs Improvement"}
                  </Badge>
                </div>
                
                <div className="text-center">
                  <Zap className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <p className="text-sm font-medium">FID (First Input Delay)</p>
                  <p className="text-2xl font-bold">{Math.round(performanceMetrics.webVitals.fid)}ms</p>
                  <Badge variant={performanceMetrics.webVitals.fid < 100 ? "default" : "destructive"}>
                    {performanceMetrics.webVitals.fid < 100 ? "Good" : "Needs Improvement"}
                  </Badge>
                </div>
                
                <div className="text-center">
                  <Eye className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                  <p className="text-sm font-medium">CLS (Cumulative Layout Shift)</p>
                  <p className="text-2xl font-bold">{performanceMetrics.webVitals.cls.toFixed(3)}</p>
                  <Badge variant={performanceMetrics.webVitals.cls < 0.1 ? "default" : "destructive"}>
                    {performanceMetrics.webVitals.cls < 0.1 ? "Good" : "Needs Improvement"}
                  </Badge>
                </div>
                
                <div className="text-center">
                  <Activity className="h-8 w-8 mx-auto mb-2 text-orange-500" />
                  <p className="text-sm font-medium">TTFB (Time to First Byte)</p>
                  <p className="text-2xl font-bold">{Math.round(performanceMetrics.webVitals.ttfb)}ms</p>
                  <Badge variant={performanceMetrics.webVitals.ttfb < 600 ? "default" : "destructive"}>
                    {performanceMetrics.webVitals.ttfb < 600 ? "Good" : "Needs Improvement"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Security Incidents */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Security Incidents</CardTitle>
                <CardDescription>Latest security events and threats detected</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  <div className="space-y-3">
                    {securityMetrics.recentIncidents.map((incident, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 rounded-lg border">
                        <AlertTriangle className={`h-4 w-4 mt-1 ${
                          incident.severity === 'high' ? 'text-red-500' :
                          incident.severity === 'medium' ? 'text-yellow-500' : 'text-green-500'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-sm">{incident.type}</p>
                            <Badge className={`text-xs ${getSeverityColor(incident.severity)}`}>
                              {incident.severity}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{incident.description}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-xs text-muted-foreground">{incident.time}</p>
                            {incident.ip && (
                              <Badge variant="outline" className="text-xs">
                                IP: {incident.ip}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Threat Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Threat Analysis</CardTitle>
                <CardDescription>Breakdown of security threats by type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {securityMetrics.suspiciousActivity.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div>
                        <p className="font-medium">{activity.type}</p>
                        <p className="text-sm text-muted-foreground">{activity.count} incidents</p>
                      </div>
                      <Badge className={getSeverityColor(activity.severity)}>
                        {activity.severity}
                      </Badge>
                    </div>
                  ))}
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4 text-center">
                  <div>
                    <Lock className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                    <p className="text-sm font-medium">Auth Failures</p>
                    <p className="text-2xl font-bold">{securityMetrics.authFailures}</p>
                  </div>
                  <div>
                    <Shield className="h-6 w-6 mx-auto mb-2 text-green-500" />
                    <p className="text-sm font-medium">Rate Limit Hits</p>
                    <p className="text-2xl font-bold">{securityMetrics.rateLimitHits}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* CPU Usage */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Cpu className="h-5 w-5" />
                  CPU Usage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Current</span>
                    <span className="text-sm font-medium">{Math.round(performanceMetrics.systemHealth.cpu)}%</span>
                  </div>
                  <Progress value={performanceMetrics.systemHealth.cpu} />
                  <p className="text-xs text-muted-foreground">
                    {performanceMetrics.systemHealth.cpu < 70 ? "Normal" : performanceMetrics.systemHealth.cpu < 90 ? "High" : "Critical"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Memory Usage */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MemoryStick className="h-5 w-5" />
                  Memory Usage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Current</span>
                    <span className="text-sm font-medium">{Math.round(performanceMetrics.systemHealth.memory)}%</span>
                  </div>
                  <Progress value={performanceMetrics.systemHealth.memory} />
                  <p className="text-xs text-muted-foreground">
                    {performanceMetrics.systemHealth.memory < 70 ? "Normal" : performanceMetrics.systemHealth.memory < 90 ? "High" : "Critical"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Disk Usage */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <HardDrive className="h-5 w-5" />
                  Disk Usage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Current</span>
                    <span className="text-sm font-medium">{Math.round(performanceMetrics.systemHealth.disk)}%</span>
                  </div>
                  <Progress value={performanceMetrics.systemHealth.disk} />
                  <p className="text-xs text-muted-foreground">
                    {performanceMetrics.systemHealth.disk < 80 ? "Normal" : performanceMetrics.systemHealth.disk < 95 ? "High" : "Critical"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="services" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Service Status</CardTitle>
              <CardDescription>Health and performance of all system services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {systemStatus.services.map((service, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(service.status)}
                      <div>
                        <p className="font-medium">{service.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Response Time: {service.responseTime}ms
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={service.status === 'up' ? 'default' : service.status === 'degraded' ? 'secondary' : 'destructive'}>
                        {service.status.toUpperCase()}
                      </Badge>
                      <p className="text-sm text-muted-foreground mt-1">
                        Uptime: {service.uptime}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}