import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Stethoscope, Globe, Clock, CheckCircle2, AlertCircle, FileText } from "lucide-react";
import { format } from "date-fns";

interface MedicalInquiry {
  id: string;
  patient_name: string;
  medical_condition: string | null;
  status: string | null;
  treatment_stage: string | null;
  created_at: string | null;
  preferred_location: string | null;
  case_notes: string | null;
}

interface TourismBooking {
  id: string;
  client_name: string;
  special_requests: string | null;
  status: string | null;
  country: string | null;
  preferred_dates: string | null;
  created_at: string | null;
  group_size: number | null;
}

const statusColors: Record<string, string> = {
  new: "bg-blue-100 text-blue-800",
  pending: "bg-yellow-100 text-yellow-800",
  in_review: "bg-purple-100 text-purple-800",
  assigned: "bg-indigo-100 text-indigo-800",
  in_treatment: "bg-orange-100 text-orange-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  confirmed: "bg-green-100 text-green-800",
  registered: "bg-blue-100 text-blue-800",
};

const statusIcon = (status: string) => {
  switch (status) {
    case "completed":
    case "confirmed":
      return <CheckCircle2 className="h-4 w-4" />;
    case "cancelled":
      return <AlertCircle className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

export default function MyRequests() {
  const { user } = useAuth();
  const [medicalInquiries, setMedicalInquiries] = useState<MedicalInquiry[]>([]);
  const [tourismBookings, setTourismBookings] = useState<TourismBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      setLoading(true);
      const [medRes, tourRes] = await Promise.all([
        supabase
          .from("medical_inquiries")
          .select("*")
          .eq("contact_email", user.email || "")
          .order("created_at", { ascending: false }),
        supabase
          .from("tourism_bookings")
          .select("*")
          .eq("client_email", user.email || "")
          .order("created_at", { ascending: false }),
      ]);
      setMedicalInquiries((medRes.data as MedicalInquiry[]) || []);
      setTourismBookings((tourRes.data as TourismBooking[]) || []);
      setLoading(false);
    };
    fetchData();
  }, [user]);

  const totalRequests = medicalInquiries.length + tourismBookings.length;
  const activeRequests = [...medicalInquiries, ...tourismBookings].filter(
    (r) => r.status !== "completed" && r.status !== "cancelled"
  ).length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-semibold text-foreground">My Service Requests</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Track your medical consultations and tourism bookings
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{totalRequests}</p>
                <p className="text-xs text-muted-foreground">Total Requests</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{activeRequests}</p>
                <p className="text-xs text-muted-foreground">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold">
                  {totalRequests - activeRequests}
                </p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="medical" className="w-full">
        <TabsList>
          <TabsTrigger value="medical" className="gap-2">
            <Stethoscope className="h-4 w-4" /> Medical ({medicalInquiries.length})
          </TabsTrigger>
          <TabsTrigger value="tourism" className="gap-2">
            <Globe className="h-4 w-4" /> Tourism ({tourismBookings.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="medical" className="mt-4 space-y-3">
          {loading ? (
            <p className="text-sm text-muted-foreground py-8 text-center">Loading...</p>
          ) : medicalInquiries.length === 0 ? (
            <Card className="border">
              <CardContent className="p-8 text-center">
                <Stethoscope className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">No medical consultation requests yet.</p>
              </CardContent>
            </Card>
          ) : (
            medicalInquiries.map((inquiry) => (
              <Card key={inquiry.id} className="border hover:border-primary/20 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-semibold truncate">{inquiry.medical_condition || "Medical Consultation"}</h3>
                        <Badge variant="outline" className={statusColors[inquiry.status || "new"]}>
                          {statusIcon(inquiry.status || "new")}
                          <span className="ml-1 capitalize">{(inquiry.status || "new").replace(/_/g, " ")}</span>
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Patient: {inquiry.patient_name}
                        {inquiry.preferred_location && ` • Location: ${inquiry.preferred_location}`}
                      </p>
                      {inquiry.treatment_stage && (
                        <p className="text-xs text-primary mt-1">Stage: {inquiry.treatment_stage}</p>
                      )}
                      {inquiry.case_notes && (
                        <p className="text-xs text-muted-foreground mt-2 bg-muted/50 p-2 rounded">
                          <strong>Notes:</strong> {inquiry.case_notes}
                        </p>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground whitespace-nowrap">
                      {inquiry.created_at ? format(new Date(inquiry.created_at), "MMM d, yyyy") : ""}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="tourism" className="mt-4 space-y-3">
          {loading ? (
            <p className="text-sm text-muted-foreground py-8 text-center">Loading...</p>
          ) : tourismBookings.length === 0 ? (
            <Card className="border">
              <CardContent className="p-8 text-center">
                <Globe className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">No tourism bookings yet.</p>
              </CardContent>
            </Card>
          ) : (
            tourismBookings.map((booking) => (
              <Card key={booking.id} className="border hover:border-primary/20 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-semibold truncate">
                          {booking.special_requests?.substring(0, 60) || "Tourism Booking"}
                        </h3>
                        <Badge variant="outline" className={statusColors[booking.status || "pending"]}>
                          {statusIcon(booking.status || "pending")}
                          <span className="ml-1 capitalize">{(booking.status || "pending").replace(/_/g, " ")}</span>
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {booking.client_name}
                        {booking.country && ` • ${booking.country}`}
                        {booking.group_size && ` • Group: ${booking.group_size}`}
                      </p>
                      {booking.preferred_dates && (
                        <p className="text-xs text-primary mt-1">Dates: {booking.preferred_dates}</p>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground whitespace-nowrap">
                      {booking.created_at ? format(new Date(booking.created_at), "MMM d, yyyy") : ""}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
