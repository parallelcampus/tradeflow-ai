import { 
  Globe, 
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
    title: "International Trade Facilitation",
    description: "End-to-end cross-border trade support — from company registration and customs documentation to shipping logistics and compliance across UAE, Asia, Europe, and Africa.",
  },
  {
    icon: Building2,
    title: "Dubai Business Setup",
    description: "Complete company formation services in Dubai Free Zones (DMCC, JAFZA, DAFZA), mainland, and offshore — including licensing, visa processing, and PRO services.",
  },
  {
    icon: Users,
    title: "Global Buyer Discovery",
    description: "Identify verified importers across 85+ countries using AI-powered intent signals, trade data analytics, and curated B2B matchmaking events.",
  },
  {
    icon: Calendar,
    title: "Trade Shows & Events",
    description: "Participate in AITAS-organized international exhibitions, trade delegations, and sector-specific buyer-seller meets in Dubai, Asia, and global markets.",
  },
  {
    icon: HeartPulse,
    title: "Medical Tourism Services",
    description: "Comprehensive coordination for international patients seeking world-class treatment — hospital selection, visa facilitation, travel logistics, and post-treatment follow-up.",
  },
  {
    icon: Sparkles,
    title: "AI Trade Intelligence",
    description: "24/7 AI assistant trained on international trade regulations, UAE business laws, free zone policies, and medical tourism procedures — with multilingual support in 7 languages.",
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
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-6">
            Integrated Trade &
            <span className="text-primary"> Allied Services</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            AITAS brings together every service an enterprise needs to trade, set up operations, access healthcare, and grow globally — powered by AI and backed by domain experts from Dubai.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service) => {
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
                  
                  <h3 className="text-xl font-display font-bold text-foreground mb-3">
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
              <span className="text-3xl lg:text-4xl font-bold text-foreground">3,200+</span>
              <span className="text-sm text-muted-foreground mt-1">Global Members</span>
            </div>
            <div className="flex flex-col items-center">
              <ShoppingBag className="w-8 h-8 text-primary mb-3" />
              <span className="text-3xl lg:text-4xl font-bold text-foreground">$50M+</span>
              <span className="text-sm text-muted-foreground mt-1">Trade Deals Enabled</span>
            </div>
            <div className="flex flex-col items-center">
              <Plane className="w-8 h-8 text-primary mb-3" />
              <span className="text-3xl lg:text-4xl font-bold text-foreground">45+</span>
              <span className="text-sm text-muted-foreground mt-1">Delegations Completed</span>
            </div>
            <div className="flex flex-col items-center">
              <HeartPulse className="w-8 h-8 text-primary mb-3" />
              <span className="text-3xl lg:text-4xl font-bold text-foreground">800+</span>
              <span className="text-sm text-muted-foreground mt-1">Patients Assisted</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
