import { 
  LayoutDashboard, 
  Globe, 
  FileText, 
  Calendar,
  Building2,
  Settings,
  ChevronDown,
  Shield,
  Landmark,
  RefreshCw,
  Database,
  Sparkles,
  Library,
  HeartPulse
} from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useSidebar } from '@/components/ui/sidebar';
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
} from '@/components/ui/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';

const adminMenuItems = [
  { title: 'Dashboard', url: '/admin', icon: LayoutDashboard },
];

const contentManagement = [
  { title: 'Delegations', url: '/admin/delegations', icon: Globe, badge: '6' },
  { title: 'Events & Exhibitions', url: '/admin/events', icon: Calendar, badge: '14' },
  { title: 'Government Schemes', url: '/admin/schemes', icon: FileText, badge: 'ERPNext' },
  { title: 'Policies', url: '/admin/policies', icon: Landmark, badge: 'AI' },
  { title: 'Tourism & Medical', url: '/admin/tourism-medical', icon: HeartPulse },
  { title: 'AI Suggestions', url: '/admin/ai-suggestions', icon: Sparkles, badge: 'AI' },
];

const erpnextItems = [
  { title: 'Users & Plans', url: '/admin/erpnext-users', icon: Database, badge: 'ERPNext' },
  { title: 'Consultants', url: '/admin/consultants', icon: Building2 },
  { title: 'Sync Status', url: '/admin/sync', icon: RefreshCw },
];

const masterDataItems = [
  { title: 'Master Data', url: '/admin/master-data', icon: Library, badge: 'All' },
];

const settingsItems = [
  { title: 'General Settings', url: '/admin/settings', icon: Settings },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';

  const renderMenuItems = (items: typeof adminMenuItems) => (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton asChild tooltip={item.title}>
            <NavLink
              to={item.url}
              end={item.url === '/admin'}
              className="flex items-center gap-3 px-3 py-2 rounded-sm hover:bg-muted/50 transition-colors"
              activeClassName="bg-primary/10 text-primary font-medium"
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {!collapsed && (
                <>
                  <span className="flex-1">{item.title}</span>
                  {'badge' in item && (item as any).badge && (
                    <Badge variant="secondary" className="text-xs px-1.5 py-0">
                      {(item as any).badge}
                    </Badge>
                  )}
                </>
              )}
            </NavLink>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarHeader className="border-b border-border p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-sm bg-primary flex items-center justify-center">
            <Shield className="h-4 w-4 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div>
              <h2 className="font-serif font-semibold text-sm">Admin Panel</h2>
              <p className="text-xs text-muted-foreground">AITAS Management</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            {renderMenuItems(adminMenuItems)}
          </SidebarGroupContent>
        </SidebarGroup>

        <Collapsible defaultOpen className="group/collapsible">
          <SidebarGroup>
            <CollapsibleTrigger asChild>
              <SidebarGroupLabel className="cursor-pointer hover:bg-muted/50 rounded-sm transition-colors flex items-center justify-between pr-2">
                {!collapsed && <span>Content Management</span>}
                {!collapsed && <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />}
              </SidebarGroupLabel>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarGroupContent>
                {renderMenuItems(contentManagement)}
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>

        <Collapsible defaultOpen className="group/collapsible">
          <SidebarGroup>
            <CollapsibleTrigger asChild>
              <SidebarGroupLabel className="cursor-pointer hover:bg-muted/50 rounded-sm transition-colors flex items-center justify-between pr-2">
                {!collapsed && <span>ERPNext Integration</span>}
                {!collapsed && <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />}
              </SidebarGroupLabel>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarGroupContent>
                {renderMenuItems(erpnextItems)}
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>

        <SidebarGroup>
          <SidebarGroupLabel>{!collapsed && 'Configuration'}</SidebarGroupLabel>
          <SidebarGroupContent>
            {renderMenuItems(masterDataItems)}
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>{!collapsed && 'System'}</SidebarGroupLabel>
          <SidebarGroupContent>
            {renderMenuItems(settingsItems)}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-4">
        {!collapsed && (
          <div className="text-xs text-muted-foreground">
            <p>AITAS Admin v1.0</p>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
