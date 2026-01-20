import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const services = [
  {
    title: "Trade Consultancy",
    description: "Expert guidance on export-import procedures, market entry strategies, documentation requirements, and international trade compliance.",
    link: "/consultancy",
  },
  {
    title: "Business Delegations",
    description: "Organized trade missions to key markets including Southeast Asia, Middle East, Europe, and Americas for direct business engagement.",
    link: "/delegation",
  },
  {
    title: "Training Programs",
    description: "Comprehensive capacity building programs on international trade practices, export documentation, and market development strategies.",
    link: "/training",
  },
  {
    title: "Policy Advisory",
    description: "Navigation of government schemes, subsidies, trade policies, and regulatory frameworks to maximize business opportunities.",
    link: "/schemes",
  },
  {
    title: "Market Intelligence",
    description: "Research-backed insights on global markets, buyer trends, competitive analysis, and emerging trade opportunities.",
    link: "/buyer-discovery",
  },
  {
    title: "Networking Events",
    description: "B2B meetings, trade exhibitions, and industry conferences connecting exporters with international buyers and partners.",
    link: "/events",
  },
];

const ServicesSection = () => {
  return (
    <section className="section-spacing bg-secondary/30 border-y border-border">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-6">
            Our Services
          </h2>
          <p className="text-lg text-muted-foreground">
            Comprehensive trade facilitation services to support your international business objectives.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-border max-w-6xl mx-auto">
          {services.map((service) => (
            <div
              key={service.title}
              className="bg-background p-8 lg:p-10 group"
            >
              <h3 className="text-xl font-serif font-bold text-primary mb-4">
                {service.title}
              </h3>
              
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {service.description}
              </p>
              
              <Link 
                to={service.link}
                className="inline-flex items-center text-foreground font-medium group-hover:text-primary transition-colors"
              >
                Learn more 
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
