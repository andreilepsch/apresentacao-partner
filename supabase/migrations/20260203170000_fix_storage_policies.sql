-- Ensure 'logos' bucket exists and is public
INSERT INTO storage.buckets (id, name, public)
VALUES ('logos', 'logos', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Authenticated users can upload logos" ON storage.objects;
DROP POLICY IF EXISTS "Public can view logos" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own logos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own logos" ON storage.objects;
DROP POLICY IF EXISTS "Give users access to own folder 1bk0zba_0" ON storage.objects;
DROP POLICY IF EXISTS "Give users access to own folder 1bk0zba_1" ON storage.objects;
DROP POLICY IF EXISTS "Give users access to own folder 1bk0zba_2" ON storage.objects;
DROP POLICY IF EXISTS "Give users access to own folder 1bk0zba_3" ON storage.objects;


-- Policy to allow authenticated users to upload files to 'logos' bucket
-- Allowing upload to any path in the bucket for now to avoid complexity with folder structures
CREATE POLICY "Authenticated users can upload logos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'logos' );

-- Policy to allow public to view files in 'logos' bucket
CREATE POLICY "Public can view logos"
ON storage.objects FOR SELECT
TO public
USING ( bucket_id = 'logos' );

-- Policy to allow users to update/delete their own files
CREATE POLICY "Users can update their own logos"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'logos' AND auth.uid() = owner );

CREATE POLICY "Users can delete their own logos"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'logos' AND auth.uid() = owner );
