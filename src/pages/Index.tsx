import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import TrustBar from "@/components/sections/TrustBar";
import ServicesSection from "@/components/sections/ServicesSection";
import ISBBESection from "@/components/sections/ISBBESection";
import AISection from "@/components/sections/AISection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import PricingSection from "@/components/sections/PricingSection";
import UserRolesSection from "@/components/sections/UserRolesSection";
import CTASection from "@/components/sections/CTASection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <TrustBar />
        <ServicesSection />
        <ISBBESection />
        <AISection />
        <TestimonialsSection />
        <PricingSection />
        <UserRolesSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
