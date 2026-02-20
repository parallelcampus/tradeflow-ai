import { 
  Globe, 
  FileText, 
  Users, 
  Calendar, 
  Sparkles,
  ArrowRight,
  Building2,
  ShoppingBag,
  Plane,
  HeartPulse
} from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
  {
    icon: Globe,
    title: "Export-Import Services",
    description: "End-to-end trade facilitation with documentation, compliance, and logistics support.",
  },
  {
    icon: FileText,
    title: "Government Schemes",
    description: "AI-powered navigation of subsidies, incentives, and policy benefits for your business.",
  },
  {
    icon: Users,
    title: "Buyer Discovery",
    description: "Connect with verified international buyers using intelligent matching algorithms.",
  },
  {
    icon: Calendar,
    title: "Events & Exhibitions",
    description: "Access trade fairs, B2B meetings, and international delegations worldwide.",
  },
  {
    icon: HeartPulse,
    title: "Medical & Tourism Facilitation",
    description: "International healthcare coordination, pilgrimage circuits, and travel support services.",
  },
  {
    icon: Sparkles,
    title: "AI Trade Assistant",
    description: "24/7 intelligent support for queries, document analysis, and scheme guidance.",
  },
];

const ServicesSection = () => {
  return (
    <section id="services" className="py-24 bg-background relative">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-semibold rounded-sm mb-4">
            Our Services
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-foreground mb-6">
            Complete Trade & Allied
            <span className="text-primary"> Services Ecosystem</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            From policy navigation to medical tourism, we provide everything you need to succeed in international trade and allied services.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                className="group relative bg-card rounded-sm p-8 shadow-card hover:shadow-card-hover transition-all duration-300 border border-border hover:border-primary/30 overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-sm bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary transition-colors duration-300">
                    <Icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
                  </div>
                  
                  <h3 className="text-xl font-serif font-bold text-foreground mb-3">
                    {service.title}
                  </h3>
                  
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {service.description}
                  </p>
                  
                  <Button variant="ghost" className="p-0 h-auto text-primary hover:text-primary/80 group/btn">
                    Learn More 
                    <ArrowRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Stats Bar */}
        <div className="mt-20 bg-primary/5 border border-primary/20 rounded-sm p-8 lg:p-12">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center">
              <Building2 className="w-8 h-8 text-primary mb-3" />
              <span className="text-3xl lg:text-4xl font-bold text-foreground">5,000+</span>
              <span className="text-sm text-muted-foreground mt-1">Registered Companies</span>
            </div>
            <div className="flex flex-col items-center">
              <ShoppingBag className="w-8 h-8 text-primary mb-3" />
              <span className="text-3xl lg:text-4xl font-bold text-foreground">25K+</span>
              <span className="text-sm text-muted-foreground mt-1">Trade Deals Closed</span>
            </div>
            <div className="flex flex-col items-center">
              <Plane className="w-8 h-8 text-primary mb-3" />
              <span className="text-3xl lg:text-4xl font-bold text-foreground">200+</span>
              <span className="text-sm text-muted-foreground mt-1">Delegations Organized</span>
            </div>
            <div className="flex flex-col items-center">
              <HeartPulse className="w-8 h-8 text-primary mb-3" />
              <span className="text-3xl lg:text-4xl font-bold text-foreground">1,000+</span>
              <span className="text-sm text-muted-foreground mt-1">Patients Facilitated</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
