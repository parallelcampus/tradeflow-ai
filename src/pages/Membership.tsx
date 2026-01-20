import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Building2, Users, Globe, Award, ArrowRight } from "lucide-react";

const Membership = () => {
  const { data: plans, isLoading } = useQuery({
    queryKey: ['membership-plans'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('membership_plans')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');
      if (error) throw error;
      return data;
    }
  });

  const benefits = [
    { icon: Globe, title: "Global Network Access", description: "Connect with 5000+ verified international buyers and exporters across 50+ countries" },
    { icon: Users, title: "B2B Matchmaking", description: "AI-powered matching with potential business partners based on your industry and requirements" },
    { icon: Building2, title: "Trade Delegations", description: "Priority access to international trade delegations and business missions" },
    { icon: Award, title: "Government Scheme Support", description: "Dedicated assistance for availing export promotion schemes and subsidies" },
  ];

  const membershipTypes = [
    {
      name: "Basic Member",
      price: "Free",
      description: "For businesses starting their export journey",
      features: [
        "Access to buyer database (limited)",
        "Monthly trade newsletter",
        "Basic scheme information",
        "Community forum access",
      ],
      popular: false
    },
    {
      name: "Premium Member",
      price: "₹25,000/year",
      description: "For established exporters seeking growth",
      features: [
        "Full buyer database access",
        "AI-powered buyer matching",
        "Priority delegation registration",
        "Scheme application support",
        "Dedicated relationship manager",
        "Quarterly market reports",
      ],
      popular: true
    },
    {
      name: "Enterprise Member",
      price: "₹75,000/year",
      description: "For large corporations and industry leaders",
      features: [
        "Everything in Premium",
        "VIP delegation seats",
        "Custom market research",
        "Government liaison support",
        "Brand promotion opportunities",
        "Executive networking events",
        "Priority consultant access",
      ],
      popular: false
    }
  ];

  const displayPlans = plans && plans.length > 0 ? plans.map(plan => ({
    name: plan.name,
    price: plan.price ? `${plan.currency || 'USD'} ${plan.price}` : 'Free',
    description: plan.description || '',
    features: Array.isArray(plan.features) ? plan.features : [],
    popular: plan.is_popular
  })) : membershipTypes;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-16 bg-primary">
          <div className="container mx-auto px-4 text-center">
            <Badge className="mb-4 bg-white/20 text-white hover:bg-white/30 border-0">
              <Crown className="w-3 h-3 mr-1" />
              Membership Programs
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Join India's Premier Trade Network
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Become a member of GTPC and unlock exclusive access to global markets, 
              trade opportunities, and government support services.
            </p>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 bg-secondary/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Why Become a Member?
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                GTPC membership opens doors to a world of trade opportunities and support services
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => (
                <Card key={index} className="border-border hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <benefit.icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Membership Plans
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Choose the plan that best fits your business needs and growth aspirations
              </p>
            </div>
            {isLoading ? (
              <div className="text-center py-12">Loading plans...</div>
            ) : (
              <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {displayPlans.map((plan, index) => (
                  <Card 
                    key={index} 
                    className={`relative border-2 ${plan.popular ? 'border-primary shadow-lg' : 'border-border'}`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                      </div>
                    )}
                    <CardHeader className="text-center pb-4">
                      <CardTitle className="text-xl">{plan.name}</CardTitle>
                      <div className="mt-4">
                        <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                      </div>
                      <CardDescription className="mt-2">{plan.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3 mb-6">
                        {plan.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start gap-2 text-sm">
                            <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                            <span className="text-muted-foreground">{String(feature)}</span>
                          </li>
                        ))}
                      </ul>
                      <Button 
                        className="w-full" 
                        variant={plan.popular ? "default" : "outline"}
                      >
                        Get Started
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-primary text-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold mb-2">5000+</div>
                <div className="text-white/70">Active Members</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">50+</div>
                <div className="text-white/70">Countries Covered</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">₹500Cr+</div>
                <div className="text-white/70">Trade Facilitated</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">200+</div>
                <div className="text-white/70">Delegations Organized</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Ready to Expand Your Business Globally?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Join thousands of successful exporters who have grown their business with GTPC membership
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="px-8">
                Apply for Membership
              </Button>
              <Button size="lg" variant="outline" className="px-8">
                Contact Us
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Membership;
