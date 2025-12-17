-- =====================================================
-- CRIAR PRIMEIRO USUÁRIO ADMIN
-- Execute este script DEPOIS de criar um usuário pelo sistema
-- =====================================================

-- Primeiro, crie um usuário pelo sistema (acesse http://localhost:8080 e faça cadastro)
-- Depois, execute este SQL substituindo 'EMAIL_DO_USUARIO' pelo email cadastrado

-- Opção 1: Se você já sabe o email do usuário
-- Descomente e altere o email abaixo:

/*
DO $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Buscar o ID do usuário pelo email
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'seuemail@autoridadeinvestimentos.com.br';
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Usuário não encontrado. Certifique-se de criar a conta primeiro.';
  END IF;
  
  -- Atribuir role admin
  INSERT INTO public.user_roles (user_id, role)
  VALUES (v_user_id, 'admin')
  ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
  
  -- Aprovar conta
  INSERT INTO public.user_account_status (user_id, status, is_active, approved_at)
  VALUES (v_user_id, 'approved', true, now())
  ON CONFLICT (user_id) DO UPDATE SET status = 'approved', is_active = true, approved_at = now();
  
  -- Vincular à empresa padrão
  INSERT INTO public.user_companies (user_id, company_id)
  VALUES (v_user_id, '00000000-0000-0000-0000-000000000001')
  ON CONFLICT (user_id) DO UPDATE SET company_id = '00000000-0000-0000-0000-000000000001';
  
  RAISE NOTICE 'Usuário % promovido a admin com sucesso!', v_user_id;
END $$;
*/

-- Opção 2: Promover o PRIMEIRO usuário cadastrado a admin automaticamente
-- (use apenas se houver um único usuário no sistema)

DO $$
DECLARE
  v_user_id UUID;
  v_email TEXT;
BEGIN
  -- Buscar o primeiro usuário
  SELECT id, email INTO v_user_id, v_email FROM auth.users ORDER BY created_at ASC LIMIT 1;
  
  IF v_user_id IS NULL THEN
    RAISE NOTICE 'Nenhum usuário encontrado. Crie uma conta primeiro em http://localhost:8080 ou na URL de produção.';
    RETURN;
  END IF;
  
  -- Atribuir role admin
  INSERT INTO public.user_roles (user_id, role)
  VALUES (v_user_id, 'admin')
  ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
  
  -- Aprovar conta
  INSERT INTO public.user_account_status (user_id, status, is_active, approved_at)
  VALUES (v_user_id, 'approved', true, now())
  ON CONFLICT (user_id) DO UPDATE SET status = 'approved', is_active = true, approved_at = now();
  
  -- Vincular à empresa padrão
  INSERT INTO public.user_companies (user_id, company_id)
  VALUES (v_user_id, '00000000-0000-0000-0000-000000000001')
  ON CONFLICT (user_id) DO UPDATE SET company_id = '00000000-0000-0000-0000-000000000001';
  
  RAISE NOTICE 'Usuário % (%) promovido a admin com sucesso!', v_email, v_user_id;
END $$;
