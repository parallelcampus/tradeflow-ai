import { supabase } from "@/integrations/supabase/client";

export interface SearchFilters {
  country_code?: string[];
  region_country_code?: string[];
  city_region_country?: string[];
  company_size?: string[];
  company_revenue?: string[];
  company_age?: string[];
  linkedin_category?: string[];
  naics_category?: string[];
  google_category?: string[];
  company_name?: string[];
  website_keywords?: string[];
  company_tech_stack_category?: string[];
  company_tech_stack_tech?: string[];
  number_of_locations?: string[];
  topics?: string[];
  events?: {
    values: string[];
    last_occurrence: number;
  };
}

export interface Business {
  business_id: string;
  name?: string;
  domain?: string;
  linkedin_url?: string;
  website_url?: string;
  country?: string;
  country_code?: string;
  city?: string;
  region?: string;
  industry?: string;
  linkedin_category?: string;
  company_size?: string;
  number_of_employees?: number;
  revenue?: string;
  company_revenue?: string;
  founded_year?: number;
  description?: string;
  logo_url?: string;
  phone?: string;
  email?: string;
  company_age?: string;
  tech_stack?: string[];
  number_of_locations?: number;
}

export interface ExploriumResponse<T = any> {
  success: boolean;
  error?: string;
  data?: T[];
  total_results?: number;
  total_pages?: number;
  page?: number;
  matched_businesses?: T[];
  total_matches?: number;
  stats?: {
    business_categories_per_location?: Record<string, any>;
    revenue_per_category?: Record<string, any>;
    number_of_employees_per_category?: Record<string, any>;
  };
}

