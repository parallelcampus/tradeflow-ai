import { useState } from 'react';
import { 
  Search, Filter, Globe, ArrowRight, FileText, 
  Calendar, Tag, ExternalLink, Star, Landmark,
  CheckCircle2, DollarSign
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const countryOptions = [
  { value: 'all', label: 'All Countries' },
  { value: 'India', label: 'India' },
  { value: 'UAE', label: 'UAE' },
  { value: 'UK', label: 'United Kingdom' },
  { value: 'Malaysia', label: 'Malaysia' },
  { value: 'Estonia', label: 'Estonia' },
];

const categoryOptions = [
  { value: 'all', label: 'All Categories' },
  { value: 'export_subsidy', label: 'Export Subsidy' },
  { value: 'manufacturing', label: 'Manufacturing Incentives' },
  { value: 'startup_grants', label: 'Startup Grants' },
  { value: 'tax_relief', label: 'Tax Relief' },
  { value: 'freezone', label: 'Freezone Benefits' },
  { value: 'innovation', label: 'Innovation Schemes' },
];

const categoryLabels: Record<string, string> = {
  export_subsidy: 'Export Subsidy',
  manufacturing: 'Manufacturing',
  startup_grants: 'Startup Grants',
  tax_relief: 'Tax Relief',
  freezone: 'Freezone',
  innovation: 'Innovation',
};

export default function SchemesDatabase() {
  const [countryFilter, setCountryFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAssessment, setShowAssessment] = useState(false);
  const [selectedSchemeId, setSelectedSchemeId] = useState<string | null>(null);
  const [assessmentForm, setAssessmentForm] = useState({
    company_name: '', contact_name: '', contact_email: '', contact_phone: '',
    country: '', sector: '', annual_revenue: '', employee_count: '', notes: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const { data: schemes, isLoading } = useQuery({
    queryKey: ['gov-schemes-db', countryFilter, categoryFilter],
    queryFn: async () => {
      let query = supabase.from('government_schemes_db').select('*').eq('is_active', true).order('is_featured', { ascending: false }).order('sort_order');
      if (countryFilter !== 'all') query = query.eq('country', countryFilter);
      if (categoryFilter !== 'all') query = query.eq('category', categoryFilter);
      const { data } = await query;
      return data || [];
    },
  });

  const filteredSchemes = (schemes || []).filter((s: any) =>
    !searchQuery || s.title.toLowerCase().includes(searchQuery.toLowerCase()) || s.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAssessmentSubmit = async () => {
    if (!assessmentForm.company_name || !assessmentForm.contact_name || !assessmentForm.contact_email) {
      toast.error('Please fill in required fields');
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from('scheme_assessment_requests').insert({
      scheme_id: selectedSchemeId || null,
      company_name: assessmentForm.company_name,
      contact_name: assessmentForm.contact_name,
      contact_email: assessmentForm.contact_email,
      contact_phone: assessmentForm.contact_phone || null,
      country: assessmentForm.country || null,
      sector: assessmentForm.sector || null,
      annual_revenue: assessmentForm.annual_revenue || null,
      employee_count: assessmentForm.employee_count || null,
      notes: assessmentForm.notes || null,
    });
    setSubmitting(false);
    if (error) {
      toast.error('Submission failed. Please try again.');
    } else {
      toast.success('Assessment request submitted! Our team will evaluate your eligibility.');
      setShowAssessment(false);
      setAssessmentForm({ company_name: '', contact_name: '', contact_email: '', contact_phone: '', country: '', sector: '', annual_revenue: '', employee_count: '', notes: '' });
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
                <Landmark className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Government Schemes & Incentives</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground mb-6 leading-tight">
                Government Schemes &<br />
                <span className="text-primary">Incentives Database</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Searchable database of export subsidies, manufacturing incentives, startup grants, and tax relief programs across India, UAE, UK, Malaysia, and Estonia.
              </p>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="py-8 border-b border-border bg-card">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search schemes..."
                  className="pl-10 rounded-sm"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={countryFilter} onValueChange={setCountryFilter}>
                <SelectTrigger className="w-48 rounded-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {countryOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-56 rounded-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {categoryOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={() => { setShowAssessment(true); setSelectedSchemeId(null); }}>
                <FileText className="w-4 h-4 mr-2" /> Request Assessment
              </Button>
            </div>
          </div>
        </section>

        {/* Schemes List */}
        <section className="py-12">
          <div className="container mx-auto px-4 lg:px-8">
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading schemes...</p>
              </div>
            ) : filteredSchemes.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSchemes.map((scheme: any) => (
                  <Card key={scheme.id} className="border hover:border-primary/30 transition-colors flex flex-col">
                    <CardContent className="p-6 flex-1 flex flex-col">
                      <div className="flex items-start justify-between mb-3">
                        <Badge variant="secondary" className="text-xs capitalize">
                          {categoryLabels[scheme.category] || scheme.category}
                        </Badge>
                        {scheme.is_featured && <Star className="w-4 h-4 text-primary fill-primary" />}
                      </div>
                      <h3 className="text-lg font-serif font-bold text-foreground mb-2">{scheme.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4 flex-1 line-clamp-3">{scheme.description}</p>
                      
                      <div className="space-y-2 text-sm mb-4">
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-primary" />
                          <span className="text-foreground">{scheme.country}</span>
                        </div>
                        {scheme.sector && (
                          <div className="flex items-center gap-2">
                            <Tag className="w-4 h-4 text-primary" />
                            <span className="text-foreground">{scheme.sector}</span>
                          </div>
                        )}
                        {scheme.application_deadline && (
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-primary" />
                            <span className="text-foreground">Deadline: {new Date(scheme.application_deadline).toLocaleDateString()}</span>
                          </div>
                        )}
                        {scheme.estimated_benefit && (
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-primary" />
                            <span className="text-foreground">{scheme.estimated_benefit}</span>
                          </div>
                        )}
                      </div>

                      {scheme.eligibility_tags?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {scheme.eligibility_tags.map((tag: string) => (
                            <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                          ))}
                        </div>
                      )}

                      <div className="flex gap-2 mt-auto">
                        <Button variant="outline" size="sm" className="flex-1" onClick={() => { setSelectedSchemeId(scheme.id); setShowAssessment(true); }}>
                          Check Eligibility
                        </Button>
                        {scheme.official_url && (
                          <Button variant="ghost" size="sm" asChild>
                            <a href={scheme.official_url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border">
                <CardContent className="p-12 text-center">
                  <Landmark className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-serif font-bold text-foreground mb-2">No Schemes Found</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {searchQuery || countryFilter !== 'all' || categoryFilter !== 'all'
                      ? 'Try adjusting your filters or search query.'
                      : 'Government schemes are being added to the database. Check back soon.'}
                  </p>
                  <Button variant="outline" onClick={() => { setShowAssessment(true); setSelectedSchemeId(null); }}>
                    Request Eligibility Assessment <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </section>

        {/* Assessment Modal/Section */}
        {showAssessment && (
          <section className="py-12 bg-primary/5 border-t border-border">
            <div className="container mx-auto px-4 lg:px-8">
              <Card className="border border-primary/20 max-w-2xl mx-auto">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl font-serif flex items-center gap-3">
                      <CheckCircle2 className="w-6 h-6 text-primary" />
                      Request Eligibility Assessment
                    </CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => setShowAssessment(false)}>✕</Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Company Name *</label>
                      <Input placeholder="Your company" className="rounded-sm" value={assessmentForm.company_name} onChange={e => setAssessmentForm({...assessmentForm, company_name: e.target.value})} />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Contact Name *</label>
                      <Input placeholder="Full name" className="rounded-sm" value={assessmentForm.contact_name} onChange={e => setAssessmentForm({...assessmentForm, contact_name: e.target.value})} />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Email *</label>
                      <Input type="email" placeholder="you@company.com" className="rounded-sm" value={assessmentForm.contact_email} onChange={e => setAssessmentForm({...assessmentForm, contact_email: e.target.value})} />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Country</label>
                      <Input placeholder="Your country" className="rounded-sm" value={assessmentForm.country} onChange={e => setAssessmentForm({...assessmentForm, country: e.target.value})} />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Sector</label>
                      <Input placeholder="e.g., Manufacturing, IT" className="rounded-sm" value={assessmentForm.sector} onChange={e => setAssessmentForm({...assessmentForm, sector: e.target.value})} />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Annual Revenue</label>
                      <Input placeholder="e.g., $1M-$5M" className="rounded-sm" value={assessmentForm.annual_revenue} onChange={e => setAssessmentForm({...assessmentForm, annual_revenue: e.target.value})} />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Additional Notes</label>
                    <Textarea placeholder="Specific schemes or sectors of interest..." className="rounded-sm" value={assessmentForm.notes} onChange={e => setAssessmentForm({...assessmentForm, notes: e.target.value})} />
                  </div>
                  <Button className="w-full" size="lg" onClick={handleAssessmentSubmit} disabled={submitting}>
                    {submitting ? 'Submitting...' : 'Explore Eligible Incentives'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
