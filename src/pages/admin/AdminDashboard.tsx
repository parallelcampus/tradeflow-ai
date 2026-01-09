import { 
  Users, 
  GraduationCap, 
  Globe, 
  FileText, 
  Calendar, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  Activity
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';

const stats = [
  {
    title: 'Total Users',
    value: '2,847',
    change: '+12.5%',
    trend: 'up',
    icon: Users,
    color: 'text-blue-600',
    bgColor: 'bg-blue-500/10',
  },
  {
    title: 'Training Programs',
    value: '24',
    change: '+3',
    trend: 'up',
    icon: GraduationCap,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-500/10',
  },
  {
    title: 'Active Delegations',
    value: '6',
    change: '+2',
    trend: 'up',
    icon: Globe,
    color: 'text-purple-600',
    bgColor: 'bg-purple-500/10',
  },
  {
    title: 'Government Schemes',
    value: '15',
    change: 'ERPNext',
    trend: 'neutral',
    icon: FileText,
    color: 'text-amber-600',
    bgColor: 'bg-amber-500/10',
  },
];

const recentActivity = [
  { action: 'New user registered', user: 'Priya Sharma', time: '5 min ago', type: 'user' },
  { action: 'Training program updated', user: 'Admin', time: '1 hour ago', type: 'training' },
  { action: 'Delegation application received', user: 'Rajesh Kumar', time: '2 hours ago', type: 'delegation' },
  { action: 'Scheme data synced from ERPNext', user: 'System', time: '3 hours ago', type: 'scheme' },
  { action: 'New consultant approved', user: 'Dr. Amit Patel', time: '5 hours ago', type: 'consultant' },
];

const quickActions = [
  { title: 'Add Training Program', href: '/admin/training', icon: GraduationCap },
  { title: 'Create Delegation', href: '/admin/delegations', icon: Globe },
  { title: 'Add Event', href: '/admin/events', icon: Calendar },
  { title: 'Sync Schemes', href: '/admin/schemes', icon: FileText },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <Badge 
                  variant={stat.trend === 'up' ? 'default' : 'secondary'}
                  className={`text-xs ${stat.trend === 'up' ? 'bg-emerald-500/20 text-emerald-600' : ''}`}
                >
                  {stat.trend === 'up' && <ArrowUpRight className="h-3 w-3 mr-1" />}
                  {stat.change}
                </Badge>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Quick Actions */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            {quickActions.map((action) => (
              <Button 
                key={action.title} 
                variant="outline" 
                className="w-full justify-start gap-3"
                asChild
              >
                <Link to={action.href}>
                  <action.icon className="h-4 w-4" />
                  {action.title}
                </Link>
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-border/50 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest actions in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center gap-4 pb-4 border-b border-border/50 last:border-0 last:pb-0">
                  <div className={`p-2 rounded-full ${
                    activity.type === 'user' ? 'bg-blue-500/10' :
                    activity.type === 'training' ? 'bg-emerald-500/10' :
                    activity.type === 'delegation' ? 'bg-purple-500/10' :
                    activity.type === 'scheme' ? 'bg-amber-500/10' :
                    'bg-muted'
                  }`}>
                    {activity.type === 'user' && <Users className="h-4 w-4 text-blue-600" />}
                    {activity.type === 'training' && <GraduationCap className="h-4 w-4 text-emerald-600" />}
                    {activity.type === 'delegation' && <Globe className="h-4 w-4 text-purple-600" />}
                    {activity.type === 'scheme' && <FileText className="h-4 w-4 text-amber-600" />}
                    {activity.type === 'consultant' && <Users className="h-4 w-4 text-primary" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.user}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Overview */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Content Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Training Programs</span>
                <span className="text-sm font-medium">24 active</span>
              </div>
              <Progress value={80} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Delegations</span>
                <span className="text-sm font-medium">6 upcoming</span>
              </div>
              <Progress value={60} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Events & Exhibitions</span>
                <span className="text-sm font-medium">8 scheduled</span>
              </div>
              <Progress value={45} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Government Schemes</span>
                <span className="text-sm font-medium">15 from ERPNext</span>
              </div>
              <Progress value={100} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              System Health
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-500/10">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-sm">Database</span>
              </div>
              <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-600">Healthy</Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-500/10">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-sm">ERPNext Connection</span>
              </div>
              <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-600">Connected</Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-500/10">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-sm">API Services</span>
              </div>
              <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-600">Online</Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-amber-500/10">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-sm">Email Service</span>
              </div>
              <Badge variant="secondary" className="bg-amber-500/20 text-amber-600">Configure</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
