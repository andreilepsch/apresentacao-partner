-- Remover função approve_user duplicada (versão antiga sem company_id)
DROP FUNCTION IF EXISTS public.approve_user(uuid, text);

-- Criar função para buscar nomes de empresas únicos (otimização)
CREATE OR REPLACE FUNCTION public.get_unique_company_names()
RETURNS TABLE(company_name text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT DISTINCT company_name
  FROM public.user_branding
  WHERE company_name IS NOT NULL AND company_name != ''
  ORDER BY company_name;
$$;