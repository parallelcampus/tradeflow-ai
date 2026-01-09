import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { format, addDays } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import {
  Users,
  Handshake,
  Search,
  Globe,
  Building2,
  Calendar as CalendarIcon,
  Clock,
  Video,
  MapPin,
  Sparkles,
  ArrowRight,
  MessageSquare,
  Star,
  CheckCircle2,
  Plus,
  Filter,
  TrendingUp,
  Target,
  Loader2
} from 'lucide-react';

interface MatchedBusiness {
  id: string;
  name: string;
  industry: string;
  country: string;
  size: string;
  matchScore: number;
  interests: string[];
  avatar?: string;
  description?: string;
}

// Mock data for AI-matched businesses
const mockMatches: MatchedBusiness[] = [
  {
    id: '1',
    name: 'TechVentures GmbH',
    industry: 'Electronics',
    country: 'Germany',
    size: '50-200 employees',
    matchScore: 95,
    interests: ['IoT devices', 'Smart home', 'Consumer electronics'],
    description: 'Leading German distributor of innovative electronics seeking Asian suppliers.'
  },
  {
    id: '2',
    name: 'GreenPath Trading',
    industry: 'Organic Foods',
    country: 'Netherlands',
    size: '10-50 employees',
    matchScore: 88,
    interests: ['Organic spices', 'Tea', 'Sustainable packaging'],
    description: 'European organic food importer with focus on sustainable sourcing.'
  },
  {
    id: '3',
    name: 'Pacific Imports LLC',
    industry: 'Textiles',
    country: 'USA',
    size: '200-500 employees',
    matchScore: 82,
    interests: ['Cotton textiles', 'Home furnishing', 'Sustainable fabrics'],
    description: 'Major US textile importer looking for quality suppliers.'
  },
  {
    id: '4',
    name: 'Nordic Solutions AS',
    industry: 'Machinery',
    country: 'Norway',
    size: '50-200 employees',
    matchScore: 78,
    interests: ['Industrial machinery', 'Automation', 'Energy equipment'],
    description: 'Scandinavian industrial equipment buyer expanding supplier network.'
  }
];

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
];

