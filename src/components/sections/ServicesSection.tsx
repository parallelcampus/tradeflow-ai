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

const services = [
  {
    icon: Globe,
    title: "Export-Import Services",
    description: "End-to-end trade facilitation with documentation, compliance, and logistics support.",
    color: "bg-gold-gradient",
    iconColor: "text-navy-deep",
  },
  {
    icon: FileText,
    title: "Government Schemes",
    description: "AI-powered navigation of subsidies, incentives, and policy benefits for your business.",
    color: "bg-teal-primary",
    iconColor: "text-white",
  },
  {
    icon: Users,
    title: "Buyer Discovery",
    description: "Connect with verified international buyers using intelligent matching algorithms.",
    color: "bg-navy-deep",
    iconColor: "text-gold-soft",
  },
  {
    icon: Calendar,
    title: "Events & Exhibitions",
    description: "Access trade fairs, B2B meetings, and international delegations worldwide.",
    color: "bg-gold-gradient",
    iconColor: "text-navy-deep",
  },
  {
    icon: GraduationCap,
    title: "Training Programs",
    description: "Certified courses on export procedures, compliance, and international trade.",
    color: "bg-teal-primary",
    iconColor: "text-white",
  },
  {
    icon: Sparkles,
    title: "AI Trade Assistant",
    description: "24/7 intelligent support for queries, document analysis, and scheme guidance.",
    color: "bg-navy-deep",
    iconColor: "text-gold-soft",
  },
];

const ServicesSection = () => {
  return (
    <section id="services" className="py-24 bg-background relative">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 bg-gold-soft/10 text-gold-bright text-sm font-semibold rounded-full mb-4">
            Our Services
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-6">
            Complete Trade 
            <span className="text-gradient-gold"> Ecosystem</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            From policy navigation to buyer connections, we provide everything you need to succeed in international trade.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                className="group relative bg-card rounded-2xl p-8 shadow-soft hover:shadow-strong transition-all duration-500 border border-border hover:border-gold-soft/30 overflow-hidden"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Hover gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-gold-soft/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10">
                  <div className={`w-14 h-14 rounded-xl ${service.color} flex items-center justify-center mb-6 shadow-medium group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-7 h-7 ${service.iconColor}`} />
                  </div>
                  
                  <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-gradient-gold transition-colors">
                    {service.title}
                  </h3>
                  
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {service.description}
                  </p>
                  
                  <Button variant="ghost" className="p-0 h-auto text-gold-bright hover:text-gold-soft group/btn">
                    Learn More 
                    <ArrowRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Stats Bar */}
        <div className="mt-20 bg-navy-deep rounded-2xl p-8 lg:p-12 shadow-strong">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center">
              <Building2 className="w-8 h-8 text-gold-soft mb-3" />
              <span className="text-3xl lg:text-4xl font-bold text-gold-pale">5,000+</span>
              <span className="text-sm text-gold-pale/60 mt-1">Registered Companies</span>
            </div>
            <div className="flex flex-col items-center">
              <ShoppingBag className="w-8 h-8 text-teal-light mb-3" />
              <span className="text-3xl lg:text-4xl font-bold text-gold-pale">25K+</span>
              <span className="text-sm text-gold-pale/60 mt-1">Trade Deals Closed</span>
            </div>
            <div className="flex flex-col items-center">
              <Plane className="w-8 h-8 text-gold-soft mb-3" />
              <span className="text-3xl lg:text-4xl font-bold text-gold-pale">200+</span>
              <span className="text-sm text-gold-pale/60 mt-1">Delegations Organized</span>
            </div>
            <div className="flex flex-col items-center">
              <GraduationCap className="w-8 h-8 text-teal-light mb-3" />
              <span className="text-3xl lg:text-4xl font-bold text-gold-pale">10K+</span>
              <span className="text-sm text-gold-pale/60 mt-1">Professionals Trained</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
