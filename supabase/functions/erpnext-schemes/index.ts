import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const erpnextUrl = Deno.env.get('ERPNEXT_URL');
    const apiKey = Deno.env.get('ERPNEXT_API_KEY');
    const apiSecret = Deno.env.get('ERPNEXT_API_SECRET');

    if (!erpnextUrl || !apiKey || !apiSecret) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'ERPNext credentials not configured',
          schemes: [] 
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch Government Schemes from ERPNext
    // Assuming a custom DocType "Government Scheme" exists in ERPNext
    const url = `${erpnextUrl}/api/resource/Government Scheme?limit_page_length=0&fields=["name","scheme_name","ministry","benefit","deadline","eligibility","status","category","description","application_url","documents_required"]`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `token ${apiKey}:${apiSecret}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('ERPNext schemes fetch error:', await response.text());
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Failed to fetch schemes from ERPNext',
          schemes: [] 
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const result = await response.json();
    
    // Map ERPNext response to our schema
    const schemes = (result.data || []).map((scheme: Record<string, unknown>, index: number) => ({
      id: index + 1,
      erpnext_id: scheme.name,
      name: scheme.scheme_name || scheme.name,
      ministry: scheme.ministry || 'Not specified',
      benefit: scheme.benefit || 'Contact for details',
      deadline: scheme.deadline || 'Ongoing',
      eligibility: scheme.eligibility || 'Check scheme guidelines',
      status: scheme.status || 'active',
      category: scheme.category || 'General',
      description: scheme.description || '',
      applicationUrl: scheme.application_url || '',
      documentsRequired: scheme.documents_required || '',
    }));

    return new Response(
      JSON.stringify({ success: true, schemes }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Schemes fetch error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage, schemes: [] }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
