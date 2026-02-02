-- Add logo_negative_url to companies table
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS logo_negative_url TEXT;

-- Add logo_negative_url to user_branding table (legacy/fallback)
ALTER TABLE public.user_branding ADD COLUMN IF NOT EXISTS logo_negative_url TEXT;
