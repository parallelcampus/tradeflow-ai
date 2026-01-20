import { Link } from "react-router-dom";

const Footer = () => {
  const footerLinks = {
    services: [
      { label: "Trade Consultancy", href: "/consultancy" },
      { label: "Business Delegations", href: "/delegation" },
      { label: "Training Programs", href: "/training" },
      { label: "Events & Exhibitions", href: "/events" },
    ],
    resources: [
      { label: "Government Schemes", href: "/schemes" },
      { label: "Market Research", href: "/buyer-discovery" },
      { label: "Knowledge Center", href: "#" },
      { label: "FAQs", href: "#" },
    ],
    about: [
      { label: "About GTPC", href: "/about" },
      { label: "Our Team", href: "/team" },
      { label: "Partners", href: "#" },
      { label: "Contact", href: "/contact" },
    ],
  };

  return (
    <footer className="bg-foreground text-background">
      {/* Main Footer */}
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <span className="text-2xl font-serif font-bold">GTPC</span>
              <p className="text-xs text-background/60 tracking-wider uppercase mt-1">
                Global Trade Promotion Corporation
              </p>
            </div>
            <p className="text-background/70 mb-8 leading-relaxed max-w-sm">
              Facilitating sustainable trade relationships and expanding 
              market access for businesses worldwide since 2009.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-2 text-sm text-background/60">
              <p>World Trade Centre, Mumbai 400005</p>
              <p>contact@gtpc.global</p>
              <p>+91 22 1234 5678</p>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="font-semibold text-background mb-4 text-sm uppercase tracking-wider">
              Services
            </h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.label}>
                  <Link 
                    to={link.href} 
                    className="text-sm text-background/60 hover:text-background transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-background mb-4 text-sm uppercase tracking-wider">
              Resources
            </h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <Link 
                    to={link.href} 
                    className="text-sm text-background/60 hover:text-background transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-background mb-4 text-sm uppercase tracking-wider">
              About
            </h4>
            <ul className="space-y-3">
              {footerLinks.about.map((link) => (
                <li key={link.label}>
                  <Link 
                    to={link.href} 
                    className="text-sm text-background/60 hover:text-background transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-background/10">
        <div className="container mx-auto px-4 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-background/50">
            <p>© 2025 Global Trade Promotion Corporation. All rights reserved.</p>
            <div className="flex gap-6">
              <Link to="#" className="hover:text-background transition-colors">Privacy Policy</Link>
              <Link to="#" className="hover:text-background transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
