import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import ServicesSection from "@/components/sections/ServicesSection";
import AISection from "@/components/sections/AISection";
import UserRolesSection from "@/components/sections/UserRolesSection";
import CTASection from "@/components/sections/CTASection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <ServicesSection />
        <AISection />
        <UserRolesSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
