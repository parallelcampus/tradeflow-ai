import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Rajesh Sharma",
    role: "CEO, Textile Exports Ltd",
    company: "Mumbai, India",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    content: "GTPC helped us discover buyers in 12 new countries. Their AI-powered matching system is incredibly accurate. We've increased our exports by 40% in just 6 months.",
    rating: 5,
  },
  {
    name: "Priya Patel",
    role: "Director, Handicraft Collective",
    company: "Jaipur, India",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    content: "The government schemes navigator saved us lakhs in compliance costs. We never knew about so many incentives available for small exporters until we used GTPC.",
    rating: 5,
  },
  {
    name: "Ahmed Khan",
    role: "Trade Consultant",
    company: "Delhi, India",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    content: "As a consultant, the platform has transformed how I serve my clients. The AI assistant helps me stay updated with the latest policies and provides instant answers.",
    rating: 5,
  },
];

const stats = [
  { value: "500+", label: "Global Partners" },
  { value: "50+", label: "Countries Covered" },
  { value: "1000+", label: "Successful Matches" },
  { value: "15+", label: "Years Experience" },
];

const TestimonialsSection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-4">
            Success Stories
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Trusted by Trade
            <span className="text-primary"> Professionals</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            See how businesses across India are transforming their global trade journey with GTPC
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className="group bg-card rounded-2xl p-8 shadow-card hover:shadow-elevated transition-all duration-500 border border-border hover:border-primary/20 relative"
            >
              {/* Quote icon */}
              <Quote className="absolute top-6 right-6 w-10 h-10 text-primary/10 group-hover:text-primary/20 transition-colors" />
              
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-warning text-warning" />
                ))}
              </div>
              
              {/* Content */}
              <p className="text-muted-foreground mb-6 leading-relaxed relative z-10">
                "{testimonial.content}"
              </p>
              
              {/* Author */}
              <div className="flex items-center gap-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
                />
                <div>
                  <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  <p className="text-xs text-primary">{testimonial.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Bar */}
        <div className="bg-primary rounded-2xl p-8 lg:p-12 shadow-elevated">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center">
                <span className="text-4xl lg:text-5xl font-bold text-primary-foreground mb-2">
                  {stat.value}
                </span>
                <span className="text-sm text-primary-foreground/70">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
