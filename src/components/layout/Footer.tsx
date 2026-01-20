import { Globe, Mail, Phone, MapPin, Linkedin, Twitter, Youtube, Facebook } from "lucide-react";

const Footer = () => {
  const footerLinks = {
    services: [
      { label: "Export-Import Services", href: "#" },
      { label: "Government Schemes", href: "#" },
      { label: "Buyer Discovery", href: "#" },
      { label: "B2B Marketplace", href: "#" },
      { label: "Events & Exhibitions", href: "#" },
    ],
    resources: [
      { label: "AI Trade Assistant", href: "#" },
      { label: "Training Programs", href: "#" },
      { label: "Knowledge Center", href: "#" },
      { label: "Policy Updates", href: "#" },
      { label: "FAQs", href: "#" },
    ],
    company: [
      { label: "About GTPC", href: "#" },
      { label: "Our Team", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Partners", href: "#" },
      { label: "Contact Us", href: "#" },
    ],
    legal: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Cookie Policy", href: "#" },
      { label: "Compliance", href: "#" },
    ],
  };

  const socialLinks = [
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Youtube, href: "#", label: "YouTube" },
    { icon: Facebook, href: "#", label: "Facebook" },
  ];

  return (
    <footer className="bg-navy-deep text-gold-pale">
      {/* Main Footer */}
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gold-gradient flex items-center justify-center shadow-gold">
                <Globe className="w-7 h-7 text-navy-deep" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight">GTPC</span>
                <span className="text-[10px] text-gold-soft/70 tracking-wider uppercase">Global Trade Promotion</span>
              </div>
            </div>
            <p className="text-gold-pale/70 mb-6 leading-relaxed">
              Empowering businesses to navigate international trade with AI-driven insights, government scheme access, and seamless global connections.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-gold-pale/70">
                <MapPin className="w-4 h-4 text-gold-soft" />
                <span>World Trade Center, Mumbai, India</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gold-pale/70">
                <Mail className="w-4 h-4 text-gold-soft" />
                <span>support@gtpc.global</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gold-pale/70">
                <Phone className="w-4 h-4 text-gold-soft" />
                <span>+91 22 1234 5678</span>
              </div>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="font-semibold text-gold-soft mb-4">Services</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-gold-pale/70 hover:text-gold-soft transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gold-soft mb-4">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-gold-pale/70 hover:text-gold-soft transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gold-soft mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-gold-pale/70 hover:text-gold-soft transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gold-soft mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-gold-pale/70 hover:text-gold-soft transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gold-soft/10">
        <div className="container mx-auto px-4 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gold-pale/60">
              © 2025 Global Trade Promotion Corporation. All rights reserved.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="w-10 h-10 rounded-full bg-gold-soft/10 flex items-center justify-center text-gold-pale/70 hover:bg-gold-soft hover:text-navy-deep transition-all duration-300"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
