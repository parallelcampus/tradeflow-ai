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
  Shield,
  UserPlus,
  CloudUpload,
  Cpu,
  Hospital,
  HeartHandshake,
  Lock
} from "lucide-react";
import { Link } from "react-router-dom";
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

const howItWorksSteps = [
  {
    step: 1,
    icon: UserPlus,
    headline: "Create Your Secure Medical Profile",
    content: "Patients begin by registering through the secure AITAS Medical Portal. Basic personal details and treatment intent are submitted. A unique patient ID is generated for tracking.",
    note: "All submissions are encrypted and handled under strict confidentiality standards.",
  },
  {
    step: 2,
    icon: CloudUpload,
    headline: "Confidential Medical Document Upload",
    content: "Patients upload diagnostic reports, medical history, imaging scans, and prescriptions. Files are securely stored in an encrypted document vault accessible only to authorized case coordinators.",
    items: ["Diagnostic reports", "Medical history", "Imaging scans", "Prescriptions"],
  },
  {
    step: 3,
    icon: Cpu,
    headline: "AI-Assisted Case Structuring",
    content: "AITAS uses advanced AI large language model technology to organize medical documents, extract structured medical data, identify treatment categories, flag key clinical indicators, and prepare structured medical summaries.",
    items: ["Organize medical documents", "Extract structured medical data", "Identify treatment categories", "Flag key clinical indicators", "Prepare structured medical summaries"],
    disclaimer: "The AI system does NOT provide medical diagnosis or treatment advice. It is used solely to organize and structure information to support efficient specialist review.",
  },
  {
    step: 4,
    icon: Hospital,
    headline: "Secure Specialist Review",
    content: "Structured case summaries are shared privately with accredited hospitals and specialists in India. Doctors review medical reports, AI-structured summaries, and clinical documentation. Hospitals provide medical opinions, treatment pathways, suggested duration, and required pre-travel preparation.",
  },
  {
    step: 5,
    icon: Plane,
    headline: "End-to-End Treatment Coordination",
    content: "Once the patient confirms the preferred hospital, AITAS coordinates the entire journey.",
    items: ["Medical visa documentation guidance", "Travel coordination", "Accommodation assistance", "Airport transfer", "Admission scheduling", "In-hospital case management"],
  },
  {
    step: 6,
    icon: HeartHandshake,
    headline: "Continued Care & Remote Follow-Up",
    content: "After treatment, patients receive continued support through follow-up report uploads, tele-consultation coordination, and long-term monitoring plans.",
    items: ["Follow-up reports uploaded", "Tele-consultation coordination", "Long-term monitoring plan provided"],
  },
];

export default function TourismMedical() {
  const [activeTab, setActiveTab] = useState<'medical' | 'pilgrimage' | 'partner'>('medical');
  
  // Pilgrimage form state
  const [pilgrimageForm, setPilgrimageForm] = useState({
    client_name: '', country: '', special_requests: '', group_size: '',
    preferred_dates: '', client_email: '',
  });
  const [pilgrimageSubmitting, setPilgrimageSubmitting] = useState(false);


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
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-6 leading-tight">
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
                <h2 className="text-3xl font-display font-bold text-foreground mb-3">
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

              {/* How It Works Section */}
              <div className="mb-16">
                <div className="text-center mb-12">
                  <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-semibold rounded-sm mb-4">
                    AI-Powered Secure Process
                  </span>
                  <h3 className="text-2xl md:text-3xl font-display font-bold text-foreground">
                    How It Works — <span className="text-primary">Secure, Structured & Intelligent Coordination</span>
                  </h3>
                </div>

                <div className="space-y-6">
                  {howItWorksSteps.map((step) => {
                    const StepIcon = step.icon;
                    return (
                      <div key={step.step} className="flex gap-6 items-start">
                        {/* Step Number & Line */}
                        <div className="flex flex-col items-center flex-shrink-0">
                          <div className="w-12 h-12 rounded-sm bg-primary flex items-center justify-center">
                            <StepIcon className="w-6 h-6 text-primary-foreground" />
                          </div>
                          {step.step < 6 && <div className="w-px h-full min-h-[40px] bg-border mt-2" />}
                        </div>

                        {/* Step Content */}
                        <div className="pb-6 flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-sm">STEP {step.step}</span>
                          </div>
                          <h4 className="text-lg font-display font-bold text-foreground mb-2">{step.headline}</h4>
                          <p className="text-sm text-muted-foreground leading-relaxed mb-3">{step.content}</p>
                          
                          {step.items && (
                            <ul className="space-y-1.5 mb-3">
                              {step.items.map((item, i) => (
                                <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          )}

                          {step.note && (
                            <div className="flex items-start gap-2 bg-primary/5 border border-primary/15 rounded-sm p-3">
                              <Shield className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                              <p className="text-xs text-muted-foreground">{step.note}</p>
                            </div>
                          )}

                          {step.disclaimer && (
                            <div className="flex items-start gap-2 bg-destructive/5 border border-destructive/15 rounded-sm p-3">
                              <Shield className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                              <p className="text-xs text-muted-foreground"><strong>Important:</strong> {step.disclaimer}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Trust & Security Box */}
                <div className="mt-12 bg-primary/5 border border-primary/20 rounded-sm p-8 lg:p-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-sm bg-primary flex items-center justify-center">
                      <Lock className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <h4 className="text-xl font-display font-bold text-foreground">Your Data. Your Privacy. Your Control.</h4>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      "Encrypted document storage",
                      "Restricted access controls",
                      "No third-party data sharing without consent",
                      "Secure AI environment",
                      "Confidential case routing",
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                        <span className="text-sm text-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* CTA to Register */}
              <div className="bg-primary/5 border border-primary/20 rounded-sm p-8 lg:p-10 max-w-2xl text-center">
                <Shield className="w-10 h-10 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-display font-bold text-foreground mb-3">
                  Start Your Medical Journey
                </h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Register securely on the AITAS Medical Portal to submit your details, upload medical records, and receive coordinated specialist care.
                </p>
                <Link to="/auth">
                  <Button size="lg" className="group">
                    Register Now
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Pilgrimage Section */}
        {activeTab === 'pilgrimage' && (
          <section className="py-16">
            <div className="container mx-auto px-4 lg:px-8">
              <h2 className="text-3xl font-display font-bold text-foreground mb-3">
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
                          <h3 className="text-lg font-display font-bold text-foreground mb-2">{circuit.title}</h3>
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
                      <h4 className="font-display font-bold text-foreground mb-2">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Plan Pilgrimage Form */}
              <Card className="border border-primary/20 max-w-2xl">
                <CardHeader>
                  <CardTitle className="text-2xl font-display flex items-center gap-3">
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
              <h2 className="text-3xl font-display font-bold text-foreground mb-3">
                Partner With <span className="text-primary">AITAS</span>
              </h2>
              <p className="text-muted-foreground mb-10 max-w-2xl">
                Join our network of accredited hospitals, healthcare specialists, and tourism operators to serve international clients.
              </p>

              <div className="grid md:grid-cols-2 gap-8">
                <Card className="border border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-xl font-display flex items-center gap-3">
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
                    <CardTitle className="text-xl font-display flex items-center gap-3">
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
