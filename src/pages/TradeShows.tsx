import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Calendar,
  MapPin,
  Users,
  Globe,
  Star,
  CheckCircle,
  Clock,
  Building2,
  BadgePercent,
  ExternalLink,
  Search,
  ArrowRight,
  Award,
  Briefcase,
  Send,
  Ticket,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// ─── Types ───────────────────────────────────────────────────────────────────

interface TradeShow {
  id: string;
  name: string;
  description: string;
  location: string;
  country: string;
  startDate: string;
  endDate: string;
  industry: string[];
  organizer: string;
  website?: string;
  stallsAvailable: number;
  totalStalls: number;
  stallPrice: number;
  currency: string;
  isFeatured?: boolean;
  status: "open" | "closing_soon" | "fully_booked";
  subsidyType?: string;
  subsidyPercent?: number;
  category: "international" | "national" | "aitas_pavilion";
}

interface SponsorPackage {
  id: string;
  name: string;
  price: number;
  currency: string;
  benefits: string[];
  isPopular?: boolean;
}

// ─── Sample Data ─────────────────────────────────────────────────────────────

const tradeShows: TradeShow[] = [
  {
    id: "1",
    name: "India International Trade Fair 2026",
    description: "Premier trade fair showcasing Indian products with MAI scheme support for MSME exporters.",
    location: "Pragati Maidan, New Delhi",
    country: "India",
    startDate: "2026-11-14",
    endDate: "2026-11-27",
    category: "national",
    subsidyType: "MAI",
    subsidyPercent: 75,
    stallPrice: 150000,
    currency: "INR",
    industry: ["Multi-sector", "Handicrafts", "Textiles"],
    organizer: "Ministry of Commerce & Industry",
    website: "https://iitf.in",
    stallsAvailable: 45,
    totalStalls: 200,
    isFeatured: true,
    status: "open",
  },
  {
    id: "2",
    name: "Gulfood 2026",
    description: "World's largest annual food and beverage exhibition with international participation.",
    location: "Dubai World Trade Centre",
    country: "UAE",
    startDate: "2026-02-20",
    endDate: "2026-02-24",
    category: "international",
    stallPrice: 45000,
    currency: "USD",
    industry: ["Food & Beverages"],
    organizer: "DWTC",
    website: "https://gulfood.com",
    stallsAvailable: 8,
    totalStalls: 50,
    isFeatured: true,
    status: "open",
  },
  {
    id: "3",
    name: "Ambiente 2026",
    description: "World's leading trade fair for consumer goods and interior design.",
    location: "Frankfurt Messe, Germany",
    country: "Germany",
    startDate: "2026-02-07",
    endDate: "2026-02-11",
    category: "international",
    stallPrice: 8500,
    currency: "EUR",
    industry: ["Home Decor", "Consumer Goods"],
    organizer: "Messe Frankfurt",
    website: "https://ambiente.messefrankfurt.com",
    stallsAvailable: 5,
    totalStalls: 30,
    isFeatured: true,
    status: "closing_soon",
  },
  {
    id: "4",
    name: "AITAS India Pavilion @ Expo 2026",
    description: "Premium India pavilion with exclusive AITAS member discounts and shared infrastructure.",
    location: "Osaka, Japan",
    country: "Japan",
    startDate: "2026-04-13",
    endDate: "2026-10-13",
    category: "aitas_pavilion",
    subsidyType: "AITAS Discount",
    subsidyPercent: 35,
    stallPrice: 25000,
    currency: "USD",
    industry: ["Multi-sector"],
    organizer: "AITAS Global",
    stallsAvailable: 20,
    totalStalls: 50,
    isFeatured: true,
    status: "open",
  },
  {
    id: "5",
    name: "Canton Fair 2026",
    description: "China Import and Export Fair — the most comprehensive international trade event.",
    location: "Guangzhou, China",
    country: "China",
    startDate: "2026-04-15",
    endDate: "2026-05-05",
    category: "international",
    stallPrice: 12000,
    currency: "USD",
    industry: ["Multi-sector"],
    organizer: "CFTC",
    website: "https://cantonfair.org.cn",
    stallsAvailable: 15,
    totalStalls: 40,
    status: "open",
  },
  {
    id: "6",
    name: "AITAS Collective @ Texworld Paris",
    description: "Group participation with shared booth and networking lounge for textile exporters.",
    location: "Paris Le Bourget, France",
    country: "France",
    startDate: "2026-09-10",
    endDate: "2026-09-13",
    category: "aitas_pavilion",
    subsidyType: "AITAS Discount",
    subsidyPercent: 40,
    stallPrice: 4500,
    currency: "EUR",
    industry: ["Textiles", "Apparel"],
    organizer: "AITAS Global",
    stallsAvailable: 8,
    totalStalls: 15,
    status: "open",
  },
];

