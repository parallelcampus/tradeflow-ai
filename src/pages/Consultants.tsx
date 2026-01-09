import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Search, Filter, Star, MapPin, Clock, DollarSign, Award, 
  Calendar, Video, Phone, Users, Briefcase, CheckCircle2, 
  MessageSquare, Globe, Languages, GraduationCap, Trophy,
  ChevronRight, Loader2, RefreshCw, Link2
} from 'lucide-react';
import ConsultantProfile from '@/components/consultants/ConsultantProfile';
import BookingModal from '@/components/consultants/BookingModal';
import { syncConsultantsFromERPNext } from '@/lib/api/erpnext';
import { toast } from 'sonner';

interface Consultant {
  id: string;
  full_name: string;
  email: string;
  avatar_url: string | null;
  bio: string | null;
  headline: string | null;
  years_experience: number;
  hourly_rate: number | null;
  currency: string;
  languages: string[];
  location: string | null;
  country: string | null;
  timezone: string | null;
  linkedin_url: string | null;
  website_url: string | null;
  certifications: string[] | null;
  education: string[] | null;
  is_verified: boolean;
  is_available: boolean;
  total_consultations: number;
  average_rating: number;
  industries?: { id: string; name: string }[];
}

export default function Consultants() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [minRating, setMinRating] = useState<string>('all');
  const [selectedConsultant, setSelectedConsultant] = useState<Consultant | null>(null);
  const [bookingConsultant, setBookingConsultant] = useState<Consultant | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleERPNextSync = async () => {
    setIsSyncing(true);
    try {
      const success = await syncConsultantsFromERPNext();
      if (success) {
        toast.success('Consultants synced from ERPNext');
        queryClient.invalidateQueries({ queryKey: ['consultants'] });
      } else {
        toast.error('Failed to sync consultants');
      }
    } catch (error) {
      toast.error('Error syncing consultants');
    } finally {
      setIsSyncing(false);
    }
  };

  // Fetch industries
  const { data: industries } = useQuery({
    queryKey: ['industries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('industries')
        .select('*')
        .order('name');
      if (error) throw error;
      return data;
    }
  });

  // Fetch consultants with their industries
  const { data: consultants, isLoading } = useQuery({
    queryKey: ['consultants', selectedIndustry, selectedCountry, priceRange, minRating, searchQuery],
    queryFn: async () => {
      let query = supabase
        .from('consultants')
        .select(`
          *,
          consultant_industries (
            industry_id,
            industries (id, name)
          )
        `)
        .eq('is_available', true);

      if (selectedCountry !== 'all') {
        query = query.eq('country', selectedCountry);
      }

      if (priceRange[1] < 500) {
        query = query.lte('hourly_rate', priceRange[1]);
      }
      if (priceRange[0] > 0) {
        query = query.gte('hourly_rate', priceRange[0]);
      }

      if (minRating !== 'all') {
        query = query.gte('average_rating', parseFloat(minRating));
      }

      if (searchQuery) {
        query = query.or(`full_name.ilike.%${searchQuery}%,headline.ilike.%${searchQuery}%,bio.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query.order('average_rating', { ascending: false });
      if (error) throw error;

      // Transform the data to flatten industries
      const transformedData = data?.map(consultant => ({
        ...consultant,
        industries: consultant.consultant_industries?.map((ci: any) => ci.industries).filter(Boolean) || []
      }));

      // Filter by industry if selected
      if (selectedIndustry !== 'all') {
        return transformedData?.filter(c => 
          c.industries?.some((i: any) => i.id === selectedIndustry)
        );
      }

      return transformedData;
    }
  });

  // Get unique countries from consultants
  const countries = [...new Set(consultants?.map(c => c.country).filter(Boolean))];

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'
            }`}
          />
        ))}
        <span className="ml-1 text-sm font-medium">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">Find Expert Consultants</h1>
          <p className="text-muted-foreground">
            Connect with trade experts to grow your business globally
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleERPNextSync}
            disabled={isSyncing}
          >
            <Link2 className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
            Sync ERPNext
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className={`lg:block ${showFilters ? 'block' : 'hidden'}`}>
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Search */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Name, expertise..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              {/* Industry */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Industry</label>
                <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Industries" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Industries</SelectItem>
                    {industries?.map((industry) => (
                      <SelectItem key={industry.id} value={industry.id}>
                        {industry.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Country */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Countries" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Countries</SelectItem>
                    {countries.map((country) => (
                      <SelectItem key={country} value={country!}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Hourly Rate</label>
                  <span className="text-sm text-muted-foreground">
                    ${priceRange[0]} - ${priceRange[1]}+
                  </span>
                </div>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={500}
                  step={25}
                  className="w-full"
                />
              </div>

              {/* Rating */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Minimum Rating</label>
                <Select value={minRating} onValueChange={setMinRating}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any Rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any Rating</SelectItem>
                    <SelectItem value="4.5">4.5+ Stars</SelectItem>
                    <SelectItem value="4">4+ Stars</SelectItem>
                    <SelectItem value="3.5">3.5+ Stars</SelectItem>
                    <SelectItem value="3">3+ Stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedIndustry('all');
                  setSelectedCountry('all');
                  setPriceRange([0, 500]);
                  setMinRating('all');
                }}
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Consultant List */}
        <div className="lg:col-span-3 space-y-4">
          {/* Results count */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {consultants?.length || 0} consultants found
            </p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : consultants?.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="font-semibold mb-2">No consultants found</h3>
                <p className="text-muted-foreground text-sm">
                  Try adjusting your filters or search criteria
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {consultants?.map((consultant) => (
                <Card 
                  key={consultant.id} 
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedConsultant(consultant)}
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                      {/* Avatar */}
                      <div className="flex-shrink-0">
                        <Avatar className="h-20 w-20">
                          <AvatarImage src={consultant.avatar_url || undefined} />
                          <AvatarFallback className="text-xl bg-primary/10 text-primary">
                            {consultant.full_name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-lg">{consultant.full_name}</h3>
                              {consultant.is_verified && (
                                <CheckCircle2 className="h-4 w-4 text-primary fill-primary/20" />
                              )}
                            </div>
                            {consultant.headline && (
                              <p className="text-muted-foreground">{consultant.headline}</p>
                            )}
                          </div>
                          <div className="text-right flex-shrink-0">
                            {consultant.hourly_rate && (
                              <div className="font-semibold text-lg">
                                ${consultant.hourly_rate}
                                <span className="text-sm font-normal text-muted-foreground">/hr</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="flex flex-wrap items-center gap-4 mt-3 text-sm">
                          {renderStars(consultant.average_rating)}
                          <span className="text-muted-foreground">
                            ({consultant.total_consultations} consultations)
                          </span>
                          {consultant.location && (
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <MapPin className="h-3.5 w-3.5" />
                              {consultant.location}
                            </div>
                          )}
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Briefcase className="h-3.5 w-3.5" />
                            {consultant.years_experience} years exp.
                          </div>
                        </div>

                        {/* Industries */}
                        {consultant.industries && consultant.industries.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {consultant.industries.slice(0, 4).map((industry: any) => (
                              <Badge key={industry.id} variant="secondary" className="text-xs">
                                {industry.name}
                              </Badge>
                            ))}
                            {consultant.industries.length > 4 && (
                              <Badge variant="outline" className="text-xs">
                                +{consultant.industries.length - 4} more
                              </Badge>
                            )}
                          </div>
                        )}

                        {/* Bio preview */}
                        {consultant.bio && (
                          <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                            {consultant.bio}
                          </p>
                        )}
                      </div>

                      {/* Action */}
                      <div className="flex flex-col gap-2 flex-shrink-0">
                        <Button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setBookingConsultant(consultant);
                          }}
                        >
                          <Calendar className="h-4 w-4 mr-2" />
                          Book Meeting
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedConsultant(consultant);
                          }}
                        >
                          View Profile
                          <ChevronRight className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Consultant Profile Dialog */}
      <Dialog open={!!selectedConsultant} onOpenChange={() => setSelectedConsultant(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0">
          {selectedConsultant && (
            <ConsultantProfile 
              consultant={selectedConsultant} 
              onBook={() => {
                setBookingConsultant(selectedConsultant);
                setSelectedConsultant(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Booking Modal */}
      <BookingModal
        consultant={bookingConsultant}
        open={!!bookingConsultant}
        onClose={() => setBookingConsultant(null)}
      />
    </div>
  );
}
