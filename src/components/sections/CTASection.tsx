import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="section-spacing bg-primary">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary-foreground mb-6">
            Begin Your Global Trade Journey
          </h2>
          
          <p className="text-lg text-primary-foreground/80 mb-10 max-w-2xl mx-auto">
            Connect with our team to discuss how GTPC can support your 
            international trade objectives and market expansion plans.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button 
                variant="secondary" 
                className="rounded-none px-8 h-12 text-base font-medium bg-white text-primary hover:bg-white/90"
              >
                Register Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button 
                variant="outline" 
                className="rounded-none border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 px-8 h-12 text-base font-medium"
              >
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
