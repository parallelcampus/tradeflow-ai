import { Button } from "@/components/ui/button";
import { ArrowRight, Globe, TrendingUp, Users, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen bg-background overflow-hidden pt-20">
      {/* Subtle grid */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(hsl(155 79% 20% / 0.4) 1px, transparent 1px), linear-gradient(90deg, hsl(155 79% 20% / 0.4) 1px, transparent 1px)`,
          backgroundSize: '80px 80px'
        }}
      />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center min-h-[calc(100vh-5rem)] py-16">
          {/* Left Content */}
          <div className="flex flex-col gap-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-sm w-fit animate-fade-in">
              <span className="w-2 h-2 bg-primary rounded-full" />
              <span className="text-sm font-medium text-primary">AI-Powered Trade & Allied Services</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif font-bold text-foreground leading-[1.1] animate-fade-in" style={{ animationDelay: '0.1s' }}>
              Empowering
              <span className="block text-primary">Global Trade</span>
              <span className="block">Excellence</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Transform your international trade journey with AI-driven insights, government scheme navigation, medical tourism facilitation, and seamless buyer-seller connections.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <Link to="/auth">
                <Button variant="hero" size="xl" className="group bg-primary text-primary-foreground">
                  Start Your Journey
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/tourism-medical">
                <Button variant="heroOutline" size="xl" className="border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground">
                  Medical & Tourism
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="flex flex-col">
                <span className="text-2xl md:text-3xl font-bold text-primary">50K+</span>
                <span className="text-sm text-muted-foreground">Active Members</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl md:text-3xl font-bold text-primary">150+</span>
                <span className="text-sm text-muted-foreground">Countries Served</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl md:text-3xl font-bold text-primary">$2B+</span>
                <span className="text-sm text-muted-foreground">Trade Facilitated</span>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="relative flex items-center justify-center lg:justify-end">
            <div className="relative w-80 h-80 md:w-[420px] md:h-[420px] lg:w-[480px] lg:h-[480px]">
              <div className="absolute inset-0 rounded-full border border-primary/20" />
              <div className="absolute inset-4 rounded-full border border-primary/10" />
              
              <div className="absolute inset-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Globe className="w-24 h-24 md:w-32 md:h-32 text-primary/60" strokeWidth={1} />
              </div>

              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-card rounded-sm p-4 shadow-md border border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-sm bg-primary flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">AI Analytics</p>
                    <p className="text-xs text-muted-foreground">Real-time insights</p>
                  </div>
                </div>
              </div>

              <div className="absolute top-1/2 -right-4 -translate-y-1/2 bg-card rounded-sm p-4 shadow-md border border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-sm bg-primary flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Buyer Match</p>
                    <p className="text-xs text-muted-foreground">AI-powered discovery</p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 left-1/4 bg-card rounded-sm p-4 shadow-md border border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-sm bg-primary/10 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Compliant</p>
                    <p className="text-xs text-muted-foreground">Govt verified</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-border" />
    </section>
  );
};

export default HeroSection;
