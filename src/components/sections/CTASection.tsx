import { Button } from "@/components/ui/button";
import { ArrowRight, Globe, Sparkles, Users, Phone, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-primary via-primary/95 to-primary/90 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(hsl(0 0% 100%) 1px, transparent 1px),
              linear-gradient(90deg, hsl(0 0% 100%) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        />
      </div>
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-full mb-8 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-warning" />
            <span className="text-sm font-medium text-white">Start Free Today</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6 leading-tight">
            Ready to Transform Your
            <span className="block text-warning">Global Trade Journey?</span>
          </h2>
          
          <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Join thousands of exporters, importers, and trade professionals who are leveraging AI-powered tools to grow their international business.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link to="/auth">
              <Button size="lg" variant="secondary" className="group text-primary font-semibold px-8 h-14 text-base">
                Create Your Account
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 hover:text-white h-14 text-base backdrop-blur-sm">
              Schedule a Demo
            </Button>
          </div>
          
          {/* Trust indicators */}
          <div className="grid sm:grid-cols-3 gap-8 pt-8 border-t border-white/10">
            <div className="flex flex-col items-center gap-2">
              <Globe className="w-8 h-8 text-warning" />
              <span className="text-white font-semibold">150+ Countries</span>
              <span className="text-sm text-white/60">Global reach</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Users className="w-8 h-8 text-white/80" />
              <span className="text-white font-semibold">50,000+ Users</span>
              <span className="text-sm text-white/60">Active community</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Sparkles className="w-8 h-8 text-warning" />
              <span className="text-white font-semibold">24/7 AI Support</span>
              <span className="text-sm text-white/60">Always available</span>
            </div>
          </div>

          {/* Contact info */}
          <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-center gap-6 text-white/70">
            <a href="tel:+912212345678" className="flex items-center gap-2 hover:text-white transition-colors">
              <Phone className="w-4 h-4" />
              <span>+91 22 1234 5678</span>
            </a>
            <a href="mailto:support@gtpc.global" className="flex items-center gap-2 hover:text-white transition-colors">
              <Mail className="w-4 h-4" />
              <span>support@gtpc.global</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
