import { useState } from 'react';
import { 
  Calendar, MapPin, Users, Building2, Landmark, Tag, 
  ExternalLink, Search, BadgePercent, Globe,
  CheckCircle, Clock, Star
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Event {
  id: string;
  name: string;
  description: string;
  location: string;
  state?: string;
  country: string;
  startDate: string;
  endDate: string;
  category: 'central_govt' | 'state_govt' | 'non_subsidized' | 'gtpc_pavilion';
  subsidyType?: string;
  subsidyPercent?: number;
  discountPercent?: number;
  stallPrice: number;
  currency: string;
  industry: string[];
  organizer: string;
  website?: string;
  stallsAvailable: number;
  totalStalls: number;
  isFeatured?: boolean;
  status: 'open' | 'closing_soon' | 'fully_booked';
}

const sampleEvents: Event[] = [
  // Central Government Events
  {
    id: '1',
    name: 'India International Trade Fair 2026',
    description: 'Premier trade fair showcasing Indian products with MAI scheme support for MSME exporters.',
    location: 'Pragati Maidan, New Delhi',
    country: 'India',
    startDate: '2026-02-15',
    endDate: '2026-02-28',
    category: 'central_govt',
    subsidyType: 'MAI',
    subsidyPercent: 75,
    stallPrice: 150000,
    currency: 'INR',
    industry: ['Multi-sector', 'Handicrafts', 'Textiles'],
    organizer: 'Ministry of Commerce & Industry',
    website: 'https://iitf.in',
    stallsAvailable: 45,
    totalStalls: 200,
    isFeatured: true,
    status: 'open'
  },
  {
    id: '2',
    name: 'AAHAR - International Food & Hospitality Fair',
    description: 'Asia largest food and hospitality fair with MDA support for food exporters.',
    location: 'Pragati Maidan, New Delhi',
    country: 'India',
    startDate: '2026-03-10',
    endDate: '2026-03-14',
    category: 'central_govt',
    subsidyType: 'MDA',
    subsidyPercent: 60,
    stallPrice: 180000,
    currency: 'INR',
    industry: ['Food & Beverages', 'Hospitality'],
    organizer: 'ITPO',
    stallsAvailable: 12,
    totalStalls: 150,
    status: 'closing_soon'
  },
  {
    id: '3',
    name: 'Gulfood 2026',
    description: 'World largest annual food and beverage exhibition with MAI support.',
    location: 'Dubai World Trade Centre',
    country: 'UAE',
    startDate: '2026-02-20',
    endDate: '2026-02-24',
    category: 'central_govt',
    subsidyType: 'MAI',
    subsidyPercent: 80,
    stallPrice: 45000,
    currency: 'USD',
    industry: ['Food & Beverages'],
    organizer: 'TPCI',
    stallsAvailable: 8,
    totalStalls: 50,
    isFeatured: true,
    status: 'open'
  },
  // State Government Events
  {
    id: '4',
    name: 'Gujarat International Textile Expo',
    description: 'State-sponsored textile exhibition with Gujarat Export Promotion subsidy.',
    location: 'Ahmedabad Exhibition Centre',
    state: 'Gujarat',
    country: 'India',
    startDate: '2026-04-05',
    endDate: '2026-04-10',
    category: 'state_govt',
    subsidyType: 'State Export Promotion',
    subsidyPercent: 50,
    stallPrice: 75000,
    currency: 'INR',
    industry: ['Textiles', 'Apparel'],
    organizer: 'Gujarat State Export Corporation',
    stallsAvailable: 60,
    totalStalls: 120,
    status: 'open'
  },
  {
    id: '5',
    name: 'Tamil Nadu Engineering Expo',
    description: 'Engineering and auto components exhibition with MSME subsidy from TN Govt.',
    location: 'Chennai Trade Centre',
    state: 'Tamil Nadu',
    country: 'India',
    startDate: '2026-05-12',
    endDate: '2026-05-16',
    category: 'state_govt',
    subsidyType: 'MSME Subsidy',
    subsidyPercent: 40,
    stallPrice: 90000,
    currency: 'INR',
    industry: ['Engineering', 'Auto Components'],
    organizer: 'TANSTIA',
    stallsAvailable: 35,
    totalStalls: 80,
    status: 'open'
  },
  {
    id: '6',
    name: 'Maharashtra Agri Export Summit',
    description: 'Agricultural products exhibition with state subsidy for farmers and agri-exporters.',
    location: 'NESCO, Mumbai',
    state: 'Maharashtra',
    country: 'India',
    startDate: '2026-03-25',
    endDate: '2026-03-28',
    category: 'state_govt',
    subsidyType: 'State Export Promotion',
    subsidyPercent: 55,
    stallPrice: 60000,
    currency: 'INR',
    industry: ['Agriculture', 'Food Processing'],
    organizer: 'MEDA',
    stallsAvailable: 80,
    totalStalls: 150,
    status: 'open'
  },
  {
    id: '7',
    name: 'Karnataka IT & Electronics Expo',
    description: 'State-sponsored tech exhibition for IT and electronics exporters.',
    location: 'BIEC, Bangalore',
    state: 'Karnataka',
    country: 'India',
    startDate: '2026-06-08',
    endDate: '2026-06-12',
    category: 'state_govt',
    subsidyType: 'State Export Promotion',
    subsidyPercent: 45,
    stallPrice: 120000,
    currency: 'INR',
    industry: ['IT', 'Electronics'],
    organizer: 'KEONICS',
    stallsAvailable: 25,
    totalStalls: 60,
    status: 'open'
  },
  // Non-Subsidized Events
  {
    id: '8',
    name: 'Ambiente 2026',
    description: 'World leading trade fair for consumer goods and interior design.',
    location: 'Frankfurt Messe',
    country: 'Germany',
    startDate: '2026-02-07',
    endDate: '2026-02-11',
    category: 'non_subsidized',
    stallPrice: 8500,
    currency: 'EUR',
    industry: ['Home Decor', 'Consumer Goods'],
    organizer: 'Messe Frankfurt',
    website: 'https://ambiente.messefrankfurt.com',
    stallsAvailable: 5,
    totalStalls: 30,
    isFeatured: true,
    status: 'closing_soon'
  },
  {
    id: '9',
    name: 'Canton Fair 2026',
    description: 'China Import and Export Fair - comprehensive international trade event.',
    location: 'Guangzhou',
    country: 'China',
    startDate: '2026-04-15',
    endDate: '2026-05-05',
    category: 'non_subsidized',
    stallPrice: 12000,
    currency: 'USD',
    industry: ['Multi-sector'],
    organizer: 'CFTC',
    website: 'https://cantonfair.org.cn',
    stallsAvailable: 15,
    totalStalls: 40,
    status: 'open'
  },
  {
    id: '10',
    name: 'SIAL Paris 2026',
    description: 'Global food industry exhibition in Paris.',
    location: 'Paris Nord Villepinte',
    country: 'France',
    startDate: '2026-10-15',
    endDate: '2026-10-19',
    category: 'non_subsidized',
    stallPrice: 9500,
    currency: 'EUR',
    industry: ['Food & Beverages'],
    organizer: 'SIAL Group',
    stallsAvailable: 20,
    totalStalls: 35,
    status: 'open'
  },
  // GTPC Pavilion Events
  {
    id: '11',
    name: 'GTPC India Pavilion @ Expo 2026',
    description: 'Premium India pavilion with exclusive GTPC member discounts and shared infrastructure.',
    location: 'Osaka, Japan',
    country: 'Japan',
    startDate: '2026-04-13',
    endDate: '2026-10-13',
    category: 'gtpc_pavilion',
    discountPercent: 35,
    stallPrice: 25000,
    currency: 'USD',
    industry: ['Multi-sector'],
    organizer: 'GTPC',
    stallsAvailable: 20,
    totalStalls: 50,
    isFeatured: true,
    status: 'open'
  },
  {
    id: '12',
    name: 'GTPC Collective @ Texworld Paris',
    description: 'Group participation with shared booth and networking lounge for textile exporters.',
    location: 'Paris Le Bourget',
    country: 'France',
    startDate: '2026-02-10',
    endDate: '2026-02-13',
    category: 'gtpc_pavilion',
    discountPercent: 40,
    stallPrice: 4500,
    currency: 'EUR',
    industry: ['Textiles', 'Apparel'],
    organizer: 'GTPC',
    stallsAvailable: 8,
    totalStalls: 15,
    status: 'open'
  },
  {
    id: '13',
    name: 'GTPC SME Pavilion @ Big 5 Dubai',
    description: 'Affordable participation for SME construction exporters with B2B matchmaking.',
    location: 'Dubai World Trade Centre',
    country: 'UAE',
    startDate: '2026-11-23',
    endDate: '2026-11-26',
    category: 'gtpc_pavilion',
    discountPercent: 45,
    stallPrice: 8000,
    currency: 'USD',
    industry: ['Construction', 'Building Materials'],
    organizer: 'GTPC',
    stallsAvailable: 12,
    totalStalls: 20,
    status: 'open'
  },
  {
    id: '14',
    name: 'GTPC Premium Pavilion @ MEDICA',
    description: 'Healthcare and medical devices pavilion with full support services.',
    location: 'Dusseldorf',
    country: 'Germany',
    startDate: '2026-11-16',
    endDate: '2026-11-19',
    category: 'gtpc_pavilion',
    discountPercent: 30,
    stallPrice: 12000,
    currency: 'EUR',
    industry: ['Healthcare', 'Medical Devices'],
    organizer: 'GTPC',
    stallsAvailable: 6,
    totalStalls: 12,
    status: 'closing_soon'
  }
];

const states = [
  'All States', 'Gujarat', 'Tamil Nadu', 'Maharashtra', 'Karnataka', 
  'Rajasthan', 'Uttar Pradesh', 'West Bengal', 'Kerala'
];

const industries = [
  'All Industries', 'Food & Beverages', 'Textiles', 'Engineering', 
  'IT', 'Healthcare', 'Agriculture', 'Handicrafts', 'Auto Components'
];

export default function Events() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('All States');
  const [selectedIndustry, setSelectedIndustry] = useState('All Industries');

  const filterEvents = (events: Event[]) => {
    return events.filter(event => {
      const matchesSearch = event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.industry.some(ind => ind.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesState = selectedState === 'All States' || event.state === selectedState;
      const matchesIndustry = selectedIndustry === 'All Industries' || 
        event.industry.some(ind => ind.toLowerCase().includes(selectedIndustry.toLowerCase()));
      
      return matchesSearch && matchesState && matchesIndustry;
    });
  };

  const getEventsByCategory = (category: string) => {
    if (category === 'all') return filterEvents(sampleEvents);
    return filterEvents(sampleEvents.filter(e => e.category === category));
  };

  const getCategoryStats = () => {
    return {
      central: sampleEvents.filter(e => e.category === 'central_govt').length,
      state: sampleEvents.filter(e => e.category === 'state_govt').length,
      nonSubsidized: sampleEvents.filter(e => e.category === 'non_subsidized').length,
      gtpc: sampleEvents.filter(e => e.category === 'gtpc_pavilion').length
    };
  };

  const stats = getCategoryStats();

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getCategoryBadge = (category: Event['category']) => {
    switch (category) {
      case 'central_govt':
        return <Badge className="bg-blue-500/10 text-blue-600 border-blue-200">Central Govt</Badge>;
      case 'state_govt':
        return <Badge className="bg-green-500/10 text-green-600 border-green-200">State Govt</Badge>;
      case 'non_subsidized':
        return <Badge className="bg-gray-500/10 text-gray-600 border-gray-200">Non-Subsidized</Badge>;
      case 'gtpc_pavilion':
        return <Badge className="bg-orange-500/10 text-orange-600 border-orange-200">GTPC Pavilion</Badge>;
    }
  };

  const getStatusBadge = (status: Event['status']) => {
    switch (status) {
      case 'open':
        return <Badge variant="outline" className="text-green-600 border-green-300"><CheckCircle className="w-3 h-3 mr-1" />Open</Badge>;
      case 'closing_soon':
        return <Badge variant="outline" className="text-amber-600 border-amber-300"><Clock className="w-3 h-3 mr-1" />Closing Soon</Badge>;
      case 'fully_booked':
        return <Badge variant="outline" className="text-red-600 border-red-300">Fully Booked</Badge>;
    }
  };

  const EventCard = ({ event }: { event: Event }) => (
    <Card className="hover:shadow-lg transition-all duration-300 border-border/50 group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              {getCategoryBadge(event.category)}
              {getStatusBadge(event.status)}
              {event.isFeatured && (
                <Badge className="bg-primary/10 text-primary border-primary/20">
                  <Star className="w-3 h-3 mr-1 fill-current" />Featured
                </Badge>
              )}
            </div>
            <CardTitle className="text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors">
              {event.name}
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
        
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4 shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Globe className="h-4 w-4 shrink-0" />
            <span>{event.country}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4 shrink-0" />
            <span>{formatDate(event.startDate)}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4 shrink-0" />
            <span>{event.stallsAvailable}/{event.totalStalls} stalls</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {event.industry.slice(0, 3).map((ind, i) => (
            <Badge key={i} variant="secondary" className="text-xs">{ind}</Badge>
          ))}
        </div>

        <div className="pt-3 border-t border-border/50">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Stall Price</p>
              <p className="font-semibold text-lg">{formatCurrency(event.stallPrice, event.currency)}</p>
            </div>
            {(event.subsidyPercent || event.discountPercent) && (
              <div className="text-right">
                <p className="text-xs text-muted-foreground mb-1">
                  {event.subsidyPercent ? event.subsidyType : 'GTPC Discount'}
                </p>
                <Badge className="bg-green-500 text-white text-base px-3">
                  <BadgePercent className="w-4 h-4 mr-1" />
                  {event.subsidyPercent || event.discountPercent}% OFF
                </Badge>
              </div>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button className="flex-1" size="sm">
              Apply for Stall
            </Button>
            {event.website && (
              <Button variant="outline" size="sm" asChild>
                <a href={event.website} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold">Events & Exhibitions</h1>
        <p className="text-muted-foreground mt-1">
          Explore trade fairs, exhibitions with government subsidies and GTPC discounted pavilions
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-blue-50 border-blue-200 dark:bg-blue-950/20">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Landmark className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">{stats.central}</p>
              <p className="text-xs text-blue-600/80">Central Govt Events</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-green-50 border-green-200 dark:bg-green-950/20">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Building2 className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{stats.state}</p>
              <p className="text-xs text-green-600/80">State Govt Events</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-50 border-gray-200 dark:bg-gray-950/20">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-gray-500/20 rounded-lg">
              <Globe className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-600">{stats.nonSubsidized}</p>
              <p className="text-xs text-gray-600/80">Non-Subsidized</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-orange-50 border-orange-200 dark:bg-orange-950/20">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-orange-500/20 rounded-lg">
              <Tag className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-600">{stats.gtpc}</p>
              <p className="text-xs text-orange-600/80">GTPC Pavilions</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events, locations, industries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedState} onValueChange={setSelectedState}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Select State" />
              </SelectTrigger>
              <SelectContent>
                {states.map(state => (
                  <SelectItem key={state} value={state}>{state}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Select Industry" />
              </SelectTrigger>
              <SelectContent>
                {industries.map(ind => (
                  <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
          <TabsTrigger value="all" className="gap-2">
            <Calendar className="h-4 w-4 hidden sm:block" />
            All
          </TabsTrigger>
          <TabsTrigger value="central_govt" className="gap-2">
            <Landmark className="h-4 w-4 hidden sm:block" />
            Central
          </TabsTrigger>
          <TabsTrigger value="state_govt" className="gap-2">
            <Building2 className="h-4 w-4 hidden sm:block" />
            State
          </TabsTrigger>
          <TabsTrigger value="non_subsidized" className="gap-2">
            <Globe className="h-4 w-4 hidden sm:block" />
            Non-Subsidy
          </TabsTrigger>
          <TabsTrigger value="gtpc_pavilion" className="gap-2">
            <Tag className="h-4 w-4 hidden sm:block" />
            GTPC
          </TabsTrigger>
        </TabsList>

        {['all', 'central_govt', 'state_govt', 'non_subsidized', 'gtpc_pavilion'].map(tab => (
          <TabsContent key={tab} value={tab} className="mt-6">
            {tab === 'central_govt' && (
              <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-800 dark:text-blue-200 flex items-center gap-2">
                  <Landmark className="h-5 w-5" />
                  Central Government Subsidized Events
                </h3>
                <p className="text-sm text-blue-600/80 dark:text-blue-300/80 mt-1">
                  Events supported by MAI (Market Access Initiative) and MDA (Market Development Assistance) schemes from Ministry of Commerce
                </p>
              </div>
            )}
            
            {tab === 'state_govt' && (
              <div className="mb-6 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200">
                <h3 className="font-semibold text-green-800 dark:text-green-200 flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  State Government Subsidized Events
                </h3>
                <p className="text-sm text-green-600/80 dark:text-green-300/80 mt-1">
                  Events with subsidies from State Export Promotion Councils and MSME departments
                </p>
              </div>
            )}
            
            {tab === 'gtpc_pavilion' && (
              <div className="mb-6 p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200">
                <h3 className="font-semibold text-orange-800 dark:text-orange-200 flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  GTPC Discounted Pavilions
                </h3>
                <p className="text-sm text-orange-600/80 dark:text-orange-300/80 mt-1">
                  Exclusive group participation packages with shared infrastructure, B2B matchmaking, and member discounts
                </p>
              </div>
            )}

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {getEventsByCategory(tab).map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>

            {getEventsByCategory(tab).length === 0 && (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium">No events found</h3>
                <p className="text-muted-foreground">Try adjusting your filters</p>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
