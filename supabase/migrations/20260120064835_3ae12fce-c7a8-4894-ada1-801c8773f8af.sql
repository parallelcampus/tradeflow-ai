-- Create team_members table for team page
CREATE TABLE public.team_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  designation TEXT NOT NULL,
  department TEXT,
  bio TEXT,
  photo_url TEXT,
  email TEXT,
  phone TEXT,
  linkedin_url TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create gallery_images table for gallery page
CREATE TABLE public.gallery_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  category TEXT DEFAULT 'General',
  event_name TEXT,
  event_date DATE,
  location TEXT,
  sort_order INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create membership_plans table
CREATE TABLE public.membership_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  currency TEXT DEFAULT 'USD',
  duration_months INTEGER DEFAULT 12,
  features JSONB DEFAULT '[]'::jsonb,
  is_popular BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create delegation_programs table
CREATE TABLE public.delegation_programs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  destination_country TEXT NOT NULL,
  description TEXT,
  start_date DATE,
  end_date DATE,
  registration_deadline DATE,
  max_participants INTEGER,
  current_participants INTEGER DEFAULT 0,
  price DECIMAL(10,2),
  currency TEXT DEFAULT 'USD',
  highlights JSONB DEFAULT '[]'::jsonb,
  itinerary JSONB DEFAULT '[]'::jsonb,
  included_services JSONB DEFAULT '[]'::jsonb,
  image_url TEXT,
  status TEXT DEFAULT 'upcoming',
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.membership_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delegation_programs ENABLE ROW LEVEL SECURITY;

-- Public read policies (for display on website)
CREATE POLICY "Anyone can view active team members" ON public.team_members FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view active gallery images" ON public.gallery_images FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view active membership plans" ON public.membership_plans FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view active delegation programs" ON public.delegation_programs FOR SELECT USING (is_active = true);

-- Admin policies (for super_admin role)
CREATE POLICY "Admins can manage team members" ON public.team_members FOR ALL USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'super_admin')
);
CREATE POLICY "Admins can manage gallery images" ON public.gallery_images FOR ALL USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'super_admin')
);
CREATE POLICY "Admins can manage membership plans" ON public.membership_plans FOR ALL USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'super_admin')
);
CREATE POLICY "Admins can manage delegation programs" ON public.delegation_programs FOR ALL USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'super_admin')
);

-- Create updated_at trigger function if not exists
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Add triggers for updated_at
CREATE TRIGGER update_team_members_updated_at BEFORE UPDATE ON public.team_members FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_gallery_images_updated_at BEFORE UPDATE ON public.gallery_images FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_membership_plans_updated_at BEFORE UPDATE ON public.membership_plans FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_delegation_programs_updated_at BEFORE UPDATE ON public.delegation_programs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();