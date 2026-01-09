import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Star, MapPin, Clock, DollarSign, Award, Calendar, 
  Video, Phone, Users, Briefcase, CheckCircle2, 
  MessageSquare, Globe, Languages, GraduationCap, Trophy,
  Linkedin, ExternalLink, Quote
} from 'lucide-react';

interface ConsultantProfileProps {
  consultant: {
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
  };
  onBook: () => void;
}

export default function ConsultantProfile({ consultant, onBook }: ConsultantProfileProps) {
  // Fetch reviews
  const { data: reviews } = useQuery({
    queryKey: ['consultant-reviews', consultant.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('consultant_reviews')
        .select('*')
        .eq('consultant_id', consultant.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  // Fetch success stories
  const { data: successStories } = useQuery({
    queryKey: ['consultant-success-stories', consultant.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('consultant_success_stories')
        .select('*')
        .eq('consultant_id', consultant.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  // Fetch services
  const { data: services } = useQuery({
    queryKey: ['consultant-services', consultant.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('consultant_services')
        .select('*')
        .eq('consultant_id', consultant.id);
      if (error) throw error;
      return data;
    }
  });

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
      </div>
    );
  };

  return (
    <ScrollArea className="max-h-[90vh]">
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row gap-6 pb-6 border-b">
          <Avatar className="h-28 w-28">
            <AvatarImage src={consultant.avatar_url || undefined} />
            <AvatarFallback className="text-3xl bg-primary/10 text-primary">
              {consultant.full_name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold">{consultant.full_name}</h2>
                  {consultant.is_verified && (
                    <Badge className="bg-primary/10 text-primary border-0">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
                {consultant.headline && (
                  <p className="text-muted-foreground mt-1">{consultant.headline}</p>
                )}
              </div>
              <div className="text-right">
                {consultant.hourly_rate && (
                  <div className="text-2xl font-bold">
                    ${consultant.hourly_rate}
                    <span className="text-base font-normal text-muted-foreground">/hr</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 mt-4 text-sm">
              <div className="flex items-center gap-1">
                {renderStars(consultant.average_rating)}
                <span className="ml-1 font-medium">{consultant.average_rating.toFixed(1)}</span>
                <span className="text-muted-foreground">({reviews?.length || 0} reviews)</span>
              </div>
              {consultant.location && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {consultant.location}, {consultant.country}
                </div>
              )}
              <div className="flex items-center gap-1 text-muted-foreground">
                <Briefcase className="h-4 w-4" />
                {consultant.years_experience} years experience
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Users className="h-4 w-4" />
                {consultant.total_consultations} consultations
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <Button onClick={onBook}>
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Meeting
              </Button>
              {consultant.linkedin_url && (
                <Button variant="outline" asChild>
                  <a href={consultant.linkedin_url} target="_blank" rel="noopener noreferrer">
                    <Linkedin className="h-4 w-4 mr-2" />
                    LinkedIn
                  </a>
                </Button>
              )}
              {consultant.website_url && (
                <Button variant="outline" asChild>
                  <a href={consultant.website_url} target="_blank" rel="noopener noreferrer">
                    <Globe className="h-4 w-4 mr-2" />
                    Website
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Tabs Content */}
        <Tabs defaultValue="about" className="mt-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="success">Success Stories</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="mt-6 space-y-6">
            {/* Bio */}
            {consultant.bio && (
              <div>
                <h3 className="font-semibold mb-2">About</h3>
                <p className="text-muted-foreground whitespace-pre-line">{consultant.bio}</p>
              </div>
            )}

            {/* Industries */}
            {consultant.industries && consultant.industries.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Industry Expertise</h3>
                <div className="flex flex-wrap gap-2">
                  {consultant.industries.map((industry: any) => (
                    <Badge key={industry.id} variant="secondary">
                      {industry.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Languages */}
            {consultant.languages && consultant.languages.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Languages className="h-4 w-4" />
                  Languages
                </h3>
                <div className="flex flex-wrap gap-2">
                  {consultant.languages.map((lang) => (
                    <Badge key={lang} variant="outline">
                      {lang}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {consultant.certifications && consultant.certifications.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  Certifications
                </h3>
                <ul className="space-y-1">
                  {consultant.certifications.map((cert, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      {cert}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Education */}
            {consultant.education && consultant.education.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  Education
                </h3>
                <ul className="space-y-1">
                  {consultant.education.map((edu, idx) => (
                    <li key={idx} className="text-muted-foreground">{edu}</li>
                  ))}
                </ul>
              </div>
            )}
          </TabsContent>

          <TabsContent value="services" className="mt-6">
            {services && services.length > 0 ? (
              <div className="grid gap-4">
                {services.map((service) => (
                  <Card key={service.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold">{service.service_name}</h4>
                          {service.description && (
                            <p className="text-sm text-muted-foreground mt-1">{service.description}</p>
                          )}
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {service.duration_minutes} min
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          {service.price && (
                            <div className="font-semibold text-lg">${service.price}</div>
                          )}
                          <Button size="sm" className="mt-2" onClick={onBook}>
                            Book
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No specific services listed yet.</p>
                <p className="text-sm">Contact for custom consulting rates.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="success" className="mt-6">
            {successStories && successStories.length > 0 ? (
              <div className="space-y-6">
                {successStories.map((story) => (
                  <Card key={story.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{story.title}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">
                            {story.client_company} • {story.industry}
                          </p>
                        </div>
                        {story.is_featured && (
                          <Badge className="bg-yellow-100 text-yellow-800 border-0">
                            <Trophy className="h-3 w-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {story.challenge && (
                        <div>
                          <h5 className="font-medium text-sm text-muted-foreground">Challenge</h5>
                          <p className="text-sm">{story.challenge}</p>
                        </div>
                      )}
                      {story.solution && (
                        <div>
                          <h5 className="font-medium text-sm text-muted-foreground">Solution</h5>
                          <p className="text-sm">{story.solution}</p>
                        </div>
                      )}
                      {story.results && (
                        <div>
                          <h5 className="font-medium text-sm text-muted-foreground">Results</h5>
                          <p className="text-sm">{story.results}</p>
                        </div>
                      )}
                      {story.testimonial_quote && (
                        <blockquote className="border-l-4 border-primary/30 pl-4 italic text-muted-foreground">
                          <Quote className="h-4 w-4 mb-2 text-primary/50" />
                          "{story.testimonial_quote}"
                          {story.client_name && (
                            <footer className="mt-2 text-sm not-italic">
                              — {story.client_name}
                            </footer>
                          )}
                        </blockquote>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No success stories shared yet.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            {reviews && reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{review.reviewer_name}</span>
                            {review.is_verified && (
                              <Badge variant="outline" className="text-xs">
                                Verified
                              </Badge>
                            )}
                          </div>
                          {review.reviewer_company && (
                            <p className="text-sm text-muted-foreground">{review.reviewer_company}</p>
                          )}
                        </div>
                        <div className="text-right">
                          {renderStars(review.rating)}
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(review.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      {review.title && (
                        <h4 className="font-medium mb-1">{review.title}</h4>
                      )}
                      {review.review_text && (
                        <p className="text-sm text-muted-foreground">{review.review_text}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No reviews yet.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  );
}
