import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plane, 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  CheckCircle,
  ArrowRight,
  Globe,
  Building2,
  FileCheck
} from "lucide-react";
import { format } from "date-fns";

interface DelegationProgram {
  id: string;
  title: string;
  destination_country: string;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  registration_deadline: string | null;
  max_participants: number | null;
  current_participants: number | null;
  price: number | null;
  currency: string | null;
  highlights: string[] | null;
  itinerary: any[] | null;
  included_services: string[] | null;
  image_url: string | null;
  status: string | null;
  is_featured: boolean | null;
}

const Delegation = () => {
  const { data: delegations, isLoading } = useQuery({
    queryKey: ['delegation-programs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('delegation_programs')
        .select('*')
        .eq('is_active', true)
        .order('start_date');
      if (error) throw error;
      return data as DelegationProgram[];
    }
  });

  const benefits = [
    { icon: Users, title: "Pre-arranged B2B Meetings", description: "Scheduled meetings with verified international buyers and partners" },
    { icon: Building2, title: "Factory & Trade Fair Visits", description: "Access to major trade fairs and industrial facility tours" },
    { icon: FileCheck, title: "Govt. Liaison Support", description: "Assistance with embassy meetings and government introductions" },
    { icon: Globe, title: "Market Intelligence", description: "Detailed market reports and competitive landscape analysis" },
  ];

  // Placeholder delegations if database is empty
  const placeholderDelegations: DelegationProgram[] = [
    {
      id: '1',
      title: 'UAE Business Delegation 2024',
      destination_country: 'United Arab Emirates',
      description: 'Explore business opportunities in Dubai and Abu Dhabi with pre-arranged B2B meetings with leading importers.',
      start_date: '2024-04-15',
      end_date: '2024-04-22',
      registration_deadline: '2024-03-31',
      max_participants: 25,
      current_participants: 18,
      price: 125000,
      currency: 'INR',
      highlights: ['15+ B2B Meetings', 'Gulf Food Expo Visit', 'Chamber of Commerce Meeting', 'Port Tour'],
      itinerary: [],
      included_services: ['5-Star Accommodation', 'Business Visa Assistance', 'Airport Transfers', 'Interpreter Services', 'All Meals'],
      image_url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600',
      status: 'upcoming',
      is_featured: true
    },
    {
      id: '2',
      title: 'Germany Industrial Mission',
      destination_country: 'Germany',
      description: 'Visit industrial hubs and meet potential partners for manufacturing and technology sectors.',
      start_date: '2024-05-10',
      end_date: '2024-05-18',
      registration_deadline: '2024-04-15',
      max_participants: 20,
      current_participants: 12,
      price: 185000,
      currency: 'INR',
      highlights: ['Hannover Messe Visit', 'Factory Tours', '10+ B2B Meetings', 'Tech Park Visit'],
      itinerary: [],
      included_services: ['4-Star Accommodation', 'Schengen Visa Support', 'Train Passes', 'Interpreter Services'],
      image_url: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=600',
      status: 'upcoming',
      is_featured: true
    },
    {
      id: '3',
      title: 'Singapore Trade Connect',
      destination_country: 'Singapore',
      description: 'Strategic business development trip focusing on ASEAN market opportunities.',
      start_date: '2024-06-05',
      end_date: '2024-06-10',
      registration_deadline: '2024-05-20',
      max_participants: 30,
      current_participants: 8,
      price: 95000,
      currency: 'INR',
      highlights: ['Food & Hotel Asia Expo', 'Port Tour', 'Indian Embassy Meeting', 'Networking Dinner'],
      itinerary: [],
      included_services: ['Hotel Accommodation', 'Expo Passes', 'Local Transport', 'Business Networking Events'],
      image_url: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=600',
      status: 'upcoming',
      is_featured: false
    }
  ];

  const displayDelegations = delegations && delegations.length > 0 ? delegations : placeholderDelegations;

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case 'upcoming':
        return <Badge className="bg-primary">Upcoming</Badge>;
      case 'registering':
        return <Badge className="bg-green-600">Open for Registration</Badge>;
      case 'full':
        return <Badge variant="secondary">Fully Booked</Badge>;
      case 'completed':
        return <Badge variant="outline">Completed</Badge>;
      default:
        return <Badge className="bg-primary">Upcoming</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-16 bg-primary">
          <div className="container mx-auto px-4 text-center">
            <Badge className="mb-4 bg-white/20 text-white hover:bg-white/30 border-0">
              <Plane className="w-3 h-3 mr-1" />
              Trade Delegations
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              International Business Delegations
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
              Join organized business missions to key international markets with 
              pre-arranged meetings, trade fair access, and comprehensive support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-primary">
                View All Delegations
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                Request Custom Delegation
              </Button>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 bg-secondary/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                What's Included in Our Delegations
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We handle all logistics so you can focus on business development
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => (
                <Card key={index} className="border-border text-center">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <benefit.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h4 className="font-semibold text-foreground mb-2">{benefit.title}</h4>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Upcoming Delegations */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Upcoming Delegations
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Register now for our upcoming international business missions
              </p>
            </div>
            {isLoading ? (
              <div className="text-center py-12">Loading delegations...</div>
            ) : (
              <div className="grid lg:grid-cols-2 gap-8">
                {displayDelegations.map((delegation) => (
                  <Card key={delegation.id} className="overflow-hidden border-border hover:shadow-lg transition-shadow">
                    <div className="md:flex">
                      <div className="md:w-1/3 relative">
                        <img 
                          src={delegation.image_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400'}
                          alt={delegation.title}
                          className="w-full h-48 md:h-full object-cover"
                        />
                        <div className="absolute top-3 left-3">
                          {getStatusBadge(delegation.status)}
                        </div>
                      </div>
                      <div className="md:w-2/3 p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-xl font-semibold text-foreground mb-1">{delegation.title}</h3>
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <MapPin className="w-4 h-4" />
                              <span>{delegation.destination_country}</span>
                            </div>
                          </div>
                          {delegation.is_featured && (
                            <Badge variant="outline" className="border-primary text-primary">Featured</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{delegation.description}</p>
                        
                        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                          {delegation.start_date && delegation.end_date && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Calendar className="w-4 h-4" />
                              <span>{format(new Date(delegation.start_date), 'MMM d')} - {format(new Date(delegation.end_date), 'MMM d, yyyy')}</span>
                            </div>
                          )}
                          {delegation.max_participants && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Users className="w-4 h-4" />
                              <span>{delegation.current_participants}/{delegation.max_participants} seats</span>
                            </div>
                          )}
                        </div>

                        {delegation.highlights && delegation.highlights.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {(delegation.highlights as string[]).slice(0, 3).map((highlight, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                {highlight}
                              </Badge>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-4 border-t border-border">
                          <div>
                            <span className="text-2xl font-bold text-foreground">
                              {delegation.currency || 'INR'} {delegation.price?.toLocaleString()}
                            </span>
                            <span className="text-sm text-muted-foreground">/person</span>
                          </div>
                          <Button>
                            Register Now
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Past Success Stats */}
        <section className="py-16 bg-primary text-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Delegation Success</h2>
              <p className="text-white/80">Track record of successful business missions</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold mb-2">200+</div>
                <div className="text-white/70">Delegations Organized</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">50+</div>
                <div className="text-white/70">Countries Covered</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">5000+</div>
                <div className="text-white/70">B2B Meetings Arranged</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">₹2000Cr+</div>
                <div className="text-white/70">Business Generated</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Can't Find a Suitable Delegation?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              We can organize custom business missions tailored to your specific industry and target markets
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="px-8">
                Request Custom Delegation
              </Button>
              <Button size="lg" variant="outline" className="px-8">
                Talk to Our Team
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Delegation;
