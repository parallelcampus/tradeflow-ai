import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ERPNextRequest {
  endpoint: string;
  method?: string;
  data?: Record<string, unknown>;
  filters?: Record<string, unknown>;
  fields?: string[];
}

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
        JSON.stringify({ success: false, error: 'ERPNext credentials not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { endpoint, method = 'GET', data, filters, fields }: ERPNextRequest = await req.json();

    // Build URL with filters and fields
    let url = `${erpnextUrl}/api/resource/${endpoint}`;
    const params = new URLSearchParams();

    if (filters) {
      params.append('filters', JSON.stringify(filters));
    }

    if (fields && fields.length > 0) {
      params.append('fields', JSON.stringify(fields));
    }

    // Default limit
    params.append('limit_page_length', '0');

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const headers: HeadersInit = {
      'Authorization': `token ${apiKey}:${apiSecret}`,
      'Content-Type': 'application/json',
    };

    const fetchOptions: RequestInit = {
      method,
      headers,
    };

    if (data && (method === 'POST' || method === 'PUT')) {
      fetchOptions.body = JSON.stringify(data);
    }

    console.log(`ERPNext API Request: ${method} ${url}`);
    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ERPNext API Error:', errorText);
      return new Response(
        JSON.stringify({ success: false, error: `ERPNext API error: ${response.status}`, details: errorText }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const result = await response.json();

    return new Response(
      JSON.stringify({ success: true, data: result }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Edge function error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
