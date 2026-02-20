
-- Medical Tourism Inquiries
CREATE TABLE public.medical_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_name TEXT NOT NULL,
  country TEXT,
  medical_condition TEXT,
  preferred_location TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  report_urls TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'new' CHECK (status IN ('new','in_review','assigned','in_treatment','follow_up','completed','cancelled')),
  assigned_admin UUID,
  case_notes TEXT,
  treatment_stage TEXT,
  follow_up_date DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.medical_inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage medical inquiries" ON public.medical_inquiries
FOR ALL USING (has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'regional_admin'));

CREATE POLICY "Anyone can submit medical inquiry" ON public.medical_inquiries
FOR INSERT WITH CHECK (true);

-- Tourism Packages
CREATE TABLE public.tourism_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT DEFAULT 'pilgrimage' CHECK (category IN ('pilgrimage','medical','cultural','custom')),
  description TEXT,
  destinations TEXT[],
  duration_days INTEGER,
  price NUMERIC,
  currency TEXT DEFAULT 'USD',
  highlights JSONB DEFAULT '[]',
  itinerary JSONB DEFAULT '[]',
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  max_group_size INTEGER,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.tourism_packages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active packages" ON public.tourism_packages
FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage packages" ON public.tourism_packages
FOR ALL USING (has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'regional_admin'));

-- Tourism Bookings
CREATE TABLE public.tourism_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id UUID REFERENCES public.tourism_packages(id),
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_phone TEXT,
  country TEXT,
  group_size INTEGER DEFAULT 1,
  preferred_dates TEXT,
  special_requests TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','approved','confirmed','in_progress','completed','cancelled')),
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.tourism_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage bookings" ON public.tourism_bookings
FOR ALL USING (has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'regional_admin'));

CREATE POLICY "Anyone can submit booking" ON public.tourism_bookings
FOR INSERT WITH CHECK (true);

-- Add-On Services
CREATE TABLE public.addon_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT DEFAULT 'general' CHECK (category IN ('general','medical','tourism','trade')),
  description TEXT,
  price NUMERIC,
  currency TEXT DEFAULT 'USD',
  icon TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.addon_services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active addons" ON public.addon_services
FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage addons" ON public.addon_services
FOR ALL USING (has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'regional_admin'));

-- Triggers for updated_at
CREATE TRIGGER update_medical_inquiries_updated_at BEFORE UPDATE ON public.medical_inquiries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tourism_packages_updated_at BEFORE UPDATE ON public.tourism_packages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tourism_bookings_updated_at BEFORE UPDATE ON public.tourism_bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_addon_services_updated_at BEFORE UPDATE ON public.addon_services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
