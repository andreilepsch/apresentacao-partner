-- =====================================================
-- SCRIPT DE RESET E CRIAÇÃO DO BANCO - AUTORIDADE INVESTIMENTOS
-- Execute este script no SQL Editor do Supabase Studio
-- =====================================================

-- PARTE 1: LIMPEZA (DROP de objetos existentes)
-- =====================================================

-- Desabilitar triggers temporariamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_created_branding ON auth.users;
DROP TRIGGER IF EXISTS validate_email_domain_trigger ON auth.users;
DROP TRIGGER IF EXISTS update_grupos_consorcio_updated_at ON public.grupos_consorcio;
DROP TRIGGER IF EXISTS update_companies_updated_at ON public.companies;

-- Drop functions
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user_branding() CASCADE;
DROP FUNCTION IF EXISTS public.validate_email_domain() CASCADE;
DROP FUNCTION IF EXISTS public.has_role(UUID, public.app_role) CASCADE;
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS public.set_user_company(UUID, UUID) CASCADE;
DROP FUNCTION IF EXISTS public.approve_user(UUID, TEXT, UUID) CASCADE;

-- Drop tables (ordem reversa de dependências)
DROP TABLE IF EXISTS public.analises_mensais CASCADE;
DROP TABLE IF EXISTS public.grupos_consorcio CASCADE;
DROP TABLE IF EXISTS public.user_account_status CASCADE;
DROP TABLE IF EXISTS public.user_companies CASCADE;
DROP TABLE IF EXISTS public.user_branding CASCADE;
DROP TABLE IF EXISTS public.user_roles CASCADE;
DROP TABLE IF EXISTS public.companies CASCADE;
DROP TABLE IF EXISTS public.credit_price CASCADE;
DROP TABLE IF EXISTS public.administradoras_info CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Drop types
DROP TYPE IF EXISTS public.app_role CASCADE;
DROP TYPE IF EXISTS public.account_status CASCADE;

-- =====================================================
-- PARTE 2: CRIAÇÃO DA ESTRUTURA
-- =====================================================

-- Criar tabela de perfis de usuário
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id);

-- Função para criar perfil automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data ->> 'full_name');
  RETURN NEW;
END;
$$;

-- Trigger para criar perfil quando usuário se registra
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Função para validar domínio de email
CREATE OR REPLACE FUNCTION public.validate_email_domain()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.email NOT LIKE '%@autoridadeinvestimentos.com.br' THEN
    RAISE EXCEPTION 'Only @autoridadeinvestimentos.com.br email addresses are allowed';
  END IF;
  RETURN NEW;
END;
$$;

-- Trigger para validar domínio antes da inserção
CREATE TRIGGER validate_email_domain_trigger
  BEFORE INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.validate_email_domain();

-- =====================================================
-- CRIAR ENUM E TABELAS DE ROLES
-- =====================================================

CREATE TYPE public.app_role AS ENUM ('admin', 'mentor', 'partner');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  role public.app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Função para verificar roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- =====================================================
-- CRIAR TABELA DE EMPRESAS
-- =====================================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

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
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON public.companies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- Inserir empresa padrão
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
);

-- Políticas RLS para companies
CREATE POLICY "Admins podem gerenciar todas as empresas"
  ON public.companies
  FOR ALL
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Usuários podem visualizar empresas ativas"
  ON public.companies
  FOR SELECT
  USING (is_active = true);

-- =====================================================
-- USER COMPANIES (vinculação usuário-empresa)
-- =====================================================

CREATE TABLE public.user_companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

ALTER TABLE public.user_companies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own company link"
  ON public.user_companies
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all company links"
  ON public.user_companies
  FOR ALL
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

-- =====================================================
-- USER BRANDING (legacy - pode ser removido depois)
-- =====================================================

