import { 
  TrendingUp, 
  FileText, 
  Users, 
  Calendar,
  ArrowUpRight,
  MessageSquare,
  Store,
  Globe
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';

const statsCards = [
  { title: 'Active Schemes', value: '24', change: '+3 new', icon: FileText, color: 'text-primary' },
  { title: 'Buyer Matches', value: '156', change: '+12 this week', icon: TrendingUp, color: 'text-accent' },
  { title: 'Consultations', value: '8', change: '2 upcoming', icon: Users, color: 'text-secondary' },
  { title: 'Events', value: '5', change: '1 tomorrow', icon: Calendar, color: 'text-primary' },
];

const quickActions = [
  { title: 'AI Assistant', description: 'Ask questions about trade & schemes', icon: MessageSquare, url: '/dashboard/ai', color: 'bg-primary' },
  { title: 'Find Buyers', description: 'Discover international buyers', icon: Globe, url: '/dashboard/buyers', color: 'bg-accent' },
  { title: 'Marketplace', description: 'Browse products & RFQs', icon: Store, url: '/dashboard/marketplace', color: 'bg-secondary' },
  { title: 'View Schemes', description: 'Explore govt subsidies', icon: FileText, url: '/dashboard/schemes', color: 'bg-primary' },
];

const recentActivity = [
  { title: 'New scheme alert: PLI for Electronics', time: '2 hours ago', type: 'scheme' },
  { title: 'Buyer inquiry from Vietnam', time: '5 hours ago', type: 'buyer' },
  { title: 'Consultation with Expert Raj Kumar', time: 'Yesterday', type: 'consultation' },
  { title: 'Registered for Export Summit 2026', time: '2 days ago', type: 'event' },
];

export default function Dashboard() {
  const { user } = useAuth();
  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || 'there';

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">
          Welcome back, {firstName}!
        </h1>
        <p className="text-muted-foreground mt-1">
          Here's what's happening with your trade activities today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat) => (
          <Card key={stat.title} className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <Link key={action.title} to={action.url}>
              <Card className="border-border/50 hover:border-primary/50 hover:shadow-lg transition-all cursor-pointer group h-full">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center mb-4`}>
                    <action.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold flex items-center gap-2">
                    {action.title}
                    <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">{action.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity & AI Prompt */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest trade updates and alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-4 pb-4 border-b border-border/50 last:border-0 last:pb-0">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                  <div>
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Assistant Preview */}
        <Card className="border-border/50 bg-gradient-to-br from-primary/5 to-accent/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              AI Trade Assistant
            </CardTitle>
            <CardDescription>Get instant answers to your trade questions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground italic">
                  "What government schemes are available for textile exporters in 2026?"
                </p>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground italic">
                  "Help me understand the documentation required for exporting to Vietnam"
                </p>
              </div>
              <Button asChild className="w-full">
                <Link to="/dashboard/ai">
                  Start Conversation <ArrowUpRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
