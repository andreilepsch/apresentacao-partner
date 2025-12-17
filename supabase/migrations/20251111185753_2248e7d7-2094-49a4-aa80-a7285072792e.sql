-- Create function to get user role bypassing RLS
CREATE OR REPLACE FUNCTION public.get_user_role(target_user_id uuid)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = target_user_id
  LIMIT 1
$$;