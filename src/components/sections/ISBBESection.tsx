import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const exhibitions = [
  {
    country: "Kenya",
    region: "East Africa",
    description: "Strategic gateway to the East African market with growing consumer demand and trade opportunities.",
  },
  {
    country: "Brazil",
    region: "South America",
    description: "Access Latin America's largest economy and its diverse consumer market segments.",
  },
  {
    country: "Chile",
    region: "South America",
    description: "Stable economy with high purchasing power and strong trade agreements network.",
  },
  {
    country: "Uzbekistan",
    region: "Central Asia",
    description: "Emerging hub on the historic Silk Road with growing import requirements.",
  },
  {
    country: "Malaysia",
    region: "Southeast Asia",
    description: "ASEAN business center offering access to 600+ million regional consumers.",
  },
  {
    country: "UAE",
    region: "Middle East",
    description: "Global trading hub connecting markets across Middle East, Africa, and South Asia.",
  },
];

const ISBBESection = () => {
  return (
    <section className="section-spacing bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-sm font-medium text-primary uppercase tracking-wider mb-4">
            International Program
          </p>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-6">
            Indian Street Beyond Border Events
          </h2>
          <p className="text-lg text-muted-foreground">
            Taking Indian products directly to global consumers through strategic 
            B2C exhibitions across key international markets.
          </p>
        </div>

        {/* Exhibitions Grid */}
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
            {exhibitions.map((exhibition) => (
              <div
                key={exhibition.country}
                className="bg-background p-8 group"
              >
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                  {exhibition.region}
                </p>
                <h3 className="text-xl font-serif font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {exhibition.country}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {exhibition.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link 
            to="/events"
            className="inline-flex items-center text-foreground font-medium hover:text-primary transition-colors"
          >
            View all upcoming exhibitions
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ISBBESection;
