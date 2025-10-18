
-- Create about_info table for managing About section content
CREATE TABLE public.about_info (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  summary TEXT NOT NULL,
  years_experience TEXT NOT NULL DEFAULT '3+',
  projects_completed TEXT NOT NULL DEFAULT '25+',
  technologies_count TEXT NOT NULL DEFAULT '10+',
  client_satisfaction TEXT NOT NULL DEFAULT '100%',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.about_info ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since this is portfolio content)
CREATE POLICY "Allow public read access" 
  ON public.about_info 
  FOR SELECT 
  USING (true);

CREATE POLICY "Allow public insert access" 
  ON public.about_info 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Allow public update access" 
  ON public.about_info 
  FOR UPDATE 
  USING (true);

CREATE POLICY "Allow public delete access" 
  ON public.about_info 
  FOR DELETE 
  USING (true);
