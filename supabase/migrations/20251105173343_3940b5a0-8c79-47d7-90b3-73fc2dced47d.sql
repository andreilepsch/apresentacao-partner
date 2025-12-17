-- PHASE 1: Criar infraestrutura
-- Criar tabela user_companies para mapear usuários a empresas
CREATE TABLE IF NOT EXISTS public.user_companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id) -- Um usuário só pode pertencer a uma empresa
);

-- Habilitar RLS em user_companies
ALTER TABLE public.user_companies ENABLE ROW LEVEL SECURITY;

-- RLS policies para user_companies
CREATE POLICY "Users can view their own company mapping"
ON public.user_companies
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all company mappings"
ON public.user_companies
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage all company mappings"
ON public.user_companies
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

-- Atualizar RLS policies de companies para permitir usuários verem sua empresa
DROP POLICY IF EXISTS "Usuários podem visualizar sua empresa" ON public.companies;

CREATE POLICY "Users can view their associated company"
ON public.companies
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_companies
    WHERE user_companies.company_id = companies.id
    AND user_companies.user_id = auth.uid()
  )
);

-- Trigger para updated_at em user_companies
CREATE TRIGGER update_user_companies_updated_at
BEFORE UPDATE ON public.user_companies
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- PHASE 2: Migrar dados existentes
-- Inserir empresas únicas de user_branding em companies
INSERT INTO public.companies (
  id,
  company_name,
  logo_url,
  primary_color,
  secondary_color,
  accent_color,
  company_tagline,
  team_photo_url,
  mentor_photo_url,
  metrics_json,
  contact_phone,
  contact_email,
  contact_whatsapp,
  feedback_question,
  authority_quote,
  authority_quote_author,
  authority_quote_role,
  contract_company_name,
  contract_cnpj,
  contract_address,
  contract_city,
  contract_cep,
  contract_website,
  pdf_intro_text,
  pdf_background_color,
  pdf_accent_color,
  pdf_logo_url
)
SELECT DISTINCT ON (company_name)
  gen_random_uuid(),
  company_name,
  logo_url,
  primary_color,
  secondary_color,
  accent_color,
  company_tagline,
  team_photo_url,
  mentor_photo_url,
  metrics_json,
  contact_phone,
  contact_email,
  contact_whatsapp,
  feedback_question,
  authority_quote,
  authority_quote_author,
  authority_quote_role,
  contract_company_name,
  contract_cnpj,
  contract_address,
  contract_city,
  contract_cep,
  contract_website,
  pdf_intro_text,
  pdf_background_color,
  pdf_accent_color,
  pdf_logo_url
FROM public.user_branding
WHERE company_name IS NOT NULL
ON CONFLICT DO NOTHING;

-- Mapear usuários existentes para empresas baseado em user_branding
INSERT INTO public.user_companies (user_id, company_id)
SELECT DISTINCT 
  ub.user_id,
  c.id
FROM public.user_branding ub
JOIN public.companies c ON c.company_name = ub.company_name
WHERE ub.user_id IS NOT NULL
ON CONFLICT (user_id) DO NOTHING;