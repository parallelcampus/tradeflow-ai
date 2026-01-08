import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Globe, TrendingUp, Users, Shield } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen bg-hero-gradient overflow-hidden pt-20">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated grid */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(hsl(42 100% 50% / 0.3) 1px, transparent 1px),
              linear-gradient(90deg, hsl(42 100% 50% / 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}
        />
        
        {/* Glowing orbs */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gold-bright/10 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-teal-primary/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1.5s' }} />
        
        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-gold-soft/40 rounded-full animate-particle"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center min-h-[calc(100vh-5rem)] py-16">
          {/* Left Content */}
          <div className="flex flex-col gap-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-soft/10 border border-gold-soft/20 rounded-full w-fit animate-fade-in">
              <span className="w-2 h-2 bg-gold-bright rounded-full animate-pulse" />
              <span className="text-sm font-medium text-gold-soft">AI-Powered Trade Facilitation Platform</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-bold text-gold-pale leading-[1.1] animate-fade-in" style={{ animationDelay: '0.1s' }}>
              Empowering
              <span className="block text-gradient-gold">Global Trade</span>
              <span className="block text-teal-light">Excellence</span>
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-gold-pale/70 max-w-xl leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Transform your export-import journey with AI-driven insights, government scheme navigation, and seamless buyer-seller connections—all in one unified platform.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <Button variant="hero" size="xl" className="group">
                Start Your Trade Journey
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="heroOutline" size="xl" className="group">
                <Play className="w-5 h-5" />
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gold-soft/10 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="flex flex-col">
                <span className="text-2xl md:text-3xl font-bold text-gold-soft">50K+</span>
                <span className="text-sm text-gold-pale/60">Active Exporters</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl md:text-3xl font-bold text-gold-soft">150+</span>
                <span className="text-sm text-gold-pale/60">Countries Served</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl md:text-3xl font-bold text-gold-soft">$2B+</span>
                <span className="text-sm text-gold-pale/60">Trade Facilitated</span>
              </div>
            </div>
          </div>

          {/* Right Content - Globe Visualization */}
          <div className="relative flex items-center justify-center lg:justify-end">
            <div className="relative w-80 h-80 md:w-[420px] md:h-[420px] lg:w-[500px] lg:h-[500px]">
              {/* Outer ring */}
              <div className="absolute inset-0 rounded-full border border-gold-soft/20 animate-rotate-slow" />
              <div className="absolute inset-4 rounded-full border border-teal-light/20 animate-rotate-slow" style={{ animationDirection: 'reverse', animationDuration: '25s' }} />
              
              {/* Center globe */}
              <div className="absolute inset-12 rounded-full bg-gradient-to-br from-navy-medium to-navy-deep shadow-strong flex items-center justify-center animate-float">
                <Globe className="w-24 h-24 md:w-32 md:h-32 text-gold-soft/80" strokeWidth={1} />
              </div>

              {/* Floating feature cards */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-card/95 backdrop-blur-sm rounded-xl p-4 shadow-medium animate-float border border-gold-soft/10" style={{ animationDelay: '0.5s' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gold-gradient flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-navy-deep" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">AI Analytics</p>
                    <p className="text-xs text-muted-foreground">Real-time insights</p>
                  </div>
                </div>
              </div>

              <div className="absolute top-1/2 -right-4 translate-y-[-50%] bg-card/95 backdrop-blur-sm rounded-xl p-4 shadow-medium animate-float border border-gold-soft/10" style={{ animationDelay: '1s' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-teal-primary flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Buyer Match</p>
                    <p className="text-xs text-muted-foreground">AI-powered discovery</p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 left-1/4 bg-card/95 backdrop-blur-sm rounded-xl p-4 shadow-medium animate-float border border-gold-soft/10" style={{ animationDelay: '1.5s' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-navy-deep flex items-center justify-center">
                    <Shield className="w-5 h-5 text-gold-soft" />
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

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V120Z" fill="hsl(220 25% 97%)"/>
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