const sponsorPackages: SponsorPackage[] = [
  {
    id: "bronze",
    name: "Bronze",
    price: 5000,
    currency: "USD",
    benefits: [
      "Logo on event website",
      "Social media mentions",
      "2 complimentary passes",
      "Company listing in directory",
    ],
  },
  {
    id: "silver",
    name: "Silver",
    price: 15000,
    currency: "USD",
    benefits: [
      "Everything in Bronze",
      "Logo on event banners",
      "5 complimentary passes",
      "Speaking slot (10 min)",
      "Branded networking lounge",
    ],
    isPopular: true,
  },
  {
    id: "gold",
    name: "Gold",
    price: 35000,
    currency: "USD",
    benefits: [
      "Everything in Silver",
      "Keynote speaking slot",
      "10 complimentary passes",
      "Exclusive meeting room",
      "Full-page brochure insert",
      "Priority B2B matchmaking",
    ],
  },
  {
    id: "platinum",
    name: "Platinum",
    price: 75000,
    currency: "USD",
    benefits: [
      "Everything in Gold",
      "Title sponsorship rights",
      "20 complimentary passes",
      "Dedicated pavilion space",
      "VIP dinner hosting",
      "Media coverage package",
      "Post-event lead database",
    ],
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const formatCurrency = (amount: number, currency: string) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });

// ─── Sub-Components ──────────────────────────────────────────────────────────

