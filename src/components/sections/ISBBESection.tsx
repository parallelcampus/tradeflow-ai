import { ArrowRight, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

const exhibitions = [
  {
    country: "Kenya",
    flag: "🇰🇪",
    description: "East African market gateway with growing consumer demand",
    color: "from-emerald-500 to-emerald-600",
  },
  {
    country: "Brazil",
    flag: "🇧🇷",
    description: "Latin America's largest economy and consumer market",
    color: "from-green-500 to-yellow-500",
  },
  {
    country: "Chile",
    flag: "🇨🇱",
    description: "Stable economy with high purchasing power consumers",
    color: "from-red-500 to-blue-600",
  },
  {
    country: "Uzbekistan",
    flag: "🇺🇿",
    description: "Central Asian hub on the historic Silk Road",
    color: "from-cyan-500 to-green-500",
  },
  {
    country: "Malaysia",
    flag: "🇲🇾",
    description: "ASEAN business center with diverse consumer base",
    color: "from-yellow-500 to-red-500",
  },
  {
    country: "Dubai, UAE",
    flag: "🇦🇪",
    description: "Global trading hub and luxury market center",
    color: "from-green-600 to-red-500",
  },
];

const ISBBESection = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-primary/5 via-background to-accent/5 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--accent)/0.1),transparent_50%)]" />
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6">
            <Globe className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">New Initiative</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            ISBBE - Indian Street
            <span className="block text-primary">Beyond Border Events</span>
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Taking Indian products directly to global consumers through strategic B2C exhibitions across Africa, South America, Middle East, and Asia
          </p>
        </div>

        {/* Exhibitions Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {exhibitions.map((exhibition) => (
            <div
              key={exhibition.country}
              className="group bg-card rounded-2xl p-6 shadow-card hover:shadow-elevated transition-all duration-500 border border-border hover:border-primary/30 cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div className="text-4xl">{exhibition.flag}</div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {exhibition.country}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {exhibition.description}
                  </p>
                </div>
              </div>
              
              {/* Hover gradient bar */}
              <div className={`h-1 w-0 group-hover:w-full bg-gradient-to-r ${exhibition.color} rounded-full mt-4 transition-all duration-500`} />
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button size="lg" className="group">
            Explore ISBBE Exhibitions
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ISBBESection;
