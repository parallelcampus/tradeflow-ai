import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { registerConsultantInERPNext, ConsultantData } from '@/lib/api/erpnext';
import { toast } from 'sonner';
import { Loader2, Plus, X, CheckCircle, Building2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

const countries = [
  'United States', 'United Kingdom', 'India', 'Germany', 'France', 'Canada', 
  'Australia', 'Singapore', 'UAE', 'Japan', 'China', 'Brazil', 'South Africa'
];

const commonLanguages = ['English', 'Hindi', 'Spanish', 'French', 'German', 'Mandarin', 'Arabic', 'Japanese', 'Portuguese'];

export default function ConsultantRegister() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newCertification, setNewCertification] = useState('');
  const [newLanguage, setNewLanguage] = useState('');
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    full_name: '',
    email: user?.email || '',
    phone: '',
    country: '',
    location: '',
    timezone: '',
    headline: '',
    bio: '',
    hourly_rate: '',
    years_experience: '',
    linkedin_url: '',
    website_url: '',
    certifications: [] as string[],
    languages: ['English'],
  });

  const { data: industries } = useQuery({
    queryKey: ['industries'],
    queryFn: async () => {
      const { data, error } = await supabase.from('industries').select('*').order('name');
      if (error) throw error;
      return data;
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addCertification = () => {
    if (newCertification.trim()) {
      setFormData(prev => ({
        ...prev,
        certifications: [...prev.certifications, newCertification.trim()]
      }));
      setNewCertification('');
    }
  };

  const removeCertification = (index: number) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
    }));
  };

  const addLanguage = () => {
    if (newLanguage && !formData.languages.includes(newLanguage)) {
      setFormData(prev => ({
        ...prev,
        languages: [...prev.languages, newLanguage]
      }));
      setNewLanguage('');
    }
  };

  const removeLanguage = (lang: string) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.filter(l => l !== lang)
    }));
  };

  const toggleIndustry = (industryId: string) => {
    setSelectedIndustries(prev => 
      prev.includes(industryId) 
        ? prev.filter(id => id !== industryId)
        : [...prev, industryId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please sign in to register as a consultant');
      navigate('/auth');
      return;
    }

    if (!formData.full_name || !formData.email || !formData.headline) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Create consultant in local database
      const { data: consultant, error: consultantError } = await supabase
        .from('consultants')
        .insert({
          user_id: user.id,
          full_name: formData.full_name,
          email: formData.email,
          phone: formData.phone || null,
          country: formData.country || null,
          location: formData.location || null,
          timezone: formData.timezone || null,
          headline: formData.headline,
          bio: formData.bio || null,
          hourly_rate: formData.hourly_rate ? parseFloat(formData.hourly_rate) : null,
          years_experience: formData.years_experience ? parseInt(formData.years_experience) : 0,
          linkedin_url: formData.linkedin_url || null,
          website_url: formData.website_url || null,
          certifications: formData.certifications.length > 0 ? formData.certifications : null,
          languages: formData.languages,
          is_available: true,
          is_verified: false,
        })
        .select()
        .single();

      if (consultantError) throw consultantError;

      // 2. Add industry associations
      if (selectedIndustries.length > 0 && consultant) {
        const industryInserts = selectedIndustries.map(industryId => ({
          consultant_id: consultant.id,
          industry_id: industryId,
        }));

        await supabase.from('consultant_industries').insert(industryInserts);
      }

      // 3. Sync to ERPNext
      const erpnextData: ConsultantData = {
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        country: formData.country,
        bio: formData.bio,
        headline: formData.headline,
        hourly_rate: formData.hourly_rate ? parseFloat(formData.hourly_rate) : undefined,
        years_experience: formData.years_experience ? parseInt(formData.years_experience) : undefined,
        linkedin_url: formData.linkedin_url,
        website_url: formData.website_url,
        certifications: formData.certifications,
        languages: formData.languages,
        industries: selectedIndustries,
      };

      const erpnextResult = await registerConsultantInERPNext(erpnextData);
      
      if (erpnextResult.success) {
        toast.success('Consultant profile created and synced to ERPNext!');
      } else {
        toast.success('Consultant profile created locally (ERPNext sync pending)');
      }

      navigate('/dashboard/consultants');
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Failed to create consultant profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
          <Building2 className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-display font-bold">Become a Consultant</h1>
          <p className="text-muted-foreground">Register your profile to offer expert consultancy services</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Your personal and contact details</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name *</Label>
              <Input
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                placeholder="John Doe"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="john@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+1 234 567 8900"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Select 
                value={formData.country} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, country: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map(country => (
                    <SelectItem key={country} value={country}>{country}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">City / Location</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="New York, NY"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Input
                id="timezone"
                name="timezone"
                value={formData.timezone}
                onChange={handleInputChange}
                placeholder="EST / UTC-5"
              />
            </div>
          </CardContent>
        </Card>

        {/* Professional Profile */}
        <Card>
          <CardHeader>
            <CardTitle>Professional Profile</CardTitle>
            <CardDescription>Describe your expertise and experience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="headline">Professional Headline *</Label>
              <Input
                id="headline"
                name="headline"
                value={formData.headline}
                onChange={handleInputChange}
                placeholder="Senior Export Consultant | 15+ Years in International Trade"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio / About</Label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Describe your experience, expertise, and what makes you unique..."
                rows={4}
              />
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="years_experience">Years of Experience</Label>
                <Input
                  id="years_experience"
                  name="years_experience"
                  type="number"
                  min="0"
                  value={formData.years_experience}
                  onChange={handleInputChange}
                  placeholder="10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hourly_rate">Hourly Rate (USD)</Label>
                <Input
                  id="hourly_rate"
                  name="hourly_rate"
                  type="number"
                  min="0"
                  value={formData.hourly_rate}
                  onChange={handleInputChange}
                  placeholder="150"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Industries */}
        <Card>
          <CardHeader>
            <CardTitle>Industries & Expertise</CardTitle>
            <CardDescription>Select the industries you specialize in</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {industries?.map(industry => (
                <Badge
                  key={industry.id}
                  variant={selectedIndustries.includes(industry.id) ? 'default' : 'outline'}
                  className="cursor-pointer text-sm py-1.5 px-3"
                  onClick={() => toggleIndustry(industry.id)}
                >
                  {selectedIndustries.includes(industry.id) && (
                    <CheckCircle className="h-3 w-3 mr-1" />
                  )}
                  {industry.name}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Languages */}
        <Card>
          <CardHeader>
            <CardTitle>Languages</CardTitle>
            <CardDescription>Languages you can communicate in</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {formData.languages.map(lang => (
                <Badge key={lang} variant="secondary" className="gap-1">
                  {lang}
                  <button
                    type="button"
                    onClick={() => removeLanguage(lang)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Select value={newLanguage} onValueChange={setNewLanguage}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Add language" />
                </SelectTrigger>
                <SelectContent>
                  {commonLanguages.filter(l => !formData.languages.includes(l)).map(lang => (
                    <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button type="button" variant="outline" size="icon" onClick={addLanguage}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Certifications */}
        <Card>
          <CardHeader>
            <CardTitle>Certifications</CardTitle>
            <CardDescription>Professional certifications and credentials</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {formData.certifications.map((cert, index) => (
                <Badge key={index} variant="secondary" className="gap-1">
                  {cert}
                  <button
                    type="button"
                    onClick={() => removeCertification(index)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newCertification}
                onChange={(e) => setNewCertification(e.target.value)}
                placeholder="e.g., Certified Export Professional"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCertification())}
              />
              <Button type="button" variant="outline" size="icon" onClick={addCertification}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Online Presence */}
        <Card>
          <CardHeader>
            <CardTitle>Online Presence</CardTitle>
            <CardDescription>Your professional profiles and website</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="linkedin_url">LinkedIn URL</Label>
              <Input
                id="linkedin_url"
                name="linkedin_url"
                value={formData.linkedin_url}
                onChange={handleInputChange}
                placeholder="https://linkedin.com/in/johndoe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website_url">Website URL</Label>
              <Input
                id="website_url"
                name="website_url"
                value={formData.website_url}
                onChange={handleInputChange}
                placeholder="https://johndoe.com"
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Registering...
              </>
            ) : (
              'Register as Consultant'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
