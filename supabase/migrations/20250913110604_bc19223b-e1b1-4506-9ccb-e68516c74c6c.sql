-- Create internships table
CREATE TABLE public.internships (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    location TEXT NOT NULL,
    duration TEXT NOT NULL,
    description TEXT[] NOT NULL DEFAULT '{}'::text[]
);

-- Enable Row Level Security
ALTER TABLE public.internships ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
CREATE POLICY "Allow public read access" 
ON public.internships 
FOR SELECT 
USING (true);

CREATE POLICY "Allow public insert access" 
ON public.internships 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public update access" 
ON public.internships 
FOR UPDATE 
USING (true);

CREATE POLICY "Allow public delete access" 
ON public.internships 
FOR DELETE 
USING (true);

-- Create function to update timestamps (if not exists)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_internships_updated_at
    BEFORE UPDATE ON public.internships
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();