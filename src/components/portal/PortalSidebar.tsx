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
  ChevronDown
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
            'flex items-center gap-3 rounded-lg px-3 py-2 transition-colors',
            isActive(item.url) 
              ? 'bg-primary text-primary-foreground' 
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          )}
        >
          <item.icon className="h-4 w-4 shrink-0" />
          {!collapsed && <span>{item.title}</span>}
        </NavLink>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );

  return (
    <Sidebar collapsible="icon" className="border-r border-border/50">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shrink-0">
            <Globe className="h-5 w-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-lg font-display font-bold text-foreground">GTPC</h1>
              <p className="text-xs text-muted-foreground">Trade Portal</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
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

        {/* Trade Services */}
        <SidebarGroup>
          <Collapsible defaultOpen={isGroupActive(tradeItems)}>
            <CollapsibleTrigger className="w-full">
              <SidebarGroupLabel className="flex items-center justify-between cursor-pointer hover:text-foreground transition-colors">
                {!collapsed && <span>Trade Services</span>}
                {!collapsed && <ChevronDown className="h-4 w-4" />}
              </SidebarGroupLabel>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {tradeItems.map((item) => (
                    <NavItem key={item.title} item={item} />
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>

        {/* Events & Training */}
        <SidebarGroup>
          <Collapsible defaultOpen={isGroupActive(eventsItems)}>
            <CollapsibleTrigger className="w-full">
              <SidebarGroupLabel className="flex items-center justify-between cursor-pointer hover:text-foreground transition-colors">
                {!collapsed && <span>Events & Training</span>}
                {!collapsed && <ChevronDown className="h-4 w-4" />}
              </SidebarGroupLabel>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {eventsItems.map((item) => (
                    <NavItem key={item.title} item={item} />
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>

        {/* Admin */}
        <SidebarGroup>
          <Collapsible defaultOpen={isGroupActive(adminItems)}>
            <CollapsibleTrigger className="w-full">
              <SidebarGroupLabel className="flex items-center justify-between cursor-pointer hover:text-foreground transition-colors">
                {!collapsed && <span>Administration</span>}
                {!collapsed && <ChevronDown className="h-4 w-4" />}
              </SidebarGroupLabel>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {adminItems.map((item) => (
                    <NavItem key={item.title} item={item} />
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-border/50">
        {!collapsed && user && (
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-sm font-medium text-primary">
                {user.email?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.email}</p>
              <p className="text-xs text-muted-foreground">Exporter</p>
            </div>
          </div>
        )}
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive"
          onClick={signOut}
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span>Sign Out</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
