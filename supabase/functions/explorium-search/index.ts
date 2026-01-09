import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SearchFilters {
  country_code?: string[];
  company_size?: string[];
  company_revenue?: string[];
  linkedin_category?: string[];
  naics_category?: string[];
  google_category?: string[];
  company_name?: string[];
  website_keywords?: string[];
}

interface SearchRequest {
  action: "search" | "match" | "stats";
  filters?: SearchFilters;
  page?: number;
  page_size?: number;
  businesses_to_match?: Array<{
    name?: string;
    domain?: string;
    url?: string;
    linkedin_url?: string;
  }>;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("EXPLORIUM_API_KEY");
    if (!apiKey) {
      console.error("EXPLORIUM_API_KEY not configured");
      return new Response(
        JSON.stringify({ success: false, error: "Explorium API key not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body: SearchRequest = await req.json();
    const { action, filters, page = 1, page_size = 20, businesses_to_match } = body;

    let endpoint = "";
    let requestBody: any = {};

    switch (action) {
      case "search":
        endpoint = "https://api.explorium.ai/v1/businesses";
        // Build filters object for Explorium API
        const exploriumFilters: Record<string, { values: string[] }> = {};
        
        if (filters?.country_code?.length) {
          exploriumFilters.country_code = { values: filters.country_code };
        }
        if (filters?.company_size?.length) {
          exploriumFilters.company_size = { values: filters.company_size };
        }
        if (filters?.company_revenue?.length) {
          exploriumFilters.company_revenue = { values: filters.company_revenue };
        }
        if (filters?.linkedin_category?.length) {
          exploriumFilters.linkedin_category = { values: filters.linkedin_category };
        }
        if (filters?.naics_category?.length) {
          exploriumFilters.naics_category = { values: filters.naics_category };
        }
        if (filters?.google_category?.length) {
          exploriumFilters.google_category = { values: filters.google_category };
        }
        if (filters?.company_name?.length) {
          exploriumFilters.company_name = { values: filters.company_name };
        }
        if (filters?.website_keywords?.length) {
          exploriumFilters.website_keywords = { values: filters.website_keywords };
        }

        requestBody = {
          mode: "full",
          size: 1000,
          page_size: page_size,
          page: page,
          filters: exploriumFilters,
        };
        break;

      case "match":
        endpoint = "https://api.explorium.ai/v1/businesses/match";
        requestBody = {
          businesses_to_match: businesses_to_match || [],
        };
        break;

      case "stats":
        endpoint = "https://api.explorium.ai/v1/businesses/stats";
        const statsFilters: Record<string, { values: string[] }> = {};
        
        if (filters?.country_code?.length) {
          statsFilters.country_code = { values: filters.country_code };
        }
        if (filters?.linkedin_category?.length) {
          statsFilters.linkedin_category = { values: filters.linkedin_category };
        }

        requestBody = {
          filters: statsFilters,
        };
        break;

      default:
        return new Response(
          JSON.stringify({ success: false, error: "Invalid action" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    console.log(`Explorium ${action} request:`, JSON.stringify(requestBody, null, 2));

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "api_key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Explorium API error:", response.status, data);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: data.detail || data.message || `Request failed with status ${response.status}` 
        }),
        { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Explorium ${action} successful, results:`, data.total_results || data.total_matches || 0);

    return new Response(
      JSON.stringify({ success: true, ...data }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in explorium-search:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
