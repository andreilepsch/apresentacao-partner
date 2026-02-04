ALTER TABLE public.companies
ADD COLUMN IF NOT EXISTS media_json JSONB DEFAULT '[]'::jsonb;
