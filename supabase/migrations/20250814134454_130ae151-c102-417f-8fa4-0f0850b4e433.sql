
-- Create table for personal information
CREATE TABLE public.personal_info (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  email TEXT,
  phone TEXT,
  location TEXT,
  github_url TEXT,
  linkedin_url TEXT,
  twitter_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for projects
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  technologies TEXT[] NOT NULL DEFAULT '{}',
  image_url TEXT,
  github_url TEXT,
  live_url TEXT,
  order_index INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for work experience
CREATE TABLE public.experiences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT NOT NULL,
  duration TEXT NOT NULL,
  description TEXT[] NOT NULL DEFAULT '{}',
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for education
CREATE TABLE public.education (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  degree TEXT NOT NULL,
  institution TEXT NOT NULL,
  location TEXT NOT NULL,
  duration TEXT NOT NULL,
  grade TEXT,
  description TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for certificates
CREATE TABLE public.certificates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  issuer TEXT NOT NULL,
  date TEXT NOT NULL,
  credential_id TEXT,
  verify_url TEXT,
  description TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security (RLS) - making these tables public for now
-- You can add authentication later if needed
ALTER TABLE public.personal_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public access (you can modify these later for authentication)
CREATE POLICY "Allow public read access" ON public.personal_info FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON public.personal_info FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON public.personal_info FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access" ON public.personal_info FOR DELETE USING (true);

CREATE POLICY "Allow public read access" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON public.projects FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON public.projects FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access" ON public.projects FOR DELETE USING (true);

CREATE POLICY "Allow public read access" ON public.experiences FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON public.experiences FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON public.experiences FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access" ON public.experiences FOR DELETE USING (true);

CREATE POLICY "Allow public read access" ON public.education FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON public.education FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON public.education FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access" ON public.education FOR DELETE USING (true);

CREATE POLICY "Allow public read access" ON public.certificates FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON public.certificates FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON public.certificates FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access" ON public.certificates FOR DELETE USING (true);

-- Enable realtime for all tables
ALTER TABLE public.personal_info REPLICA IDENTITY FULL;
ALTER TABLE public.projects REPLICA IDENTITY FULL;
ALTER TABLE public.experiences REPLICA IDENTITY FULL;
ALTER TABLE public.education REPLICA IDENTITY FULL;
ALTER TABLE public.certificates REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.personal_info;
ALTER PUBLICATION supabase_realtime ADD TABLE public.projects;
ALTER PUBLICATION supabase_realtime ADD TABLE public.experiences;
ALTER PUBLICATION supabase_realtime ADD TABLE public.education;
ALTER PUBLICATION supabase_realtime ADD TABLE public.certificates;

-- Insert default personal info
INSERT INTO public.personal_info (name, title, subtitle, email, github_url, linkedin_url, twitter_url) 
VALUES (
  'Yash Pawar',
  'Full Stack Developer & Software Engineer',
  'Passionate about creating exceptional digital experiences with modern technologies. Specialized in React, Node.js, and cloud solutions.',
  'yash@example.com',
  'https://github.com/yashpawar',
  'https://linkedin.com/in/yashpawar',
  'https://twitter.com/yashpawar'
);
