const TrustBar = () => {
  return (
    <section className="py-12 bg-background border-b border-border">
      <div className="container mx-auto px-4 lg:px-8">
        <p className="text-center text-sm text-muted-foreground mb-6">
          Working in partnership with
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
          <span className="text-lg font-medium text-foreground/60">Ministry of Commerce</span>
          <span className="text-lg font-medium text-foreground/60">FIEO</span>
          <span className="text-lg font-medium text-foreground/60">World Trade Centre</span>
          <span className="text-lg font-medium text-foreground/60">ECGC</span>
          <span className="text-lg font-medium text-foreground/60">EXIM Bank</span>
        </div>
      </div>
    </section>
  );
};

export default TrustBar;
