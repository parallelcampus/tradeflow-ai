import { useState } from 'react';
import { 
  Factory, ArrowRight, CheckCircle2, Globe, Search,
  Wrench, Truck, ClipboardCheck, MapPin, Users, Shield,
  Building2, Package
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const requestTypes = [
  { value: 'seeking_manufacturer', label: 'Seeking Manufacturing Partner', icon: Search, desc: 'Global companies looking for manufacturing in India or other markets' },
  { value: 'offering_manufacturing', label: 'Offering Manufacturing Capacity', icon: Factory, desc: 'Indian manufacturers seeking global clients and export orders' },
  { value: 'contract_manufacturing', label: 'Contract Manufacturing', icon: ClipboardCheck, desc: 'OEM/ODM partnerships for product development and production' },
  { value: 'vendor_sourcing', label: 'Vendor Sourcing', icon: Package, desc: 'Raw material and component supplier identification' },
];

const services = [
  { icon: Search, title: 'Factory Matchmaking', desc: 'AI-assisted matching between global buyers and Indian manufacturers' },
  { icon: Package, title: 'Vendor Sourcing', desc: 'Identify and vet raw material and component suppliers' },
  { icon: ClipboardCheck, title: 'Contract Manufacturing', desc: 'OEM/ODM facilitation with IP protection frameworks' },
  { icon: Shield, title: 'Industrial Due Diligence', desc: 'Factory audits, quality checks, and compliance verification' },
  { icon: MapPin, title: 'Site Visit Coordination', desc: 'Arrange factory tours and industrial zone visits' },
  { icon: Truck, title: 'Logistics Facilitation', desc: 'Export packaging, shipping, and customs coordination' },
];

const sectors = [
  'Agri & Food Processing', 'Automotive & Auto Parts', 'Chemicals & Pharmaceuticals',
  'Electronics & IoT', 'Healthcare Equipment', 'Machinery & Tools',
  'Packaging', 'Plastics & Rubber', 'Textiles & Garments', 'Other',
];

export default function ManufacturingPartnerships() {
  const [selectedType, setSelectedType] = useState('');
  const [form, setForm] = useState({
    company_name: '', contact_name: '', contact_email: '', contact_phone: '',
    country: '', sector: '', product_category: '', requirements: '',
    annual_volume: '', budget_range: '', preferred_countries: '',
    certifications_required: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!form.company_name || !form.contact_name || !form.contact_email || !selectedType) {
      toast.error('Please fill in required fields and select a request type');
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from('manufacturing_partnerships').insert({
      request_type: selectedType,
      company_name: form.company_name,
      contact_name: form.contact_name,
      contact_email: form.contact_email,
      contact_phone: form.contact_phone || null,
      country: form.country || null,
      sector: form.sector || null,
      product_category: form.product_category || null,
      requirements: form.requirements || null,
      annual_volume: form.annual_volume || null,
      budget_range: form.budget_range || null,
      preferred_countries: form.preferred_countries ? form.preferred_countries.split(',').map(s => s.trim()) : [],
      certifications_required: form.certifications_required ? form.certifications_required.split(',').map(s => s.trim()) : [],
    });
    setSubmitting(false);
    if (error) {
      toast.error('Submission failed. Please try again.');
    } else {
      toast.success('Partnership request submitted! Our team will match you with suitable partners.');
      setForm({ company_name: '', contact_name: '', contact_email: '', contact_phone: '', country: '', sector: '', product_category: '', requirements: '', annual_volume: '', budget_range: '', preferred_countries: '', certifications_required: '' });
      setSelectedType('');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        {/* Hero */}
        <section className="bg-primary/5 border-b border-border py-20 lg:py-28">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-sm mb-6">
                <Factory className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Manufacturing & Industry Partnerships</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-6 leading-tight">
                Manufacturing &<br />
                <span className="text-primary">Industrial Partnerships</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                AITAS connects global companies with Indian manufacturers, facilitates contract manufacturing, vendor sourcing, and industrial collaborations across sectors.
              </p>
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="py-16">
          <div className="container mx-auto px-4 lg:px-8">
            <h2 className="text-3xl font-display font-bold text-foreground mb-3">
              Partnership <span className="text-primary">Services</span>
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl">
              End-to-end manufacturing partnership facilitation for global enterprises and Indian exporters.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {services.map((s) => (
                <Card key={s.title} className="border hover:border-primary/30 transition-colors">
                  <CardContent className="p-6">
                    <s.icon className="w-8 h-8 text-primary mb-4" />
                    <h3 className="text-lg font-display font-bold text-foreground mb-2">{s.title}</h3>
                    <p className="text-sm text-muted-foreground">{s.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Request Type Selection */}
            <div className="mb-12">
              <h3 className="text-2xl font-display font-bold text-foreground mb-6">
                Select Your <span className="text-primary">Request Type</span>
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {requestTypes.map((rt) => (
                  <Card 
                    key={rt.value} 
                    className={`border cursor-pointer transition-all ${selectedType === rt.value ? 'border-primary bg-primary/5' : 'hover:border-primary/30'}`}
                    onClick={() => setSelectedType(rt.value)}
                  >
                    <CardContent className="p-6 flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-sm flex items-center justify-center flex-shrink-0 ${selectedType === rt.value ? 'bg-primary' : 'bg-primary/10'}`}>
                        <rt.icon className={`w-6 h-6 ${selectedType === rt.value ? 'text-primary-foreground' : 'text-primary'}`} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">{rt.label}</h4>
                        <p className="text-sm text-muted-foreground">{rt.desc}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Partnership Form */}
            <Card className="border border-primary/20 max-w-2xl">
              <CardHeader>
                <CardTitle className="text-2xl font-display flex items-center gap-3">
                  <Factory className="w-6 h-6 text-primary" />
                  Find a Manufacturing Partner
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Company Name *</label>
                    <Input placeholder="Your company" className="rounded-sm" value={form.company_name} onChange={e => setForm({...form, company_name: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Contact Name *</label>
                    <Input placeholder="Full name" className="rounded-sm" value={form.contact_name} onChange={e => setForm({...form, contact_name: e.target.value})} />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Email *</label>
                    <Input type="email" placeholder="you@company.com" className="rounded-sm" value={form.contact_email} onChange={e => setForm({...form, contact_email: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Country</label>
                    <Input placeholder="Your country" className="rounded-sm" value={form.country} onChange={e => setForm({...form, country: e.target.value})} />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Sector</label>
                    <Select value={form.sector} onValueChange={v => setForm({...form, sector: v})}>
                      <SelectTrigger className="rounded-sm"><SelectValue placeholder="Select sector" /></SelectTrigger>
                      <SelectContent>
                        {sectors.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Product Category</label>
                    <Input placeholder="e.g., Auto Parts, Textiles" className="rounded-sm" value={form.product_category} onChange={e => setForm({...form, product_category: e.target.value})} />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Requirements</label>
                  <Textarea placeholder="Describe your manufacturing requirements, specifications, and quality standards..." className="rounded-sm" value={form.requirements} onChange={e => setForm({...form, requirements: e.target.value})} />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Annual Volume</label>
                    <Input placeholder="e.g., 10,000 units/year" className="rounded-sm" value={form.annual_volume} onChange={e => setForm({...form, annual_volume: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Budget Range</label>
                    <Input placeholder="e.g., $100K-$500K" className="rounded-sm" value={form.budget_range} onChange={e => setForm({...form, budget_range: e.target.value})} />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Required Certifications</label>
                  <Input placeholder="e.g., ISO 9001, CE, FDA (comma-separated)" className="rounded-sm" value={form.certifications_required} onChange={e => setForm({...form, certifications_required: e.target.value})} />
                </div>
                <Button className="w-full" size="lg" onClick={handleSubmit} disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Find a Manufacturing Partner'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
