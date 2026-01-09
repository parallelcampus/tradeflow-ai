import { useState } from 'react';
import { 
  Users, 
  CreditCard, 
  RefreshCw, 
  ExternalLink, 
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Building2,
  Mail,
  Phone,
  Calendar
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

// Mock data - In production, this would come from ERPNext API
const mockUsers = [
  {
    id: '1',
    email: 'priya.sharma@exportco.in',
    full_name: 'Priya Sharma',
    company: 'Export Co. Pvt. Ltd.',
    phone: '+91 98765 43210',
    plan: 'Premium',
    status: 'active',
    role: 'exporter',
    subscription_start: '2024-01-15',
    subscription_end: '2025-01-15',
    last_login: '2024-01-08',
  },
  {
    id: '2',
    email: 'rajesh.kumar@tradelink.com',
    full_name: 'Rajesh Kumar',
    company: 'TradeLink Solutions',
    phone: '+91 87654 32109',
    plan: 'Basic',
    status: 'active',
    role: 'importer',
    subscription_start: '2024-06-01',
    subscription_end: '2024-12-01',
    last_login: '2024-01-07',
  },
  {
    id: '3',
    email: 'amit.patel@globalexports.in',
    full_name: 'Dr. Amit Patel',
    company: 'Global Exports India',
    phone: '+91 76543 21098',
    plan: 'Enterprise',
    status: 'active',
    role: 'consultant',
    subscription_start: '2023-12-01',
    subscription_end: '2024-12-01',
    last_login: '2024-01-08',
  },
  {
    id: '4',
    email: 'neha.gupta@textiles.com',
    full_name: 'Neha Gupta',
    company: 'Gupta Textiles',
    phone: '+91 65432 10987',
    plan: 'Premium',
    status: 'expired',
    role: 'exporter',
    subscription_start: '2023-06-01',
    subscription_end: '2024-01-01',
    last_login: '2023-12-28',
  },
  {
    id: '5',
    email: 'vikram.singh@imports.in',
    full_name: 'Vikram Singh',
    company: 'Singh Imports',
    phone: '+91 54321 09876',
    plan: 'Basic',
    status: 'pending',
    role: 'buyer',
    subscription_start: '2024-01-10',
    subscription_end: '2025-01-10',
    last_login: null,
  },
];

const mockPlans = [
  {
    id: '1',
    name: 'Basic',
    price: '₹2,999/month',
    features: ['5 Buyer Matches/month', 'Basic AI Assistant', 'Email Support'],
    active_users: 156,
    color: 'bg-slate-500',
  },
  {
    id: '2',
    name: 'Premium',
    price: '₹7,999/month',
    features: ['25 Buyer Matches/month', 'Advanced AI Assistant', 'Priority Support', 'Delegation Access'],
    active_users: 89,
    color: 'bg-blue-500',
  },
  {
    id: '3',
    name: 'Enterprise',
    price: '₹19,999/month',
    features: ['Unlimited Buyer Matches', 'Full AI Suite', 'Dedicated Manager', 'Custom Integrations'],
    active_users: 23,
    color: 'bg-purple-500',
  },
];

const stats = [
  { title: 'Total Users', value: '2,847', icon: Users, change: '+12.5%' },
  { title: 'Active Subscriptions', value: '2,156', icon: CheckCircle2, change: '+8.3%' },
  { title: 'Expired', value: '412', icon: XCircle, change: '-5.2%' },
  { title: 'Pending', value: '279', icon: Clock, change: '+15.1%' },
];

export default function AdminERPNextUsers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [planFilter, setPlanFilter] = useState('all');
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState('2024-01-08 14:32');

  const erpnextUrl = import.meta.env.VITE_ERPNEXT_URL || 'https://your-erpnext.frappe.cloud';

  const handleSync = async () => {
    setSyncing(true);
    // Simulate sync
    await new Promise(resolve => setTimeout(resolve, 2000));
    setSyncing(false);
    setLastSync(new Date().toLocaleString());
    toast.success('Successfully synced with ERPNext');
  };

  const openInERPNext = (doctype: string, name?: string) => {
    const url = name 
      ? `${erpnextUrl}/app/${doctype}/${name}`
      : `${erpnextUrl}/app/${doctype}`;
    window.open(url, '_blank');
  };

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = 
      user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesPlan = planFilter === 'all' || user.plan === planFilter;
    return matchesSearch && matchesStatus && matchesPlan;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-emerald-500/20 text-emerald-600 hover:bg-emerald-500/30">Active</Badge>;
      case 'expired':
        return <Badge className="bg-red-500/20 text-red-600 hover:bg-red-500/30">Expired</Badge>;
      case 'pending':
        return <Badge className="bg-amber-500/20 text-amber-600 hover:bg-amber-500/30">Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case 'Enterprise':
        return <Badge className="bg-purple-500/20 text-purple-600">{plan}</Badge>;
      case 'Premium':
        return <Badge className="bg-blue-500/20 text-blue-600">{plan}</Badge>;
      default:
        return <Badge variant="secondary">{plan}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">
            User and subscription data synced from ERPNext. Manage directly in ERPNext.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-xs text-muted-foreground">Last sync: {lastSync}</p>
          <Button variant="outline" size="sm" onClick={handleSync} disabled={syncing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'Syncing...' : 'Sync Now'}
          </Button>
          <Button size="sm" onClick={() => openInERPNext('user')}>
            <ExternalLink className="h-4 w-4 mr-2" />
            Open ERPNext
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <stat.icon className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-xs text-emerald-600">{stat.change}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users" className="gap-2">
            <Users className="h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="plans" className="gap-2">
            <CreditCard className="h-4 w-4" />
            Plans
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, email, or company..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={planFilter} onValueChange={setPlanFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Plans</SelectItem>
                    <SelectItem value="Basic">Basic</SelectItem>
                    <SelectItem value="Premium">Premium</SelectItem>
                    <SelectItem value="Enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Users Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Subscription End</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{user.full_name}</p>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {user.email}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          {user.company}
                        </div>
                      </TableCell>
                      <TableCell>{getPlanBadge(user.plan)}</TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {new Date(user.subscription_end).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openInERPNext('user', user.email)}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="flex items-center justify-center p-4">
            <p className="text-sm text-muted-foreground">
              Showing {filteredUsers.length} of {mockUsers.length} users • 
              <Button variant="link" className="px-1 h-auto text-sm" onClick={() => openInERPNext('user')}>
                View all in ERPNext <ExternalLink className="h-3 w-3 ml-1" />
              </Button>
            </p>
          </div>
        </TabsContent>

        <TabsContent value="plans" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {mockPlans.map((plan) => (
              <Card key={plan.id} className="relative overflow-hidden">
                <div className={`absolute top-0 left-0 right-0 h-1 ${plan.color}`} />
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{plan.name}</CardTitle>
                    <Badge variant="secondary">{plan.active_users} users</Badge>
                  </div>
                  <CardDescription className="text-xl font-bold text-foreground">
                    {plan.price}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    variant="outline" 
                    className="w-full mt-4"
                    onClick={() => openInERPNext('subscription-plan', plan.name)}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Manage in ERPNext
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardContent className="p-6 text-center">
              <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-2">Manage Subscription Plans</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Create, modify, or delete subscription plans directly in ERPNext.
                Changes will be reflected here after sync.
              </p>
              <Button onClick={() => openInERPNext('subscription-plan')}>
                <ExternalLink className="h-4 w-4 mr-2" />
                Open Plan Management in ERPNext
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
