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
    description: "Upload government PDFs, policies, and circulars. Our AI extracts key eligibility points, benefits, deadlines, and required documents—translating complex bureaucratic language into simple, actionable steps.",
  },
  {
    icon: Link,
    title: "Scheme Analyzer",
    description: "Paste any government scheme URL. AI fetches live content, summarizes benefits, identifies applicable industries, and auto-tags by state and export category.",
  },
  {
    icon: MessageSquare,
    title: "Trade Assistant",
    description: "Chat with our AI to understand export/import procedures, compare incentives, get compliance guidance, and ask questions from uploaded documents.",
  },
  {
    icon: Languages,
    title: "Multilingual Support",
    description: "Access everything in English, Hindi, Arabic, Vietnamese, Bahasa, French, and Spanish. AI responses and document summaries in your preferred language.",
  },
];

const capabilities = [
  "Extract key points from 100+ page PDFs in seconds",
  "Auto-generate step-by-step application guides",
  "Context-aware responses based on your profile",
  "Escalate complex queries to human consultants",
  "OCR support for scanned documents",
  "Real-time policy updates and alerts",
];

const AISection = () => {
  return (
    <section id="ai" className="py-24 bg-muted/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-gold-soft/5 to-transparent" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-primary/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            <span className="inline-block px-4 py-1.5 bg-teal-primary/10 text-teal-primary text-sm font-semibold rounded-full mb-4">
              AI-Powered
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-6">
              Intelligence That
              <span className="block text-gradient-gold">Understands Trade</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Our AI engine is specifically trained on trade policies, government schemes, and export-import regulations. It reads, analyzes, and explains complex documents so you can focus on growing your business.
            </p>

            {/* Capabilities list */}
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {capabilities.map((capability, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-foreground">{capability}</span>
                </div>
              ))}
            </div>

            <Button variant="hero" size="lg" className="group">
              <Sparkles className="w-5 h-5" />
              Try AI Assistant
            </Button>
          </div>

          {/* Right Content - Feature Cards */}
          <div className="grid gap-6">
            {aiFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="group bg-card rounded-2xl p-6 shadow-soft hover:shadow-medium transition-all duration-300 border border-border hover:border-gold-soft/30 flex gap-5"
                >
                  <div className="w-12 h-12 rounded-xl bg-navy-deep flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-gold-soft" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-2">
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

        {/* Chat Preview Card */}
        <div className="mt-20 bg-card rounded-2xl shadow-strong border border-border overflow-hidden">
          <div className="bg-navy-deep px-6 py-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gold-gradient flex items-center justify-center">
              <Bot className="w-5 h-5 text-navy-deep" />
            </div>
            <div>
              <h4 className="text-gold-pale font-semibold">GTPC AI Trade Assistant</h4>
              <p className="text-xs text-gold-pale/60">Powered by Advanced Language Models</p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
              <span className="text-xs text-gold-pale/60">Online</span>
            </div>
          </div>
          
          <div className="p-6 space-y-4">
            {/* User message */}
            <div className="flex justify-end">
              <div className="bg-navy-deep/10 rounded-2xl rounded-br-sm px-4 py-3 max-w-md">
                <p className="text-sm text-foreground">What are the benefits of MEIS scheme for textile exporters?</p>
              </div>
            </div>
            
            {/* AI response */}
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gold-gradient flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-navy-deep" />
              </div>
              <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-3 max-w-lg">
                <p className="text-sm text-foreground mb-3">
                  The <strong>Merchandise Exports from India Scheme (MEIS)</strong> offers several benefits for textile exporters:
                </p>
                <ul className="text-sm text-foreground space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-gold-bright rounded-full mt-2" />
                    <span><strong>Duty Credit:</strong> 2-5% of FOB value as duty credit scrips</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-gold-bright rounded-full mt-2" />
                    <span><strong>Transferable:</strong> Scrips can be used or sold in market</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-gold-bright rounded-full mt-2" />
                    <span><strong>Wide Coverage:</strong> Over 8,000 tariff lines covered</span>
                  </li>
                </ul>
                <p className="text-xs text-muted-foreground mt-3">
                  Would you like me to check your eligibility based on your export profile?
                </p>
              </div>
            </div>
          </div>
          
          <div className="px-6 pb-6">
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Ask about schemes, policies, or export procedures..."
                className="flex-1 bg-muted rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold-soft/50"
              />
              <Button variant="hero" size="default">
                Send
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AISection;
