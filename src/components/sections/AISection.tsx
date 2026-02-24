import { 
  Bot, 
  FileSearch, 
  Languages, 
  Link, 
  MessageSquare, 
  Sparkles,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";

const aiFeatures = [
  {
    icon: FileSearch,
    title: "Document Intelligence",
    description: "Upload trade documents, medical reports, and business registrations. Our AI extracts key details, eligibility points, and required documentation.",
  },
  {
    icon: Link,
    title: "Business Setup Advisor",
    description: "Get AI-powered guidance on company formation in Dubai, UAE Free Zones, and global markets — including licensing, visa, and compliance requirements.",
  },
  {
    icon: MessageSquare,
    title: "Medical Tourism Concierge",
    description: "Chat with our AI to find accredited hospitals, compare treatment options, coordinate travel logistics, and get cost estimates for medical procedures.",
  },
  {
    icon: Languages,
    title: "Multilingual Support",
    description: "Access everything in English, Arabic, Hindi, Vietnamese, Bahasa, French, and Spanish. AI responses in your preferred language.",
  },
];

const capabilities = [
  "Dubai Free Zone setup guidance in minutes",
  "Auto-generate step-by-step visa & licensing guides",
  "Medical tourism cost comparisons across hospitals",
  "Escalate complex queries to human consultants",
  "Trade event recommendations based on your sector",
  "Real-time regulatory updates for UAE & global markets",
];

const AISection = () => {
  return (
    <section id="ai" className="py-24 bg-muted/50 relative overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-semibold rounded-sm mb-4">
              AI-Powered
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-6">
              Intelligence That
              <span className="block text-primary">Understands Trade</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Our AI engine is trained on international trade regulations, Dubai business setup procedures, medical tourism coordination, and global event management — so you can focus on growing your business across borders.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {capabilities.map((capability, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-foreground">{capability}</span>
                </div>
              ))}
            </div>

            <Button variant="hero" size="lg" className="group">
              <Sparkles className="w-5 h-5" />
              Try AI Assistant
            </Button>
          </div>

          {/* Right Content */}
          <div className="grid gap-6">
            {aiFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="group bg-card rounded-sm p-6 shadow-card hover:shadow-card-hover transition-all duration-300 border border-border hover:border-primary/30 flex gap-5"
                >
                  <div className="w-12 h-12 rounded-sm bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary transition-colors">
                    <Icon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-lg font-display font-bold text-foreground mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chat Preview */}
        <div className="mt-20 bg-card rounded-sm shadow-elevated border border-border overflow-hidden">
          <div className="bg-primary/5 px-6 py-4 flex items-center gap-3 border-b border-border">
            <div className="w-10 h-10 rounded-sm bg-primary flex items-center justify-center">
              <Bot className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h4 className="text-foreground font-semibold">AITAS AI Trade Assistant</h4>
              <p className="text-xs text-muted-foreground">Powered by Advanced Language Models</p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <span className="w-2 h-2 bg-primary rounded-full" />
              <span className="text-xs text-muted-foreground">Online</span>
            </div>
          </div>
          
          <div className="p-6 space-y-4">
    <div className="flex justify-end">
              <div className="bg-primary/10 rounded-sm px-4 py-3 max-w-md">
                <p className="text-sm text-foreground">What are the steps to set up a business in Dubai Free Zone?</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-sm bg-primary flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-primary-foreground" />
              </div>
              <div className="bg-muted rounded-sm px-4 py-3 max-w-lg">
                <p className="text-sm text-foreground mb-3">
                  Setting up a business in a <strong>Dubai Free Zone</strong> involves these key steps:
                </p>
                <ul className="text-sm text-foreground space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2" />
                    <span><strong>Choose Free Zone:</strong> DMCC, JAFZA, DAFZA based on your industry</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2" />
                    <span><strong>100% Ownership:</strong> No local sponsor required, full repatriation of profits</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2" />
                    <span><strong>Tax Benefits:</strong> 0% corporate & income tax in most free zones</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="px-6 pb-6">
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Ask about Dubai business setup, medical tourism, or trade events..."
                className="flex-1 bg-muted rounded-sm px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <Button variant="default" size="default">Send</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AISection;
