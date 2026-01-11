import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Types for master data
export interface MasterCountry {
  id: string;
  code: string;
  name: string;
  region: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface MasterRegion {
  id: string;
  country_code: string;
  code: string;
  name: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface MasterCompanySize {
  id: string;
  code: string;
  label: string;
  min_employees: number | null;
  max_employees: number | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface MasterRevenueRange {
  id: string;
  code: string;
  label: string;
  min_revenue: number | null;
  max_revenue: number | null;
  currency: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface MasterCompanyAge {
  id: string;
  code: string;
  label: string;
  min_years: number | null;
  max_years: number | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface MasterTechCategory {
  id: string;
  code: string;
  name: string;
  description: string | null;
  icon: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface MasterBusinessEvent {
  id: string;
  code: string;
  name: string;
  description: string | null;
  category: string | null;
  icon: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface MasterIntentTopic {
  id: string;
  code: string;
  name: string;
  description: string | null;
  category: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface MasterTrainingCategory {
  id: string;
  code: string;
  name: string;
  description: string | null;
  icon: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface MasterEventType {
  id: string;
  code: string;
  name: string;
  description: string | null;
  icon: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface MasterSchemeCategory {
  id: string;
  code: string;
  name: string;
  description: string | null;
  icon: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

// Generic hook for master data operations
function useMasterDataQuery<T>(tableName: string, queryKey: string) {
  return useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const { data, error } = await supabase
        .from(tableName as any)
        .select("*")
        .order("sort_order", { ascending: true });
      
      if (error) throw error;
      return data as T[];
    },
  });
}

function useMasterDataMutations<T extends { id?: string }>(
  tableName: string,
  queryKey: string
) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createMutation = useMutation({
    mutationFn: async (item: Omit<T, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from(tableName as any)
        .insert(item as any)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      toast({ title: "Created successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error creating item", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<T> & { id: string }) => {
      const { data, error } = await supabase
        .from(tableName as any)
        .update(updates as any)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      toast({ title: "Updated successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error updating item", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from(tableName as any)
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      toast({ title: "Deleted successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error deleting item", description: error.message, variant: "destructive" });
    },
  });

  return { createMutation, updateMutation, deleteMutation };
}

// Specific hooks for each master data type
export function useMasterCountries() {
  const query = useMasterDataQuery<MasterCountry>("master_countries", "master_countries");
  const mutations = useMasterDataMutations<MasterCountry>("master_countries", "master_countries");
  return { ...query, ...mutations };
}

export function useMasterRegions() {
  const query = useMasterDataQuery<MasterRegion>("master_regions", "master_regions");
  const mutations = useMasterDataMutations<MasterRegion>("master_regions", "master_regions");
  return { ...query, ...mutations };
}

export function useMasterCompanySizes() {
  const query = useMasterDataQuery<MasterCompanySize>("master_company_sizes", "master_company_sizes");
  const mutations = useMasterDataMutations<MasterCompanySize>("master_company_sizes", "master_company_sizes");
  return { ...query, ...mutations };
}

export function useMasterRevenueRanges() {
  const query = useMasterDataQuery<MasterRevenueRange>("master_revenue_ranges", "master_revenue_ranges");
  const mutations = useMasterDataMutations<MasterRevenueRange>("master_revenue_ranges", "master_revenue_ranges");
  return { ...query, ...mutations };
}

export function useMasterCompanyAges() {
  const query = useMasterDataQuery<MasterCompanyAge>("master_company_ages", "master_company_ages");
  const mutations = useMasterDataMutations<MasterCompanyAge>("master_company_ages", "master_company_ages");
  return { ...query, ...mutations };
}

export function useMasterTechCategories() {
  const query = useMasterDataQuery<MasterTechCategory>("master_tech_categories", "master_tech_categories");
  const mutations = useMasterDataMutations<MasterTechCategory>("master_tech_categories", "master_tech_categories");
  return { ...query, ...mutations };
}

export function useMasterBusinessEvents() {
  const query = useMasterDataQuery<MasterBusinessEvent>("master_business_events", "master_business_events");
  const mutations = useMasterDataMutations<MasterBusinessEvent>("master_business_events", "master_business_events");
  return { ...query, ...mutations };
}

export function useMasterIntentTopics() {
  const query = useMasterDataQuery<MasterIntentTopic>("master_intent_topics", "master_intent_topics");
  const mutations = useMasterDataMutations<MasterIntentTopic>("master_intent_topics", "master_intent_topics");
  return { ...query, ...mutations };
}

export function useMasterTrainingCategories() {
  const query = useMasterDataQuery<MasterTrainingCategory>("master_training_categories", "master_training_categories");
  const mutations = useMasterDataMutations<MasterTrainingCategory>("master_training_categories", "master_training_categories");
  return { ...query, ...mutations };
}

export function useMasterEventTypes() {
  const query = useMasterDataQuery<MasterEventType>("master_event_types", "master_event_types");
  const mutations = useMasterDataMutations<MasterEventType>("master_event_types", "master_event_types");
  return { ...query, ...mutations };
}

export function useMasterSchemeCategories() {
  const query = useMasterDataQuery<MasterSchemeCategory>("master_scheme_categories", "master_scheme_categories");
  const mutations = useMasterDataMutations<MasterSchemeCategory>("master_scheme_categories", "master_scheme_categories");
  return { ...query, ...mutations };
}
