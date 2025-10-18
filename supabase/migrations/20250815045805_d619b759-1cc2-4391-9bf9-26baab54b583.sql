
-- Add Instagram URL and profile picture URL to personal_info table
ALTER TABLE public.personal_info 
ADD COLUMN instagram_url TEXT,
ADD COLUMN profile_picture_url TEXT;

-- Enable realtime for personal_info table if not already enabled
ALTER TABLE public.personal_info REPLICA IDENTITY FULL;
