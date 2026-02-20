import { Button } from "@/components/ui/button";
import { ArrowRight, Globe, Sparkles, Users } from "lucide-react";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="py-24 bg-primary/5 border-y border-primary/20 relative overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-sm mb-8">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Start Free Today</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-serif font-bold text-foreground mb-6 leading-tight">
            Ready to Transform Your
            <span className="block text-primary">Global Trade Journey?</span>
          </h2>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Join thousands of exporters, importers, and trade professionals who are leveraging AI-powered tools to grow their international business.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link to="/auth">
              <Button size="xl" className="group bg-primary text-primary-foreground hover:bg-primary/90">
                Create Your Account
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button variant="heroOutline" size="xl" className="border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground">
              Schedule a Demo
            </Button>
          </div>
          
          <div className="grid sm:grid-cols-3 gap-8 pt-8 border-t border-border">
            <div className="flex flex-col items-center gap-2">
              <Globe className="w-8 h-8 text-primary" />
              <span className="text-foreground font-semibold">150+ Countries</span>
              <span className="text-sm text-muted-foreground">Global reach</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Users className="w-8 h-8 text-primary" />
              <span className="text-foreground font-semibold">50,000+ Users</span>
              <span className="text-sm text-muted-foreground">Active community</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Sparkles className="w-8 h-8 text-primary" />
              <span className="text-foreground font-semibold">24/7 AI Support</span>
              <span className="text-sm text-muted-foreground">Always available</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
