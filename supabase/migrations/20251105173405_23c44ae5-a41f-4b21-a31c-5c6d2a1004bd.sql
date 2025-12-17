-- PHASE 4: Atualizar função approve_user para usar companies
CREATE OR REPLACE FUNCTION public.approve_user(
  _user_id uuid, 
  _role text DEFAULT 'partner'::text, 
  _company_id uuid DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Verificar se admin
  IF NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only admins can approve users';
  END IF;
  
  -- Validar role
  IF _role NOT IN ('admin', 'partner', 'user') THEN
    RAISE EXCEPTION 'Invalid role: %', _role;
  END IF;
  
  -- Atualizar status
  UPDATE public.user_account_status
  SET status = 'approved',
      approved_at = now(),
      approved_by = auth.uid()
  WHERE user_id = _user_id;
  
  -- Atribuir role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (_user_id, _role::app_role)
  ON CONFLICT (user_id) DO UPDATE SET role = _role::app_role;
  
  -- Se company_id foi fornecido, vincular usuário à empresa
  IF _company_id IS NOT NULL THEN
    INSERT INTO public.user_companies (user_id, company_id)
    VALUES (_user_id, _company_id)
    ON CONFLICT (user_id) DO UPDATE SET company_id = _company_id;
  END IF;
END;
$$;