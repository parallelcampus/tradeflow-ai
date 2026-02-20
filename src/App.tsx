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
import Delegations from "./pages/Delegations";
import Events from "./pages/Events";
import ComingSoon from "./pages/ComingSoon";
import NotFound from "./pages/NotFound";
import TourismMedical from "./pages/TourismMedical";
import MyRequests from "./pages/portal/MyRequests";
import MyDocuments from "./pages/portal/MyDocuments";
import MyProfile from "./pages/portal/MyProfile";
import MyEvents from "./pages/portal/MyEvents";
import MyInvoices from "./pages/portal/MyInvoices";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminDelegations from "./pages/admin/AdminDelegations";
import AdminEvents from "./pages/admin/AdminEvents";
import AdminSchemes from "./pages/admin/AdminSchemes";
import AdminPolicies from "./pages/admin/AdminPolicies";
import AdminERPNextUsers from "./pages/admin/AdminERPNextUsers";
import AdminAISuggestions from "./pages/admin/AdminAISuggestions";
import AdminMasterData from "./pages/admin/AdminMasterData";
import AdminMedicalInquiries from "./pages/admin/AdminMedicalInquiries";
import AdminTourismManagement from "./pages/admin/AdminTourismManagement";
import AdminAddonServices from "./pages/admin/AdminAddonServices";
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
            <Route path="/tourism-medical" element={<TourismMedical />} />
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
            <Route path="/dashboard/tourism-medical" element={<PortalLayout><ComingSoon title="Tourism & Medical" /></PortalLayout>} />
            <Route path="/dashboard/requests" element={<PortalLayout><MyRequests /></PortalLayout>} />
            <Route path="/dashboard/documents" element={<PortalLayout><MyDocuments /></PortalLayout>} />
            <Route path="/dashboard/profile" element={<PortalLayout><MyProfile /></PortalLayout>} />
            <Route path="/dashboard/my-events" element={<PortalLayout><MyEvents /></PortalLayout>} />
            <Route path="/dashboard/billing" element={<PortalLayout><MyInvoices /></PortalLayout>} />
            <Route path="/dashboard/admin/users" element={<PortalLayout><ComingSoon title="User Management" /></PortalLayout>} />
            <Route path="/dashboard/admin/orgs" element={<PortalLayout><ComingSoon title="Organizations" /></PortalLayout>} />
            <Route path="/dashboard/admin/security" element={<PortalLayout><ComingSoon title="Security" /></PortalLayout>} />
            <Route path="/dashboard/settings" element={<PortalLayout><ComingSoon title="Settings" /></PortalLayout>} />
            
            {/* Admin Panel Routes */}
            <Route path="/admin" element={<AdminLayout title="Dashboard"><AdminDashboard /></AdminLayout>} />
            <Route path="/admin/delegations" element={<AdminLayout title="Delegations" breadcrumbs={[{ label: 'Delegations' }]}><AdminDelegations /></AdminLayout>} />
            <Route path="/admin/events" element={<AdminLayout title="Events & Exhibitions" breadcrumbs={[{ label: 'Events' }]}><AdminEvents /></AdminLayout>} />
            <Route path="/admin/schemes" element={<AdminLayout title="Government Schemes" breadcrumbs={[{ label: 'Schemes' }]}><AdminSchemes /></AdminLayout>} />
            <Route path="/admin/policies" element={<AdminLayout title="Government Policies" breadcrumbs={[{ label: 'Policies' }]}><AdminPolicies /></AdminLayout>} />
            <Route path="/admin/tourism-medical" element={<AdminLayout title="Tourism & Medical" breadcrumbs={[{ label: 'Tourism & Medical' }]}><ComingSoon title="Tourism & Medical Management" /></AdminLayout>} />
            <Route path="/admin/medical-inquiries" element={<AdminLayout title="Medical Inquiries" breadcrumbs={[{ label: 'Medical Inquiries' }]}><AdminMedicalInquiries /></AdminLayout>} />
            <Route path="/admin/tourism-management" element={<AdminLayout title="Tourism Management" breadcrumbs={[{ label: 'Tourism Management' }]}><AdminTourismManagement /></AdminLayout>} />
            <Route path="/admin/addon-services" element={<AdminLayout title="Add-On Services" breadcrumbs={[{ label: 'Add-On Services' }]}><AdminAddonServices /></AdminLayout>} />
            <Route path="/admin/erpnext-users" element={<AdminLayout title="Users & Plans" breadcrumbs={[{ label: 'ERPNext Integration' }, { label: 'Users & Plans' }]}><AdminERPNextUsers /></AdminLayout>} />
            <Route path="/admin/consultants" element={<AdminLayout title="Consultants" breadcrumbs={[{ label: 'Consultants' }]}><ComingSoon title="Consultant Management" /></AdminLayout>} />
            <Route path="/admin/sync" element={<AdminLayout title="Sync Status" breadcrumbs={[{ label: 'ERPNext Integration' }, { label: 'Sync Status' }]}><ComingSoon title="Sync Status" /></AdminLayout>} />
            <Route path="/admin/ai-suggestions" element={<AdminLayout title="AI Suggestions" breadcrumbs={[{ label: 'AI Suggestions' }]}><AdminAISuggestions /></AdminLayout>} />
            <Route path="/admin/settings" element={<AdminLayout title="Settings" breadcrumbs={[{ label: 'Settings' }]}><ComingSoon title="Admin Settings" /></AdminLayout>} />
            <Route path="/admin/master-data" element={<AdminLayout title="Master Data" breadcrumbs={[{ label: 'Master Data' }]}><AdminMasterData /></AdminLayout>} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
