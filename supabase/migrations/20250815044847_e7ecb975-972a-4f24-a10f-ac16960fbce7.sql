
-- Create achievements table for managing achievement content
CREATE TABLE public.achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_type TEXT NOT NULL DEFAULT 'award',
  date TEXT NOT NULL,
  category TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since this is portfolio content)
CREATE POLICY "Allow public read access" 
  ON public.achievements 
  FOR SELECT 
  USING (true);

CREATE POLICY "Allow public insert access" 
  ON public.achievements 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Allow public update access" 
  ON public.achievements 
  FOR UPDATE 
  USING (true);

CREATE POLICY "Allow public delete access" 
  ON public.achievements 
  FOR DELETE 
  USING (true);

-- Enable realtime for achievements table
ALTER TABLE public.achievements REPLICA IDENTITY FULL;
