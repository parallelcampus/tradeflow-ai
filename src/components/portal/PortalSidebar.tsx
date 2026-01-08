import { 
  LayoutDashboard, 
  MessageSquare, 
  Store, 
  Settings, 
  Users, 
  FileText, 
  Calendar, 
  GraduationCap,
  Building2,
  Globe,
  TrendingUp,
  Shield,
  LogOut,
  ChevronRight
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

const mainNavItems = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { title: 'AI Assistant', url: '/dashboard/ai', icon: MessageSquare },
  { title: 'Marketplace', url: '/dashboard/marketplace', icon: Store },
];

const tradeItems = [
  { title: 'Schemes & Subsidies', url: '/dashboard/schemes', icon: FileText },
  { title: 'Buyer Discovery', url: '/dashboard/buyers', icon: TrendingUp },
  { title: 'Consultants', url: '/dashboard/consultants', icon: Users },
];

const eventsItems = [
  { title: 'Events', url: '/dashboard/events', icon: Calendar },
  { title: 'Delegations', url: '/dashboard/delegations', icon: Globe },
  { title: 'Training', url: '/dashboard/training', icon: GraduationCap },
];

const adminItems = [
  { title: 'User Management', url: '/dashboard/admin/users', icon: Users },
  { title: 'Organizations', url: '/dashboard/admin/orgs', icon: Building2 },
  { title: 'Security', url: '/dashboard/admin/security', icon: Shield },
  { title: 'Settings', url: '/dashboard/settings', icon: Settings },
];

export function PortalSidebar() {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const location = useLocation();
  const { signOut, user } = useAuth();

  const isActive = (path: string) => location.pathname === path;
  const isGroupActive = (items: { url: string }[]) => 
    items.some(item => location.pathname.startsWith(item.url));

  const NavItem = ({ item }: { item: { title: string; url: string; icon: any } }) => (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <NavLink
          to={item.url}
          className={cn(
            'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
            isActive(item.url) 
              ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' 
              : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
          )}
        >
          <item.icon className="h-4 w-4 shrink-0" />
          {!collapsed && <span>{item.title}</span>}
        </NavLink>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );

  const CollapsibleGroup = ({ 
    label, 
    items 
  }: { 
    label: string; 
    items: { title: string; url: string; icon: any }[] 
  }) => (
    <SidebarGroup>
      <Collapsible defaultOpen={isGroupActive(items)}>
        <CollapsibleTrigger className="w-full group">
          <SidebarGroupLabel className="flex items-center justify-between cursor-pointer text-sidebar-foreground/50 hover:text-sidebar-foreground/70 transition-colors text-xs uppercase tracking-wider font-medium">
            {!collapsed && <span>{label}</span>}
            {!collapsed && (
              <ChevronRight className="h-3.5 w-3.5 transition-transform group-data-[state=open]:rotate-90" />
            )}
          </SidebarGroupLabel>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarGroupContent className="mt-1">
            <SidebarMenu>
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
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-sidebar-primary/10 rounded-lg flex items-center justify-center shrink-0">
            <Globe className="h-5 w-5 text-sidebar-primary" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-base font-serif font-semibold text-sidebar-foreground">GTPC</h1>
              <p className="text-2xs text-sidebar-foreground/50 uppercase tracking-wider">Trade Portal</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <NavItem key={item.title} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="my-4 h-px bg-sidebar-border" />

        {/* Trade Services */}
        <CollapsibleGroup label="Trade Services" items={tradeItems} />

        {/* Events & Training */}
        <CollapsibleGroup label="Events & Training" items={eventsItems} />

        {/* Admin */}
        <CollapsibleGroup label="Administration" items={adminItems} />
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border">
        {!collapsed && user && (
          <div className="flex items-center gap-3 mb-3 p-2 rounded-md bg-sidebar-accent/30">
            <div className="w-8 h-8 rounded-full bg-sidebar-primary/20 flex items-center justify-center">
              <span className="text-xs font-medium text-sidebar-primary">
                {user.email?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                {user.user_metadata?.full_name || user.email?.split('@')[0]}
              </p>
              <p className="text-2xs text-sidebar-foreground/50 uppercase tracking-wider">Exporter</p>
            </div>
          </div>
        )}
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-2 text-sidebar-foreground/60 hover:text-destructive hover:bg-destructive/10"
          onClick={signOut}
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span className="text-sm">Sign Out</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}