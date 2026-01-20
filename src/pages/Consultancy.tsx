import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Briefcase, 
  FileText, 
  Globe, 
  Shield, 
  TrendingUp, 
  Users,
  ArrowRight,
  Star,
  CheckCircle,
  Clock
} from "lucide-react";
import { Link } from "react-router-dom";

const Consultancy = () => {
  const { data: consultants, isLoading } = useQuery({
    queryKey: ['featured-consultants'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('consultants')
        .select('*')
        .eq('is_verified', true)
        .order('average_rating', { ascending: false })
        .limit(4);
      if (error) throw error;
      return data;
    }
  });

  const services = [
    {
      icon: Globe,
      title: "Market Entry Strategy",
      description: "Comprehensive analysis and strategy development for entering new international markets",
      features: ["Market research", "Competitor analysis", "Entry mode selection", "Risk assessment"]
    },
    {
      icon: FileText,
      title: "Export Documentation",
      description: "Complete assistance with export documentation, compliance, and regulatory requirements",
      features: ["License procurement", "Customs documentation", "Quality certifications", "Legal compliance"]
    },
    {
      icon: TrendingUp,
      title: "Trade Finance Advisory",
      description: "Expert guidance on export financing, insurance, and payment risk management",
      features: ["LC negotiation", "Export credit", "Risk mitigation", "Insurance planning"]
    },
    {
      icon: Users,
      title: "Buyer-Seller Matchmaking",
      description: "AI-powered matching with verified international buyers and business partners",
      features: ["Database access", "Due diligence", "Negotiation support", "Contract assistance"]
    },
    {
      icon: Shield,
      title: "Quality & Compliance",
      description: "Support for international quality standards and compliance requirements",
      features: ["ISO certification", "Product testing", "Compliance audits", "Standards training"]
    },
    {
      icon: Briefcase,
      title: "Business Development",
      description: "Strategic support for expanding your export business and building partnerships",
      features: ["Growth strategy", "Partner identification", "Trade fair support", "Brand building"]
    }
  ];

  const process = [
    { step: 1, title: "Initial Consultation", description: "Free 30-minute consultation to understand your requirements" },
    { step: 2, title: "Needs Assessment", description: "Detailed analysis of your business and export objectives" },
    { step: 3, title: "Strategy Development", description: "Custom strategy and action plan development" },
    { step: 4, title: "Implementation", description: "Hands-on support for strategy execution" },
    { step: 5, title: "Ongoing Support", description: "Continuous guidance and market monitoring" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-16 bg-primary">
          <div className="container mx-auto px-4 text-center">
            <Badge className="mb-4 bg-white/20 text-white hover:bg-white/30 border-0">
              <Briefcase className="w-3 h-3 mr-1" />
              Expert Consultancy
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Professional Trade Consultancy Services
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
              Get expert guidance from industry veterans with decades of experience 
              in international trade and export promotion.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-primary">
                Book a Consultation
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Link to="/dashboard/consultants">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                  Browse Consultants
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Our Consultancy Services
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Comprehensive support for every aspect of your international trade journey
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, index) => (
                <Card key={index} className="border-border hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <service.icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{service.title}</CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="w-4 h-4 text-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-16 bg-secondary/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                How It Works
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our streamlined process ensures you get the right support at every stage
              </p>
            </div>
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-5 gap-4">
                {process.map((item, index) => (
                  <div key={index} className="text-center">
                    <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                      {item.step}
                    </div>
                    <h4 className="font-semibold text-foreground mb-2">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Featured Consultants */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Our Expert Consultants
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Work with verified industry experts who bring decades of experience
              </p>
            </div>
            {isLoading ? (
              <div className="text-center py-12">Loading consultants...</div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {(consultants || []).slice(0, 4).map((consultant) => (
                  <Card key={consultant.id} className="border-border hover:shadow-md transition-shadow">
                    <CardContent className="pt-6 text-center">
                      <Avatar className="w-20 h-20 mx-auto mb-4">
                        <AvatarImage src={consultant.avatar_url || ''} />
                        <AvatarFallback className="bg-primary/10 text-primary text-xl">
                          {consultant.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <h4 className="font-semibold text-foreground">{consultant.full_name}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{consultant.headline || 'Trade Consultant'}</p>
                      <div className="flex items-center justify-center gap-1 mb-4">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-medium">{consultant.average_rating?.toFixed(1) || 'N/A'}</span>
                        <span className="text-sm text-muted-foreground">({consultant.total_consultations || 0} consultations)</span>
                      </div>
                      <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {consultant.years_experience || 0}+ years
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            <div className="text-center mt-8">
              <Link to="/dashboard/consultants">
                <Button variant="outline" size="lg">
                  View All Consultants
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-white/80 mb-8 max-w-xl mx-auto">
              Book a free consultation with our experts and take the first step towards global success
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-primary px-8">
                Book Free Consultation
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8">
                Call Us: 1800-XXX-XXXX
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Consultancy;
