import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle2, Clock, CreditCard, Loader2 } from "lucide-react";
import { format } from "date-fns";

interface EventRegistration {
  id: string;
  event_type: string;
  event_title: string;
  event_date: string | null;
  status: string | null;
  payment_status: string | null;
  amount: number | null;
  currency: string | null;
  notes: string | null;
  created_at: string;
}

const statusColors: Record<string, string> = {
  registered: "bg-blue-100 text-blue-800",
  confirmed: "bg-green-100 text-green-800",
  attended: "bg-primary/10 text-primary",
  cancelled: "bg-red-100 text-red-800",
  pending: "bg-yellow-100 text-yellow-800",
  paid: "bg-green-100 text-green-800",
};

export default function MyEvents() {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("event_registrations")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      setRegistrations((data as EventRegistration[]) || []);
      setLoading(false);
    };
    fetch();
  }, [user]);

  const upcoming = registrations.filter((r) => r.status !== "attended" && r.status !== "cancelled");
  const past = registrations.filter((r) => r.status === "attended" || r.status === "cancelled");

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-semibold text-foreground">My Event Registrations</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          View your event, delegation, and exhibition registrations
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{registrations.length}</p>
              <p className="text-xs text-muted-foreground">Total Registrations</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{upcoming.length}</p>
              <p className="text-xs text-muted-foreground">Upcoming</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{past.length}</p>
              <p className="text-xs text-muted-foreground">Past</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : registrations.length === 0 ? (
        <Card className="border">
          <CardContent className="p-12 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No event registrations yet.</p>
            <p className="text-xs text-muted-foreground mt-1">
              Browse events and delegations to register.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {registrations.map((reg) => (
            <Card key={reg.id} className="border hover:border-primary/20 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="text-sm font-semibold">{reg.event_title}</h3>
                      <Badge variant="outline" className={statusColors[reg.status || "registered"]}>
                        {(reg.status || "registered").replace(/_/g, " ")}
                      </Badge>
                      <Badge variant="outline" className="capitalize text-[10px]">
                        {reg.event_type}
                      </Badge>
                    </div>
                    {reg.event_date && (
                      <p className="text-xs text-muted-foreground">Date: {reg.event_date}</p>
                    )}
                    {reg.amount && (
                      <div className="flex items-center gap-1 mt-1">
                        <CreditCard className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {reg.currency} {reg.amount} •{" "}
                          <span className={`capitalize ${reg.payment_status === "paid" ? "text-green-600" : "text-yellow-600"}`}>
                            {reg.payment_status}
                          </span>
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground whitespace-nowrap">
                    {format(new Date(reg.created_at), "MMM d, yyyy")}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
