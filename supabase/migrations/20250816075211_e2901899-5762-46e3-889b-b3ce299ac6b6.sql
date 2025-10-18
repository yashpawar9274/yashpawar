
-- Create a table for social links/contact information
CREATE TABLE public.social_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  icon_type TEXT NOT NULL DEFAULT 'link',
  is_active BOOLEAN NOT NULL DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
CREATE POLICY "Allow public read access" 
  ON public.social_links 
  FOR SELECT 
  USING (true);

CREATE POLICY "Allow public insert access" 
  ON public.social_links 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Allow public update access" 
  ON public.social_links 
  FOR UPDATE 
  USING (true);

CREATE POLICY "Allow public delete access" 
  ON public.social_links 
  FOR DELETE 
  USING (true);
