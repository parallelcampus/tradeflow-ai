
-- Create consultant profiles table
CREATE TABLE public.consultants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  bio TEXT,
  headline TEXT,
  years_experience INTEGER DEFAULT 0,
  hourly_rate DECIMAL(10,2),
  currency TEXT DEFAULT 'USD',
  languages TEXT[] DEFAULT ARRAY['English'],
  location TEXT,
  country TEXT,
  timezone TEXT,
  linkedin_url TEXT,
  website_url TEXT,
  certifications TEXT[],
  education TEXT[],
  is_verified BOOLEAN DEFAULT false,
  is_available BOOLEAN DEFAULT true,
  total_consultations INTEGER DEFAULT 0,
  average_rating DECIMAL(3,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Industries lookup table
CREATE TABLE public.industries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Consultant industries (many-to-many)
CREATE TABLE public.consultant_industries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultant_id UUID REFERENCES public.consultants(id) ON DELETE CASCADE NOT NULL,
  industry_id UUID REFERENCES public.industries(id) ON DELETE CASCADE NOT NULL,
  expertise_level TEXT CHECK (expertise_level IN ('beginner', 'intermediate', 'expert')) DEFAULT 'intermediate',
  UNIQUE(consultant_id, industry_id)
);

-- Consultant services/specializations
CREATE TABLE public.consultant_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultant_id UUID REFERENCES public.consultants(id) ON DELETE CASCADE NOT NULL,
  service_name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  duration_minutes INTEGER DEFAULT 60,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Consultant success stories
CREATE TABLE public.consultant_success_stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultant_id UUID REFERENCES public.consultants(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  client_name TEXT,
  client_company TEXT,
  industry TEXT,
  challenge TEXT,
  solution TEXT,
  results TEXT,
  metrics JSONB,
  testimonial_quote TEXT,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Consultant reviews
CREATE TABLE public.consultant_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultant_id UUID REFERENCES public.consultants(id) ON DELETE CASCADE NOT NULL,
  reviewer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewer_name TEXT NOT NULL,
  reviewer_company TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  title TEXT,
  review_text TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Consultant availability slots
CREATE TABLE public.consultant_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultant_id UUID REFERENCES public.consultants(id) ON DELETE CASCADE NOT NULL,
  day_of_week INTEGER CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_recurring BOOLEAN DEFAULT true,
  specific_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Meeting bookings
CREATE TABLE public.consultant_meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultant_id UUID REFERENCES public.consultants(id) ON DELETE CASCADE NOT NULL,
  client_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_company TEXT,
  service_id UUID REFERENCES public.consultant_services(id) ON DELETE SET NULL,
  meeting_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  status TEXT CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')) DEFAULT 'pending',
  meeting_type TEXT CHECK (meeting_type IN ('video', 'phone', 'in_person')) DEFAULT 'video',
  meeting_link TEXT,
  notes TEXT,
  total_cost DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.consultants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.industries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultant_industries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultant_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultant_success_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultant_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultant_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultant_meetings ENABLE ROW LEVEL SECURITY;

-- Consultants policies (public read, own write)
CREATE POLICY "Anyone can view consultants" ON public.consultants FOR SELECT USING (true);
CREATE POLICY "Consultants can update own profile" ON public.consultants FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Authenticated users can create consultant profile" ON public.consultants FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Industries policies (public read)
CREATE POLICY "Anyone can view industries" ON public.industries FOR SELECT USING (true);

-- Consultant industries policies
CREATE POLICY "Anyone can view consultant industries" ON public.consultant_industries FOR SELECT USING (true);
CREATE POLICY "Consultants can manage own industries" ON public.consultant_industries FOR ALL 
  USING (consultant_id IN (SELECT id FROM public.consultants WHERE user_id = auth.uid()));

-- Services policies
CREATE POLICY "Anyone can view services" ON public.consultant_services FOR SELECT USING (true);
CREATE POLICY "Consultants can manage own services" ON public.consultant_services FOR ALL 
  USING (consultant_id IN (SELECT id FROM public.consultants WHERE user_id = auth.uid()));

-- Success stories policies
CREATE POLICY "Anyone can view success stories" ON public.consultant_success_stories FOR SELECT USING (true);
CREATE POLICY "Consultants can manage own success stories" ON public.consultant_success_stories FOR ALL 
  USING (consultant_id IN (SELECT id FROM public.consultants WHERE user_id = auth.uid()));

-- Reviews policies
CREATE POLICY "Anyone can view reviews" ON public.consultant_reviews FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create reviews" ON public.consultant_reviews FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

-- Availability policies
CREATE POLICY "Anyone can view availability" ON public.consultant_availability FOR SELECT USING (true);
CREATE POLICY "Consultants can manage own availability" ON public.consultant_availability FOR ALL 
  USING (consultant_id IN (SELECT id FROM public.consultants WHERE user_id = auth.uid()));

-- Meetings policies
CREATE POLICY "Users can view own meetings" ON public.consultant_meetings FOR SELECT 
  USING (client_id = auth.uid() OR consultant_id IN (SELECT id FROM public.consultants WHERE user_id = auth.uid()));
CREATE POLICY "Authenticated users can book meetings" ON public.consultant_meetings FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can update own meetings" ON public.consultant_meetings FOR UPDATE 
  USING (client_id = auth.uid() OR consultant_id IN (SELECT id FROM public.consultants WHERE user_id = auth.uid()));

-- Insert default industries
INSERT INTO public.industries (name, slug, icon) VALUES
  ('Textiles & Apparel', 'textiles', 'shirt'),
  ('Electronics & Technology', 'electronics', 'cpu'),
  ('Food & Beverages', 'food', 'utensils'),
  ('Pharmaceuticals', 'pharma', 'pill'),
  ('Automotive', 'automotive', 'car'),
  ('Agriculture', 'agriculture', 'wheat'),
  ('Chemicals', 'chemicals', 'flask-conical'),
  ('Machinery & Equipment', 'machinery', 'cog'),
  ('Gems & Jewelry', 'jewelry', 'gem'),
  ('Handicrafts', 'handicrafts', 'palette'),
  ('Leather Goods', 'leather', 'briefcase'),
  ('Steel & Metals', 'metals', 'hammer'),
  ('Plastics', 'plastics', 'package'),
  ('Marine Products', 'marine', 'fish'),
  ('IT & Software', 'it', 'code');

-- Trigger for updated_at
CREATE TRIGGER update_consultants_updated_at
  BEFORE UPDATE ON public.consultants
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_meetings_updated_at
  BEFORE UPDATE ON public.consultant_meetings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
