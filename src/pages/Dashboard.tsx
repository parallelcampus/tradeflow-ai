import { 
  TrendingUp, 
  FileText, 
  Users, 
  Calendar,
  ArrowRight,
  MessageSquare,
  Store,
  Globe,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';

const statsCards = [
  { title: 'Active Schemes', value: '24', change: '+3 new this month', icon: FileText, color: 'text-blue-600 bg-blue-50' },
  { title: 'Buyer Matches', value: '156', change: '+12 this week', icon: TrendingUp, color: 'text-green-600 bg-green-50' },
  { title: 'Consultations', value: '8', change: '2 upcoming', icon: Users, color: 'text-purple-600 bg-purple-50' },
  { title: 'Events', value: '5', change: '1 tomorrow', icon: Calendar, color: 'text-orange-600 bg-orange-50' },
];

const quickActions = [
  { 
    title: 'AI Assistant', 
    description: 'Get instant answers about schemes, documentation, and compliance', 
    icon: MessageSquare, 
    url: '/dashboard/ai',
    badge: 'AI Powered'
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
    title: 'Govt Schemes', 
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

const aiSuggestions = [
  'What government schemes are available for textile exporters?',
  'Help me understand documentation for exporting to Vietnam',
  'Compare PLI incentives across sectors',
];

export default function Dashboard() {
  const { user } = useAuth();
  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'there';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">
            Welcome back, {firstName}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Here's an overview of your trade activities and opportunities.
          </p>
        </div>
        <Button asChild size="sm" className="hidden md:flex">
          <Link to="/dashboard/ai">
            <Sparkles className="h-4 w-4 mr-2" />
            Ask AI
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat) => (
          <Card key={stat.title} className="border shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-semibold mt-1">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                </div>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-base font-semibold mb-3">Quick Actions</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <Link key={action.title} to={action.url}>
              <Card className="border shadow-sm hover:shadow-md hover:border-primary/20 transition-all cursor-pointer group h-full">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="w-9 h-9 rounded-lg bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                      <action.icon className="h-4 w-4 text-primary" />
                    </div>
                    {action.badge && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary uppercase tracking-wide">
                        {action.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="font-medium text-sm flex items-center gap-1 group-hover:text-primary transition-colors">
                    {action.title}
                    <ArrowRight className="h-3.5 w-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{action.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity & AI Prompt */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card className="border shadow-sm">
          <CardHeader className="pb-3 px-4 pt-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
              <Button variant="ghost" size="sm" className="text-xs text-muted-foreground h-7 px-2">
                View all <ExternalLink className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="space-y-1">
              {recentActivity.map((activity, index) => (
                <div 
                  key={index} 
                  className="flex items-start gap-3 py-2.5 border-b border-border/50 last:border-0 last:pb-0 hover:bg-muted/30 -mx-2 px-2 rounded-md transition-colors cursor-pointer"
                >
                  <div className="w-2 h-2 rounded-full bg-primary/60 mt-1.5 shrink-0" />
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
        <Card className="border shadow-sm">
          <CardHeader className="pb-3 px-4 pt-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold">AI Trade Assistant</CardTitle>
                <CardDescription className="text-xs">Get instant answers to your trade questions</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="space-y-2 mb-4">
              {aiSuggestions.map((suggestion, index) => (
                <Link 
                  key={index}
                  to="/dashboard/ai"
                  className="block bg-muted/50 hover:bg-muted rounded-lg p-3 border border-border/50 hover:border-primary/20 transition-colors group"
                >
                  <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                    "{suggestion}"
                  </p>
                </Link>
              ))}
            </div>
            <Button asChild className="w-full" size="sm">
              <Link to="/dashboard/ai">
                Start Conversation <ArrowRight className="ml-2 h-3.5 w-3.5" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
