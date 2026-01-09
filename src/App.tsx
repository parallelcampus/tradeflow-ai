import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { AdminLayout } from "@/components/admin/AdminLayout";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import AIAssistant from "./pages/AIAssistant";
import Marketplace from "./pages/Marketplace";
import Schemes from "./pages/Schemes";
import BuyerDiscovery from "./pages/BuyerDiscovery";
import Consultants from "./pages/Consultants";
import ConsultantRegister from "./pages/ConsultantRegister";
import MyMeetings from "./pages/MyMeetings";
import B2BMeetings from "./pages/B2BMeetings";
import Training from "./pages/Training";
import Delegations from "./pages/Delegations";
import Events from "./pages/Events";
import ComingSoon from "./pages/ComingSoon";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminTraining from "./pages/admin/AdminTraining";
import AdminDelegations from "./pages/admin/AdminDelegations";
import AdminEvents from "./pages/admin/AdminEvents";
import AdminSchemes from "./pages/admin/AdminSchemes";
import AdminPolicies from "./pages/admin/AdminPolicies";
import AdminERPNextUsers from "./pages/admin/AdminERPNextUsers";
import AdminAISuggestions from "./pages/admin/AdminAISuggestions";

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
            <Route path="/dashboard/buyers" element={<PortalLayout><BuyerDiscovery /></PortalLayout>} />
            <Route path="/dashboard/consultants" element={<PortalLayout><Consultants /></PortalLayout>} />
            <Route path="/dashboard/consultants/register" element={<PortalLayout><ConsultantRegister /></PortalLayout>} />
            <Route path="/dashboard/meetings" element={<PortalLayout><MyMeetings /></PortalLayout>} />
            <Route path="/dashboard/b2b" element={<PortalLayout><B2BMeetings /></PortalLayout>} />
            <Route path="/dashboard/events" element={<PortalLayout><Events /></PortalLayout>} />
            <Route path="/dashboard/delegations" element={<PortalLayout><Delegations /></PortalLayout>} />
            <Route path="/dashboard/training" element={<PortalLayout><Training /></PortalLayout>} />
            <Route path="/dashboard/admin/users" element={<PortalLayout><ComingSoon title="User Management" /></PortalLayout>} />
            <Route path="/dashboard/admin/orgs" element={<PortalLayout><ComingSoon title="Organizations" /></PortalLayout>} />
            <Route path="/dashboard/admin/security" element={<PortalLayout><ComingSoon title="Security" /></PortalLayout>} />
            <Route path="/dashboard/settings" element={<PortalLayout><ComingSoon title="Settings" /></PortalLayout>} />
            
            {/* Admin Panel Routes */}
            <Route path="/admin" element={<AdminLayout title="Dashboard"><AdminDashboard /></AdminLayout>} />
            <Route path="/admin/training" element={<AdminLayout title="Training Programs" breadcrumbs={[{ label: 'Training Programs' }]}><AdminTraining /></AdminLayout>} />
            <Route path="/admin/delegations" element={<AdminLayout title="Delegations" breadcrumbs={[{ label: 'Delegations' }]}><AdminDelegations /></AdminLayout>} />
            <Route path="/admin/events" element={<AdminLayout title="Events & Exhibitions" breadcrumbs={[{ label: 'Events' }]}><AdminEvents /></AdminLayout>} />
            <Route path="/admin/schemes" element={<AdminLayout title="Government Schemes" breadcrumbs={[{ label: 'Schemes' }]}><AdminSchemes /></AdminLayout>} />
            <Route path="/admin/policies" element={<AdminLayout title="Government Policies" breadcrumbs={[{ label: 'Policies' }]}><AdminPolicies /></AdminLayout>} />
            <Route path="/admin/erpnext-users" element={<AdminLayout title="Users & Plans" breadcrumbs={[{ label: 'ERPNext Integration' }, { label: 'Users & Plans' }]}><AdminERPNextUsers /></AdminLayout>} />
            <Route path="/admin/consultants" element={<AdminLayout title="Consultants" breadcrumbs={[{ label: 'Consultants' }]}><ComingSoon title="Consultant Management" /></AdminLayout>} />
            <Route path="/admin/sync" element={<AdminLayout title="Sync Status" breadcrumbs={[{ label: 'ERPNext Integration' }, { label: 'Sync Status' }]}><ComingSoon title="Sync Status" /></AdminLayout>} />
            <Route path="/admin/ai-suggestions" element={<AdminLayout title="AI Suggestions" breadcrumbs={[{ label: 'AI Suggestions' }]}><AdminAISuggestions /></AdminLayout>} />
            <Route path="/admin/settings" element={<AdminLayout title="Settings" breadcrumbs={[{ label: 'Settings' }]}><ComingSoon title="Admin Settings" /></AdminLayout>} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
