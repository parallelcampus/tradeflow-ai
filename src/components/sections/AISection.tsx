import { 
  FileSearch, 
  Languages, 
  Link, 
  MessageSquare, 
  ArrowRight
} from "lucide-react";
import { Link as RouterLink } from "react-router-dom";

const aiFeatures = [
  {
    icon: FileSearch,
    title: "Document Intelligence",
    description: "Upload government PDFs, policies, and circulars. Extract key eligibility points, benefits, and required documents from complex documentation.",
  },
  {
    icon: Link,
    title: "Scheme Analysis",
    description: "Analyze government scheme URLs. Summarize benefits, identify applicable industries, and auto-tag by state and export category.",
  },
  {
    icon: MessageSquare,
    title: "Trade Guidance",
    description: "Understand export-import procedures, compare incentives, get compliance guidance, and clarify policy requirements.",
  },
  {
    icon: Languages,
    title: "Multilingual Support",
    description: "Access resources in English, Hindi, Arabic, Vietnamese, Bahasa, French, and Spanish for comprehensive global reach.",
  },
];

const AISection = () => {
  return (
    <section className="section-spacing bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="max-w-3xl mx-auto text-center mb-16">
            <p className="text-sm font-medium text-primary uppercase tracking-wider mb-4">
              Digital Resources
            </p>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-6">
              Trade Intelligence Tools
            </h2>
            <p className="text-lg text-muted-foreground">
              Digital tools to help you navigate policies, analyze documents, 
              and understand trade requirements efficiently.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 gap-12 mb-12">
            {aiFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="flex gap-6">
                  <div className="w-12 h-12 rounded-none bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-serif font-bold text-foreground mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA */}
          <div className="text-center">
            <RouterLink 
              to="/ai-assistant"
              className="inline-flex items-center text-foreground font-medium hover:text-primary transition-colors"
            >
              Access Trade Intelligence Tools
              <ArrowRight className="w-4 h-4 ml-2" />
            </RouterLink>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AISection;
