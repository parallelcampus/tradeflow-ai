import { supabase } from "@/integrations/supabase/client";

export interface SearchFilters {
  country_code?: string[];
  company_size?: string[];
  company_revenue?: string[];
  linkedin_category?: string[];
  naics_category?: string[];
  google_category?: string[];
  company_name?: string[];
  website_keywords?: string[];
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
];

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

export const industries = [
  { value: "software development", label: "Software Development" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "retail", label: "Retail" },
  { value: "financial services", label: "Financial Services" },
  { value: "healthcare", label: "Healthcare" },
  { value: "food and beverage", label: "Food & Beverage" },
  { value: "construction", label: "Construction" },
  { value: "transportation", label: "Transportation" },
  { value: "real estate", label: "Real Estate" },
  { value: "agriculture", label: "Agriculture" },
  { value: "mining", label: "Mining" },
  { value: "textiles", label: "Textiles" },
  { value: "chemicals", label: "Chemicals" },
  { value: "machinery", label: "Machinery" },
  { value: "electronics", label: "Electronics" },
  { value: "automotive", label: "Automotive" },
  { value: "pharmaceuticals", label: "Pharmaceuticals" },
  { value: "wholesale", label: "Wholesale" },
  { value: "import and export", label: "Import & Export" },
  { value: "logistics", label: "Logistics" },
];
