import { 
  Building2, 
  Briefcase, 
  ShoppingCart, 
  Package, 
  Calendar, 
  Plane, 
  GraduationCap, 
  Building,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

const roles = [
  {
    icon: Building2,
    title: "Exporters",
    description: "Access schemes, find buyers, manage documentation, and track your export journey with AI assistance.",
    features: ["Scheme eligibility checker", "Buyer discovery", "Document management", "AI trade assistant"],
  },
  {
    icon: ShoppingCart,
    title: "Importers",
    description: "Discover suppliers, understand regulations, and streamline your import compliance process.",
    features: ["Supplier matching", "Compliance guidance", "Tariff calculator", "Policy updates"],
  },
  {
    icon: Briefcase,
    title: "Consultants",
    description: "Build your practice with verified credentials, client management, and integrated billing.",
    features: ["Profile showcase", "Appointment system", "Client CRM", "Automated billing"],
  },
  {
    icon: Package,
    title: "Manufacturers",
    description: "Connect with global markets, understand quality standards, and access export incentives.",
    features: ["Market insights", "Quality certifications", "Export guidance", "B2B connections"],
  },
  {
    icon: Calendar,
    title: "Event Organizers",
    description: "Manage exhibitions, trade fairs, and B2B meetings with comprehensive event tools.",
    features: ["Event dashboard", "Participant management", "QR check-in", "Analytics reports"],
  },
  {
    icon: Plane,
    title: "Delegation Managers",
    description: "Organize international trade delegations with document handling and itinerary management.",
    features: ["Delegation planning", "Document coordination", "Travel management", "Outcome tracking"],
  },
  {
    icon: GraduationCap,
    title: "Trainers & Mentors",
    description: "Deliver courses, certifications, and capacity-building programs on the integrated LMS.",
    features: ["Course creation", "Live sessions", "Certification issuance", "Progress tracking"],
  },
  {
    icon: Building,
    title: "Government Liaison",
    description: "Read-only access to monitor trade activities, scheme utilization, and policy impact.",
    features: ["Activity monitoring", "Scheme analytics", "Report generation", "Policy feedback"],
  },
];

const UserRolesSection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 bg-navy-deep/10 text-navy-deep text-sm font-semibold rounded-full mb-4">
            For Everyone in Trade
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-6">
            One Platform,
            <span className="text-gradient-navy"> Multiple Roles</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Whether you're an exporter, consultant, event organizer, or government official—GTPC provides tailored tools for your specific needs.
          </p>
        </div>

        {/* Roles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {roles.map((role, index) => {
            const Icon = role.icon;
            return (
              <div
                key={role.title}
                className="group bg-card rounded-2xl p-6 shadow-soft hover:shadow-strong transition-all duration-500 border border-border hover:border-navy-deep/30 flex flex-col"
              >
                <div className="w-12 h-12 rounded-xl bg-navy-deep flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-gold-gradient transition-all duration-300">
                  <Icon className="w-6 h-6 text-gold-soft group-hover:text-navy-deep transition-colors" />
                </div>
                
                <h3 className="text-lg font-bold text-foreground mb-2">
                  {role.title}
                </h3>
                
                <p className="text-sm text-muted-foreground mb-5 flex-grow">
                  {role.description}
                </p>
                
                <ul className="space-y-2 mb-5">
                  {role.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs text-foreground">
                      <span className="w-1 h-1 bg-gold-bright rounded-full" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <Button variant="ghost" className="p-0 h-auto text-sm text-navy-deep hover:text-gold-bright group/btn justify-start">
                  Get Started 
                  <ArrowRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default UserRolesSection;
