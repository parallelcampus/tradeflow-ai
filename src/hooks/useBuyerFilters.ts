import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Fetch countries from master data
export function useMasterCountriesForFilters() {
  return useQuery({
    queryKey: ["master_countries_filters"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("master_countries" as any)
        .select("code, name, region")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
      
      if (error) throw error;
      return (data || []).map((c: any) => ({ 
        code: c.code.toLowerCase(), 
        name: c.name,
        region: c.region 
      }));
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

// Fetch regions from master data
export function useMasterRegionsForFilters() {
  return useQuery({
    queryKey: ["master_regions_filters"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("master_regions" as any)
        .select("country_code, code, name")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
      
      if (error) throw error;
      
      // Group by country_code
      const grouped: Record<string, { code: string; name: string }[]> = {};
      (data || []).forEach((r: any) => {
        const countryCode = r.country_code.toLowerCase();
        if (!grouped[countryCode]) {
          grouped[countryCode] = [];
        }
        grouped[countryCode].push({
          code: r.code.toLowerCase(),
          name: r.name,
        });
      });
      
      return grouped;
    },
    staleTime: 1000 * 60 * 10,
  });
}

// Fetch company sizes from master data
export function useMasterCompanySizesForFilters() {
  return useQuery({
    queryKey: ["master_company_sizes_filters"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("master_company_sizes" as any)
        .select("code, label")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
      
      if (error) throw error;
      return (data || []).map((s: any) => ({ 
        value: s.code, 
        label: s.label 
      }));
    },
    staleTime: 1000 * 60 * 10,
  });
}

// Fetch revenue ranges from master data
export function useMasterRevenueRangesForFilters() {
  return useQuery({
    queryKey: ["master_revenue_ranges_filters"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("master_revenue_ranges" as any)
        .select("code, label")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
      
      if (error) throw error;
      return (data || []).map((r: any) => ({ 
        value: r.code, 
        label: r.label 
      }));
    },
    staleTime: 1000 * 60 * 10,
  });
}

// Fetch company ages from master data
export function useMasterCompanyAgesForFilters() {
  return useQuery({
    queryKey: ["master_company_ages_filters"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("master_company_ages" as any)
        .select("code, label")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
      
      if (error) throw error;
      return (data || []).map((a: any) => ({ 
        value: a.code, 
        label: a.label 
      }));
    },
    staleTime: 1000 * 60 * 10,
  });
}

// Fetch tech categories from master data
export function useMasterTechCategoriesForFilters() {
  return useQuery({
    queryKey: ["master_tech_categories_filters"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("master_tech_categories" as any)
        .select("code, name")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
      
      if (error) throw error;
      return (data || []).map((t: any) => ({ 
        value: t.code, 
        label: t.name 
      }));
    },
    staleTime: 1000 * 60 * 10,
  });
}

// Fetch business events from master data
export function useMasterBusinessEventsForFilters() {
  return useQuery({
    queryKey: ["master_business_events_filters"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("master_business_events" as any)
        .select("code, name, description, icon")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
      
      if (error) throw error;
      return (data || []).map((e: any) => ({ 
        value: e.code, 
        label: e.name,
        description: e.description,
        icon: e.icon 
      }));
    },
    staleTime: 1000 * 60 * 10,
  });
}

// Fetch intent topics from master data
export function useMasterIntentTopicsForFilters() {
  return useQuery({
    queryKey: ["master_intent_topics_filters"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("master_intent_topics" as any)
        .select("code, name, description")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
      
      if (error) throw error;
      return (data || []).map((t: any) => ({ 
        value: t.code, 
        label: t.name,
        description: t.description 
      }));
    },
    staleTime: 1000 * 60 * 10,
  });
}

// Fetch industries from the existing industries table
export function useIndustriesForFilters() {
  return useQuery({
    queryKey: ["industries_filters"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("industries")
        .select("slug, name")
        .order("name", { ascending: true });
      
      if (error) throw error;
      return (data || []).map((i) => ({ 
        value: i.slug, 
        label: i.name 
      }));
    },
    staleTime: 1000 * 60 * 10,
  });
}

// Combined hook for all buyer discovery filters
export function useBuyerDiscoveryFilters() {
  const countries = useMasterCountriesForFilters();
  const regions = useMasterRegionsForFilters();
  const companySizes = useMasterCompanySizesForFilters();
  const revenueRanges = useMasterRevenueRangesForFilters();
  const companyAges = useMasterCompanyAgesForFilters();
  const techCategories = useMasterTechCategoriesForFilters();
  const businessEvents = useMasterBusinessEventsForFilters();
  const intentTopics = useMasterIntentTopicsForFilters();
  const industries = useIndustriesForFilters();

  const isLoading = 
    countries.isLoading || 
    regions.isLoading || 
    companySizes.isLoading || 
    revenueRanges.isLoading ||
    companyAges.isLoading ||
    techCategories.isLoading ||
    businessEvents.isLoading ||
    intentTopics.isLoading ||
    industries.isLoading;

  return {
    countries: countries.data || [],
    regions: regions.data || {},
    companySizes: companySizes.data || [],
    revenueRanges: revenueRanges.data || [],
    companyAges: companyAges.data || [],
    techCategories: techCategories.data || [],
    businessEvents: businessEvents.data || [],
    intentTopics: intentTopics.data || [],
    industries: industries.data || [],
    isLoading,
  };
}
