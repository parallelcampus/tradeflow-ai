import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { PortalLayout } from "@/components/portal/PortalLayout";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import AIAssistant from "./pages/AIAssistant";
import Marketplace from "./pages/Marketplace";
import Schemes from "./pages/Schemes";
import ComingSoon from "./pages/ComingSoon";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<PortalLayout><Dashboard /></PortalLayout>} />
            <Route path="/dashboard/ai" element={<PortalLayout><AIAssistant /></PortalLayout>} />
            <Route path="/dashboard/marketplace" element={<PortalLayout><Marketplace /></PortalLayout>} />
            <Route path="/dashboard/schemes" element={<PortalLayout><Schemes /></PortalLayout>} />
            <Route path="/dashboard/buyers" element={<PortalLayout><ComingSoon title="Buyer Discovery" /></PortalLayout>} />
            <Route path="/dashboard/consultants" element={<PortalLayout><ComingSoon title="Consultants" /></PortalLayout>} />
            <Route path="/dashboard/events" element={<PortalLayout><ComingSoon title="Events" /></PortalLayout>} />
            <Route path="/dashboard/delegations" element={<PortalLayout><ComingSoon title="Delegations" /></PortalLayout>} />
            <Route path="/dashboard/training" element={<PortalLayout><ComingSoon title="Training" /></PortalLayout>} />
            <Route path="/dashboard/admin/users" element={<PortalLayout><ComingSoon title="User Management" /></PortalLayout>} />
            <Route path="/dashboard/admin/orgs" element={<PortalLayout><ComingSoon title="Organizations" /></PortalLayout>} />
            <Route path="/dashboard/admin/security" element={<PortalLayout><ComingSoon title="Security" /></PortalLayout>} />
            <Route path="/dashboard/settings" element={<PortalLayout><ComingSoon title="Settings" /></PortalLayout>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
