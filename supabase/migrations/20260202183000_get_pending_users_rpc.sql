CREATE OR REPLACE FUNCTION public.get_pending_users_data()
RETURNS TABLE (
  user_id uuid,
  status public.account_status,
  created_at timestamptz,
  requested_at timestamptz,
  email varchar,
  full_name text,
  company_name text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    uas.user_id,
    uas.status,
    uas.created_at,
    uas.requested_at,
    au.email::varchar,
    (au.raw_user_meta_data->>'full_name')::text as full_name,
    (au.raw_user_meta_data->>'company_name')::text as company_name
  FROM public.user_account_status uas
  JOIN auth.users au ON uas.user_id = au.id
  WHERE uas.status = 'pending'
  ORDER BY uas.created_at DESC;
END;
$$;
