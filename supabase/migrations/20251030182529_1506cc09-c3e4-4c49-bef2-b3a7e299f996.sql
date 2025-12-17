-- Fix security issue: Update search_path for update_updated_at_column function
-- Using CREATE OR REPLACE to update the existing function without breaking dependencies
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;