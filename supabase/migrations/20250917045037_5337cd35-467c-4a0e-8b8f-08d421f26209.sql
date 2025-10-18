-- Create reviews table
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name TEXT NOT NULL,
  client_position TEXT,
  client_company TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT NOT NULL,
  project_name TEXT,
  work_duration TEXT,
  client_image_url TEXT,
  is_featured BOOLEAN DEFAULT true,
  is_approved BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (only approved reviews)
CREATE POLICY "Public can view approved reviews" 
ON public.reviews 
FOR SELECT 
USING (is_approved = true);

-- Create policies for admin access (all operations)
CREATE POLICY "Allow public insert access" 
ON public.reviews 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public update access" 
ON public.reviews 
FOR UPDATE 
USING (true);

CREATE POLICY "Allow public delete access" 
ON public.reviews 
FOR DELETE 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_reviews_updated_at
BEFORE UPDATE ON public.reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();