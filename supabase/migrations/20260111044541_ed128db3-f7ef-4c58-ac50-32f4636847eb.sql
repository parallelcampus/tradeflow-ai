-- Create master data tables for admin management

-- Countries master table
CREATE TABLE public.master_countries (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    code text NOT NULL UNIQUE,
    name text NOT NULL,
    region text,
    is_active boolean DEFAULT true,
    sort_order integer DEFAULT 0,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Regions master table (states/regions within countries)
CREATE TABLE public.master_regions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    country_code text NOT NULL,
    code text NOT NULL,
    name text NOT NULL,
    is_active boolean DEFAULT true,
    sort_order integer DEFAULT 0,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(country_code, code)
);

-- Company sizes master table
CREATE TABLE public.master_company_sizes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    code text NOT NULL UNIQUE,
    label text NOT NULL,
    min_employees integer,
    max_employees integer,
    is_active boolean DEFAULT true,
    sort_order integer DEFAULT 0,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Revenue ranges master table
CREATE TABLE public.master_revenue_ranges (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    code text NOT NULL UNIQUE,
    label text NOT NULL,
    min_revenue numeric,
    max_revenue numeric,
    currency text DEFAULT 'USD',
    is_active boolean DEFAULT true,
    sort_order integer DEFAULT 0,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Company ages master table
CREATE TABLE public.master_company_ages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    code text NOT NULL UNIQUE,
    label text NOT NULL,
    min_years integer,
    max_years integer,
    is_active boolean DEFAULT true,
    sort_order integer DEFAULT 0,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Tech categories master table
CREATE TABLE public.master_tech_categories (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    code text NOT NULL UNIQUE,
    name text NOT NULL,
    description text,
    icon text,
    is_active boolean DEFAULT true,
    sort_order integer DEFAULT 0,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Business events master table
CREATE TABLE public.master_business_events (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    code text NOT NULL UNIQUE,
    name text NOT NULL,
    description text,
    category text,
    icon text,
    is_active boolean DEFAULT true,
    sort_order integer DEFAULT 0,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Buyer intent topics master table
CREATE TABLE public.master_intent_topics (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    code text NOT NULL UNIQUE,
    name text NOT NULL,
    description text,
    category text,
    is_active boolean DEFAULT true,
    sort_order integer DEFAULT 0,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Training categories master table
CREATE TABLE public.master_training_categories (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    code text NOT NULL UNIQUE,
    name text NOT NULL,
    description text,
    icon text,
    is_active boolean DEFAULT true,
    sort_order integer DEFAULT 0,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Event types master table
CREATE TABLE public.master_event_types (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    code text NOT NULL UNIQUE,
    name text NOT NULL,
    description text,
    icon text,
    is_active boolean DEFAULT true,
    sort_order integer DEFAULT 0,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Scheme categories master table
CREATE TABLE public.master_scheme_categories (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    code text NOT NULL UNIQUE,
    name text NOT NULL,
    description text,
    icon text,
    is_active boolean DEFAULT true,
    sort_order integer DEFAULT 0,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.master_countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_company_sizes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_revenue_ranges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_company_ages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_tech_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_business_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_intent_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_training_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_event_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_scheme_categories ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Anyone can view active master data
CREATE POLICY "Anyone can view active countries" ON public.master_countries FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view active regions" ON public.master_regions FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view active company sizes" ON public.master_company_sizes FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view active revenue ranges" ON public.master_revenue_ranges FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view active company ages" ON public.master_company_ages FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view active tech categories" ON public.master_tech_categories FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view active business events" ON public.master_business_events FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view active intent topics" ON public.master_intent_topics FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view active training categories" ON public.master_training_categories FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view active event types" ON public.master_event_types FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view active scheme categories" ON public.master_scheme_categories FOR SELECT USING (is_active = true);

-- RLS Policies: Only admins can manage master data
CREATE POLICY "Admins can manage countries" ON public.master_countries FOR ALL USING (has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'regional_admin'));
CREATE POLICY "Admins can manage regions" ON public.master_regions FOR ALL USING (has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'regional_admin'));
CREATE POLICY "Admins can manage company sizes" ON public.master_company_sizes FOR ALL USING (has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'regional_admin'));
CREATE POLICY "Admins can manage revenue ranges" ON public.master_revenue_ranges FOR ALL USING (has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'regional_admin'));
CREATE POLICY "Admins can manage company ages" ON public.master_company_ages FOR ALL USING (has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'regional_admin'));
CREATE POLICY "Admins can manage tech categories" ON public.master_tech_categories FOR ALL USING (has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'regional_admin'));
CREATE POLICY "Admins can manage business events" ON public.master_business_events FOR ALL USING (has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'regional_admin'));
CREATE POLICY "Admins can manage intent topics" ON public.master_intent_topics FOR ALL USING (has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'regional_admin'));
CREATE POLICY "Admins can manage training categories" ON public.master_training_categories FOR ALL USING (has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'regional_admin'));
CREATE POLICY "Admins can manage event types" ON public.master_event_types FOR ALL USING (has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'regional_admin'));
CREATE POLICY "Admins can manage scheme categories" ON public.master_scheme_categories FOR ALL USING (has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'regional_admin'));

-- Create updated_at triggers
CREATE TRIGGER update_master_countries_updated_at BEFORE UPDATE ON public.master_countries FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_master_regions_updated_at BEFORE UPDATE ON public.master_regions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_master_company_sizes_updated_at BEFORE UPDATE ON public.master_company_sizes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_master_revenue_ranges_updated_at BEFORE UPDATE ON public.master_revenue_ranges FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_master_company_ages_updated_at BEFORE UPDATE ON public.master_company_ages FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_master_tech_categories_updated_at BEFORE UPDATE ON public.master_tech_categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_master_business_events_updated_at BEFORE UPDATE ON public.master_business_events FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_master_intent_topics_updated_at BEFORE UPDATE ON public.master_intent_topics FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_master_training_categories_updated_at BEFORE UPDATE ON public.master_training_categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_master_event_types_updated_at BEFORE UPDATE ON public.master_event_types FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_master_scheme_categories_updated_at BEFORE UPDATE ON public.master_scheme_categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();