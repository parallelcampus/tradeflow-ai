import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="pt-32 pb-20 md:pt-40 md:pb-28 lg:pt-48 lg:pb-36 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground mb-8 leading-tight animate-fade-in">
            Facilitating Global Trade for a 
            <span className="text-primary block mt-2">Prosperous Future</span>
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-in" style={{ animationDelay: '0.1s' }}>
            The Global Trade Promotion Corporation works with governments, exporters, 
            and institutions to develop sustainable trade relationships and expand 
            market access worldwide.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <Link to="/delegation">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-none px-8 h-12 text-base font-medium">
                Explore Programs
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="outline" className="rounded-none border-foreground/20 text-foreground hover:bg-foreground/5 px-8 h-12 text-base font-medium">
                About GTPC
              </Button>
            </Link>
          </div>
        </div>

        {/* Divider */}
        <div className="max-w-xl mx-auto mt-20 pt-16 border-t border-border">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-3xl md:text-4xl font-serif font-bold text-primary">50+</p>
              <p className="text-sm text-muted-foreground mt-1">Partner Countries</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-serif font-bold text-primary">500+</p>
              <p className="text-sm text-muted-foreground mt-1">Trade Delegations</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-serif font-bold text-primary">15+</p>
              <p className="text-sm text-muted-foreground mt-1">Years of Service</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
