import { 
  LayoutDashboard, 
  MessageSquare, 
  Store, 
  Settings, 
  Users, 
  FileText, 
  Calendar, 
  Building2,
  Globe,
  TrendingUp,
  Shield,
  LogOut,
  ChevronDown,
  CreditCard,
  FolderOpen,
  Lock,
  HeartPulse,
  ClipboardList,
  UserCircle,
  CalendarCheck
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const featureStatus: Record<string, { enabled: boolean; reason?: string }> = {
  '/dashboard': { enabled: true },
  '/dashboard/ai': { enabled: true },
  '/dashboard/marketplace': { enabled: true },
  '/dashboard/schemes': { enabled: true },
  '/dashboard/buyers': { enabled: true },
  '/dashboard/consultants': { enabled: true },
  '/dashboard/meetings': { enabled: true },
  '/dashboard/b2b': { enabled: true },
  '/dashboard/events': { enabled: true },
  '/dashboard/delegations': { enabled: true },
  '/dashboard/tourism-medical': { enabled: true },
  '/dashboard/requests': { enabled: true },
  '/dashboard/my-events': { enabled: true },
  '/dashboard/documents': { enabled: true },
  '/dashboard/billing': { enabled: true },
  '/dashboard/profile': { enabled: true },
  '/dashboard/admin/users': { enabled: false, reason: 'Admin access required' },
  '/dashboard/admin/orgs': { enabled: false, reason: 'Admin access required' },
  '/dashboard/admin/security': { enabled: false, reason: 'Admin access required' },
  '/dashboard/settings': { enabled: true },
};

const mainNavItems = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { title: 'AI Assistant', url: '/dashboard/ai', icon: MessageSquare },
  { title: 'Marketplace', url: '/dashboard/marketplace', icon: Store },
];

const tradeItems = [
  { title: 'Govt Schemes', url: '/dashboard/schemes', icon: FileText },
  { title: 'Buyer Discovery', url: '/dashboard/buyers', icon: TrendingUp },
  { title: 'Consultants', url: '/dashboard/consultants', icon: Users },
  { title: 'My Appointments', url: '/dashboard/meetings', icon: Calendar },
  { title: 'B2B Meetings', url: '/dashboard/b2b', icon: Building2 },
];

const eventsItems = [
  { title: 'Events & Exhibitions', url: '/dashboard/events', icon: Calendar },
  { title: 'Delegations', url: '/dashboard/delegations', icon: Globe },
  { title: 'Tourism & Medical', url: '/dashboard/tourism-medical', icon: HeartPulse },
];

const resourceItems = [
  { title: 'My Requests', url: '/dashboard/requests', icon: ClipboardList },
  { title: 'My Events', url: '/dashboard/my-events', icon: CalendarCheck },
  { title: 'Documents', url: '/dashboard/documents', icon: FolderOpen },
  { title: 'Billing', url: '/dashboard/billing', icon: CreditCard },
  { title: 'Profile', url: '/dashboard/profile', icon: UserCircle },
  { title: 'Settings', url: '/dashboard/settings', icon: Settings },
];

const adminItems = [
  { title: 'User Management', url: '/dashboard/admin/users', icon: Users },
  { title: 'Organizations', url: '/dashboard/admin/orgs', icon: Building2 },
  { title: 'Security', url: '/dashboard/admin/security', icon: Shield },
];

export function PortalSidebar() {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const location = useLocation();
  const { signOut, user } = useAuth();

  const isActive = (path: string) => location.pathname === path;
  const isGroupActive = (items: { url: string }[]) => 
    items.some(item => location.pathname.startsWith(item.url));

  const NavItem = ({ item }: { item: { title: string; url: string; icon: any } }) => {
    const status = featureStatus[item.url] || { enabled: true };
    const active = isActive(item.url);
    
    const linkContent = (
      <div
        className={cn(
          'flex items-center gap-3 rounded-sm px-3 py-2 text-sm transition-colors w-full',
          active 
            ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' 
            : status.enabled
              ? 'text-sidebar-foreground hover:bg-sidebar-hover'
              : 'text-muted-foreground cursor-not-allowed opacity-60'
        )}
      >
        <item.icon className="h-4 w-4 shrink-0" />
        {!collapsed && <span className="font-medium">{item.title}</span>}
        {!collapsed && !status.enabled && (
          <Lock className="h-3 w-3 ml-auto" />
        )}
      </div>
    );

    if (!status.enabled) {
      return (
        <SidebarMenuItem>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-full">{linkContent}</div>
            </TooltipTrigger>
            <TooltipContent side="right" className="text-xs">
              {status.reason}
            </TooltipContent>
          </Tooltip>
        </SidebarMenuItem>
      );
    }

    return (
      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <NavLink to={item.url} className="w-full">
            {linkContent}
          </NavLink>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  const CollapsibleGroup = ({ 
    label, 
    items,
    defaultOpen = false
  }: { 
    label: string; 
    items: { title: string; url: string; icon: any }[];
    defaultOpen?: boolean;
  }) => (
    <SidebarGroup className="py-0">
      <Collapsible defaultOpen={defaultOpen || isGroupActive(items)}>
        <CollapsibleTrigger className="w-full group">
          <SidebarGroupLabel className="flex items-center justify-between cursor-pointer text-muted-foreground hover:text-foreground transition-colors text-xs uppercase tracking-wide font-semibold px-3 py-2">
            {!collapsed && <span>{label}</span>}
            {!collapsed && (
              <ChevronDown className="h-3.5 w-3.5 transition-transform group-data-[state=closed]:-rotate-90" />
            )}
          </SidebarGroupLabel>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {items.map((item) => (
                <NavItem key={item.title} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </CollapsibleContent>
      </Collapsible>
    </SidebarGroup>
  );

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border bg-sidebar-background">
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-primary-foreground">A</span>
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-base font-serif font-semibold text-sidebar-foreground tracking-tight">AITAS</h1>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Trade Portal</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-3">
        <SidebarGroup className="py-0">
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {mainNavItems.map((item) => (
                <NavItem key={item.title} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="my-3 mx-3 h-px bg-sidebar-border" />

        <CollapsibleGroup label="Trade Services" items={tradeItems} defaultOpen />
        <CollapsibleGroup label="Events & Services" items={eventsItems} />
        <CollapsibleGroup label="Resources" items={resourceItems} />
        <CollapsibleGroup label="Administration" items={adminItems} />
      </SidebarContent>

      <SidebarFooter className="p-3 border-t border-sidebar-border">
        {!collapsed && user && (
          <div className="flex items-center gap-3 mb-3 p-2 rounded-sm bg-muted/50">
            <div className="w-8 h-8 rounded-sm bg-primary/10 flex items-center justify-center">
              <span className="text-xs font-semibold text-primary">
                {user.email?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                {user.user_metadata?.full_name || user.email?.split('@')[0]}
              </p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Member</p>
            </div>
          </div>
        )}
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-9"
          onClick={signOut}
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span className="text-sm font-medium">Sign Out</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
