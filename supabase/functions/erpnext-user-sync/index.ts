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

    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await supabaseAdmin.auth.getUser(token);

    if (claimsError || !claimsData.user) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const user = claimsData.user;
    const { action, userData } = await req.json();

    if (action === 'sync_to_erpnext') {
      // Create or update user in ERPNext
      // First check if user exists
      const checkUrl = `${erpnextUrl}/api/resource/User?filters=[["email","=","${user.email}"]]`;
      const checkResponse = await fetch(checkUrl, {
        method: 'GET',
        headers: {
          'Authorization': `token ${apiKey}:${apiSecret}`,
          'Content-Type': 'application/json',
        },
      });

      const checkResult = await checkResponse.json();
      const userExists = checkResult.data && checkResult.data.length > 0;

      if (userExists) {
        // Update existing user
        const updateUrl = `${erpnextUrl}/api/resource/User/${user.email}`;
        await fetch(updateUrl, {
          method: 'PUT',
          headers: {
            'Authorization': `token ${apiKey}:${apiSecret}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            first_name: userData?.full_name?.split(' ')[0] || user.email?.split('@')[0],
            last_name: userData?.full_name?.split(' ').slice(1).join(' ') || '',
            mobile_no: userData?.phone || '',
          }),
        });
      } else {
        // Create new user
        const createUrl = `${erpnextUrl}/api/resource/User`;
        await fetch(createUrl, {
          method: 'POST',
          headers: {
            'Authorization': `token ${apiKey}:${apiSecret}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: user.email,
            first_name: userData?.full_name?.split(' ')[0] || user.email?.split('@')[0],
            last_name: userData?.full_name?.split(' ').slice(1).join(' ') || '',
            mobile_no: userData?.phone || '',
            send_welcome_email: 0,
            enabled: 1,
          }),
        });
      }

      return new Response(
        JSON.stringify({ success: true, message: 'User synced to ERPNext' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: false, error: 'Invalid action' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('User sync error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
