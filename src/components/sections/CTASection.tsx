import { Button } from "@/components/ui/button";
import { ArrowRight, Globe, Sparkles, Users } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-24 bg-hero-gradient relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-bright/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-teal-primary/10 rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-soft/10 border border-gold-soft/20 rounded-full mb-8">
            <Sparkles className="w-4 h-4 text-gold-soft" />
            <span className="text-sm font-medium text-gold-soft">Start Free Today</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-display font-bold text-gold-pale mb-6 leading-tight">
            Ready to Transform Your
            <span className="block text-gradient-gold">Global Trade Journey?</span>
          </h2>
          
          <p className="text-lg md:text-xl text-gold-pale/70 mb-10 max-w-2xl mx-auto">
            Join thousands of exporters, importers, and trade professionals who are leveraging AI-powered tools to grow their international business.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button variant="hero" size="xl" className="group">
              Create Your Account
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="heroOutline" size="xl">
              Schedule a Demo
            </Button>
          </div>
          
          {/* Trust indicators */}
          <div className="grid sm:grid-cols-3 gap-8 pt-8 border-t border-gold-soft/10">
            <div className="flex flex-col items-center gap-2">
              <Globe className="w-8 h-8 text-gold-soft" />
              <span className="text-gold-pale font-semibold">150+ Countries</span>
              <span className="text-sm text-gold-pale/60">Global reach</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Users className="w-8 h-8 text-teal-light" />
              <span className="text-gold-pale font-semibold">50,000+ Users</span>
              <span className="text-sm text-gold-pale/60">Active community</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Sparkles className="w-8 h-8 text-gold-soft" />
              <span className="text-gold-pale font-semibold">24/7 AI Support</span>
              <span className="text-sm text-gold-pale/60">Always available</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
