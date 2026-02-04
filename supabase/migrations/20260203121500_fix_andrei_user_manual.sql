DO $$
DECLARE
    v_user_email text := 'andrei.lepsch@gmail.com';
    v_user_id uuid;
    v_correct_company_id uuid;
    v_count integer;
BEGIN
    -- 1. Identificar o ID do usuário pelo email
    SELECT id INTO v_user_id FROM auth.users WHERE email = v_user_email;
    
    IF v_user_id IS NULL THEN 
        RAISE NOTICE 'Usuário % não encontrado. Nenhuma ação realizada.', v_user_email;
        RETURN; 
    END IF;

    RAISE NOTICE 'Usuário encontrado: % (ID: %)', v_user_email, v_user_id;

    -- 2. Encontrar a empresa correta ("Empresa do Andrei")
    -- Se houver duplicada, pegamos a mais recente ou qualquer uma
    SELECT id INTO v_correct_company_id 
    FROM public.companies 
    WHERE company_name = 'Empresa do Andrei' 
    LIMIT 1;
    
    -- Se não existir, cria a empresa
    IF v_correct_company_id IS NULL THEN
        RAISE NOTICE 'Empresa "Empresa do Andrei" não encontrada. Criando...';
        INSERT INTO public.companies (company_name, is_active) 
        VALUES ('Empresa do Andrei', true) 
        RETURNING id INTO v_correct_company_id;
    ELSE
        RAISE NOTICE 'Empresa "Empresa do Andrei" encontrada: %', v_correct_company_id;
    END IF;

    -- 3. REMOVER TODAS as associações existentes de empresa para este usuário
    -- Isso elimina duplicatas, links errados, etc.
    DELETE FROM public.user_companies WHERE user_id = v_user_id;
    RAISE NOTICE 'Associações anteriores em user_companies removidas.';

    -- 4. Criar UMA ÚNICA associação correta
    INSERT INTO public.user_companies (user_id, company_id) 
    VALUES (v_user_id, v_correct_company_id);
    RAISE NOTICE 'Nova associação criada em user_companies.';

    -- 5. Corrigir tabela legada user_branding
    DELETE FROM public.user_branding WHERE user_id = v_user_id;
    INSERT INTO public.user_branding (user_id, company_name) 
    VALUES (v_user_id, 'Empresa do Andrei');
    RAISE NOTICE 'Tabela user_branding corrigida.';

    -- 6. Atualizar metadados do usuário para refletir a empresa correta
    UPDATE auth.users
    SET raw_user_meta_data = 
        COALESCE(raw_user_meta_data, '{}'::jsonb) || 
        jsonb_build_object('company_id', v_correct_company_id, 'company_name', 'Empresa do Andrei')
    WHERE id = v_user_id;
    RAISE NOTICE 'Metadados do usuário atualizados.';

    -- 7. Verificação final
    SELECT count(*) INTO v_count FROM public.user_companies WHERE user_id = v_user_id;
    RAISE NOTICE 'Contagem final de links em user_companies para o usuário: %', v_count;

END $$;
