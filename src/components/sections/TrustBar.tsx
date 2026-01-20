import { Shield, Award, Clock, Headphones } from "lucide-react";

const trustItems = [
  {
    icon: Shield,
    text: "ISO 9001 Certified",
  },
  {
    icon: Award,
    text: "FIEO Member",
  },
  {
    icon: Clock,
    text: "15+ Years Experience",
  },
  {
    icon: Headphones,
    text: "24/7 Support",
  },
];

const TrustBar = () => {
  return (
    <section className="py-6 bg-muted/50 border-y border-border">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
          <span className="text-sm text-muted-foreground font-medium">
            Trusted by leading companies worldwide
          </span>
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
            {trustItems.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.text}
                  className="flex items-center gap-2 text-foreground"
                >
                  <Icon className="w-5 h-5 text-primary" />
                  <span className="text-sm font-semibold">{item.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustBar;
