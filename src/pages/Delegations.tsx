import { useState } from 'react';
import { Globe, Calendar, MapPin, Users, Plane, Building2, CheckCircle, Clock, ArrowRight, Star, Filter, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

// Sample delegation programs
const delegations = [
  {
    id: '1',
    title: 'Gulf Food Expo 2025 - Dubai Trade Delegation',
    destination: 'Dubai, UAE',
    country: 'United Arab Emirates',
    startDate: '2025-02-20',
    endDate: '2025-02-26',
    duration: '7 days',
    industry: 'Food & Beverages',
    totalSlots: 25,
    registeredSlots: 18,
    price: 125000,
    currency: 'INR',
    status: 'open',
    highlights: [
      'Visit Gulf Food Exhibition',
      'B2B meetings with 50+ buyers',
      'Factory visits to major importers',
      'Networking dinner with trade officials'
    ],
    inclusions: ['Flight tickets', 'Hotel accommodation', 'Local transport', 'Visa assistance', 'Exhibition entry'],
    organizer: 'FIEO Western Region',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400'
  },
  {
    id: '2',
    title: 'Africa Trade Mission - Kenya & Tanzania',
    destination: 'Nairobi & Dar es Salaam',
    country: 'Kenya, Tanzania',
    startDate: '2025-03-15',
    endDate: '2025-03-22',
    duration: '8 days',
    industry: 'Textiles & Engineering',
    totalSlots: 20,
    registeredSlots: 12,
    price: 145000,
    currency: 'INR',
    status: 'open',
    highlights: [
      'Meet with African importers',
      'Visit industrial zones',
      'Government trade briefings',
      'Cultural exchange program'
    ],
    inclusions: ['Flight tickets', 'Hotel accommodation', 'B2B meetings', 'Local transport', 'Interpreter services'],
    organizer: 'EEPC India',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?w=400'
  },
  {
    id: '3',
    title: 'ASEAN Business Summit - Singapore',
    destination: 'Singapore',
    country: 'Singapore',
    startDate: '2025-04-10',
    endDate: '2025-04-14',
    duration: '5 days',
    industry: 'IT & Electronics',
    totalSlots: 30,
    registeredSlots: 28,
    price: 98000,
    currency: 'INR',
    status: 'almost_full',
    highlights: [
      'ASEAN Business Summit participation',
      'Tech startup networking',
      'Government-level trade talks',
      'Innovation hub visits'
    ],
    inclusions: ['Flight tickets', 'Hotel accommodation', 'Summit registration', 'Networking events'],
    organizer: 'CII',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=400'
  },
  {
    id: '4',
    title: 'European Textile Fair - Germany & France',
    destination: 'Frankfurt & Paris',
    country: 'Germany, France',
    startDate: '2025-05-05',
    endDate: '2025-05-12',
    duration: '8 days',
    industry: 'Textiles & Apparel',
    totalSlots: 15,
    registeredSlots: 8,
    price: 185000,
    currency: 'INR',
    status: 'open',
    highlights: [
      'Texworld Paris exhibition',
      'Meeting with European buyers',
      'Factory visits in Germany',
      'Sustainability workshops'
    ],
    inclusions: ['Flight tickets', 'Hotel accommodation', 'Exhibition passes', 'Schengen visa assistance', 'B2B meetings'],
    organizer: 'TEXPROCIL',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=400'
  },
  {
    id: '5',
    title: 'Latin America Trade Exploration - Brazil & Mexico',
    destination: 'São Paulo & Mexico City',
    country: 'Brazil, Mexico',
    startDate: '2025-06-01',
    endDate: '2025-06-10',
    duration: '10 days',
    industry: 'Pharmaceuticals & Chemicals',
    totalSlots: 20,
    registeredSlots: 5,
    price: 220000,
    currency: 'INR',
    status: 'open',
    highlights: [
      'Pharma industry meetings',
      'Regulatory briefings',
      'Factory and port visits',
      'Trade partnership signing'
    ],
    inclusions: ['Flight tickets', 'Hotel accommodation', 'Visa assistance', 'Business meetings', 'Local transport'],
    organizer: 'Pharmexcil',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=400'
  },
  {
    id: '6',
    title: 'Japan Technology Mission',
    destination: 'Tokyo & Osaka',
    country: 'Japan',
    startDate: '2025-04-25',
    endDate: '2025-04-30',
    duration: '6 days',
    industry: 'Engineering & Auto Components',
    totalSlots: 18,
    registeredSlots: 16,
    price: 165000,
    currency: 'INR',
    status: 'almost_full',
    highlights: [
      'Toyota production system visit',
      'Meeting with Japanese importers',
      'Technology partnership discussions',
      'Quality management workshops'
    ],
    inclusions: ['Flight tickets', 'Hotel accommodation', 'Factory visits', 'Interpreter services', 'Business meetings'],
    organizer: 'ACMA',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400'
  }
];

// Past delegations for reference
const pastDelegations = [
  {
    id: 'p1',
    title: 'China Canton Fair Delegation 2024',
    destination: 'Guangzhou, China',
    date: 'October 2024',
    participants: 22,
    dealsGenerated: 45,
    totalExportValue: '$2.5M',
    rating: 4.8
  },
  {
    id: 'p2',
    title: 'UK Trade Mission 2024',
    destination: 'London, UK',
    date: 'September 2024',
    participants: 18,
    dealsGenerated: 32,
    totalExportValue: '$1.8M',
    rating: 4.7
  },
  {
    id: 'p3',
    title: 'Vietnam Manufacturing Connect',
    destination: 'Ho Chi Minh City',
    date: 'August 2024',
    participants: 15,
    dealsGenerated: 28,
    totalExportValue: '$1.2M',
    rating: 4.6
  }
];

export default function Delegations() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [selectedDelegation, setSelectedDelegation] = useState<typeof delegations[0] | null>(null);
  const [isApplyDialogOpen, setIsApplyDialogOpen] = useState(false);

  const filteredDelegations = delegations.filter(d => {
    const matchesSearch = d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.destination.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = selectedRegion === 'all' || 
      d.country.toLowerCase().includes(selectedRegion.toLowerCase());
    const matchesIndustry = selectedIndustry === 'all' || 
      d.industry.toLowerCase().includes(selectedIndustry.toLowerCase());
    return matchesSearch && matchesRegion && matchesIndustry;
  });

  const handleApply = () => {
    toast.success('Application submitted successfully!', {
      description: `Your application for ${selectedDelegation?.title} has been received. Our team will contact you shortly.`
    });
    setIsApplyDialogOpen(false);
    setSelectedDelegation(null);
  };

  const getStatusBadge = (status: string, registered: number, total: number) => {
    const percentage = (registered / total) * 100;
    if (status === 'almost_full' || percentage >= 80) {
      return <Badge variant="destructive" className="text-xs">Almost Full</Badge>;
    }
    if (percentage >= 50) {
      return <Badge className="bg-amber-500/20 text-amber-600 border-amber-500/30 text-xs">Filling Fast</Badge>;
    }
    return <Badge variant="secondary" className="text-xs">Open</Badge>;
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Globe className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Trade Delegations</h1>
            <p className="text-muted-foreground">Join official trade missions to explore global markets</p>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/20">
                <Plane className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">6</p>
                <p className="text-xs text-muted-foreground">Upcoming Delegations</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border-emerald-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/20">
                <MapPin className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">12</p>
                <p className="text-xs text-muted-foreground">Countries Covered</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">87</p>
                <p className="text-xs text-muted-foreground">Slots Available</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 border-amber-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/20">
                <Building2 className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">$5.5M</p>
                <p className="text-xs text-muted-foreground">Deals Generated (2024)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-6">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming Delegations</TabsTrigger>
          <TabsTrigger value="past">Past Delegations</TabsTrigger>
          <TabsTrigger value="my-applications">My Applications</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-6">
          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search delegations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                <SelectItem value="middle east">Middle East</SelectItem>
                <SelectItem value="africa">Africa</SelectItem>
                <SelectItem value="asia">Asia Pacific</SelectItem>
                <SelectItem value="europe">Europe</SelectItem>
                <SelectItem value="americas">Americas</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Industries</SelectItem>
                <SelectItem value="food">Food & Beverages</SelectItem>
                <SelectItem value="textiles">Textiles & Apparel</SelectItem>
                <SelectItem value="engineering">Engineering</SelectItem>
                <SelectItem value="pharma">Pharmaceuticals</SelectItem>
                <SelectItem value="it">IT & Electronics</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Delegation Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredDelegations.map((delegation) => (
              <Card key={delegation.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-40">
                  <img
                    src={delegation.image}
                    alt={delegation.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="flex items-center gap-2 text-white/90 text-sm">
                      <MapPin className="h-4 w-4" />
                      <span>{delegation.destination}</span>
                    </div>
                  </div>
                  <div className="absolute top-3 right-3">
                    {getStatusBadge(delegation.status, delegation.registeredSlots, delegation.totalSlots)}
                  </div>
                </div>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg leading-tight">{delegation.title}</CardTitle>
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="text-sm font-medium">{delegation.rating}</span>
                    </div>
                  </div>
                  <CardDescription className="flex items-center gap-4 text-xs">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(delegation.startDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })} - {new Date(delegation.endDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {delegation.duration}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-1.5">
                      <Badge variant="outline" className="text-xs">{delegation.industry}</Badge>
                      <Badge variant="outline" className="text-xs">{delegation.organizer}</Badge>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Registration Progress</span>
                        <span className="font-medium">{delegation.registeredSlots}/{delegation.totalSlots} slots</span>
                      </div>
                      <Progress value={(delegation.registeredSlots / delegation.totalSlots) * 100} className="h-1.5" />
                    </div>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      {delegation.highlights.slice(0, 2).map((highlight, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-emerald-500" />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
                <CardFooter className="pt-0 flex items-center justify-between">
                  <div>
                    <span className="text-xl font-bold text-foreground">₹{delegation.price.toLocaleString('en-IN')}</span>
                    <span className="text-xs text-muted-foreground">/person</span>
                  </div>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedDelegation(delegation)}>
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>{delegation.title}</DialogTitle>
                          <DialogDescription>
                            {delegation.destination} • {delegation.duration}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <img src={delegation.image} alt={delegation.title} className="w-full h-48 object-cover rounded-lg" />
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-medium text-sm mb-2">Trip Details</h4>
                              <div className="space-y-2 text-sm text-muted-foreground">
                                <p><strong>Dates:</strong> {new Date(delegation.startDate).toLocaleDateString()} - {new Date(delegation.endDate).toLocaleDateString()}</p>
                                <p><strong>Duration:</strong> {delegation.duration}</p>
                                <p><strong>Industry:</strong> {delegation.industry}</p>
                                <p><strong>Organizer:</strong> {delegation.organizer}</p>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-medium text-sm mb-2">Availability</h4>
                              <div className="space-y-2">
                                <Progress value={(delegation.registeredSlots / delegation.totalSlots) * 100} className="h-2" />
                                <p className="text-sm text-muted-foreground">
                                  {delegation.totalSlots - delegation.registeredSlots} slots remaining
                                </p>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium text-sm mb-2">Program Highlights</h4>
                            <ul className="grid grid-cols-2 gap-2">
                              {delegation.highlights.map((h, i) => (
                                <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                                  {h}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h4 className="font-medium text-sm mb-2">Inclusions</h4>
                            <div className="flex flex-wrap gap-2">
                              {delegation.inclusions.map((inc, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">{inc}</Badge>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-4 border-t">
                            <div>
                              <span className="text-2xl font-bold">₹{delegation.price.toLocaleString('en-IN')}</span>
                              <span className="text-muted-foreground">/person</span>
                            </div>
                            <Button onClick={() => {
                              setSelectedDelegation(delegation);
                              setIsApplyDialogOpen(true);
                            }}>
                              Apply Now <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button size="sm" onClick={() => {
                      setSelectedDelegation(delegation);
                      setIsApplyDialogOpen(true);
                    }}>
                      Apply <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="past">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pastDelegations.map((delegation) => (
              <Card key={delegation.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{delegation.title}</CardTitle>
                  <CardDescription>{delegation.destination} • {delegation.date}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Participants</p>
                        <p className="font-semibold">{delegation.participants}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Deals Generated</p>
                        <p className="font-semibold">{delegation.dealsGenerated}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Export Value</p>
                        <p className="font-semibold text-emerald-600">{delegation.totalExportValue}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Rating</p>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-amber-500 fill-current" />
                          <span className="font-semibold">{delegation.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="my-applications">
          <Card>
            <CardContent className="p-12 text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Globe className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No Applications Yet</h3>
              <p className="text-muted-foreground mb-4">
                You haven't applied to any trade delegations yet. Explore upcoming delegations to find opportunities.
              </p>
              <Button variant="outline">Browse Delegations</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Application Dialog */}
      <Dialog open={isApplyDialogOpen} onOpenChange={setIsApplyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Apply for Delegation</DialogTitle>
            <DialogDescription>
              {selectedDelegation?.title}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company">Company Name</Label>
                <Input id="company" placeholder="Enter company name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="designation">Designation</Label>
                <Input id="designation" placeholder="Your designation" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="products">Products/Services for Export</Label>
              <Textarea id="products" placeholder="Describe your products or services..." rows={3} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expectations">What do you expect from this delegation?</Label>
              <Textarea id="expectations" placeholder="Your expectations and goals..." rows={3} />
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Note:</strong> Your application will be reviewed by the organizing council. 
                You will receive a confirmation email within 3-5 business days.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsApplyDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleApply}>Submit Application</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
