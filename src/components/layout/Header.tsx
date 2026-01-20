import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Globe, ChevronDown } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  // Check if we're on a page with dark hero
  const isDarkHero = location.pathname === "/";

  const navItems = [
    { label: "Membership", href: "/membership" },
    { label: "Consultancy", href: "/consultancy" },
    { label: "Delegation", href: "/delegation" },
    { label: "Gallery", href: "/gallery" },
    { label: "Team", href: "/team" },
    { label: "Events", href: "/events" },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isDarkHero 
        ? "bg-primary/95 backdrop-blur-md border-b border-white/10" 
        : "bg-background/95 backdrop-blur-md border-b border-border"
    }`}>
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${
              isDarkHero ? "bg-white" : "bg-primary"
            }`}>
              <Globe className={`w-7 h-7 ${isDarkHero ? "text-primary" : "text-white"}`} />
            </div>
            <div className="flex flex-col">
              <span className={`text-xl font-bold tracking-tight ${isDarkHero ? "text-white" : "text-foreground"}`}>
                GTPC
              </span>
              <span className={`text-[10px] tracking-wider uppercase ${
                isDarkHero ? "text-white/70" : "text-muted-foreground"
              }`}>
                Global Trade Promotion
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isDarkHero 
                    ? "text-white/80 hover:text-white hover:bg-white/10" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm" 
              className={isDarkHero 
                ? "text-white/70 hover:text-white hover:bg-white/10" 
                : "text-muted-foreground hover:text-foreground"
              }
            >
              <Globe className="w-4 h-4 mr-1" />
              EN
              <ChevronDown className="w-3 h-3 ml-1" />
            </Button>
            <Link to="/auth">
              <Button 
                variant={isDarkHero ? "outline" : "outline"}
                size="sm"
                className={isDarkHero ? "border-white/30 text-white hover:bg-white/10" : ""}
              >
                Sign In
              </Button>
            </Link>
            <Link to="/auth">
              <Button 
                size="sm"
                variant={isDarkHero ? "secondary" : "default"}
                className={isDarkHero ? "text-primary" : ""}
              >
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`lg:hidden p-2 ${isDarkHero ? "text-white" : "text-foreground"}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className={`lg:hidden absolute top-20 left-0 right-0 border-b p-4 ${
            isDarkHero 
              ? "bg-primary border-white/10" 
              : "bg-background border-border"
          }`}>
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isDarkHero 
                      ? "text-white/80 hover:text-white hover:bg-white/10" 
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <div className={`flex flex-col gap-2 mt-4 pt-4 border-t ${
                isDarkHero ? "border-white/10" : "border-border"
              }`}>
                <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                  <Button 
                    variant="outline" 
                    className={`w-full ${isDarkHero ? "border-white/30 text-white hover:bg-white/10" : ""}`}
                  >
                    Sign In
                  </Button>
                </Link>
                <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                  <Button 
                    className="w-full"
                    variant={isDarkHero ? "secondary" : "default"}
                  >
                    Get Started
                  </Button>
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
