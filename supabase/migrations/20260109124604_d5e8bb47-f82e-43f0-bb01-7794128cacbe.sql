-- Create AI suggested questions table
CREATE TABLE public.ai_suggested_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  icon TEXT DEFAULT 'Sparkles',
  priority INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  target_roles TEXT[] DEFAULT ARRAY['exporter', 'importer', 'buyer', 'seller']::TEXT[],
  target_industries TEXT[] DEFAULT NULL,
  click_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ai_suggested_questions ENABLE ROW LEVEL SECURITY;

-- Anyone can view active questions
CREATE POLICY "Anyone can view active questions"
ON public.ai_suggested_questions
FOR SELECT
USING (is_active = true);

-- Admins can manage all questions (using has_role function)
CREATE POLICY "Admins can manage questions"
ON public.ai_suggested_questions
FOR ALL
USING (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'regional_admin'));

-- Create trigger for updated_at
CREATE TRIGGER update_ai_suggested_questions_updated_at
BEFORE UPDATE ON public.ai_suggested_questions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default questions
INSERT INTO public.ai_suggested_questions (question, category, icon, priority, target_roles) VALUES
('What government schemes are available for electronics exporters?', 'schemes', 'FileText', 10, ARRAY['exporter']::TEXT[]),
('How do I find buyers in Southeast Asia?', 'buyers', 'Globe', 9, ARRAY['exporter', 'seller']::TEXT[]),
('Explain the PLI scheme benefits for my industry', 'schemes', 'TrendingUp', 8, ARRAY['exporter', 'importer']::TEXT[]),
('What documentation is required for exporting textiles to EU?', 'documentation', 'FileText', 7, ARRAY['exporter']::TEXT[]),
('How can I apply for MEIS benefits?', 'schemes', 'Award', 6, ARRAY['exporter']::TEXT[]),
('Find importers looking for organic food products', 'buyers', 'Search', 5, ARRAY['exporter', 'seller']::TEXT[]),
('What are the latest trade policy updates from DGFT?', 'policies', 'Landmark', 4, ARRAY['exporter', 'importer']::TEXT[]),
('Help me understand customs duty exemptions', 'documentation', 'Calculator', 3, ARRAY['importer', 'buyer']::TEXT[]),
('What training programs are available for new exporters?', 'training', 'GraduationCap', 2, ARRAY['exporter']::TEXT[]),
('Connect me with trade consultants for pharmaceutical exports', 'consultants', 'Users', 1, ARRAY['exporter']::TEXT[]);