import {
  HeartPulse,
  Stethoscope,
  Plane,
  MapPin,
  FileText,
  Phone,
  Upload,
  Users,
  Globe,
  Building2,
  CheckCircle2,
  ArrowRight,
  Star,
  Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const medicalServices = [
  "Hospital Network Across India",
  "Cardiology & Cardiac Surgery",
  "Oncology & Cancer Treatment",
  "Orthopedics & Joint Replacement",
  "Organ Transplants",
  "Cosmetic & Bariatric Surgery",
  "Advanced Diagnostics & Imaging",
  "Pre-treatment Video Consultations",
  "Treatment Package Structuring",
  "Travel & Stay Coordination",
  "Airport Pickup & Concierge",
  "Medical Visa Documentation Guidance",
  "Language Interpreters",
  "Post-treatment Follow-up",
  "Dedicated Case Manager per Patient",
];

const pilgrimageCircuits = [
  { title: "Hindu Pilgrimage Circuits", description: "Char Dham, Varanasi, Tirupati, and major temple circuits across India" },
  { title: "Buddhist Circuits", description: "Bodh Gaya, Sarnath, Kushinagar, Lumbini and ancient Buddhist heritage sites" },
  { title: "Islamic Heritage Sites", description: "Historic mosques, dargahs, and Islamic cultural heritage across South Asia" },
  { title: "Christian Heritage Sites", description: "Old Goa churches, Kerala Christian heritage, and historic cathedrals" },
];

const costComparison = [
  { procedure: "Heart Bypass Surgery", india: "$5,000–$9,000", usa: "$70,000–$130,000", uk: "$25,000–$45,000" },
  { procedure: "Knee Replacement", india: "$4,000–$6,500", usa: "$35,000–$70,000", uk: "$15,000–$25,000" },
  { procedure: "Dental Implants", india: "$500–$1,000", usa: "$3,000–$5,000", uk: "$2,000–$3,500" },
  { procedure: "Cosmetic Surgery", india: "$2,000–$5,000", usa: "$10,000–$25,000", uk: "$5,000–$15,000" },
];

export default function TourismMedical() {
  const [activeTab, setActiveTab] = useState<'medical' | 'pilgrimage' | 'partner'>('medical');
  
  // Medical form state
  const [medicalForm, setMedicalForm] = useState({
    patient_name: '', country: '', medical_condition: '', preferred_location: '',
    contact_email: '', contact_phone: '',
  });
  const [medicalSubmitting, setMedicalSubmitting] = useState(false);

  // Pilgrimage form state
  const [pilgrimageForm, setPilgrimageForm] = useState({
    client_name: '', country: '', special_requests: '', group_size: '',
    preferred_dates: '', client_email: '',
  });
  const [pilgrimageSubmitting, setPilgrimageSubmitting] = useState(false);

  const handleMedicalSubmit = async () => {
    if (!medicalForm.patient_name || !medicalForm.contact_email || !medicalForm.medical_condition) {
      toast.error('Please fill in required fields');
      return;
    }
    setMedicalSubmitting(true);
    const { error } = await supabase.from('medical_inquiries').insert({
      patient_name: medicalForm.patient_name,
      country: medicalForm.country || null,
      medical_condition: medicalForm.medical_condition,
      preferred_location: medicalForm.preferred_location || null,
      contact_email: medicalForm.contact_email,
      contact_phone: medicalForm.contact_phone || null,
    });
    setMedicalSubmitting(false);
    if (error) {
      toast.error('Failed to submit. Please try again.');
    } else {
      toast.success('Consultation request submitted successfully! Our team will contact you shortly.');
      setMedicalForm({ patient_name: '', country: '', medical_condition: '', preferred_location: '', contact_email: '', contact_phone: '' });
    }
  };

  const handlePilgrimageSubmit = async () => {
    if (!pilgrimageForm.client_name || !pilgrimageForm.client_email || !pilgrimageForm.special_requests) {
      toast.error('Please fill in required fields');
      return;
    }
    setPilgrimageSubmitting(true);
    const { error } = await supabase.from('tourism_bookings').insert({
      client_name: pilgrimageForm.client_name,
      client_email: pilgrimageForm.client_email,
      country: pilgrimageForm.country || null,
      special_requests: pilgrimageForm.special_requests,
      group_size: pilgrimageForm.group_size ? parseInt(pilgrimageForm.group_size) : 1,
      preferred_dates: pilgrimageForm.preferred_dates || null,
    });
    setPilgrimageSubmitting(false);
    if (error) {
      toast.error('Failed to submit. Please try again.');
    } else {
      toast.success('Pilgrimage request submitted! Our team will reach out soon.');
      setPilgrimageForm({ client_name: '', country: '', special_requests: '', group_size: '', preferred_dates: '', client_email: '' });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-primary/5 border-b border-border py-20 lg:py-28">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-sm mb-6">
                <HeartPulse className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Medical & International Tourism Division</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground mb-6 leading-tight">
                Global Healthcare &<br />
                <span className="text-primary">Pilgrimage Facilitation Program</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                AITAS facilitates international patients and pilgrims by connecting them to accredited hospitals, healthcare specialists, and religious tourism circuits in India and other partner countries.
              </p>
            </div>
          </div>
        </section>

        {/* Tab Navigation */}
        <section className="border-b border-border sticky top-20 bg-background z-20">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex gap-0">
              {[
                { id: 'medical', label: 'Medical Tourism', icon: Stethoscope },
                { id: 'pilgrimage', label: 'Pilgrimage & Religious Tourism', icon: Globe },
                { id: 'partner', label: 'Partner With AITAS', icon: Building2 },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id 
                      ? 'border-primary text-primary' 
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Medical Tourism Section */}
        {activeTab === 'medical' && (
          <section className="py-16">
            <div className="container mx-auto px-4 lg:px-8">
              <div className="mb-16">
                <h2 className="text-3xl font-serif font-bold text-foreground mb-3">
                  Medical Tourism <span className="text-primary">Services</span>
                </h2>
                <p className="text-muted-foreground mb-8 max-w-2xl">
                  Comprehensive healthcare coordination for international patients seeking world-class treatment in India at a fraction of global costs.
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  {medicalServices.map((service, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 bg-card rounded-sm border border-border">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-foreground">{service}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cost Comparison */}
              <div className="mb-16">
                <h3 className="text-2xl font-serif font-bold text-foreground mb-6">
                  Cost Advantage: <span className="text-primary">India vs Global Markets</span>
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full border border-border rounded-sm">
                    <thead>
                      <tr className="bg-primary/10">
                        <th className="text-left p-4 font-semibold text-sm text-foreground">Procedure</th>
                        <th className="text-left p-4 font-semibold text-sm text-foreground">India</th>
                        <th className="text-left p-4 font-semibold text-sm text-foreground">USA</th>
                        <th className="text-left p-4 font-semibold text-sm text-foreground">UK</th>
                      </tr>
                    </thead>
                    <tbody>
                      {costComparison.map((row, i) => (
                        <tr key={i} className="border-t border-border">
                          <td className="p-4 text-sm font-medium text-foreground">{row.procedure}</td>
                          <td className="p-4 text-sm text-primary font-semibold">{row.india}</td>
                          <td className="p-4 text-sm text-muted-foreground">{row.usa}</td>
                          <td className="p-4 text-sm text-muted-foreground">{row.uk}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Medical Consultation Form */}
              <Card className="border border-primary/20 max-w-2xl">
                <CardHeader>
                  <CardTitle className="text-2xl font-serif flex items-center gap-3">
                    <Stethoscope className="w-6 h-6 text-primary" />
                    Request Medical Consultation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Patient Name *</label>
                      <Input placeholder="Full name" className="rounded-sm" value={medicalForm.patient_name} onChange={e => setMedicalForm({...medicalForm, patient_name: e.target.value})} />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Country *</label>
                      <Input placeholder="Your country" className="rounded-sm" value={medicalForm.country} onChange={e => setMedicalForm({...medicalForm, country: e.target.value})} />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Medical Condition *</label>
                    <Textarea placeholder="Describe the medical condition or treatment needed" className="rounded-sm" value={medicalForm.medical_condition} onChange={e => setMedicalForm({...medicalForm, medical_condition: e.target.value})} />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Preferred Treatment Location</label>
                      <Input placeholder="e.g., Mumbai, Delhi, Chennai" className="rounded-sm" value={medicalForm.preferred_location} onChange={e => setMedicalForm({...medicalForm, preferred_location: e.target.value})} />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Contact Email *</label>
                      <Input type="email" placeholder="your@email.com" className="rounded-sm" value={medicalForm.contact_email} onChange={e => setMedicalForm({...medicalForm, contact_email: e.target.value})} />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Phone Number</label>
                    <Input type="tel" placeholder="+1 234 567 8900" className="rounded-sm" value={medicalForm.contact_phone} onChange={e => setMedicalForm({...medicalForm, contact_phone: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Upload Medical Reports</label>
                    <div className="border-2 border-dashed border-border rounded-sm p-6 text-center hover:border-primary/30 transition-colors cursor-pointer">
                      <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                      <p className="text-xs text-muted-foreground mt-1">PDF, JPG, PNG up to 10MB</p>
                    </div>
                  </div>
                  <Button className="w-full" size="lg" onClick={handleMedicalSubmit} disabled={medicalSubmitting}>
                    {medicalSubmitting ? 'Submitting...' : 'Submit Consultation Request'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </section>
        )}

        {/* Pilgrimage Section */}
        {activeTab === 'pilgrimage' && (
          <section className="py-16">
            <div className="container mx-auto px-4 lg:px-8">
              <h2 className="text-3xl font-serif font-bold text-foreground mb-3">
                International Pilgrimage & <span className="text-primary">Religious Tourism</span>
              </h2>
              <p className="text-muted-foreground mb-10 max-w-2xl">
                Facilitated tours connecting pilgrims and spiritual travelers with sacred sites across India and partner countries.
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-12">
                {pilgrimageCircuits.map((circuit, i) => (
                  <Card key={i} className="border hover:border-primary/30 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-sm bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Star className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-lg font-serif font-bold text-foreground mb-2">{circuit.title}</h3>
                          <p className="text-sm text-muted-foreground">{circuit.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-12">
                {[
                  { icon: Shield, title: "VIP Darshan Coordination", desc: "Priority access and special arrangements at major religious sites" },
                  { icon: Users, title: "Group Tour Handling", desc: "Complete logistics for group pilgrimages and spiritual tours" },
                  { icon: Plane, title: "Visa & Travel Coordination", desc: "End-to-end visa processing and travel arrangement support" },
                  { icon: Globe, title: "Cultural & Spiritual Packages", desc: "Curated experiences combining spirituality with cultural immersion" },
                  { icon: FileText, title: "International Faith Partnerships", desc: "Collaborations with religious organizations worldwide" },
                  { icon: MapPin, title: "Custom Itineraries", desc: "Personalized pilgrimage routes tailored to your spiritual journey" },
                ].map((item, i) => (
                  <Card key={i} className="border hover:border-primary/30 transition-colors">
                    <CardContent className="p-6">
                      <item.icon className="w-8 h-8 text-primary mb-4" />
                      <h4 className="font-serif font-bold text-foreground mb-2">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Plan Pilgrimage Form */}
              <Card className="border border-primary/20 max-w-2xl">
                <CardHeader>
                  <CardTitle className="text-2xl font-serif flex items-center gap-3">
                    <Globe className="w-6 h-6 text-primary" />
                    Plan Your Pilgrimage
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Full Name *</label>
                      <Input placeholder="Your name" className="rounded-sm" value={pilgrimageForm.client_name} onChange={e => setPilgrimageForm({...pilgrimageForm, client_name: e.target.value})} />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Country *</label>
                      <Input placeholder="Your country" className="rounded-sm" value={pilgrimageForm.country} onChange={e => setPilgrimageForm({...pilgrimageForm, country: e.target.value})} />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Pilgrimage Interest *</label>
                    <Textarea placeholder="Describe the pilgrimage circuit or sites you're interested in" className="rounded-sm" value={pilgrimageForm.special_requests} onChange={e => setPilgrimageForm({...pilgrimageForm, special_requests: e.target.value})} />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Group Size</label>
                      <Input type="number" placeholder="Number of travelers" className="rounded-sm" value={pilgrimageForm.group_size} onChange={e => setPilgrimageForm({...pilgrimageForm, group_size: e.target.value})} />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Preferred Dates</label>
                      <Input type="text" placeholder="e.g., March 2026" className="rounded-sm" value={pilgrimageForm.preferred_dates} onChange={e => setPilgrimageForm({...pilgrimageForm, preferred_dates: e.target.value})} />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Contact Email *</label>
                    <Input type="email" placeholder="your@email.com" className="rounded-sm" value={pilgrimageForm.client_email} onChange={e => setPilgrimageForm({...pilgrimageForm, client_email: e.target.value})} />
                  </div>
                  <Button className="w-full" size="lg" onClick={handlePilgrimageSubmit} disabled={pilgrimageSubmitting}>
                    {pilgrimageSubmitting ? 'Submitting...' : 'Submit Pilgrimage Request'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </section>
        )}

        {/* Partner Section */}
        {activeTab === 'partner' && (
          <section className="py-16">
            <div className="container mx-auto px-4 lg:px-8">
              <h2 className="text-3xl font-serif font-bold text-foreground mb-3">
                Partner With <span className="text-primary">AITAS</span>
              </h2>
              <p className="text-muted-foreground mb-10 max-w-2xl">
                Join our network of accredited hospitals, healthcare specialists, and tourism operators to serve international clients.
              </p>

              <div className="grid md:grid-cols-2 gap-8">
                <Card className="border border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-xl font-serif flex items-center gap-3">
                      <Stethoscope className="w-5 h-5 text-primary" />
                      Hospital Registration
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Input placeholder="Hospital / Clinic Name *" className="rounded-sm" />
                    <Input placeholder="City, State *" className="rounded-sm" />
                    <Input placeholder="Specializations *" className="rounded-sm" />
                    <Input placeholder="Accreditation Details (NABH, JCI, etc.)" className="rounded-sm" />
                    <Input placeholder="Contact Person *" className="rounded-sm" />
                    <Input type="email" placeholder="Email *" className="rounded-sm" />
                    <Input type="tel" placeholder="Phone *" className="rounded-sm" />
                    <Textarea placeholder="Additional information about your facility" className="rounded-sm" />
                    <Button className="w-full">Register Hospital</Button>
                  </CardContent>
                </Card>

                <Card className="border border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-xl font-serif flex items-center gap-3">
                      <Plane className="w-5 h-5 text-primary" />
                      Tourism Partner Registration
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Input placeholder="Company Name *" className="rounded-sm" />
                    <Input placeholder="Service Type (Tour Operator, Travel Agent, etc.) *" className="rounded-sm" />
                    <Input placeholder="Operating Regions *" className="rounded-sm" />
                    <Input placeholder="License / Registration Number" className="rounded-sm" />
                    <Input placeholder="Contact Person *" className="rounded-sm" />
                    <Input type="email" placeholder="Email *" className="rounded-sm" />
                    <Input type="tel" placeholder="Phone *" className="rounded-sm" />
                    <Textarea placeholder="Describe your tourism services" className="rounded-sm" />
                    <Button className="w-full">Register as Partner</Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
