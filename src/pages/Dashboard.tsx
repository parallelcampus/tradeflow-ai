import { 
  TrendingUp, 
  FileText, 
  Users, 
  Calendar,
  ArrowUpRight,
  MessageSquare,
  Store,
  Globe,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';

const statsCards = [
  { title: 'Active Schemes', value: '24', change: '+3 new this month', icon: FileText, trend: 'up' },
  { title: 'Buyer Matches', value: '156', change: '+12 this week', icon: TrendingUp, trend: 'up' },
  { title: 'Consultations', value: '8', change: '2 upcoming', icon: Users, trend: 'neutral' },
  { title: 'Events', value: '5', change: '1 tomorrow', icon: Calendar, trend: 'neutral' },
];

const quickActions = [
  { 
    title: 'AI Assistant', 
    description: 'Get instant answers about schemes, documentation, and compliance', 
    icon: MessageSquare, 
    url: '/dashboard/ai',
    badge: 'AI'
  },
  { 
    title: 'Find Buyers', 
    description: 'Discover and connect with international buyers', 
    icon: Globe, 
    url: '/dashboard/buyers',
    badge: null
  },
  { 
    title: 'Marketplace', 
    description: 'Browse products, RFQs, and trade opportunities', 
    icon: Store, 
    url: '/dashboard/marketplace',
    badge: null
  },
  { 
    title: 'View Schemes', 
    description: 'Explore government subsidies and incentives', 
    icon: FileText, 
    url: '/dashboard/schemes',
    badge: null
  },
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
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-serif font-semibold text-foreground">
          Welcome back, {firstName}
        </h1>
        <p className="text-muted-foreground mt-1">
          Here's an overview of your trade activities and opportunities.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 stagger-children">
        {statsCards.map((stat) => (
          <Card key={stat.title} className="border-border shadow-card hover:shadow-card-hover transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                <stat.icon className="h-4 w-4 text-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold font-serif">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-serif font-medium">Quick Actions</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 stagger-children">
          {quickActions.map((action) => (
            <Link key={action.title} to={action.url}>
              <Card className="border-border shadow-card hover:shadow-card-hover transition-all cursor-pointer group h-full">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <action.icon className="h-5 w-5 text-primary" />
                    </div>
                    {action.badge && (
                      <span className="text-2xs font-medium px-2 py-0.5 rounded-full bg-accent/10 text-accent">
                        {action.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="font-medium text-sm flex items-center gap-1 group-hover:text-primary transition-colors">
                    {action.title}
                    <ArrowUpRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{action.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity & AI Prompt */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card className="border-border shadow-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-serif">Recent Activity</CardTitle>
              <Button variant="ghost" size="sm" className="text-xs text-muted-foreground h-7">
                View all <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div 
                  key={index} 
                  className="flex items-start gap-3 py-2 border-b border-border/50 last:border-0 last:pb-0"
                >
                  <div className="status-dot status-dot-success mt-2" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Assistant Preview */}
        <Card className="border-border shadow-card bg-primary/[0.02]">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                <MessageSquare className="h-4 w-4 text-accent" />
              </div>
              <div>
                <CardTitle className="text-base font-serif">AI Trade Assistant</CardTitle>
                <CardDescription className="text-xs">Get instant answers to your trade questions</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 mb-4">
              <div className="bg-muted/50 rounded-lg p-3 border border-border/50">
                <p className="text-sm text-muted-foreground italic">
                  "What government schemes are available for textile exporters in 2026?"
                </p>
              </div>
              <div className="bg-muted/50 rounded-lg p-3 border border-border/50">
                <p className="text-sm text-muted-foreground italic">
                  "Help me understand documentation for exporting to Vietnam"
                </p>
              </div>
            </div>
            <Button asChild className="w-full" size="sm">
              <Link to="/dashboard/ai">
                Start Conversation <ArrowUpRight className="ml-2 h-3.5 w-3.5" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}