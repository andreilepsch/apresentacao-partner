-- Criar tabela de empresas
CREATE TABLE public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  logo_url TEXT,
  primary_color TEXT NOT NULL DEFAULT '#1A4764',
  secondary_color TEXT NOT NULL DEFAULT '#c9a45c',
  accent_color TEXT NOT NULL DEFAULT '#e8f5e8',
  company_tagline TEXT,
  team_photo_url TEXT,
  mentor_photo_url TEXT,
  metrics_json JSONB DEFAULT '[
    {"label": "Em créditos gerenciados", "value": "R$ 2.4Bi"},
    {"label": "De experiência no mercado", "value": "15 anos"},
    {"label": "De satisfação dos clientes", "value": "98%"}
  ]'::jsonb,
  contact_phone TEXT,
  contact_email TEXT,
  contact_whatsapp TEXT,
  feedback_question TEXT DEFAULT 'De 0 a 10 quanto você gostou do nosso atendimento?',
  authority_quote TEXT DEFAULT 'A credibilidade conquistada junto à mídia especializada reflete nosso compromisso com a transparência e excelência nos resultados.',
  authority_quote_author TEXT DEFAULT 'CEO',
  authority_quote_role TEXT DEFAULT 'CEO da Empresa',
  contract_company_name TEXT DEFAULT 'EMPRESA LTDA',
  contract_cnpj TEXT DEFAULT '00.000.000/0001-00',
  contract_address TEXT DEFAULT 'Endereço da empresa',
  contract_city TEXT DEFAULT 'Cidade, Estado',
  contract_cep TEXT DEFAULT '00000-000',
  contract_website TEXT DEFAULT 'www.empresa.com.br',
  pdf_intro_text TEXT DEFAULT 'Nossa empresa oferece consultoria especializada em investimentos imobiliários.',
  pdf_background_color TEXT NOT NULL DEFAULT '#193D32',
  pdf_accent_color TEXT NOT NULL DEFAULT '#B78D4A',
  pdf_logo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON public.companies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Habilitar RLS
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Admins podem gerenciar todas as empresas"
  ON public.companies
  FOR ALL
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Usuários podem visualizar sua empresa"
  ON public.companies
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'company_id' = companies.id::text
    )
  );

-- Comentários
COMMENT ON TABLE public.companies IS 'Tabela de empresas/organizações do sistema';
COMMENT ON COLUMN public.companies.id IS 'ID único da empresa';
COMMENT ON COLUMN public.companies.company_name IS 'Nome fantasia da empresa';

-- Função para atualizar company_id no metadata do usuário
CREATE OR REPLACE FUNCTION public.set_user_company(
  _user_id UUID,
  _company_id UUID
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Apenas admins podem atribuir empresas
  IF NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Apenas admins podem vincular usuários a empresas';
  END IF;

  -- Atualizar raw_user_meta_data
  UPDATE auth.users
  SET raw_user_meta_data = 
    COALESCE(raw_user_meta_data, '{}'::jsonb) || 
    jsonb_build_object('company_id', _company_id::text)
  WHERE id = _user_id;
END;
$$;

COMMENT ON FUNCTION public.set_user_company IS 'Função para admins vincularem usuário a uma empresa';

-- Criar empresa "Autoridade Investimentos" (empresa padrão)
INSERT INTO public.companies (
  id,
  company_name,
  logo_url,
  primary_color,
  secondary_color,
  accent_color,
  company_tagline,
  pdf_background_color,
  pdf_accent_color
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Autoridade Investimentos',
  '/lovable-uploads/logo-partner-white-text.png',
  '#1A4764',
  '#c9a45c',
  '#e8f5e8',
  'Transformando patrimônio em renda através de investimentos imobiliários inteligentes',
  '#193D32',
  '#B78D4A'
) ON CONFLICT (id) DO NOTHING;

-- Vincular todos os usuários existentes à empresa padrão
UPDATE auth.users
SET raw_user_meta_data = 
  COALESCE(raw_user_meta_data, '{}'::jsonb) || 
  jsonb_build_object('company_id', '00000000-0000-0000-0000-000000000001');

-- Atualizar função approve_user para incluir company_id
CREATE OR REPLACE FUNCTION public.approve_user(
  _user_id UUID,
  _role TEXT DEFAULT 'partner',
  _company_id UUID DEFAULT '00000000-0000-0000-0000-000000000001'
)
RETURNS VOID
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
  
  -- Atribuir empresa
  UPDATE auth.users
  SET raw_user_meta_data = 
    COALESCE(raw_user_meta_data, '{}'::jsonb) || 
    jsonb_build_object('company_id', _company_id::text)
  WHERE id = _user_id;
END;
$$;