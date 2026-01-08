import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Globe, ChevronDown } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { label: "Services", href: "#services" },
    { label: "AI Solutions", href: "#ai" },
    { label: "Marketplace", href: "#marketplace" },
    { label: "Events", href: "#events" },
    { label: "Training", href: "#training" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-navy-deep/95 backdrop-blur-md border-b border-gold-soft/10">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gold-gradient flex items-center justify-center shadow-gold">
              <Globe className="w-7 h-7 text-navy-deep" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gold-pale tracking-tight">GTPC</span>
              <span className="text-[10px] text-gold-soft/70 tracking-wider uppercase">Global Trade Promotion</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="px-4 py-2 text-sm font-medium text-gold-pale/80 hover:text-gold-soft transition-colors rounded-lg hover:bg-gold-soft/5"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <Button variant="ghost" size="sm" className="text-gold-pale/70 hover:text-gold-soft hover:bg-gold-soft/5">
              <Globe className="w-4 h-4 mr-1" />
              EN
              <ChevronDown className="w-3 h-3 ml-1" />
            </Button>
            <Button variant="heroOutline" size="sm">
              Sign In
            </Button>
            <Button variant="hero" size="sm">
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-gold-pale"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-20 left-0 right-0 bg-navy-deep border-b border-gold-soft/10 p-4">
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="px-4 py-3 text-sm font-medium text-gold-pale/80 hover:text-gold-soft transition-colors rounded-lg hover:bg-gold-soft/5"
                >
                  {item.label}
                </a>
              ))}
              <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-gold-soft/10">
                <Button variant="heroOutline" className="w-full">
                  Sign In
                </Button>
                <Button variant="hero" className="w-full">
                  Get Started
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
