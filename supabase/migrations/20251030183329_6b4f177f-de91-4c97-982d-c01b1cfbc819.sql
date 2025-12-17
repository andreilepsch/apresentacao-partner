-- Add new fields to user_branding table
ALTER TABLE public.user_branding
ADD COLUMN company_tagline TEXT DEFAULT 'Transformando patrimônio em renda através de investimentos imobiliários inteligentes',
ADD COLUMN team_photo_url TEXT,
ADD COLUMN mentor_photo_url TEXT,
ADD COLUMN metrics_json JSONB DEFAULT '[
  {"value": "R$ 2.4Bi", "label": "Em créditos gerenciados"},
  {"value": "15 anos", "label": "De experiência no mercado"},
  {"value": "98%", "label": "De satisfação dos clientes"}
]'::jsonb,
ADD COLUMN contact_phone TEXT,
ADD COLUMN contact_email TEXT,
ADD COLUMN contact_whatsapp TEXT;

-- Create storage bucket for branding images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'branding-images',
  'branding-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for branding images
CREATE POLICY "Authenticated users can view branding images"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'branding-images');

CREATE POLICY "Users can upload their own branding images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'branding-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own branding images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'branding-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own branding images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'branding-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);