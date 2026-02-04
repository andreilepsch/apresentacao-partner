-- Add RLS policies to allow partners to update their own company details

-- 1. Enable RLS on companies table (just in case)
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing update policy if it exists (to avoid conflicts)
DROP POLICY IF EXISTS "Users can update their own company" ON public.companies;
DROP POLICY IF EXISTS "Admins can update all companies" ON public.companies;

-- 3. Create policy for Admins (Full Access)
CREATE POLICY "Admins can update all companies"
ON public.companies
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  )
);

-- 4. Create policy for Partners (Update only their linked company)
CREATE POLICY "Users can update their own company"
ON public.companies
FOR UPDATE
TO authenticated
USING (
  id IN (
    SELECT company_id 
    FROM public.user_companies 
    WHERE user_id = auth.uid()
  )
)
WITH CHECK (
  id IN (
    SELECT company_id 
    FROM public.user_companies 
    WHERE user_id = auth.uid()
  )
);

-- 5. Ensure Select policies exist
DROP POLICY IF EXISTS "Public read access to companies" ON public.companies;
CREATE POLICY "Public read access to companies"
ON public.companies
FOR SELECT
TO public
USING (true);
