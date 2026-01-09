import { supabase } from "@/integrations/supabase/client";

const SUPABASE_URL = "https://fbuishideflknmqlibng.supabase.co";

export interface GovtScheme {
  id: number;
  erpnext_id?: string;
  name: string;
  ministry: string;
  benefit: string;
  deadline: string;
  eligibility: string;
  status: string;
  category: string;
  description?: string;
  applicationUrl?: string;
  documentsRequired?: string;
}

export interface ConsultantData {
  full_name: string;
  email: string;
  phone?: string;
  country?: string;
  bio?: string;
  headline?: string;
  hourly_rate?: number;
  years_experience?: number;
  linkedin_url?: string;
  website_url?: string;
  certifications?: string[];
  languages?: string[];
  industries?: string[];
}

// Fetch government schemes from ERPNext
export async function fetchSchemesFromERPNext(): Promise<GovtScheme[]> {
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/erpnext-schemes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });

    const data = await response.json();
    
    if (data.success) {
      return data.schemes;
    }
    
    console.error('Failed to fetch schemes:', data.error);
    return [];
  } catch (error) {
    console.error('Error fetching schemes from ERPNext:', error);
    return [];
  }
}

// Sync user to ERPNext on auth changes
export async function syncUserToERPNext(userData: { full_name?: string; phone?: string }): Promise<boolean> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      console.error('No active session');
      return false;
    }

    const response = await fetch(`${SUPABASE_URL}/functions/v1/erpnext-user-sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        action: 'sync_to_erpnext',
        userData,
      }),
    });

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Error syncing user to ERPNext:', error);
    return false;
  }
}

// Register consultant in ERPNext
export async function registerConsultantInERPNext(consultantData: ConsultantData): Promise<{ success: boolean; erpnext_id?: string }> {
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/erpnext-consultant`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'register_consultant',
        consultantData,
      }),
    });

    const data = await response.json();
    return { success: data.success, erpnext_id: data.erpnext_id };
  } catch (error) {
    console.error('Error registering consultant in ERPNext:', error);
    return { success: false };
  }
}

// Sync consultants from ERPNext to local database
export async function syncConsultantsFromERPNext(): Promise<boolean> {
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/erpnext-consultant`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'sync_consultants',
      }),
    });

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Error syncing consultants from ERPNext:', error);
    return false;
  }
}
