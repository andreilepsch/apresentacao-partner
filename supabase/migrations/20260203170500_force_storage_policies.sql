-- Enable RLS on storage.objects (it might be disabled)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Ensure 'logos' bucket exists and is public
INSERT INTO storage.buckets (id, name, public)
VALUES ('logos', 'logos', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Drop ALL existing policies for the 'logos' bucket to allow a clean slate
DROP POLICY IF EXISTS "Authenticated users can upload logos" ON storage.objects;
DROP POLICY IF EXISTS "Public can view logos" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own logos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own logos" ON storage.objects;
DROP POLICY IF EXISTS "Logo Access" ON storage.objects;
DROP POLICY IF EXISTS "Logo Insert" ON storage.objects;
DROP POLICY IF EXISTS "Logo Update" ON storage.objects;
DROP POLICY IF EXISTS "Logo Delete" ON storage.objects;

-- Create permissive policies for 'logos' bucket

-- 1. SELECT: Public access to everything in 'logos'
CREATE POLICY "Logos Public Select"
ON storage.objects FOR SELECT
TO public
USING ( bucket_id = 'logos' );

-- 2. INSERT: Authenticated users can upload to 'logos'
CREATE POLICY "Logos Auth Insert"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'logos' );

-- 3. UPDATE: Authenticated users can update files in 'logos' 
-- (Simplified: anyone auth can update any logo to avoid ownership complex issues for now)
CREATE POLICY "Logos Auth Update"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'logos' );

-- 4. DELETE: Authenticated users can delete files in 'logos'
CREATE POLICY "Logos Auth Delete"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'logos' );
