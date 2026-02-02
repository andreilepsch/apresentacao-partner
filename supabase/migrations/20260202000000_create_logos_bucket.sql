-- Create storage bucket for logos if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'logos',
  'logos',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for logos
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE policyname = 'Public Access to logos'
    ) THEN
        CREATE POLICY "Public Access to logos"
        ON storage.objects FOR SELECT
        TO public
        USING (bucket_id = 'logos');
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated users can upload logos'
    ) THEN
        CREATE POLICY "Authenticated users can upload logos"
        ON storage.objects FOR INSERT
        TO authenticated
        WITH CHECK (bucket_id = 'logos');
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated users can update logos'
    ) THEN
        CREATE POLICY "Authenticated users can update logos"
        ON storage.objects FOR UPDATE
        TO authenticated
        USING (bucket_id = 'logos');
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated users can delete logos'
    ) THEN
        CREATE POLICY "Authenticated users can delete logos"
        ON storage.objects FOR DELETE
        TO authenticated
        USING (bucket_id = 'logos');
    END IF;
END
$$;
