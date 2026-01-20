import { Check, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Consultation",
    price: "₹2,500",
    period: "per hour",
    description: "Expert guidance on export-import procedures, market entry strategies, and trade compliance",
    features: [
      "1-on-1 Expert Session",
      "Market research & analysis",
      "Regulatory compliance guidance",
      "Business strategy planning",
      "Follow-up email support",
    ],
    cta: "Book Consultation",
    popular: false,
  },
  {
    name: "Annual Membership",
    price: "₹2,999",
    period: "per year",
    description: "Join our exclusive network of global trade professionals and unlock premium benefits",
    features: [
      "Priority B2B Meetings",
      "20% Delegation Discounts",
      "Free Training Access",
      "Monthly Expert Sessions",
      "500+ Global Partners Access",
      "24/7 AI Assistant",
    ],
    cta: "Become a Member",
    popular: true,
  },
  {
    name: "Training Workshop",
    price: "₹5,999",
    period: "3-hour session",
    description: "Comprehensive training on export-import fundamentals and international trade procedures",
    features: [
      "Export-import basics",
      "Documentation training",
      "Market analysis techniques",
      "Compliance certification",
      "Resource materials",
    ],
    cta: "Enroll Now",
    popular: false,
  },
];

const PricingSection = () => {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-4">
            Transparent Pricing
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Choose Your
            <span className="text-primary"> Growth Path</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Flexible options designed to support businesses at every stage of their export journey
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-card rounded-2xl p-8 shadow-card border transition-all duration-500 hover:shadow-elevated flex flex-col ${
                plan.popular
                  ? "border-primary ring-2 ring-primary/20 scale-105"
                  : "border-border hover:border-primary/30"
              }`}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="flex items-center gap-1 bg-primary text-primary-foreground px-4 py-1.5 rounded-full text-sm font-semibold shadow-lg">
                    <Star className="w-4 h-4 fill-current" />
                    Most Popular
                  </div>
                </div>
              )}

              {/* Plan header */}
              <div className="text-center mb-8">
                <h3 className="text-xl font-bold text-foreground mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-1 mb-2">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground">/{plan.period}</span>
                </div>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>

              {/* Features */}
              <ul className="space-y-4 mb-8 flex-grow">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-success" />
                    </div>
                    <span className="text-sm text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Button
                className={`w-full group ${plan.popular ? "" : "variant-outline"}`}
                variant={plan.popular ? "default" : "outline"}
              >
                {plan.cta}
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
