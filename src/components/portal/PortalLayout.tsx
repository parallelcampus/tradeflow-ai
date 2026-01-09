import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { PortalSidebar } from './PortalSidebar';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, Bell, Search, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TooltipProvider } from '@/components/ui/tooltip';

interface PortalLayoutProps {
  children: ReactNode;
}

export function PortalLayout({ children }: PortalLayoutProps) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <TooltipProvider delayDuration={100}>
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <PortalSidebar />
          <div className="flex-1 flex flex-col min-w-0">
            {/* Top Header - Clean Google Console style */}
            <header className="h-12 border-b border-border bg-card flex items-center justify-between px-4 sticky top-0 z-10">
              <div className="flex items-center gap-2">
                <SidebarTrigger className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg" />
                <div className="hidden md:block h-5 w-px bg-border mx-1" />
                <div className="relative hidden md:block">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search schemes, buyers, events..." 
                    className="w-64 lg:w-80 pl-8 h-8 bg-muted/50 border-transparent focus:border-border focus:bg-background text-sm rounded-lg"
                  />
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg">
                  <HelpCircle className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 relative text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg">
                  <Bell className="h-4 w-4" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full border-2 border-card" />
                </Button>
              </div>
            </header>
            
            {/* Main Content */}
            <main className="flex-1 p-4 lg:p-6 overflow-auto bg-background">
              <div className="max-w-7xl mx-auto">
                {children}
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
}