export const exploriumApi = {
  async searchBusinesses(
    filters: SearchFilters,
    page: number = 1,
    page_size: number = 20
  ): Promise<ExploriumResponse<Business>> {
    const { data, error } = await supabase.functions.invoke("explorium-search", {
      body: {
        action: "search",
        filters,
        page,
        page_size,
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }
    return data;
  },

  async matchBusinesses(
    businesses: Array<{
      name?: string;
      domain?: string;
      url?: string;
      linkedin_url?: string;
    }>
  ): Promise<ExploriumResponse<Business>> {
    const { data, error } = await supabase.functions.invoke("explorium-search", {
      body: {
        action: "match",
        businesses_to_match: businesses,
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }
    return data;
  },

  async getStats(filters?: SearchFilters): Promise<ExploriumResponse> {
    const { data, error } = await supabase.functions.invoke("explorium-search", {
      body: {
        action: "stats",
        filters,
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }
    return data;
  },
};

// Reference data for filters
export const countryCodes = [
  { code: "us", name: "United States" },
  { code: "gb", name: "United Kingdom" },
  { code: "de", name: "Germany" },
  { code: "fr", name: "France" },
  { code: "ca", name: "Canada" },
  { code: "au", name: "Australia" },
  { code: "in", name: "India" },
  { code: "cn", name: "China" },
  { code: "jp", name: "Japan" },
  { code: "ae", name: "UAE" },
  { code: "sa", name: "Saudi Arabia" },
  { code: "sg", name: "Singapore" },
  { code: "nl", name: "Netherlands" },
  { code: "it", name: "Italy" },
  { code: "es", name: "Spain" },
  { code: "br", name: "Brazil" },
  { code: "mx", name: "Mexico" },
  { code: "za", name: "South Africa" },
  { code: "kr", name: "South Korea" },
  { code: "my", name: "Malaysia" },
  { code: "th", name: "Thailand" },
  { code: "id", name: "Indonesia" },
  { code: "vn", name: "Vietnam" },
  { code: "ph", name: "Philippines" },
  { code: "pk", name: "Pakistan" },
  { code: "bd", name: "Bangladesh" },
  { code: "eg", name: "Egypt" },
  { code: "ng", name: "Nigeria" },
  { code: "ke", name: "Kenya" },
  { code: "gh", name: "Ghana" },
  { code: "tr", name: "Turkey" },
  { code: "pl", name: "Poland" },
  { code: "se", name: "Sweden" },
  { code: "no", name: "Norway" },
  { code: "dk", name: "Denmark" },
  { code: "fi", name: "Finland" },
  { code: "be", name: "Belgium" },
  { code: "at", name: "Austria" },
  { code: "ch", name: "Switzerland" },
  { code: "pt", name: "Portugal" },
  { code: "ie", name: "Ireland" },
  { code: "nz", name: "New Zealand" },
  { code: "ar", name: "Argentina" },
  { code: "cl", name: "Chile" },
  { code: "co", name: "Colombia" },
  { code: "pe", name: "Peru" },
];

export const regionCodes: Record<string, { code: string; name: string }[]> = {
  us: [
    { code: "us-ca", name: "California" },
    { code: "us-ny", name: "New York" },
    { code: "us-tx", name: "Texas" },
    { code: "us-fl", name: "Florida" },
    { code: "us-il", name: "Illinois" },
    { code: "us-wa", name: "Washington" },
    { code: "us-ma", name: "Massachusetts" },
    { code: "us-pa", name: "Pennsylvania" },
    { code: "us-nj", name: "New Jersey" },
    { code: "us-ga", name: "Georgia" },
  ],
  gb: [
    { code: "gb-eng", name: "England" },
    { code: "gb-sct", name: "Scotland" },
    { code: "gb-wls", name: "Wales" },
    { code: "gb-nir", name: "Northern Ireland" },
  ],
  de: [
    { code: "de-by", name: "Bavaria" },
    { code: "de-nw", name: "North Rhine-Westphalia" },
    { code: "de-bw", name: "Baden-Württemberg" },
    { code: "de-he", name: "Hesse" },
    { code: "de-be", name: "Berlin" },
  ],
  in: [
    { code: "in-mh", name: "Maharashtra" },
    { code: "in-dl", name: "Delhi" },
    { code: "in-ka", name: "Karnataka" },
    { code: "in-tn", name: "Tamil Nadu" },
    { code: "in-gj", name: "Gujarat" },
  ],
  ca: [
    { code: "ca-on", name: "Ontario" },
    { code: "ca-qc", name: "Quebec" },
    { code: "ca-bc", name: "British Columbia" },
    { code: "ca-ab", name: "Alberta" },
  ],
};

export const companySizes = [
  { value: "1-10", label: "1-10 employees" },
  { value: "11-50", label: "11-50 employees" },
  { value: "51-200", label: "51-200 employees" },
  { value: "201-500", label: "201-500 employees" },
  { value: "501-1000", label: "501-1000 employees" },
  { value: "1001-5000", label: "1001-5000 employees" },
  { value: "5001-10000", label: "5001-10000 employees" },
  { value: "10001+", label: "10000+ employees" },
];

export const revenueRanges = [
  { value: "0-500K", label: "$0 - $500K" },
  { value: "500K-1M", label: "$500K - $1M" },
  { value: "1M-5M", label: "$1M - $5M" },
  { value: "5M-10M", label: "$5M - $10M" },
  { value: "10M-50M", label: "$10M - $50M" },
  { value: "50M-100M", label: "$50M - $100M" },
  { value: "100M-500M", label: "$100M - $500M" },
  { value: "500M-1B", label: "$500M - $1B" },
  { value: "1B-10B", label: "$1B - $10B" },
  { value: "10B-100B", label: "$10B - $100B" },
];

export const companyAges = [
  { value: "0-3", label: "Startup (0-3 years)" },
  { value: "3-6", label: "Early Stage (3-6 years)" },
  { value: "6-10", label: "Growth (6-10 years)" },
  { value: "10-20", label: "Established (10-20 years)" },
  { value: "20+", label: "Mature (20+ years)" },
];

export const numberOfLocations = [
  { value: "1", label: "Single Location" },
  { value: "2-5", label: "2-5 Locations" },
  { value: "6-10", label: "6-10 Locations" },
  { value: "11-50", label: "11-50 Locations" },
  { value: "51+", label: "50+ Locations" },
];

export const industries = [
  { value: "manufacturing", label: "Manufacturing" },
  { value: "wholesale", label: "Wholesale & Distribution" },
  { value: "import and export", label: "Import & Export" },
  { value: "retail", label: "Retail" },
  { value: "food and beverage", label: "Food & Beverage" },
  { value: "agriculture", label: "Agriculture" },
  { value: "textiles", label: "Textiles & Apparel" },
  { value: "chemicals", label: "Chemicals" },
  { value: "pharmaceuticals", label: "Pharmaceuticals" },
  { value: "machinery", label: "Machinery & Equipment" },
  { value: "electronics", label: "Electronics" },
  { value: "automotive", label: "Automotive" },
  { value: "construction", label: "Construction & Building Materials" },
  { value: "mining", label: "Mining & Metals" },
  { value: "logistics", label: "Logistics & Supply Chain" },
  { value: "transportation", label: "Transportation" },
  { value: "healthcare", label: "Healthcare" },
  { value: "software development", label: "Software & Technology" },
  { value: "financial services", label: "Financial Services" },
  { value: "real estate", label: "Real Estate" },
  { value: "energy", label: "Energy & Utilities" },
  { value: "consumer goods", label: "Consumer Goods" },
  { value: "packaging", label: "Packaging" },
  { value: "plastics", label: "Plastics & Rubber" },
  { value: "furniture", label: "Furniture" },
  { value: "paper", label: "Paper & Pulp" },
  { value: "aerospace", label: "Aerospace & Defense" },
  { value: "maritime", label: "Maritime & Shipping" },
];

export const techCategories = [
  { value: "Marketing", label: "Marketing Tech" },
  { value: "CRM", label: "CRM Systems" },
  { value: "Cloud Services", label: "Cloud Services" },
  { value: "E-commerce", label: "E-commerce" },
  { value: "Analytics", label: "Analytics" },
  { value: "ERP", label: "ERP Systems" },
  { value: "Security", label: "Security" },
  { value: "Communication", label: "Communication" },
  { value: "Productivity", label: "Productivity" },
  { value: "HR", label: "HR Tech" },
  { value: "Finance", label: "Finance Tech" },
  { value: "Supply Chain", label: "Supply Chain" },
];

export const businessEvents = [
  { value: "new_funding_round", label: "New Funding Round", icon: "💰", description: "Recently raised capital" },
  { value: "new_investment", label: "New Investment", icon: "📈", description: "Made new investments" },
  { value: "new_product", label: "New Product Launch", icon: "🚀", description: "Launched new products" },
  { value: "new_office", label: "New Office", icon: "🏢", description: "Opened new locations" },
  { value: "new_partnership", label: "New Partnership", icon: "🤝", description: "Formed partnerships" },
  { value: "merger_and_acquisitions", label: "M&A Activity", icon: "🔄", description: "Mergers or acquisitions" },
  { value: "increase_in_all_departments", label: "Hiring (All Depts)", icon: "👥", description: "Growing workforce" },
  { value: "hiring_in_sales_department", label: "Hiring Sales", icon: "💼", description: "Growing sales team" },
  { value: "hiring_in_operations_department", label: "Hiring Operations", icon: "⚙️", description: "Growing operations" },
  { value: "hiring_in_trade_department", label: "Hiring Trade", icon: "🌍", description: "Growing trade team" },
  { value: "company_award", label: "Company Award", icon: "🏆", description: "Won industry awards" },
  { value: "ipo_announcement", label: "IPO Announcement", icon: "📊", description: "Going public" },
];

export const buyerIntentTopics = [
  { value: "supply chain management", label: "Supply Chain Management" },
  { value: "procurement", label: "Procurement & Sourcing" },
  { value: "international trade", label: "International Trade" },
  { value: "import regulations", label: "Import Regulations" },
  { value: "supplier evaluation", label: "Supplier Evaluation" },
  { value: "raw materials", label: "Raw Materials" },
  { value: "manufacturing outsourcing", label: "Manufacturing Outsourcing" },
  { value: "quality control", label: "Quality Control" },
  { value: "trade compliance", label: "Trade Compliance" },
  { value: "logistics optimization", label: "Logistics Optimization" },
  { value: "inventory management", label: "Inventory Management" },
  { value: "cost reduction", label: "Cost Reduction" },
  { value: "bulk purchasing", label: "Bulk Purchasing" },
  { value: "vendor management", label: "Vendor Management" },
];