CREATE TABLE public.user_branding (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  company_name TEXT NOT NULL DEFAULT 'Autoridade Investimentos',
  logo_url TEXT,
  primary_color TEXT NOT NULL DEFAULT '#2a3d35',
  secondary_color TEXT NOT NULL DEFAULT '#c9a45c',
  accent_color TEXT NOT NULL DEFAULT '#e8f5e8',
  company_tagline TEXT,
  team_photo_url TEXT,
  mentor_photo_url TEXT,
  metrics_json JSONB,
  contact_phone TEXT,
  contact_email TEXT,
  contact_whatsapp TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

ALTER TABLE public.user_branding ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own branding"
  ON public.user_branding
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own branding"
  ON public.user_branding
  FOR UPDATE
  USING (auth.uid() = user_id);

-- =====================================================
-- USER ACCOUNT STATUS
-- =====================================================

CREATE TYPE public.account_status AS ENUM ('pending', 'approved', 'rejected');

CREATE TABLE public.user_account_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  status public.account_status NOT NULL DEFAULT 'pending',
  is_active BOOLEAN NOT NULL DEFAULT false,
  approved_at TIMESTAMPTZ,
  approved_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.user_account_status ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own status"
  ON public.user_account_status
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all statuses"
  ON public.user_account_status
  FOR ALL
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

-- =====================================================
-- CREDIT PRICE (tabela de preços de crédito)
-- =====================================================

CREATE TABLE public.credit_price (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  administradora TEXT NOT NULL DEFAULT 'RODOBENS',
  group_code TEXT NOT NULL,
  prazo_months INTEGER NOT NULL,
  credito NUMERIC NOT NULL,
  parcela NUMERIC NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.credit_price ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view credit prices"
  ON public.credit_price
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage credit prices"
  ON public.credit_price
  FOR ALL
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

-- =====================================================
-- ADMINISTRADORAS INFO
-- =====================================================

CREATE TABLE public.administradoras_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  site_url TEXT,
  telefone TEXT,
  email TEXT,
  endereco TEXT,
  sobre TEXT,
  taxas_info JSONB,
  ranking_abac INTEGER,
  fundacao_ano INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.administradoras_info ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view administradoras"
  ON public.administradoras_info
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage administradoras"
  ON public.administradoras_info
  FOR ALL
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

-- Inserir administradoras padrão
INSERT INTO public.administradoras_info (nome, ranking_abac) 
VALUES 
  ('RODOBENS', 1),
  ('BRADESCO', 2),
  ('ITAU', 3),
  ('PORTO SEGURO', 4),
  ('SANTANDER', 5)
ON CONFLICT (nome) DO NOTHING;

-- =====================================================
-- GRUPOS CONSÓRCIO
-- =====================================================

CREATE TABLE public.grupos_consorcio (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  administradora TEXT NOT NULL,
  numero_grupo TEXT NOT NULL,
  prazo_meses INTEGER NOT NULL,
  capacidade_cotas INTEGER NOT NULL,
  participantes_atual INTEGER NOT NULL,
  data_inicio DATE NOT NULL,
  data_fim DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(administradora, numero_grupo)
);

ALTER TABLE public.grupos_consorcio ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER update_grupos_consorcio_updated_at
  BEFORE UPDATE ON public.grupos_consorcio
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE POLICY "Users can view their own grupos"
  ON public.grupos_consorcio
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own grupos"
  ON public.grupos_consorcio
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own grupos"
  ON public.grupos_consorcio
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own grupos"
  ON public.grupos_consorcio
  FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all grupos"
  ON public.grupos_consorcio
  FOR ALL
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

-- =====================================================
-- ANÁLISES MENSAIS
-- =====================================================

CREATE TABLE public.analises_mensais (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  grupo_id UUID REFERENCES public.grupos_consorcio(id) ON DELETE CASCADE NOT NULL,
  mes_ano TEXT NOT NULL,
  data_analise DATE NOT NULL,
  sorteio_ofertados INTEGER NOT NULL DEFAULT 0,
  sorteio_contemplacoes INTEGER NOT NULL DEFAULT 0,
  sorteio_percentual NUMERIC NOT NULL DEFAULT 0,
  lance_fixo_i_ofertados INTEGER NOT NULL DEFAULT 0,
  lance_fixo_i_contemplacoes INTEGER NOT NULL DEFAULT 0,
  lance_fixo_i_percentual NUMERIC NOT NULL DEFAULT 0,
  lance_fixo_ii_ofertados INTEGER NOT NULL DEFAULT 0,
  lance_fixo_ii_contemplacoes INTEGER NOT NULL DEFAULT 0,
  lance_fixo_ii_percentual NUMERIC NOT NULL DEFAULT 0,
  lance_livre_ofertados INTEGER NOT NULL DEFAULT 0,
  lance_livre_contemplacoes INTEGER NOT NULL DEFAULT 0,
  lance_livre_percentual NUMERIC NOT NULL DEFAULT 0,
  lance_limitado_ofertados INTEGER NOT NULL DEFAULT 0,
  lance_limitado_contemplacoes INTEGER NOT NULL DEFAULT 0,
  lance_limitado_percentual NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(grupo_id, mes_ano)
);

ALTER TABLE public.analises_mensais ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own analises"
  ON public.analises_mensais
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.grupos_consorcio
    WHERE grupos_consorcio.id = analises_mensais.grupo_id
    AND grupos_consorcio.user_id = auth.uid()
  ));

