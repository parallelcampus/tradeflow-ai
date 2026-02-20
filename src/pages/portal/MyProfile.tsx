import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Phone, Building2, Globe, Save, Loader2, Shield } from "lucide-react";
import { toast } from "sonner";

export default function MyProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    phone: "",
    company_name: "",
    country: "",
    language_preference: "en",
  });
  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      setLoading(true);
      const [profileRes, rolesRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).single(),
        supabase.from("user_roles").select("role").eq("user_id", user.id),
      ]);
      if (profileRes.data) {
        setProfile({
          full_name: profileRes.data.full_name || "",
          email: profileRes.data.email || user.email || "",
          phone: profileRes.data.phone || "",
          company_name: profileRes.data.company_name || "",
          country: profileRes.data.country || "",
          language_preference: profileRes.data.language_preference || "en",
        });
      }
      setRoles((rolesRes.data || []).map((r) => r.role));
      setLoading(false);
    };
    fetchProfile();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: profile.full_name,
        phone: profile.phone,
        company_name: profile.company_name,
        country: profile.country,
        language_preference: profile.language_preference,
      })
      .eq("id", user.id);
    setSaving(false);
    if (error) {
      toast.error("Failed to update profile");
    } else {
      toast.success("Profile updated successfully");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div>
        <h1 className="text-xl font-semibold text-foreground">My Profile</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Manage your account information and preferences
        </p>
      </div>

      {/* Roles Badge */}
      {roles.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <Shield className="h-4 w-4 text-primary" />
          {roles.map((role) => (
            <Badge key={role} variant="outline" className="capitalize">
              {role.replace(/_/g, " ")}
            </Badge>
          ))}
        </div>
      )}

      <Card className="border">
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <User className="h-4 w-4 text-primary" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Full Name</label>
              <Input
                value={profile.full_name}
                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                placeholder="Your full name"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Email</label>
              <Input value={profile.email} disabled className="bg-muted" />
              <p className="text-[10px] text-muted-foreground mt-1">Email cannot be changed</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block flex items-center gap-1">
                <Phone className="h-3.5 w-3.5" /> Phone
              </label>
              <Input
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                placeholder="+91 98765 43210"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block flex items-center gap-1">
                <Building2 className="h-3.5 w-3.5" /> Company
              </label>
              <Input
                value={profile.company_name}
                onChange={(e) => setProfile({ ...profile, company_name: e.target.value })}
                placeholder="Company name"
              />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block flex items-center gap-1">
                <Globe className="h-3.5 w-3.5" /> Country
              </label>
              <Input
                value={profile.country}
                onChange={(e) => setProfile({ ...profile, country: e.target.value })}
                placeholder="India"
              />
            </div>
          </div>
          <div className="pt-2">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border">
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Mail className="h-4 w-4 text-primary" />
            Account Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-border/50">
            <span className="text-sm text-muted-foreground">Member Since</span>
            <span className="text-sm font-medium">
              {user?.created_at
                ? new Date(user.created_at).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })
                : "N/A"}
            </span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-border/50">
            <span className="text-sm text-muted-foreground">Account ID</span>
            <span className="text-xs font-mono text-muted-foreground">{user?.id?.slice(0, 8)}...</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-muted-foreground">Language Preference</span>
            <span className="text-sm font-medium capitalize">
              {profile.language_preference === "en" ? "English" : profile.language_preference}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