export default function B2BMeetings() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedMatch, setSelectedMatch] = useState<MatchedBusiness | null>(null);
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [industryFilter, setIndustryFilter] = useState('all');
  
  // Meeting request form state
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(addDays(new Date(), 3));
  const [selectedTime, setSelectedTime] = useState('');
  const [meetingType, setMeetingType] = useState<'video' | 'in_person'>('video');
  const [meetingPurpose, setMeetingPurpose] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');

  const filteredMatches = mockMatches.filter(match => {
    if (searchQuery && !match.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (industryFilter !== 'all' && match.industry !== industryFilter) {
      return false;
    }
    return true;
  });

  const handleRequestMeeting = () => {
    if (!selectedMatch || !selectedDate || !selectedTime) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Here you would typically save to database
    toast.success('Meeting request sent!', {
      description: `Your meeting request with ${selectedMatch.name} has been submitted.`
    });

    setShowRequestDialog(false);
    setSelectedMatch(null);
    setSelectedDate(addDays(new Date(), 3));
    setSelectedTime('');
    setMeetingPurpose('');
    setAdditionalNotes('');
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 75) return 'text-blue-600 bg-blue-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-gray-600 bg-gray-100';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold flex items-center gap-2">
            <Handshake className="h-6 w-6 text-primary" />
            B2B Meetings & Matchmaking
          </h1>
          <p className="text-muted-foreground">
            AI-powered buyer-seller matching and meeting scheduling
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">{mockMatches.length}</div>
                <div className="text-sm text-muted-foreground">AI Matches</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">12</div>
                <div className="text-sm text-muted-foreground">Meetings Held</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MessageSquare className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">5</div>
                <div className="text-sm text-muted-foreground">Active Chats</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">89%</div>
                <div className="text-sm text-muted-foreground">Match Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="matches" className="space-y-6">
        <TabsList>
          <TabsTrigger value="matches" className="gap-2">
            <Sparkles className="h-4 w-4" />
            AI Matches
          </TabsTrigger>
          <TabsTrigger value="scheduled" className="gap-2">
            <CalendarIcon className="h-4 w-4" />
            Scheduled Meetings
          </TabsTrigger>
          <TabsTrigger value="events" className="gap-2">
            <Users className="h-4 w-4" />
            Upcoming Events
          </TabsTrigger>
        </TabsList>

        {/* AI Matches Tab */}
        <TabsContent value="matches" className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search businesses..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={industryFilter} onValueChange={setIndustryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Industries" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Industries</SelectItem>
                <SelectItem value="Electronics">Electronics</SelectItem>
                <SelectItem value="Organic Foods">Organic Foods</SelectItem>
                <SelectItem value="Textiles">Textiles</SelectItem>
                <SelectItem value="Machinery">Machinery</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Matches Grid */}
          <div className="grid gap-4">
            {filteredMatches.map((match) => (
              <Card key={match.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Avatar & Basic Info */}
                    <div className="flex gap-4 flex-1">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={match.avatar} />
                        <AvatarFallback className="text-lg bg-primary/10 text-primary">
                          {match.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="font-semibold text-lg flex items-center gap-2">
                              {match.name}
                              <Badge className={getScoreColor(match.matchScore)}>
                                <Sparkles className="h-3 w-3 mr-1" />
                                {match.matchScore}% Match
                              </Badge>
                            </h3>
                            <p className="text-muted-foreground">{match.description}</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 mt-3 text-sm">
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <Building2 className="h-4 w-4" />
                            {match.industry}
                          </span>
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <Globe className="h-4 w-4" />
                            {match.country}
                          </span>
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <Users className="h-4 w-4" />
                            {match.size}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-3">
                          {match.interests.map((interest, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {interest}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 min-w-[160px]">
                      <Button
                        onClick={() => {
                          setSelectedMatch(match);
                          setShowRequestDialog(true);
                        }}
                      >
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        Schedule Meeting
                      </Button>
                      <Button variant="outline">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Start Chat
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Scheduled Meetings Tab */}
        <TabsContent value="scheduled">
          <Card>
            <CardContent className="p-12 text-center">
              <CalendarIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="font-semibold mb-2">No scheduled B2B meetings</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Request meetings with matched businesses to see them here
              </p>
              <Button variant="outline">
                <Search className="h-4 w-4 mr-2" />
                Find Matches
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Events Tab */}
        <TabsContent value="events">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <Badge className="w-fit mb-2">Upcoming</Badge>
                <CardTitle className="text-lg">Trade Expo 2026 - Mumbai</CardTitle>
                <CardDescription>
                  Connect with 500+ international buyers at India's largest trade exhibition
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CalendarIcon className="h-4 w-4" />
                    March 15-18, 2026
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    Bombay Exhibition Centre, Mumbai
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    1,200+ Attendees Expected
                  </div>
                </div>
                <Button className="w-full mt-4">
                  Register & Schedule Meetings
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Badge variant="secondary" className="w-fit mb-2">Virtual</Badge>
                <CardTitle className="text-lg">B2B Connect - Electronics Summit</CardTitle>
                <CardDescription>
                  Virtual matchmaking event for electronics manufacturers and buyers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CalendarIcon className="h-4 w-4" />
                    February 28, 2026
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Video className="h-4 w-4" />
                    Online Event
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    500+ Participants
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4">
                  Join Waitlist
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Meeting Request Dialog */}
      <Dialog open={showRequestDialog} onOpenChange={setShowRequestDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Request Meeting</DialogTitle>
            <DialogDescription>
              {selectedMatch && `Schedule a meeting with ${selectedMatch.name}`}
            </DialogDescription>
          </DialogHeader>

          {selectedMatch && (
            <div className="space-y-6">
              {/* Business Info */}
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {selectedMatch.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{selectedMatch.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {selectedMatch.industry} • {selectedMatch.country}
                  </div>
                </div>
              </div>

              {/* Date Selection */}
              <div>
                <Label className="mb-2 block">Preferred Date</Label>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date()}
                  className="rounded-md border mx-auto"
                />
              </div>

              {/* Time Selection */}
              <div>
                <Label className="mb-2 block">Preferred Time</Label>
                <div className="grid grid-cols-4 gap-2">
                  {timeSlots.map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedTime(time)}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Meeting Type */}
              <div>
                <Label className="mb-2 block">Meeting Type</Label>
                <RadioGroup
                  value={meetingType}
                  onValueChange={(v) => setMeetingType(v as any)}
                  className="grid grid-cols-2 gap-4"
                >
                  <Label
                    htmlFor="b2b-video"
                    className={`flex flex-col items-center gap-2 p-4 rounded-lg border cursor-pointer transition-colors ${
                      meetingType === 'video' ? 'border-primary bg-primary/5' : 'hover:border-primary/50'
                    }`}
                  >
                    <RadioGroupItem value="video" id="b2b-video" className="sr-only" />
                    <Video className="h-6 w-6" />
                    <span className="text-sm font-medium">Video Call</span>
                  </Label>
                  <Label
                    htmlFor="b2b-in_person"
                    className={`flex flex-col items-center gap-2 p-4 rounded-lg border cursor-pointer transition-colors ${
                      meetingType === 'in_person' ? 'border-primary bg-primary/5' : 'hover:border-primary/50'
                    }`}
                  >
                    <RadioGroupItem value="in_person" id="b2b-in_person" className="sr-only" />
                    <MapPin className="h-6 w-6" />
                    <span className="text-sm font-medium">In Person</span>
                  </Label>
                </RadioGroup>
              </div>

              {/* Meeting Purpose */}
              <div>
                <Label htmlFor="purpose">Meeting Purpose</Label>
                <Select value={meetingPurpose} onValueChange={setMeetingPurpose}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select purpose" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="introductory">Introductory Call</SelectItem>
                    <SelectItem value="product_demo">Product Demonstration</SelectItem>
                    <SelectItem value="pricing">Pricing Discussion</SelectItem>
                    <SelectItem value="partnership">Partnership Opportunity</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Notes */}
              <div>
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="What would you like to discuss?"
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  rows={3}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setShowRequestDialog(false)}>
                  Cancel
                </Button>
                <Button 
                  className="flex-1" 
                  onClick={handleRequestMeeting}
                  disabled={!selectedDate || !selectedTime || !meetingPurpose}
                >
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  Send Request
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
