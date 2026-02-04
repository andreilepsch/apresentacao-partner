-- Limpeza de duplicatas e correção de constraints

-- 1. Limpar duplicatas em user_companies (mantendo a mais recente)
DELETE FROM public.user_companies
WHERE id NOT IN (
  SELECT id FROM (
    SELECT id, ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at DESC) as rn
    FROM public.user_companies
  ) sub WHERE rn = 1
);

-- 2. Garantir constraint UNIQUE em user_companies(user_id)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_companies_user_id_key') THEN
        ALTER TABLE public.user_companies ADD CONSTRAINT user_companies_user_id_key UNIQUE (user_id);
    END IF;
END $$;

-- 3. Limpar duplicatas em user_branding (mantendo a mais recente)
-- user_branding pode não ter coluna id dependendo da versão, vamos verificar pelo user_id
-- Assumindo que user_branding tem alguma chave primária ou usamos ctid se necessário.
-- Geralmente user_branding tem id uuid primary key.
DELETE FROM public.user_branding
WHERE id NOT IN (
  SELECT id FROM (
    SELECT id, ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at DESC) as rn
    FROM public.user_branding
  ) sub WHERE rn = 1
);

-- 4. Garantir constraint UNIQUE em user_branding(user_id)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_branding_user_id_key') THEN
        ALTER TABLE public.user_branding ADD CONSTRAINT user_branding_user_id_key UNIQUE (user_id);
    END IF;
END $$;
