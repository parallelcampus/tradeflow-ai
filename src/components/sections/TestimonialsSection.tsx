const testimonials = [
  {
    name: "Rajesh Sharma",
    role: "CEO, Textile Exports Ltd",
    location: "Mumbai",
    content: "GTPC's delegation program opened doors to markets we couldn't have accessed independently. Their on-ground support and institutional credibility made all the difference.",
  },
  {
    name: "Priya Patel",
    role: "Director, Handicraft Collective",
    location: "Jaipur",
    content: "The government schemes navigation service saved us considerable time and resources. We were unaware of many incentives available to small exporters until working with GTPC.",
  },
  {
    name: "Ahmed Khan",
    role: "Trade Consultant",
    location: "Delhi",
    content: "As a consultant, partnering with GTPC has transformed how I serve clients. Their research resources and policy updates keep me informed and credible.",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="section-spacing bg-secondary/30 border-y border-border">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-6">
            What Our Partners Say
          </h2>
          <p className="text-lg text-muted-foreground">
            Trusted by exporters, consultants, and institutions across India.
          </p>
        </div>

        {/* Testimonials */}
        <div className="max-w-4xl mx-auto space-y-12">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className="border-l-2 border-primary pl-8"
            >
              <blockquote className="text-lg md:text-xl text-foreground leading-relaxed mb-6">
                "{testimonial.content}"
              </blockquote>
              
              <div>
                <p className="font-semibold text-foreground">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">
                  {testimonial.role} — {testimonial.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
