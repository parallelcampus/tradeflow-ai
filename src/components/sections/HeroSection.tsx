import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Globe, TrendingUp, Users, Shield, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-primary via-primary/90 to-primary/80 overflow-hidden pt-20">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated grid */}
        <div 
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `
              linear-gradient(hsl(0 0% 100% / 0.3) 1px, transparent 1px),
              linear-gradient(90deg, hsl(0 0% 100% / 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}
        />
        
        {/* Glowing orbs */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
        
        {/* Floating particles */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-bounce"
            style={{
              left: `${10 + i * 12}%`,
              top: `${15 + (i % 4) * 20}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${2 + i * 0.5}s`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center min-h-[calc(100vh-5rem)] py-16">
          {/* Left Content */}
          <div className="flex flex-col gap-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-full w-fit animate-fade-in backdrop-blur-sm">
              <span className="w-2 h-2 bg-warning rounded-full animate-pulse" />
              <span className="text-sm font-medium text-white/90">AI-Powered Trade Facilitation Platform</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.1] animate-fade-in" style={{ animationDelay: '0.1s' }}>
              Empowering
              <span className="block text-warning">Global Trade</span>
              <span className="block text-white/90">Excellence</span>
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-white/80 max-w-xl leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Transform your export-import journey with AI-driven insights, government scheme navigation, and seamless buyer-seller connections—all in one unified platform.
            </p>

            {/* Key benefits */}
            <div className="flex flex-wrap gap-4 animate-fade-in" style={{ animationDelay: '0.25s' }}>
              {["Expert Consultancy", "Business Delegations", "Training Programs"].map((benefit) => (
                <div key={benefit} className="flex items-center gap-2 text-white/80 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-warning" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <Link to="/auth">
                <Button size="lg" variant="secondary" className="group text-primary font-semibold px-8 h-14 text-base">
                  Start Your Trade Journey
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 hover:text-white h-14 text-base backdrop-blur-sm">
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/10 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="flex flex-col">
                <span className="text-2xl md:text-3xl font-bold text-warning">500+</span>
                <span className="text-sm text-white/60">Global Partners</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl md:text-3xl font-bold text-warning">50+</span>
                <span className="text-sm text-white/60">Countries Covered</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl md:text-3xl font-bold text-warning">1000+</span>
                <span className="text-sm text-white/60">Successful Matches</span>
              </div>
            </div>
          </div>

          {/* Right Content - Globe Visualization */}
          <div className="relative flex items-center justify-center lg:justify-end">
            <div className="relative w-80 h-80 md:w-[420px] md:h-[420px] lg:w-[500px] lg:h-[500px]">
              {/* Outer ring */}
              <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-spin" style={{ animationDuration: '30s' }} />
              <div className="absolute inset-4 rounded-full border border-white/10 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '25s' }} />
              <div className="absolute inset-8 rounded-full border border-white/5" />
              
              {/* Center globe */}
              <div className="absolute inset-16 rounded-full bg-white/10 backdrop-blur-sm shadow-2xl flex items-center justify-center">
                <Globe className="w-24 h-24 md:w-32 md:h-32 text-white/80" strokeWidth={1} />
              </div>

              {/* Floating feature cards */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white rounded-xl p-4 shadow-2xl animate-bounce border border-border" style={{ animationDuration: '3s' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">AI Analytics</p>
                    <p className="text-xs text-muted-foreground">Real-time insights</p>
                  </div>
                </div>
              </div>

              <div className="absolute top-1/2 -right-4 translate-y-[-50%] bg-white rounded-xl p-4 shadow-2xl animate-bounce border border-border" style={{ animationDelay: '1s', animationDuration: '3.5s' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-success flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Buyer Match</p>
                    <p className="text-xs text-muted-foreground">AI-powered discovery</p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 left-1/4 bg-white rounded-xl p-4 shadow-2xl animate-bounce border border-border" style={{ animationDelay: '0.5s', animationDuration: '4s' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-warning flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
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
          <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V120Z" fill="hsl(var(--background))"/>
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
