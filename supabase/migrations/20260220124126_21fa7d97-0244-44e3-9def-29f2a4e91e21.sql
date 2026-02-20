
-- =====================================================
-- PHASE 2: Business Expansion & Investment Tables
-- =====================================================

-- 1. Company Setup Packages (country-specific setup tiers)
CREATE TABLE public.company_setup_packages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  country_code TEXT NOT NULL,
  country_name TEXT NOT NULL,
  jurisdiction_type TEXT, -- 'freezone', 'mainland', 'e-residency', etc.
  package_tier TEXT NOT NULL DEFAULT 'basic', -- basic, advanced, premium
  package_name TEXT NOT NULL,
  description TEXT,
  price NUMERIC,
  currency TEXT DEFAULT 'USD',
  setup_timeline TEXT, -- e.g., '2-4 weeks'
  features JSONB DEFAULT '[]'::jsonb,
  compliance_checklist JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.company_setup_packages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active packages" ON public.company_setup_packages
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage packages" ON public.company_setup_packages
  FOR ALL USING (has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'regional_admin'));

-- 2. Company Setup Requests (case tracking)
CREATE TABLE public.company_setup_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  package_id UUID REFERENCES public.company_setup_packages(id),
  country_code TEXT NOT NULL,
  company_name TEXT NOT NULL,
  business_type TEXT,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  assigned_manager UUID,
  status TEXT DEFAULT 'submitted', -- submitted, in_review, approved, in_progress, completed, cancelled
  progress_percentage INTEGER DEFAULT 0,
  compliance_status JSONB DEFAULT '[]'::jsonb,
  notes TEXT,
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.company_setup_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own requests" ON public.company_setup_requests
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create requests" ON public.company_setup_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all requests" ON public.company_setup_requests
  FOR ALL USING (has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'regional_admin'));

-- 3. Country Business Profiles (CMS for country pages)
CREATE TABLE public.country_business_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  country_code TEXT NOT NULL UNIQUE,
  country_name TEXT NOT NULL,
  flag_emoji TEXT,
  business_climate TEXT,
  tax_structure TEXT,
  setup_timeline TEXT,
  estimated_cost_range TEXT,
  key_benefits JSONB DEFAULT '[]'::jsonb,
  legal_requirements JSONB DEFAULT '[]'::jsonb,
  hero_image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.country_business_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active profiles" ON public.country_business_profiles
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage profiles" ON public.country_business_profiles
  FOR ALL USING (has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'regional_admin'));

-- 4. Investor Registrations
CREATE TABLE public.investor_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  investor_name TEXT NOT NULL,
  company_name TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  country TEXT,
  investor_type TEXT, -- individual, corporate, institutional, family_office
  capital_range TEXT, -- e.g., '$100K-$500K'
  sectors_of_interest TEXT[] DEFAULT '{}',
  investment_preference TEXT, -- equity, debt, jv, acquisition
  experience_summary TEXT,
  status TEXT DEFAULT 'pending', -- pending, approved, active, inactive
  assigned_advisor UUID,
  is_confidential BOOLEAN DEFAULT false,
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.investor_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own registration" ON public.investor_registrations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create registration" ON public.investor_registrations
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage registrations" ON public.investor_registrations
  FOR ALL USING (has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'regional_admin'));

-- 5. Investment Projects (listing module)
CREATE TABLE public.investment_projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  sector TEXT NOT NULL,
  country TEXT,
  investment_required NUMERIC,
  currency TEXT DEFAULT 'USD',
  investment_type TEXT, -- equity, debt, jv, partnership
  expected_roi TEXT,
  timeline TEXT,
  project_stage TEXT, -- concept, early, growth, expansion
  is_public BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  contact_email TEXT,
  documents_url TEXT,
  created_by UUID,
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.investment_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view public active projects" ON public.investment_projects
  FOR SELECT USING (is_active = true AND is_public = true);

CREATE POLICY "Admins can manage all projects" ON public.investment_projects
  FOR ALL USING (has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'regional_admin'));

-- 6. Government Schemes Database (searchable, multi-country)
CREATE TABLE public.government_schemes_db (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  country TEXT NOT NULL,
  category TEXT NOT NULL, -- export_subsidy, manufacturing, startup_grants, tax_relief, freezone, innovation
  sector TEXT,
  eligibility_tags TEXT[] DEFAULT '{}',
  benefits TEXT,
  application_deadline DATE,
  circular_url TEXT,
  official_url TEXT,
  estimated_benefit TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.government_schemes_db ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active schemes" ON public.government_schemes_db
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage schemes" ON public.government_schemes_db
  FOR ALL USING (has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'regional_admin'));

-- 7. Scheme Assessment Requests
CREATE TABLE public.scheme_assessment_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  scheme_id UUID REFERENCES public.government_schemes_db(id),
  company_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  country TEXT,
  sector TEXT,
  annual_revenue TEXT,
  employee_count TEXT,
  notes TEXT,
  status TEXT DEFAULT 'submitted', -- submitted, reviewing, assessed, completed
  admin_notes TEXT,
  assigned_to UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.scheme_assessment_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own assessments" ON public.scheme_assessment_requests
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Anyone can submit assessment" ON public.scheme_assessment_requests
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can manage assessments" ON public.scheme_assessment_requests
  FOR ALL USING (has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'regional_admin'));

-- 8. Manufacturing Partnership Requests
CREATE TABLE public.manufacturing_partnerships (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  request_type TEXT NOT NULL, -- 'seeking_manufacturer', 'offering_manufacturing', 'contract_manufacturing', 'vendor_sourcing'
  company_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  country TEXT,
  sector TEXT,
  product_category TEXT,
  requirements TEXT,
  annual_volume TEXT,
  budget_range TEXT,
  preferred_countries TEXT[] DEFAULT '{}',
  certifications_required TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'submitted', -- submitted, matched, in_discussion, contracted, completed
  assigned_manager UUID,
  admin_notes TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.manufacturing_partnerships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own partnerships" ON public.manufacturing_partnerships
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Anyone can submit partnership request" ON public.manufacturing_partnerships
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can manage partnerships" ON public.manufacturing_partnerships
  FOR ALL USING (has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'regional_admin'));

-- Triggers for updated_at
CREATE TRIGGER update_company_setup_packages_updated_at BEFORE UPDATE ON public.company_setup_packages FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_company_setup_requests_updated_at BEFORE UPDATE ON public.company_setup_requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_country_business_profiles_updated_at BEFORE UPDATE ON public.country_business_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_investor_registrations_updated_at BEFORE UPDATE ON public.investor_registrations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_investment_projects_updated_at BEFORE UPDATE ON public.investment_projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_government_schemes_db_updated_at BEFORE UPDATE ON public.government_schemes_db FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_scheme_assessment_requests_updated_at BEFORE UPDATE ON public.scheme_assessment_requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_manufacturing_partnerships_updated_at BEFORE UPDATE ON public.manufacturing_partnerships FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