function TradeShowCard({ show }: { show: TradeShow }) {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Registration Submitted", description: `Your application for ${show.name} has been received. We'll contact you within 48 hours.` });
    setDialogOpen(false);
  };

  const stallFillPercent = ((show.totalStalls - show.stallsAvailable) / show.totalStalls) * 100;

  return (
    <Card className="group relative overflow-hidden border-border hover:border-primary/30 transition-all duration-300 hover:shadow-elevated">
      {/* Top accent line */}
      {show.isFeatured && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-primary" />
      )}

      <CardHeader className="pb-2 pt-5">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <Badge
            variant="secondary"
            className={`text-[11px] font-semibold uppercase tracking-wide ${
              show.category === "aitas_pavilion"
                ? "bg-primary/10 text-primary border-primary/20"
                : show.category === "national"
                ? "bg-accent text-accent-foreground"
                : ""
            }`}
          >
            {show.category === "international" ? "International" : show.category === "national" ? "National" : "AITAS Pavilion"}
          </Badge>
          {show.status === "closing_soon" && (
            <Badge variant="outline" className="text-[11px] border-destructive/40 text-destructive font-medium">
              <Clock className="w-3 h-3 mr-1" /> Closing Soon
            </Badge>
          )}
          {show.isFeatured && (
            <Badge variant="outline" className="text-[11px] border-primary/30 text-primary font-medium">
              <Star className="w-3 h-3 mr-1 fill-current" /> Featured
            </Badge>
          )}
        </div>
        <CardTitle className="text-base font-bold leading-snug group-hover:text-primary transition-colors">
          {show.name}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 pb-5">
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{show.description}</p>

        {/* Info grid */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-primary/70" />
            <span className="truncate">{show.location}, {show.country}</span>
          </div>
          <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
            <Calendar className="h-3.5 w-3.5 shrink-0 text-primary/70" />
            <span>{formatDate(show.startDate)} – {formatDate(show.endDate)}</span>
          </div>
        </div>

        {/* Stall availability bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{show.stallsAvailable} stalls available</span>
            <span>{Math.round(stallFillPercent)}% filled</span>
          </div>
          <div className="h-1.5 bg-border rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                stallFillPercent > 80 ? "bg-destructive" : stallFillPercent > 50 ? "bg-[hsl(var(--warning))]" : "bg-primary"
              }`}
              style={{ width: `${stallFillPercent}%` }}
            />
          </div>
        </div>

        {/* Industries */}
        <div className="flex flex-wrap gap-1">
          {show.industry.map((ind, i) => (
            <span key={i} className="text-[11px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
              {ind}
            </span>
          ))}
        </div>

        {/* Price + CTA */}
        <div className="pt-3 border-t border-border space-y-3">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[11px] text-muted-foreground uppercase tracking-wide mb-0.5">Stall Price</p>
              <p className="font-bold text-xl text-foreground">{formatCurrency(show.stallPrice, show.currency)}</p>
            </div>
            {show.subsidyPercent && (
              <Badge className="bg-[hsl(var(--success))] text-white text-sm px-2.5 py-1 font-semibold">
                <BadgePercent className="w-3.5 h-3.5 mr-1" /> {show.subsidyPercent}% OFF
              </Badge>
            )}
          </div>

          <div className="flex gap-2">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex-1" size="sm" disabled={show.status === "fully_booked"}>
                  Apply for Stall <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Register for {show.name}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleRegister} className="space-y-4 mt-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium">Full Name *</label>
                      <Input required placeholder="Your name" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium">Company *</label>
                      <Input required placeholder="Company name" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium">Email *</label>
                      <Input type="email" required placeholder="Email address" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium">Phone</label>
                      <Input placeholder="Phone number" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Stall Size Preference</label>
                    <Select>
                      <SelectTrigger><SelectValue placeholder="Select size" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3x3">3×3 m (Standard)</SelectItem>
                        <SelectItem value="6x3">6×3 m (Double)</SelectItem>
                        <SelectItem value="6x6">6×6 m (Premium)</SelectItem>
                        <SelectItem value="custom">Custom Size</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Products/Services to Exhibit</label>
                    <Textarea placeholder="Describe your products or services" rows={3} />
                  </div>
                  <Button type="submit" className="w-full">
                    <Send className="w-4 h-4 mr-2" /> Submit Application
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
            {show.website && (
              <Button variant="outline" size="sm" asChild>
                <a href={show.website} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ExhibitorRegistrationForm() {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Exhibitor Registration Received", description: "Our team will review your application and contact you within 3 business days." });
  };

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <div className="p-2 rounded-lg bg-primary/10">
            <Building2 className="w-5 h-5 text-primary" />
          </div>
          Exhibitor Registration
        </CardTitle>
        <p className="text-sm text-muted-foreground">Register as an exhibitor to showcase your products at upcoming trade shows.</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Company Name *</label>
              <Input required placeholder="Your company name" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Contact Person *</label>
              <Input required placeholder="Full name" />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Email *</label>
              <Input type="email" required placeholder="Email address" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Phone *</label>
              <Input required placeholder="Phone number" />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Country *</label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Select country" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="india">India</SelectItem>
                  <SelectItem value="uae">UAE</SelectItem>
                  <SelectItem value="uk">United Kingdom</SelectItem>
                  <SelectItem value="germany">Germany</SelectItem>
                  <SelectItem value="usa">United States</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Industry Sector *</label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Select sector" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="food">Food & Beverages</SelectItem>
                  <SelectItem value="textiles">Textiles & Apparel</SelectItem>
                  <SelectItem value="engineering">Engineering & Machinery</SelectItem>
                  <SelectItem value="pharma">Pharma & Healthcare</SelectItem>
                  <SelectItem value="it">IT & Electronics</SelectItem>
                  <SelectItem value="agriculture">Agriculture</SelectItem>
                  <SelectItem value="consumer">Consumer Goods</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Products/Services *</label>
            <Textarea required placeholder="Describe the products or services you wish to exhibit" rows={3} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Preferred Trade Show</label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Select event" /></SelectTrigger>
                <SelectContent>
                  {tradeShows.map(show => (
                    <SelectItem key={show.id} value={show.id}>{show.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Stall Size</label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Select size" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="3x3">3×3 m (Standard)</SelectItem>
                  <SelectItem value="6x3">6×3 m (Double)</SelectItem>
                  <SelectItem value="6x6">6×6 m (Premium)</SelectItem>
                  <SelectItem value="island">Island Booth</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Special Requirements</label>
            <Textarea placeholder="Any special requirements (power, water, refrigeration, etc.)" rows={2} />
          </div>
          <Button type="submit" className="w-full" size="lg">
            <Send className="w-4 h-4 mr-2" /> Submit Exhibitor Registration
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function VisitorRegistrationForm() {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Visitor Registration Confirmed", description: "Your visitor pass details will be emailed to you shortly." });
  };

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <div className="p-2 rounded-lg bg-primary/10">
            <Ticket className="w-5 h-5 text-primary" />
          </div>
          Visitor Registration
        </CardTitle>
        <p className="text-sm text-muted-foreground">Register as a visitor to attend trade shows and connect with exhibitors.</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Full Name *</label>
              <Input required placeholder="Your full name" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Designation</label>
              <Input placeholder="Your job title" />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Company Name</label>
              <Input placeholder="Company name" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Email *</label>
              <Input type="email" required placeholder="Email address" />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Phone</label>
              <Input placeholder="Phone number" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Country</label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Select country" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="india">India</SelectItem>
                  <SelectItem value="uae">UAE</SelectItem>
                  <SelectItem value="uk">United Kingdom</SelectItem>
                  <SelectItem value="germany">Germany</SelectItem>
                  <SelectItem value="usa">United States</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Trade Show to Attend *</label>
            <Select>
              <SelectTrigger><SelectValue placeholder="Select event" /></SelectTrigger>
              <SelectContent>
                {tradeShows.map(show => (
                  <SelectItem key={show.id} value={show.id}>{show.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Purpose of Visit</label>
            <Select>
              <SelectTrigger><SelectValue placeholder="Select purpose" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="sourcing">Product Sourcing</SelectItem>
                <SelectItem value="networking">Networking</SelectItem>
                <SelectItem value="partnership">Partnership Exploration</SelectItem>
                <SelectItem value="learning">Industry Learning</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Sectors of Interest</label>
            <Textarea placeholder="Which sectors or product categories are you interested in?" rows={2} />
          </div>
          <Button type="submit" className="w-full" size="lg">
            <Send className="w-4 h-4 mr-2" /> Register as Visitor
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function SponsorPackageCard({ pkg }: { pkg: SponsorPackage }) {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Sponsorship Inquiry Submitted", description: `We'll get back to you about the ${pkg.name} package within 24 hours.` });
    setDialogOpen(false);
  };

  const tierColors: Record<string, string> = {
    Bronze: "from-amber-700/20 to-amber-900/5",
    Silver: "from-slate-400/20 to-slate-600/5",
    Gold: "from-yellow-500/20 to-yellow-700/5",
    Platinum: "from-primary/15 to-primary/5",
  };

  return (
    <Card className={`relative overflow-hidden transition-all duration-300 hover:shadow-elevated ${pkg.isPopular ? "border-primary ring-1 ring-primary/20" : "border-border"}`}>
      {/* Gradient header */}
      <div className={`h-2 bg-gradient-to-r ${tierColors[pkg.name] || ""}`} />

      {pkg.isPopular && (
        <div className="absolute top-4 right-4">
          <Badge className="bg-primary text-primary-foreground text-[10px] font-semibold">
            <Zap className="w-3 h-3 mr-0.5" /> Popular
          </Badge>
        </div>
      )}

      <CardHeader className="text-center pt-6 pb-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">{pkg.name}</p>
        <div>
          <span className="text-3xl font-bold text-foreground">{formatCurrency(pkg.price, pkg.currency)}</span>
          <span className="text-sm text-muted-foreground ml-1">/ event</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-5 pb-6">
        <ul className="space-y-2.5">
          {pkg.benefits.map((benefit, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm">
              <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <span className="text-muted-foreground">{benefit}</span>
            </li>
          ))}
        </ul>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full" variant={pkg.isPopular ? "default" : "outline"} size="lg">
              Become a Sponsor
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{pkg.name} Sponsorship Inquiry</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-2">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Company Name *</label>
                <Input required placeholder="Company name" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Contact Person *</label>
                <Input required placeholder="Full name" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Email *</label>
                  <Input type="email" required placeholder="Email" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Phone</label>
                  <Input placeholder="Phone" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Message</label>
                <Textarea placeholder="Any specific requirements or questions?" rows={3} />
              </div>
              <Button type="submit" className="w-full">
                <Send className="w-4 h-4 mr-2" /> Submit Inquiry
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function TradeShows() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filteredShows = tradeShows.filter((show) => {
    const matchesSearch =
      show.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      show.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      show.industry.some((i) => i.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = categoryFilter === "all" || show.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const uniqueCountries = new Set(tradeShows.map(s => s.country)).size;
  const totalStalls = tradeShows.reduce((sum, s) => sum + s.stallsAvailable, 0);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-28 pb-20 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-foreground via-foreground/95 to-primary/30" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />

        <div className="container mx-auto px-4 lg:px-8 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-white/80 text-sm mb-6">
              <Globe className="w-3.5 h-3.5" />
              <span>Global Trade Events Platform</span>
            </div>

            <h1 className="text-white mb-5 leading-[1.1]">
              International Trade Shows<br />
              <span className="text-primary-foreground/70">& Exhibitions</span>
            </h1>

            <p className="text-lg text-white/60 mb-10 leading-relaxed max-w-2xl">
              Discover global exhibitions, register as an exhibitor or visitor, explore sponsorship opportunities, and grow your international trade presence.
            </p>

            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: Calendar, label: "Upcoming Events", value: tradeShows.length.toString() },
                { icon: Globe, label: "Countries", value: `${uniqueCountries}+` },
                { icon: Users, label: "Stalls Available", value: totalStalls.toString() },
                { icon: TrendingUp, label: "Visitors Annually", value: "10K+" },
              ].map((stat, i) => (
                <div key={i} className="px-4 py-3 rounded-xl bg-white/[0.06] backdrop-blur-sm border border-white/[0.08]">
                  <stat.icon className="w-4 h-4 text-primary-foreground/50 mb-2" />
                  <p className="text-xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-white/40">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="py-14">
        <div className="container mx-auto px-4 lg:px-8">
          <Tabs defaultValue="events" className="space-y-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <TabsList className="flex flex-wrap h-auto gap-1 bg-card border border-border p-1.5 shadow-sm">
                <TabsTrigger value="events" className="flex items-center gap-1.5 text-sm data-[state=active]:shadow-sm">
                  <Calendar className="w-4 h-4" /> Upcoming Events
                </TabsTrigger>
                <TabsTrigger value="exhibitor" className="flex items-center gap-1.5 text-sm data-[state=active]:shadow-sm">
                  <Building2 className="w-4 h-4" /> Exhibitor
                </TabsTrigger>
                <TabsTrigger value="visitor" className="flex items-center gap-1.5 text-sm data-[state=active]:shadow-sm">
                  <Ticket className="w-4 h-4" /> Visitor
                </TabsTrigger>
                <TabsTrigger value="sponsor" className="flex items-center gap-1.5 text-sm data-[state=active]:shadow-sm">
                  <Award className="w-4 h-4" /> Sponsorship
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Events Tab */}
            <TabsContent value="events" className="space-y-6">
              {/* Filters */}
              <Card className="border-border shadow-sm">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search events by name, country, or industry..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="w-full sm:w-[200px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="international">International</SelectItem>
                        <SelectItem value="national">National</SelectItem>
                        <SelectItem value="aitas_pavilion">AITAS Pavilion</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Results count */}
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing <span className="font-semibold text-foreground">{filteredShows.length}</span> events
                </p>
              </div>

              {filteredShows.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredShows.map((show) => (
                    <TradeShowCard key={show.id} show={show} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-7 h-7 text-muted-foreground" />
                  </div>
                  <p className="font-semibold text-foreground">No events match your search</p>
                  <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters</p>
                </div>
              )}
            </TabsContent>

            {/* Exhibitor Tab */}
            <TabsContent value="exhibitor">
              <div className="max-w-2xl mx-auto">
                <ExhibitorRegistrationForm />
              </div>
            </TabsContent>

            {/* Visitor Tab */}
            <TabsContent value="visitor">
              <div className="max-w-2xl mx-auto">
                <VisitorRegistrationForm />
              </div>
            </TabsContent>

            {/* Sponsor Tab */}
            <TabsContent value="sponsor" className="space-y-10">
              <div className="text-center max-w-2xl mx-auto">
                <h2 className="font-bold text-foreground mb-3">Sponsorship Packages</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Elevate your brand visibility at international trade events. Choose a sponsorship tier that aligns with your marketing objectives.
                </p>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {sponsorPackages.map((pkg) => (
                  <SponsorPackageCard key={pkg.id} pkg={pkg} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/30 to-primary/5" />
        <div className="container mx-auto px-4 lg:px-8 text-center relative">
          <div className="max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Briefcase className="w-3.5 h-3.5" />
              Trade Advisory
            </div>
            <h2 className="font-bold text-foreground mb-4">Need Help Choosing the Right Event?</h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Our trade advisory team can help you identify the best trade shows for your industry, assist with subsidy applications, and manage your participation end-to-end.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" className="shadow-sm">
                <Briefcase className="w-4 h-4 mr-2" /> Talk to a Trade Advisor
              </Button>
              <Button variant="outline" size="lg">
                Download Event Calendar <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
