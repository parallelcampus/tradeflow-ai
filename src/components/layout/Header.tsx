import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { label: "Services", href: "#services" },
    { label: "AI Solutions", href: "#ai" },
    { label: "Tourism & Medical", href: "/tourism-medical" },
    { label: "Events", href: "#events" },
    { label: "Membership", href: "#membership" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="flex flex-col">
              <span className="text-2xl font-serif font-bold text-foreground tracking-tight">AITAS</span>
              <span className="text-[9px] text-muted-foreground tracking-widest uppercase leading-tight">International Alliance for<br />Trade and Allied Services</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              item.href.startsWith('/') ? (
                <Link
                  key={item.label}
                  to={item.href}
                  className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  key={item.label}
                  href={item.href}
                  className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
                >
                  {item.label}
                </a>
              )
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <Button variant="ghost" size="sm" className="text-foreground/70 hover:text-primary">
              EN
              <ChevronDown className="w-3 h-3 ml-1" />
            </Button>
            <Link to="/auth">
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </Link>
            <Link to="/auth">
              <Button variant="default" size="sm">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-20 left-0 right-0 bg-background border-b border-border p-4">
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                item.href.startsWith('/') ? (
                  <Link
                    key={item.label}
                    to={item.href}
                    className="px-4 py-3 text-sm font-medium text-foreground/80 hover:text-primary transition-colors hover:bg-muted rounded-sm"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <a
                    key={item.label}
                    href={item.href}
                    className="px-4 py-3 text-sm font-medium text-foreground/80 hover:text-primary transition-colors hover:bg-muted rounded-sm"
                  >
                    {item.label}
                  </a>
                )
              ))}
              <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-border">
                <Link to="/auth">
                  <Button variant="outline" className="w-full">Sign In</Button>
                </Link>
                <Link to="/auth">
                  <Button variant="default" className="w-full">Get Started</Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
