import { 
  Globe, 
  FileText, 
  Users, 
  Calendar, 
  GraduationCap, 
  Sparkles,
  ArrowRight,
  Building2,
  ShoppingBag,
  Plane
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const services = [
  {
    icon: Globe,
    title: "Trade Consultancy",
    description: "Expert guidance on export-import procedures, market entry strategies, and international trade compliance. Professional consultation at ₹2,500/hour.",
    features: ["Market research & analysis", "Regulatory compliance", "Business strategy planning"],
    link: "/consultants",
    color: "bg-primary",
  },
  {
    icon: GraduationCap,
    title: "Training & Workshops",
    description: "Comprehensive training programs on export-import fundamentals. 3-hour intensive sessions at ₹5,999 covering all aspects of international trade.",
    features: ["Export-import basics", "Documentation training", "Market analysis techniques"],
    link: "/training",
    color: "bg-success",
  },
  {
    icon: Plane,
    title: "Business Delegations",
    description: "Organized business delegations to Malaysia, Russia, USA, Japan, and UAE. Connect with potential partners and explore new markets firsthand.",
    features: ["5 target countries", "B2B meeting facilitation", "Market visit programs"],
    link: "/delegations",
    color: "bg-warning",
  },
  {
    icon: Users,
    title: "Global Network",
    description: "Access to our extensive network of verified international partners and agents. Membership at ₹2,999/year for ongoing support and connections.",
    features: ["500+ global partners", "50+ countries coverage", "Ongoing business support"],
    link: "/buyer-discovery",
    color: "bg-info",
  },
  {
    icon: FileText,
    title: "Government Schemes",
    description: "AI-powered navigation of subsidies, incentives, and policy benefits. Get matched with schemes you're eligible for automatically.",
    features: ["Eligibility checker", "Application guidance", "Policy updates"],
    link: "/schemes",
    color: "bg-destructive",
  },
  {
    icon: Sparkles,
    title: "AI Trade Assistant",
    description: "24/7 intelligent support for queries, document analysis, scheme guidance, and trade recommendations powered by advanced AI.",
    features: ["Document analysis", "Instant answers", "Multilingual support"],
    link: "/ai-assistant",
    color: "bg-primary",
  },
];

const ServicesSection = () => {
  return (
    <section id="services" className="py-24 bg-background relative">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-4">
            Our Services
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Complete Trade 
            <span className="text-primary"> Ecosystem</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            From policy navigation to buyer connections, we provide everything you need to succeed in international trade.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                className="group relative bg-card rounded-2xl p-8 shadow-card hover:shadow-elevated transition-all duration-500 border border-border hover:border-primary/30 overflow-hidden flex flex-col"
              >
                {/* Hover gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10 flex-1 flex flex-col">
                  <div className={`w-14 h-14 rounded-xl ${service.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                  
                  <p className="text-muted-foreground mb-4 leading-relaxed text-sm">
                    {service.description}
                  </p>

                  {/* Features list */}
                  <ul className="space-y-2 mb-6 flex-grow">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-foreground">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <Link to={service.link}>
                    <Button variant="ghost" className="p-0 h-auto text-primary hover:text-primary/80 group/btn justify-start">
                      Learn More 
                      <ArrowRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Stats Bar */}
        <div className="mt-20 bg-primary rounded-2xl p-8 lg:p-12 shadow-elevated">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center">
              <Building2 className="w-8 h-8 text-white/80 mb-3" />
              <span className="text-3xl lg:text-4xl font-bold text-white">5,000+</span>
              <span className="text-sm text-white/70 mt-1">Registered Companies</span>
            </div>
            <div className="flex flex-col items-center">
              <ShoppingBag className="w-8 h-8 text-warning mb-3" />
              <span className="text-3xl lg:text-4xl font-bold text-white">25K+</span>
              <span className="text-sm text-white/70 mt-1">Trade Deals Closed</span>
            </div>
            <div className="flex flex-col items-center">
              <Plane className="w-8 h-8 text-white/80 mb-3" />
              <span className="text-3xl lg:text-4xl font-bold text-white">200+</span>
              <span className="text-sm text-white/70 mt-1">Delegations Organized</span>
            </div>
            <div className="flex flex-col items-center">
              <GraduationCap className="w-8 h-8 text-warning mb-3" />
              <span className="text-3xl lg:text-4xl font-bold text-white">10K+</span>
              <span className="text-sm text-white/70 mt-1">Professionals Trained</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
