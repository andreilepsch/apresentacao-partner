-- =====================================================
-- CONFIRMAR EMAIL E PROMOVER A ADMIN
-- Execute no Supabase Studio → SQL Editor
-- =====================================================

-- 1. CONFIRMAR EMAIL DO USUÁRIO
UPDATE auth.users 
SET 
  email_confirmed_at = now(),
  updated_at = now()
WHERE email = 'contato@autoridadeinvestimentos.com.br';

-- 2. PROMOVER A ADMIN
DO $$
DECLARE
  v_user_id UUID;
BEGIN
  SELECT id INTO v_user_id 
  FROM auth.users 
  WHERE email = 'contato@autoridadeinvestimentos.com.br';
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Usuário não encontrado';
  END IF;
  
  -- Atribuir role admin
  INSERT INTO public.user_roles (user_id, role)
  VALUES (v_user_id, 'admin')
  ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
  
  -- Aprovar conta
  INSERT INTO public.user_account_status (user_id, status, is_active, approved_at)
  VALUES (v_user_id, 'approved', true, now())
  ON CONFLICT (user_id) DO UPDATE SET 
    status = 'approved', 
    is_active = true, 
    approved_at = now();
  
  -- Vincular à empresa
  INSERT INTO public.user_companies (user_id, company_id)
  VALUES (v_user_id, '00000000-0000-0000-0000-000000000001')
  ON CONFLICT (user_id) DO UPDATE SET company_id = '00000000-0000-0000-0000-000000000001';
  
  RAISE NOTICE '✅ Email confirmado e usuário promovido a admin!';
END $$;

-- 3. VERIFICAR RESULTADO
SELECT 
  email,
  email_confirmed_at,
  (SELECT role FROM user_roles WHERE user_id = auth.users.id) as role,
  (SELECT status FROM user_account_status WHERE user_id = auth.users.id) as status
FROM auth.users 
WHERE email = 'contato@autoridadeinvestimentos.com.br';