CREATE POLICY "Users can manage their own analises"
  ON public.analises_mensais
  FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.grupos_consorcio
    WHERE grupos_consorcio.id = analises_mensais.grupo_id
    AND grupos_consorcio.user_id = auth.uid()
  ));

CREATE POLICY "Admins can manage all analises"
  ON public.analises_mensais
  FOR ALL
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

-- =====================================================
-- RLS POLICIES PARA USER_ROLES
-- =====================================================

CREATE POLICY "Users can view their own roles"
  ON public.user_roles
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
  ON public.user_roles
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage all roles"
  ON public.user_roles
  FOR ALL
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

-- =====================================================
-- FUNÇÃO APPROVE_USER
-- =====================================================

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
  IF _role NOT IN ('admin', 'partner', 'mentor') THEN
    RAISE EXCEPTION 'Invalid role: %', _role;
  END IF;
  
  -- Atualizar status
  INSERT INTO public.user_account_status (user_id, status, is_active, approved_at, approved_by)
  VALUES (_user_id, 'approved', true, now(), auth.uid())
  ON CONFLICT (user_id) DO UPDATE SET 
    status = 'approved',
    is_active = true,
    approved_at = now(),
    approved_by = auth.uid();
  
  -- Atribuir role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (_user_id, _role::app_role)
  ON CONFLICT (user_id) DO UPDATE SET role = _role::app_role;
  
  -- Vincular à empresa
  INSERT INTO public.user_companies (user_id, company_id)
  VALUES (_user_id, _company_id)
  ON CONFLICT (user_id) DO UPDATE SET company_id = _company_id;
END;
$$;

-- =====================================================
-- STORAGE BUCKET PARA LOGOS
-- =====================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'logos',
  'logos',
  true,
  5242880,
  ARRAY['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg+xml']
)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Public logos are viewable by everyone"
ON storage.objects FOR SELECT
USING (bucket_id = 'logos');

CREATE POLICY "Authenticated users can upload logos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'logos');

CREATE POLICY "Users can update their own logos"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'logos');

CREATE POLICY "Users can delete their own logos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'logos');

-- =====================================================
-- FIM DO SCRIPT
-- =====================================================

-- Mensagem de sucesso
DO $$
BEGIN
  RAISE NOTICE 'Banco de dados criado com sucesso para Autoridade Investimentos!';
  RAISE NOTICE 'Empresa padrão criada: Autoridade Investimentos';
  RAISE NOTICE 'Domínio de email permitido: @autoridadeinvestimentos.com.br';
END $$;
