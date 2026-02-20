import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const navItems = [
  {
    label: "Trade & Export Services",
    href: "/trade-services",
    children: [
      { label: "Export-Import Facilitation", href: "/trade-services" },
      { label: "Buyer Discovery", href: "/dashboard/buyers" },
      { label: "B2B Matchmaking", href: "/dashboard/b2b" },
      { label: "Consultants", href: "/dashboard/consultants" },
    ],
  },
  {
    label: "Global Investment",
    href: "/global-investment",
  },
  {
    label: "Manufacturing",
    href: "/manufacturing",
  },
  {
    label: "Govt Schemes",
    href: "/schemes",
  },
  {
    label: "Medical & Tourism",
    href: "/tourism-medical",
  },
  {
    label: "Trade Shows",
    href: "/trade-shows",
  },
  {
    label: "Membership",
    href: "/membership",
  },
  {
    label: "Insights",
    href: "/insights",
    children: [
      { label: "Blog", href: "/blog" },
      { label: "News", href: "/news" },
    ],
  },
  {
    label: "Contact",
    href: "/contact",
  },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
          <nav className="hidden xl:flex items-center gap-0.5">
            {navItems.map((item) =>
              item.children ? (
                <NavigationMenu key={item.label}>
                  <NavigationMenuList>
                    <NavigationMenuItem>
                      <NavigationMenuTrigger className="bg-transparent px-3 py-2 text-sm font-medium text-foreground/80 hover:text-primary h-auto">
                        {item.label}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid gap-1 p-3 w-[220px]">
                          {item.children.map((child) => (
                            <li key={child.label}>
                              <NavigationMenuLink asChild>
                                <Link
                                  to={child.href}
                                  className="block px-3 py-2 text-sm text-foreground/80 hover:text-primary hover:bg-muted rounded-sm transition-colors"
                                >
                                  {child.label}
                                </Link>
                              </NavigationMenuLink>
                            </li>
                          ))}
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>
              ) : (
                <Link
                  key={item.label}
                  to={item.href}
                  className="px-3 py-2 text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden xl:flex items-center gap-3">
            <Link to="/auth">
              <Button variant="outline" size="sm">Sign In</Button>
            </Link>
            <Link to="/auth">
              <Button variant="default" size="sm">Get Started</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="xl:hidden p-2 text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="xl:hidden absolute top-20 left-0 right-0 bg-background border-b border-border p-4 max-h-[70vh] overflow-y-auto">
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => (
                <div key={item.label}>
                  <Link
                    to={item.href}
                    className="px-4 py-3 text-sm font-medium text-foreground/80 hover:text-primary transition-colors hover:bg-muted rounded-sm block"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                  {item.children && (
                    <div className="pl-6">
                      {item.children.map((child) => (
                        <Link
                          key={child.label}
                          to={child.href}
                          className="px-4 py-2 text-sm text-muted-foreground hover:text-primary transition-colors hover:bg-muted rounded-sm block"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
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
