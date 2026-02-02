-- Migration to update user signup flow
-- 1. Update handle_new_user_branding to assign 'partner' role immediately
-- 2. Keep status as 'pending'

CREATE OR REPLACE FUNCTION public.handle_new_user_branding()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert default branding for new user
  INSERT INTO public.user_branding (user_id, company_name, logo_url, primary_color, secondary_color, accent_color)
  VALUES (
    NEW.id,
    'Autoridade Investimentos',
    '/lovable-uploads/554a2106-221a-4aeb-b66a-a6e72e8541ec.png',
    '#2a3d35',
    '#c9a45c',
    '#e8f5e8'
  );
  
  -- ATRIBUI ROLE 'partner' IMEDIATAMENTE (como solicitado pelo usuário)
  -- mas o status continuará pendente no user_account_status
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'partner'::app_role)
  ON CONFLICT (user_id) DO NOTHING;
  
  -- Criar status pendente
  INSERT INTO public.user_account_status (user_id, status)
  VALUES (NEW.id, 'pending')
  ON CONFLICT (user_id) DO UPDATE SET status = 'pending';
  
  RETURN NEW;
END;
$$;

-- Create an RPC to delete all user data (for the admin area)
CREATE OR REPLACE FUNCTION public.delete_user_completely(_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if admin
  IF NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only admins can delete users';
  END IF;

  -- Delete from public tables (auth.users is harder due to permissions, 
  -- but deleting from profiles and status effectively removes them from lists)
  -- Note: user_roles and user_branding have ON DELETE CASCADE if configured correctly.
  
  DELETE FROM public.user_account_status WHERE user_id = _user_id;
  DELETE FROM public.user_roles WHERE user_id = _user_id;
  DELETE FROM public.user_branding WHERE user_id = _user_id;
  DELETE FROM public.profiles WHERE id = _user_id;
  DELETE FROM public.user_companies WHERE user_id = _user_id;

  -- We cannot easily delete from auth.users via SQL without service_role or more complex setup.
  -- But removing data from these tables prevents them from logging in via our ProtectedRoute.
END;
$$;

NOTIFY pgrst, 'reload schema';
