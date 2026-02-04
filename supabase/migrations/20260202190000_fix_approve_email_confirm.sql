CREATE OR REPLACE FUNCTION public.approve_user_with_company(
  _user_id uuid,
  _company_name text,
  _role text DEFAULT 'partner'
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_company_id uuid;
BEGIN
  -- 0. Verificar permissões (apenas admin pode executar)
  IF NOT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Acesso negado. Apenas administradores podem aprovar usuários.';
  END IF;

  -- 1. Verifica/Cria a Empresa
  SELECT id INTO v_company_id FROM public.companies WHERE company_name = _company_name LIMIT 1;
  
  IF v_company_id IS NULL THEN
    INSERT INTO public.companies (company_name, is_active)
    VALUES (_company_name, true)
    RETURNING id INTO v_company_id;
  END IF;

  -- 2. Atualiza Status para Aprovado
  UPDATE public.user_account_status
  SET status = 'approved',
      approved_at = now(),
      approved_by = auth.uid(),
      is_active = true
  WHERE user_id = _user_id;

  -- 3. Atribui a Role
  DELETE FROM public.user_roles WHERE user_id = _user_id;
  INSERT INTO public.user_roles (user_id, role)
  VALUES (_user_id, _role::app_role);

  -- 4. Vincula Usuário à Empresa
  -- Agora forçamos a atualização se o usuário já tiver uma empresa vinculada
  BEGIN
    INSERT INTO public.user_companies (user_id, company_id)
    VALUES (_user_id, v_company_id)
    ON CONFLICT (user_id) 
    DO UPDATE SET company_id = EXCLUDED.company_id, updated_at = now();
  EXCEPTION WHEN others THEN
    -- Fallback se constraint não existir / for diferente
    IF EXISTS (SELECT 1 FROM public.user_companies WHERE user_id = _user_id) THEN
        UPDATE public.user_companies SET company_id = v_company_id, updated_at = now() WHERE user_id = _user_id;
    ELSE
        INSERT INTO public.user_companies (user_id, company_id) VALUES (_user_id, v_company_id);
    END IF;
  END;

  -- 5. Atualiza/Cria Branding Inicial
  BEGIN
      INSERT INTO public.user_branding (user_id, company_name)
      VALUES (_user_id, _company_name)
      ON CONFLICT (user_id) 
      DO UPDATE SET company_name = EXCLUDED.company_name;
  EXCEPTION WHEN others THEN
      IF EXISTS (SELECT 1 FROM public.user_branding WHERE user_id = _user_id) THEN
          UPDATE public.user_branding SET company_name = _company_name WHERE user_id = _user_id;
      ELSE
          INSERT INTO public.user_branding (user_id, company_name) VALUES (_user_id, _company_name);
      END IF;
  END;

  -- 6. FORÇAR CONFIRMAÇÃO DE EMAIL (Ativo)
  UPDATE auth.users
  SET email_confirmed_at = COALESCE(email_confirmed_at, now()),
      last_sign_in_at = now(),
      raw_app_meta_data = raw_app_meta_data || '{"provider": "email", "providers": ["email"]}'::jsonb
  WHERE id = _user_id;
  
END;
$$;
