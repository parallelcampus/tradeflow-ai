import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    if (!erpnextUrl || !apiKey || !apiSecret) {
      return new Response(
        JSON.stringify({ success: false, error: 'ERPNext credentials not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { action, consultantData } = await req.json();

    if (action === 'register_consultant') {
      // Create consultant in ERPNext as a Supplier or custom DocType
      const createUrl = `${erpnextUrl}/api/resource/Supplier`;
      
      const response = await fetch(createUrl, {
        method: 'POST',
        headers: {
          'Authorization': `token ${apiKey}:${apiSecret}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          supplier_name: consultantData.full_name,
          supplier_type: 'Consultant',
          supplier_group: 'Services',
          email_id: consultantData.email,
          mobile_no: consultantData.phone,
          country: consultantData.country,
          custom_bio: consultantData.bio,
          custom_headline: consultantData.headline,
          custom_hourly_rate: consultantData.hourly_rate,
          custom_years_experience: consultantData.years_experience,
          custom_linkedin_url: consultantData.linkedin_url,
          custom_website_url: consultantData.website_url,
          custom_certifications: JSON.stringify(consultantData.certifications || []),
          custom_languages: JSON.stringify(consultantData.languages || []),
          custom_industries: JSON.stringify(consultantData.industries || []),
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('ERPNext consultant registration error:', errorText);
        return new Response(
          JSON.stringify({ success: false, error: 'Failed to register consultant in ERPNext' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const result = await response.json();
      return new Response(
        JSON.stringify({ success: true, erpnext_id: result.data.name }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'sync_consultants') {
      // Fetch all consultants from ERPNext
      const url = `${erpnextUrl}/api/resource/Supplier?filters=[["supplier_type","=","Consultant"]]&limit_page_length=0`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `token ${apiKey}:${apiSecret}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        return new Response(
          JSON.stringify({ success: false, error: 'Failed to fetch consultants from ERPNext' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const result = await response.json();
      const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

      // Sync each consultant to Supabase
      for (const supplier of result.data || []) {
        // Get full supplier details
        const detailUrl = `${erpnextUrl}/api/resource/Supplier/${supplier.name}`;
        const detailResponse = await fetch(detailUrl, {
          method: 'GET',
          headers: {
            'Authorization': `token ${apiKey}:${apiSecret}`,
            'Content-Type': 'application/json',
          },
        });

        if (detailResponse.ok) {
          const detail = await detailResponse.json();
          const consultantData = detail.data;

          await supabaseAdmin.from('consultants').upsert({
            email: consultantData.email_id,
            full_name: consultantData.supplier_name,
            phone: consultantData.mobile_no,
            country: consultantData.country,
            bio: consultantData.custom_bio,
            headline: consultantData.custom_headline,
            hourly_rate: consultantData.custom_hourly_rate,
            years_experience: consultantData.custom_years_experience,
            linkedin_url: consultantData.custom_linkedin_url,
            website_url: consultantData.custom_website_url,
            is_verified: true,
          }, { onConflict: 'email' });
        }
      }

      return new Response(
        JSON.stringify({ success: true, message: 'Consultants synced from ERPNext' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: false, error: 'Invalid action' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Consultant operation error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
