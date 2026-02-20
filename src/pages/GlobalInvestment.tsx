import { useState } from 'react';
import { 
  Globe, Building2, ArrowRight, CheckCircle2, MapPin, 
  Briefcase, Shield, Clock, DollarSign, Users, 
  FileText, Landmark, TrendingUp, Handshake
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const countries = [
  { code: 'AE', name: 'UAE (Dubai)', emoji: '🇦🇪', types: ['Freezone', 'Mainland'], highlight: 'Tax-free zones, 100% foreign ownership' },
  { code: 'GB', name: 'United Kingdom', emoji: '🇬🇧', types: ['Ltd Company'], highlight: 'Gateway to European markets' },
  { code: 'EE', name: 'Estonia', emoji: '🇪🇪', types: ['E-Residency'], highlight: 'Digital-first EU business setup' },
  { code: 'MY', name: 'Malaysia', emoji: '🇲🇾', types: ['Sdn Bhd'], highlight: 'Strategic ASEAN hub' },
  { code: 'IN', name: 'India', emoji: '🇮🇳', types: ['Pvt Ltd', 'LLP'], highlight: "World's fastest-growing major economy" },
];

const services = [
  { icon: FileText, title: 'Company Registration', desc: 'Full incorporation and legal entity setup' },
  { icon: Landmark, title: 'Bank Account Assistance', desc: 'Corporate banking setup coordination' },
  { icon: Shield, title: 'Compliance Structuring', desc: 'Regulatory framework and governance' },
  { icon: DollarSign, title: 'Tax Advisory Coordination', desc: 'Corporate tax planning and optimization' },
  { icon: Users, title: 'Local Sponsor Guidance', desc: 'Partner identification where required' },
  { icon: Building2, title: 'Office & Flexi-desk Setup', desc: 'Physical presence establishment' },
  { icon: Briefcase, title: 'PRO Services', desc: 'Government liaison and documentation' },
  { icon: Globe, title: 'Market Entry Strategy', desc: 'Feasibility and market analysis' },
];

const investmentServices = [
  'Investor matchmaking',
  'FDI advisory coordination',
  'Joint venture structuring',
  'Industry mapping reports',
  'Capital partnership facilitation',
  'Industrial land & zone identification',
  'Strategic introductions',
];

const tiers = [
  { name: 'Basic', price: 'From $1,500', features: ['Company registration', 'Basic compliance', 'Document preparation', 'Email support'] },
  { name: 'Advanced', price: 'From $3,500', features: ['Everything in Basic', 'Bank account setup', 'Tax advisory session', 'PRO services', 'Priority support'], popular: true },
  { name: 'Premium', price: 'From $7,500', features: ['Everything in Advanced', 'Office setup', 'Market entry strategy', 'Ongoing compliance', 'Dedicated manager', '12-month support'] },
];

export default function GlobalInvestment() {
  const [activeTab, setActiveTab] = useState('setup');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [investorForm, setInvestorForm] = useState({
    investor_name: '', company_name: '', email: '', phone: '', country: '',
    investor_type: '', capital_range: '', sectors_of_interest: '', investment_preference: '', experience_summary: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleInvestorSubmit = async () => {
    if (!investorForm.investor_name || !investorForm.email) {
      toast.error('Please fill in required fields');
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from('investor_registrations').insert({
      investor_name: investorForm.investor_name,
      company_name: investorForm.company_name || null,
      email: investorForm.email,
      phone: investorForm.phone || null,
      country: investorForm.country || null,
      investor_type: investorForm.investor_type || null,
      capital_range: investorForm.capital_range || null,
      sectors_of_interest: investorForm.sectors_of_interest ? investorForm.sectors_of_interest.split(',').map(s => s.trim()) : [],
      investment_preference: investorForm.investment_preference || null,
      experience_summary: investorForm.experience_summary || null,
    });
    setSubmitting(false);
    if (error) {
      toast.error('Submission failed. Please try again.');
    } else {
      toast.success('Registration submitted successfully! Our team will review your application.');
      setInvestorForm({ investor_name: '', company_name: '', email: '', phone: '', country: '', investor_type: '', capital_range: '', sectors_of_interest: '', investment_preference: '', experience_summary: '' });
    }
  };

  const { data: projects } = useQuery({
    queryKey: ['investment-projects'],
    queryFn: async () => {
      const { data } = await supabase.from('investment_projects').select('*').eq('is_active', true).eq('is_public', true).order('created_at', { ascending: false }).limit(6);
      return data || [];
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        {/* Hero */}
        <section className="bg-primary/5 border-b border-border py-20 lg:py-28">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-sm mb-6">
                <Globe className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Global Investment & Expansion Division</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground mb-6 leading-tight">
                Enabling Strategic<br />
                <span className="text-primary">Global Expansion</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                AITAS facilitates international company formation, investment partnerships, and market entry across key global jurisdictions.
              </p>
            </div>
          </div>
        </section>

        {/* Tab Navigation */}
        <section className="border-b border-border sticky top-20 bg-background z-20">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex gap-0 overflow-x-auto">
              {[
                { id: 'setup', label: 'Company Setup', icon: Building2 },
                { id: 'investment', label: 'Investment Facilitation', icon: TrendingUp },
                { id: 'projects', label: 'Projects', icon: Briefcase },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Company Setup Tab */}
        {activeTab === 'setup' && (
          <section className="py-16">
            <div className="container mx-auto px-4 lg:px-8">
              {/* Countries Grid */}
              <div className="mb-16">
                <h2 className="text-3xl font-serif font-bold text-foreground mb-3">
                  International Company <span className="text-primary">Setup Desk</span>
                </h2>
                <p className="text-muted-foreground mb-8 max-w-2xl">
                  Establish your business presence in key global markets with AITAS coordination support.
                </p>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {countries.map((country) => (
                    <Card key={country.code} className="border hover:border-primary/30 transition-colors group cursor-pointer" onClick={() => setSelectedCountry(country.code)}>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <span className="text-4xl">{country.emoji}</span>
                          <div className="flex-1">
                            <h3 className="text-lg font-serif font-bold text-foreground mb-1">{country.name}</h3>
                            <p className="text-sm text-muted-foreground mb-3">{country.highlight}</p>
                            <div className="flex flex-wrap gap-1.5">
                              {country.types.map((type) => (
                                <Badge key={type} variant="secondary" className="text-xs">{type}</Badge>
                              ))}
                            </div>
                          </div>
                          <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Services Grid */}
              <div className="mb-16">
                <h3 className="text-2xl font-serif font-bold text-foreground mb-6">
                  Setup Services <span className="text-primary">Included</span>
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {services.map((service) => (
                    <div key={service.title} className="flex items-start gap-3 p-4 bg-card rounded-sm border border-border">
                      <service.icon className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="text-sm font-semibold text-foreground">{service.title}</h4>
                        <p className="text-xs text-muted-foreground mt-0.5">{service.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Package Tiers */}
              <div className="mb-16">
                <h3 className="text-2xl font-serif font-bold text-foreground mb-6">
                  Setup Package <span className="text-primary">Tiers</span>
                </h3>
                <div className="grid md:grid-cols-3 gap-6">
                  {tiers.map((tier) => (
                    <Card key={tier.name} className={`border relative ${tier.popular ? 'border-primary shadow-md' : ''}`}>
                      {tier.popular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                          <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                        </div>
                      )}
                      <CardHeader>
                        <CardTitle className="text-xl font-serif">{tier.name}</CardTitle>
                        <p className="text-2xl font-bold text-primary">{tier.price}</p>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          {tier.features.map((f) => (
                            <li key={f} className="flex items-start gap-2 text-sm">
                              <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                              <span className="text-foreground">{f}</span>
                            </li>
                          ))}
                        </ul>
                        <Button className="w-full mt-6" variant={tier.popular ? 'default' : 'outline'}>
                          Start Setup <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Lead Capture */}
              <Card className="border border-primary/20 max-w-2xl">
                <CardHeader>
                  <CardTitle className="text-2xl font-serif flex items-center gap-3">
                    <Globe className="w-6 h-6 text-primary" />
                    Start Your Global Expansion
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Full Name *</label>
                      <Input placeholder="Your name" className="rounded-sm" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Country of Interest *</label>
                      <Select>
                        <SelectTrigger className="rounded-sm"><SelectValue placeholder="Select country" /></SelectTrigger>
                        <SelectContent>
                          {countries.map(c => <SelectItem key={c.code} value={c.code}>{c.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Email *</label>
                      <Input type="email" placeholder="you@company.com" className="rounded-sm" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Phone</label>
                      <Input type="tel" placeholder="+1 234 567 8900" className="rounded-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Business Requirements</label>
                    <Textarea placeholder="Describe your expansion goals..." className="rounded-sm" />
                  </div>
                  <Button className="w-full" size="lg">
                    Submit Inquiry <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </section>
        )}

        {/* Investment Facilitation Tab */}
        {activeTab === 'investment' && (
          <section className="py-16">
            <div className="container mx-auto px-4 lg:px-8">
              <div className="mb-16">
                <h2 className="text-3xl font-serif font-bold text-foreground mb-3">
                  Investment & Joint Venture <span className="text-primary">Facilitation</span>
                </h2>
                <p className="text-muted-foreground mb-8 max-w-2xl">
                  AITAS connects investors, enterprises, and projects for strategic partnerships across global markets.
                </p>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
                  {investmentServices.map((s, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 bg-card rounded-sm border border-border">
                      <Handshake className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-foreground">{s}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Investor Registration Form */}
              <Card className="border border-primary/20 max-w-2xl">
                <CardHeader>
                  <CardTitle className="text-2xl font-serif flex items-center gap-3">
                    <TrendingUp className="w-6 h-6 text-primary" />
                    Investor Registration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Investor Name *</label>
                      <Input placeholder="Full name" className="rounded-sm" value={investorForm.investor_name} onChange={e => setInvestorForm({...investorForm, investor_name: e.target.value})} />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Company / Fund</label>
                      <Input placeholder="Organization name" className="rounded-sm" value={investorForm.company_name} onChange={e => setInvestorForm({...investorForm, company_name: e.target.value})} />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Email *</label>
                      <Input type="email" placeholder="you@fund.com" className="rounded-sm" value={investorForm.email} onChange={e => setInvestorForm({...investorForm, email: e.target.value})} />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Country</label>
                      <Input placeholder="Your country" className="rounded-sm" value={investorForm.country} onChange={e => setInvestorForm({...investorForm, country: e.target.value})} />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Investor Type</label>
                      <Select value={investorForm.investor_type} onValueChange={v => setInvestorForm({...investorForm, investor_type: v})}>
                        <SelectTrigger className="rounded-sm"><SelectValue placeholder="Select type" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="individual">Individual</SelectItem>
                          <SelectItem value="corporate">Corporate</SelectItem>
                          <SelectItem value="institutional">Institutional</SelectItem>
                          <SelectItem value="family_office">Family Office</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Capital Range</label>
                      <Select value={investorForm.capital_range} onValueChange={v => setInvestorForm({...investorForm, capital_range: v})}>
                        <SelectTrigger className="rounded-sm"><SelectValue placeholder="Select range" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="$50K-$100K">$50K – $100K</SelectItem>
                          <SelectItem value="$100K-$500K">$100K – $500K</SelectItem>
                          <SelectItem value="$500K-$1M">$500K – $1M</SelectItem>
                          <SelectItem value="$1M-$5M">$1M – $5M</SelectItem>
                          <SelectItem value="$5M+">$5M+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Sectors of Interest</label>
                    <Input placeholder="e.g., Agri, Tech, Healthcare, Manufacturing" className="rounded-sm" value={investorForm.sectors_of_interest} onChange={e => setInvestorForm({...investorForm, sectors_of_interest: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Experience Summary</label>
                    <Textarea placeholder="Brief background and investment thesis..." className="rounded-sm" value={investorForm.experience_summary} onChange={e => setInvestorForm({...investorForm, experience_summary: e.target.value})} />
                  </div>
                  <Button className="w-full" size="lg" onClick={handleInvestorSubmit} disabled={submitting}>
                    {submitting ? 'Submitting...' : 'Register as Investor'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </section>
        )}

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <section className="py-16">
            <div className="container mx-auto px-4 lg:px-8">
              <h2 className="text-3xl font-serif font-bold text-foreground mb-3">
                Investment <span className="text-primary">Projects</span>
              </h2>
              <p className="text-muted-foreground mb-8 max-w-2xl">
                Browse active investment opportunities curated by AITAS.
              </p>
              {projects && projects.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map((project: any) => (
                    <Card key={project.id} className="border hover:border-primary/30 transition-colors">
                      <CardContent className="p-6">
                        {project.is_featured && <Badge className="bg-primary text-primary-foreground mb-3">Featured</Badge>}
                        <h3 className="text-lg font-serif font-bold text-foreground mb-2">{project.title}</h3>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{project.description}</p>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between"><span className="text-muted-foreground">Sector</span><span className="font-medium">{project.sector}</span></div>
                          <div className="flex justify-between"><span className="text-muted-foreground">Country</span><span className="font-medium">{project.country}</span></div>
                          {project.investment_required && (
                            <div className="flex justify-between"><span className="text-muted-foreground">Investment</span><span className="font-medium text-primary">{project.currency} {project.investment_required?.toLocaleString()}</span></div>
                          )}
                          {project.project_stage && (
                            <div className="flex justify-between"><span className="text-muted-foreground">Stage</span><Badge variant="secondary" className="text-xs capitalize">{project.project_stage}</Badge></div>
                          )}
                        </div>
                        <Button variant="outline" className="w-full mt-4" size="sm">
                          Express Interest <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="border">
                  <CardContent className="p-12 text-center">
                    <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-serif font-bold text-foreground mb-2">Projects Coming Soon</h3>
                    <p className="text-sm text-muted-foreground">Investment opportunities are being curated. Register as an investor to get early access.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
