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

-- Políticas RLS
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
  FOR EACH ROW EXECUTE FUNCTION public.validate_email_domain();-- Corrigir search_path da função handle_new_user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data ->> 'full_name');
  RETURN NEW;
END;
$$;-- Corrigir search_path da função validate_email_domain
CREATE OR REPLACE FUNCTION public.validate_email_domain()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = 'public'
AS $$
BEGIN
  IF NEW.email NOT LIKE '%@autoridadeinvestimentos.com.br' THEN
    RAISE EXCEPTION 'Only @autoridadeinvestimentos.com.br email addresses are allowed';
  END IF;
  RETURN NEW;
END;
$$;-- Atualizar função de validação para aceitar todos os domínios do Grupo Referência
CREATE OR REPLACE FUNCTION public.validate_email_domain()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Lista dos domínios permitidos do Grupo Referência
  IF NEW.email NOT LIKE '%@autoridadeinvestimentos.com.br' 
     AND NEW.email NOT LIKE '%@bankreferencia.com'
     AND NEW.email NOT LIKE '%@gruporeferencia.com'
     AND NEW.email NOT LIKE '%@referenciacapital.me'
     AND NEW.email NOT LIKE '%@referenciacorporate.com'
     AND NEW.email NOT LIKE '%@referenciaholding.com.br'
     AND NEW.email NOT LIKE '%@referenciaimob.com.br' THEN
    RAISE EXCEPTION 'Apenas emails dos domínios do Grupo Referência são permitidos';
  END IF;
  RETURN NEW;
END;
$function$;-- Update profiles RLS policy to include WITH CHECK clause for defense-in-depth
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id) 
WITH CHECK (auth.uid() = id);-- Create credit_price table
CREATE TABLE public.credit_price (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_code INTEGER NOT NULL,
  prazo_months INTEGER NOT NULL,
  credito NUMERIC NOT NULL,
  parcela NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.credit_price ENABLE ROW LEVEL SECURITY;

-- Create policy for SELECT (anonymous users)
CREATE POLICY "Allow anonymous select on credit_price" 
ON public.credit_price 
FOR SELECT 
USING (true);

-- Create policy for INSERT (service role only)
CREATE POLICY "Allow service role insert on credit_price" 
ON public.credit_price 
FOR INSERT 
WITH CHECK (auth.role() = 'service_role');

-- Create policy for UPDATE (service role only)
CREATE POLICY "Allow service role update on credit_price" 
ON public.credit_price 
FOR UPDATE 
USING (auth.role() = 'service_role');

-- Create policy for DELETE (service role only)
CREATE POLICY "Allow service role delete on credit_price" 
ON public.credit_price 
FOR DELETE 
USING (auth.role() = 'service_role');

-- Insert data for Grupo 6660 — Prazo 182 meses
INSERT INTO public.credit_price (group_code, prazo_months, credito, parcela) VALUES
(6660, 182, 120000, 558.53),
(6660, 182, 130000, 605.07),
(6660, 182, 140000, 651.62),
(6660, 182, 150000, 698.16),
(6660, 182, 160000, 744.70),
(6660, 182, 170000, 791.25),
(6660, 182, 180000, 837.79),
(6660, 182, 190000, 884.34),
(6660, 182, 200000, 930.88),
(6660, 182, 210000, 977.42),
(6660, 182, 220000, 1023.97);

-- Insert data for Grupo 6601 — Prazo 180 meses
INSERT INTO public.credit_price (group_code, prazo_months, credito, parcela) VALUES
(6601, 180, 240000, 1114.08),
(6601, 180, 260000, 1205.92),
(6601, 180, 280000, 1299.76),
(6601, 180, 300000, 1392.60),
(6601, 180, 320000, 1485.44),
(6601, 180, 340000, 1521.86),
(6601, 180, 360000, 1671.12),
(6601, 180, 380000, 1763.96),
(6601, 180, 400000, 1856.80);

-- Insert data for Grupo 6600 — Prazo 160 meses
INSERT INTO public.credit_price (group_code, prazo_months, credito, parcela) VALUES
(6600, 160, 200000, 1019.24),
(6600, 160, 220000, 1121.16),
(6600, 160, 250000, 1274.05),
(6600, 160, 260000, 1325.01),
(6600, 160, 280000, 1426.94),
(6600, 160, 300000, 1521.16),
(6600, 160, 320000, 1630.78),
(6600, 160, 340000, 1732.71),
(6600, 160, 360000, 1834.63),
(6600, 160, 380000, 1936.56),
(6600, 160, 400000, 2038.48);-- Create table for consortium groups
CREATE TABLE public.grupos_consorcio (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  administradora TEXT NOT NULL,
  numero_grupo TEXT NOT NULL,
  prazo_meses INTEGER NOT NULL,
  capacidade_cotas INTEGER NOT NULL,
  data_inicio DATE NOT NULL,
  data_fim DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for monthly analyses
CREATE TABLE public.analises_mensais (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  grupo_id UUID NOT NULL REFERENCES public.grupos_consorcio(id) ON DELETE CASCADE,
  mes_ano TEXT NOT NULL,
  data_analise DATE NOT NULL,
  sorteio_ofertados INTEGER NOT NULL DEFAULT 0,
  sorteio_contemplacoes INTEGER NOT NULL DEFAULT 0,
  sorteio_percentual NUMERIC(5,2) NOT NULL DEFAULT 0,
  lance_fixo_i_ofertados INTEGER NOT NULL DEFAULT 0,
  lance_fixo_i_contemplacoes INTEGER NOT NULL DEFAULT 0,
  lance_fixo_i_percentual NUMERIC(5,2) NOT NULL DEFAULT 0,
  lance_fixo_ii_ofertados INTEGER NOT NULL DEFAULT 0,
  lance_fixo_ii_contemplacoes INTEGER NOT NULL DEFAULT 0,
  lance_fixo_ii_percentual NUMERIC(5,2) NOT NULL DEFAULT 0,
  lance_livre_ofertados INTEGER NOT NULL DEFAULT 0,
  lance_livre_contemplacoes INTEGER NOT NULL DEFAULT 0,
  lance_livre_percentual NUMERIC(5,2) NOT NULL DEFAULT 0,
  lance_limitado_ofertados INTEGER NOT NULL DEFAULT 0,
  lance_limitado_contemplacoes INTEGER NOT NULL DEFAULT 0,
  lance_limitado_percentual NUMERIC(5,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(grupo_id, mes_ano)
);

-- Enable RLS
ALTER TABLE public.grupos_consorcio ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analises_mensais ENABLE ROW LEVEL SECURITY;

-- RLS Policies for grupos_consorcio
CREATE POLICY "Users can view their own groups"
  ON public.grupos_consorcio FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own groups"
  ON public.grupos_consorcio FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own groups"
  ON public.grupos_consorcio FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own groups"
  ON public.grupos_consorcio FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for analises_mensais
CREATE POLICY "Users can view analyses of their groups"
  ON public.analises_mensais FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.grupos_consorcio
      WHERE id = analises_mensais.grupo_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert analyses for their groups"
  ON public.analises_mensais FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.grupos_consorcio
      WHERE id = analises_mensais.grupo_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update analyses of their groups"
  ON public.analises_mensais FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.grupos_consorcio
      WHERE id = analises_mensais.grupo_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete analyses of their groups"
  ON public.analises_mensais FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.grupos_consorcio
      WHERE id = analises_mensais.grupo_id
      AND user_id = auth.uid()
    )
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_grupos_consorcio_updated_at
  BEFORE UPDATE ON public.grupos_consorcio
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();-- ===================================================================
-- MIGRAÇÃO: Dados Compartilhados em Equipe
-- Descrição: Permite que todos os usuários autenticados vejam e editem
--            todos os grupos de consórcio e suas análises mensais
-- ===================================================================

-- 1. Atualizar políticas da tabela grupos_consorcio
-- Drop políticas antigas que restringem ao próprio usuário
DROP POLICY IF EXISTS "Users can view their own groups" ON grupos_consorcio;
DROP POLICY IF EXISTS "Users can insert their own groups" ON grupos_consorcio;
DROP POLICY IF EXISTS "Users can update their own groups" ON grupos_consorcio;
DROP POLICY IF EXISTS "Users can delete their own groups" ON grupos_consorcio;

-- Criar novas políticas para acesso compartilhado
CREATE POLICY "Authenticated users can view all groups"
  ON grupos_consorcio
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert groups"
  ON grupos_consorcio
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users can update all groups"
  ON grupos_consorcio
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete all groups"
  ON grupos_consorcio
  FOR DELETE
  TO authenticated
  USING (true);

-- 2. Atualizar políticas da tabela analises_mensais
-- Drop políticas antigas que restringem baseado no dono do grupo
DROP POLICY IF EXISTS "Users can view analyses of their groups" ON analises_mensais;
DROP POLICY IF EXISTS "Users can insert analyses for their groups" ON analises_mensais;
DROP POLICY IF EXISTS "Users can update analyses of their groups" ON analises_mensais;
DROP POLICY IF EXISTS "Users can delete analyses of their groups" ON analises_mensais;

-- Criar novas políticas para acesso compartilhado
CREATE POLICY "Authenticated users can view all analyses"
  ON analises_mensais
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert analyses"
  ON analises_mensais
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update all analyses"
  ON analises_mensais
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete all analyses"
  ON analises_mensais
  FOR DELETE
  TO authenticated
  USING (true);

-- NOTA: O campo user_id é mantido em grupos_consorcio para fins de auditoria
-- (saber quem criou cada grupo), mas não é mais usado para restringir acesso-- 1. Adicionar coluna administradora com default
ALTER TABLE credit_price 
ADD COLUMN administradora TEXT NOT NULL DEFAULT 'Canopus';

-- 2. Garantir que todos os registros existentes são Canopus
UPDATE credit_price 
SET administradora = 'Canopus' 
WHERE administradora IS NULL OR administradora = '';

-- 3. Criar índice simples para filtros por administradora
CREATE INDEX idx_credit_price_administradora 
ON credit_price(administradora);

-- 4. Criar índice composto para queries otimizadas
CREATE INDEX idx_credit_price_admin_group_prazo 
ON credit_price(administradora, group_code, prazo_months);

-- 5. Adicionar constraint de validação
ALTER TABLE credit_price
ADD CONSTRAINT check_administradora_valida 
CHECK (administradora IN ('Canopus', 'Rodobens'));

-- 6. Comentário para documentação
COMMENT ON COLUMN credit_price.administradora IS 
'Administradora do consórcio (Canopus, Rodobens). Para adicionar novas: DROP e recrie a constraint check_administradora_valida.';-- Inserir dados do Grupo 1796 da Rodobens (216 meses)
INSERT INTO credit_price (administradora, group_code, prazo_months, credito, parcela)
VALUES 
  ('Rodobens', 1796, 216, 360000, 2291.75),
  ('Rodobens', 1796, 216, 350000, 2228.09),
  ('Rodobens', 1796, 216, 340000, 2164.43),
  ('Rodobens', 1796, 216, 330000, 2100.77),
  ('Rodobens', 1796, 216, 320000, 2037.11),
  ('Rodobens', 1796, 216, 310000, 1973.45),
  ('Rodobens', 1796, 216, 300000, 1909.79),
  ('Rodobens', 1796, 216, 290000, 1846.13),
  ('Rodobens', 1796, 216, 280000, 1782.48),
  ('Rodobens', 1796, 216, 270000, 1718.82),
  ('Rodobens', 1796, 216, 260000, 1655.16),
  ('Rodobens', 1796, 216, 250000, 1591.50),
  ('Rodobens', 1796, 216, 240000, 1527.84),
  ('Rodobens', 1796, 216, 230000, 1464.18),
  ('Rodobens', 1796, 216, 220000, 1400.52),
  ('Rodobens', 1796, 216, 210000, 1336.86),
  ('Rodobens', 1796, 216, 200000, 1273.20),
  ('Rodobens', 1796, 216, 190000, 1209.54),
  ('Rodobens', 1796, 216, 180000, 1145.88);-- Create table for administradoras information
CREATE TABLE public.administradoras_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT UNIQUE NOT NULL,
  contemplacoes_mes INTEGER NOT NULL,
  anos_mercado INTEGER NOT NULL,
  clientes_contemplados TEXT NOT NULL,
  descricao_adicional TEXT,
  link_reclame_aqui TEXT NOT NULL,
  parceira1_nome TEXT NOT NULL,
  parceira1_link TEXT,
  parceira2_nome TEXT NOT NULL,
  parceira2_link TEXT,
  parceira3_nome TEXT NOT NULL,
  parceira3_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.administradoras_info ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view administradoras info"
ON public.administradoras_info
FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can insert administradoras"
ON public.administradoras_info
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update administradoras"
ON public.administradoras_info
FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete administradoras"
ON public.administradoras_info
FOR DELETE
TO authenticated
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_administradoras_info_updated_at
BEFORE UPDATE ON public.administradoras_info
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial data for Canopus
INSERT INTO public.administradoras_info (
  nome, 
  contemplacoes_mes, 
  anos_mercado, 
  clientes_contemplados,
  descricao_adicional,
  link_reclame_aqui,
  parceira1_nome, parceira1_link,
  parceira2_nome, parceira2_link,
  parceira3_nome, parceira3_link
) VALUES (
  'Canopus',
  1200,
  50,
  '+178 mil',
  NULL,
  'https://www.reclameaqui.com.br/empresa/consorcio-canopus/',
  'BMW', 'https://www.bmw.com.br/pt/topics/offers-and-services1/financial-services/consorcio.html',
  'Mini Cooper', 'https://www.mini.com.br/pt_BR/home/finance-and-insurance/consorcio.html',
  'Havan', NULL
);

-- Insert initial data for Rodobens
INSERT INTO public.administradoras_info (
  nome, 
  contemplacoes_mes, 
  anos_mercado, 
  clientes_contemplados,
  descricao_adicional,
  link_reclame_aqui,
  parceira1_nome, parceira1_link,
  parceira2_nome, parceira2_link,
  parceira3_nome, parceira3_link
) VALUES (
  'Rodobens',
  0,
  75,
  '+530 mil imóveis',
  'Primeira administradora nacional de consórcios',
  'https://www.reclameaqui.com.br/empresa/rodobens-consorcio/',
  'Mercedes-Benz', NULL,
  'Marcopolo', NULL,
  'XP Investimentos', NULL
);-- Parte 1: Preparação da tabela credit_price para gestão avançada de grupos e créditos

-- 1. Adicionar constraint único para prevenir créditos duplicados no mesmo grupo
ALTER TABLE credit_price 
ADD CONSTRAINT unique_credit_per_group 
UNIQUE (administradora, group_code, credito);

-- 2. Criar índice para melhorar performance nas buscas por administradora + grupo
CREATE INDEX IF NOT EXISTS idx_credit_price_lookup 
ON credit_price(administradora, group_code);

-- 3. Adicionar coluna de descrição para identificar grupos facilmente
ALTER TABLE credit_price 
ADD COLUMN IF NOT EXISTS grupo_descricao TEXT;

-- 4. Adicionar comentários para documentação
COMMENT ON COLUMN credit_price.grupo_descricao IS 'Descrição opcional do grupo de consórcio (ex: Grupo Padrão Imóveis, Grupo Premium)';
COMMENT ON CONSTRAINT unique_credit_per_group ON credit_price IS 'Previne inserção de valores de crédito duplicados no mesmo grupo da mesma administradora';-- Remove old service_role policies
DROP POLICY IF EXISTS "Allow service role insert on credit_price" ON credit_price;
DROP POLICY IF EXISTS "Allow service role update on credit_price" ON credit_price;
DROP POLICY IF EXISTS "Allow service role delete on credit_price" ON credit_price;

-- Create new policies for authenticated users
CREATE POLICY "Authenticated users can insert credit prices"
ON credit_price
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update credit prices"
ON credit_price
FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete credit prices"
ON credit_price
FOR DELETE
TO authenticated
USING (true);-- Add participantes_atual column to grupos_consorcio table
ALTER TABLE public.grupos_consorcio 
ADD COLUMN participantes_atual integer NOT NULL DEFAULT 0;

-- Add comment to explain the difference
COMMENT ON COLUMN public.grupos_consorcio.participantes_atual IS 'Número atual de participantes ativos no grupo (atualizado mensalmente)';
COMMENT ON COLUMN public.grupos_consorcio.capacidade_cotas IS 'Capacidade total de cotas do grupo (valor fixo)';-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'mentor', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create user_branding table
CREATE TABLE public.user_branding (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  company_name TEXT NOT NULL DEFAULT 'Autoridade Investimentos',
  logo_url TEXT,
  primary_color TEXT NOT NULL DEFAULT '#2a3d35',
  secondary_color TEXT NOT NULL DEFAULT '#c9a45c',
  accent_color TEXT NOT NULL DEFAULT '#e8f5e8',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS on user_branding
ALTER TABLE public.user_branding ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user roles
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

-- Create function to handle new user branding
CREATE OR REPLACE FUNCTION public.handle_new_user_branding()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert default branding for new user
  INSERT INTO public.user_branding (user_id, company_name, logo_url, primary_color, secondary_color, accent_color)
  VALUES (
    NEW.id,
    'Autoridade Investimentos',
    '/lovable-uploads/554a2106-221a-4aeb-b66a-a6e72e8541ec.png',
    '#2a3d35',
    '#c9a45c',
    '#e8f5e8'
  );
  
  -- Assign default 'mentor' role to new user
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'mentor');
  
  RETURN NEW;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created_branding
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_branding();

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
  ON public.user_roles
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage all roles"
  ON public.user_roles
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for user_branding
CREATE POLICY "Users can view their own branding"
  ON public.user_branding
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own branding"
  ON public.user_branding
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all branding"
  ON public.user_branding
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage all branding"
  ON public.user_branding
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));-- Create credit_price table for consortium credit information
CREATE TABLE public.credit_price (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  administradora TEXT NOT NULL,
  group_code INTEGER NOT NULL,
  prazo_months INTEGER NOT NULL,
  credito NUMERIC NOT NULL,
  parcela NUMERIC NOT NULL,
  grupo_descricao TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(administradora, group_code, credito)
);

-- Enable RLS on credit_price
ALTER TABLE public.credit_price ENABLE ROW LEVEL SECURITY;

-- Create index for faster queries
CREATE INDEX idx_credit_price_administradora ON public.credit_price(administradora);
CREATE INDEX idx_credit_price_group_code ON public.credit_price(administradora, group_code);

-- RLS Policies for credit_price
-- All authenticated users can view all credit prices (public data)
CREATE POLICY "Anyone can view credit prices"
  ON public.credit_price
  FOR SELECT
  TO authenticated
  USING (true);

-- Only mentors and admins can insert credit prices
CREATE POLICY "Mentors and admins can insert credit prices"
  ON public.credit_price
  FOR INSERT
  TO authenticated
  WITH CHECK (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'mentor')
  );

-- Only mentors and admins can update credit prices
CREATE POLICY "Mentors and admins can update credit prices"
  ON public.credit_price
  FOR UPDATE
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'mentor')
  )
  WITH CHECK (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'mentor')
  );

-- Only mentors and admins can delete credit prices
CREATE POLICY "Mentors and admins can delete credit prices"
  ON public.credit_price
  FOR DELETE
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'mentor')
  );-- Create grupos_consorcio table for consortium group information
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

-- Enable RLS on grupos_consorcio
ALTER TABLE public.grupos_consorcio ENABLE ROW LEVEL SECURITY;

-- Create analises_mensais table for monthly consortium analyses
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

-- Enable RLS on analises_mensais
ALTER TABLE public.analises_mensais ENABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX idx_grupos_consorcio_user_id ON public.grupos_consorcio(user_id);
CREATE INDEX idx_grupos_consorcio_administradora ON public.grupos_consorcio(administradora);
CREATE INDEX idx_analises_mensais_grupo_id ON public.analises_mensais(grupo_id);
CREATE INDEX idx_analises_mensais_data_analise ON public.analises_mensais(data_analise DESC);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Create trigger for grupos_consorcio updated_at
CREATE TRIGGER update_grupos_consorcio_updated_at
  BEFORE UPDATE ON public.grupos_consorcio
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies for grupos_consorcio
CREATE POLICY "Users can view their own grupos"
  ON public.grupos_consorcio
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own grupos"
  ON public.grupos_consorcio
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own grupos"
  ON public.grupos_consorcio
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own grupos"
  ON public.grupos_consorcio
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all grupos"
  ON public.grupos_consorcio
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage all grupos"
  ON public.grupos_consorcio
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for analises_mensais
CREATE POLICY "Users can view analises of their own grupos"
  ON public.analises_mensais
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.grupos_consorcio
      WHERE grupos_consorcio.id = analises_mensais.grupo_id
      AND grupos_consorcio.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert analises for their own grupos"
  ON public.analises_mensais
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.grupos_consorcio
      WHERE grupos_consorcio.id = analises_mensais.grupo_id
      AND grupos_consorcio.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update analises of their own grupos"
  ON public.analises_mensais
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.grupos_consorcio
      WHERE grupos_consorcio.id = analises_mensais.grupo_id
      AND grupos_consorcio.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.grupos_consorcio
      WHERE grupos_consorcio.id = analises_mensais.grupo_id
      AND grupos_consorcio.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete analises of their own grupos"
  ON public.analises_mensais
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.grupos_consorcio
      WHERE grupos_consorcio.id = analises_mensais.grupo_id
      AND grupos_consorcio.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all analises"
  ON public.analises_mensais
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage all analises"
  ON public.analises_mensais
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));-- Create administradoras_info table for consortium administrator details
CREATE TABLE public.administradoras_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL UNIQUE,
  contemplacoes_mes INTEGER NOT NULL,
  anos_mercado INTEGER NOT NULL,
  clientes_contemplados TEXT NOT NULL,
  descricao_adicional TEXT,
  link_reclame_aqui TEXT NOT NULL,
  parceira1_nome TEXT NOT NULL,
  parceira1_link TEXT,
  parceira2_nome TEXT NOT NULL,
  parceira2_link TEXT,
  parceira3_nome TEXT NOT NULL,
  parceira3_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS on administradoras_info
ALTER TABLE public.administradoras_info ENABLE ROW LEVEL SECURITY;

-- Create index for nome searches
CREATE INDEX idx_administradoras_info_nome ON public.administradoras_info(nome);

-- Create trigger for administradoras_info updated_at
CREATE TRIGGER update_administradoras_info_updated_at
  BEFORE UPDATE ON public.administradoras_info
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies for administradoras_info
-- All authenticated users can view administrator information (public data)
CREATE POLICY "Anyone can view administradoras info"
  ON public.administradoras_info
  FOR SELECT
  TO authenticated
  USING (true);

-- Only mentors and admins can insert administradoras info
CREATE POLICY "Mentors and admins can insert administradoras info"
  ON public.administradoras_info
  FOR INSERT
  TO authenticated
  WITH CHECK (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'mentor')
  );

-- Only mentors and admins can update administradoras info
CREATE POLICY "Mentors and admins can update administradoras info"
  ON public.administradoras_info
  FOR UPDATE
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'mentor')
  )
  WITH CHECK (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'mentor')
  );

-- Only admins can delete administradoras info
CREATE POLICY "Admins can delete administradoras info"
  ON public.administradoras_info
  FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));-- Fix security issue: Update search_path for update_updated_at_column function
-- Using CREATE OR REPLACE to update the existing function without breaking dependencies
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;-- Add new fields to user_branding table
ALTER TABLE public.user_branding
ADD COLUMN company_tagline TEXT DEFAULT 'Transformando patrimônio em renda através de investimentos imobiliários inteligentes',
ADD COLUMN team_photo_url TEXT,
ADD COLUMN mentor_photo_url TEXT,
ADD COLUMN metrics_json JSONB DEFAULT '[
  {"value": "R$ 2.4Bi", "label": "Em créditos gerenciados"},
  {"value": "15 anos", "label": "De experiência no mercado"},
  {"value": "98%", "label": "De satisfação dos clientes"}
]'::jsonb,
ADD COLUMN contact_phone TEXT,
ADD COLUMN contact_email TEXT,
ADD COLUMN contact_whatsapp TEXT;

-- Create storage bucket for branding images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'branding-images',
  'branding-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for branding images
CREATE POLICY "Authenticated users can view branding images"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'branding-images');

CREATE POLICY "Users can upload their own branding images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'branding-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own branding images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'branding-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own branding images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'branding-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);-- Adicionar novos campos parametrizáveis na tabela user_branding
ALTER TABLE public.user_branding
ADD COLUMN IF NOT EXISTS feedback_question TEXT DEFAULT 'De 0 a 10 quanto você gostou do nosso atendimento?',
ADD COLUMN IF NOT EXISTS authority_quote TEXT DEFAULT 'A credibilidade conquistada junto à mídia especializada reflete nosso compromisso com a transparência e excelência nos resultados.',
ADD COLUMN IF NOT EXISTS authority_quote_author TEXT DEFAULT 'CEO',
ADD COLUMN IF NOT EXISTS authority_quote_role TEXT DEFAULT 'CEO da Empresa';-- Adicionar novos campos de branding para dados jurídicos e PDFs
ALTER TABLE user_branding
ADD COLUMN IF NOT EXISTS contract_company_name TEXT DEFAULT 'EMPRESA LTDA',
ADD COLUMN IF NOT EXISTS contract_cnpj TEXT DEFAULT '00.000.000/0001-00',
ADD COLUMN IF NOT EXISTS contract_address TEXT DEFAULT 'Endereço da empresa',
ADD COLUMN IF NOT EXISTS contract_city TEXT DEFAULT 'Cidade, Estado',
ADD COLUMN IF NOT EXISTS contract_cep TEXT DEFAULT '00000-000',
ADD COLUMN IF NOT EXISTS contract_website TEXT DEFAULT 'www.empresa.com.br',
ADD COLUMN IF NOT EXISTS pdf_intro_text TEXT DEFAULT 'Nossa empresa oferece consultoria especializada em investimentos imobiliários, com metodologia comprovada e suporte completo em todas as etapas do seu investimento.';-- FASE 1: Sistema de Aprovação de Usuários

-- 1. Criar tabela user_account_status
CREATE TABLE IF NOT EXISTS public.user_account_status (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  requested_at timestamptz NOT NULL DEFAULT now(),
  approved_at timestamptz,
  approved_by uuid,
  rejection_reason text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. Enable RLS
ALTER TABLE public.user_account_status ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies
CREATE POLICY "Admins can manage all statuses"
  ON public.user_account_status FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view their own status"
  ON public.user_account_status FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- 4. Atualizar trigger para criar status pendente (SEM atribuir role)
CREATE OR REPLACE FUNCTION public.handle_new_user_branding()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert default branding for new user
  INSERT INTO public.user_branding (user_id, company_name, logo_url, primary_color, secondary_color, accent_color)
  VALUES (
    NEW.id,
    'Autoridade Investimentos',
    '/lovable-uploads/554a2106-221a-4aeb-b66a-a6e72e8541ec.png',
    '#2a3d35',
    '#c9a45c',
    '#e8f5e8'
  );
  
  -- Criar status pendente (SEM atribuir role ainda!)
  INSERT INTO public.user_account_status (user_id, status)
  VALUES (NEW.id, 'pending');
  
  RETURN NEW;
END;
$$;

-- 5. Criar função para aprovar usuário (usando text em vez de enum para o parâmetro)
CREATE OR REPLACE FUNCTION public.approve_user(
  _user_id uuid,
  _role text DEFAULT 'partner'
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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
  
  -- Atribuir role (cast text para app_role)
  INSERT INTO public.user_roles (user_id, role)
  VALUES (_user_id, _role::app_role)
  ON CONFLICT (user_id) DO UPDATE SET role = _role::app_role;
END;
$$;

-- 6. Criar função para rejeitar usuário
CREATE OR REPLACE FUNCTION public.reject_user(
  _user_id uuid,
  _reason text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Verificar se admin
  IF NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only admins can reject users';
  END IF;
  
  -- Atualizar status
  UPDATE public.user_account_status
  SET status = 'rejected',
      rejection_reason = _reason,
      approved_by = auth.uid(),
      approved_at = now()
  WHERE user_id = _user_id;
END;
$$;

-- 7. Trigger para updated_at
CREATE TRIGGER update_user_account_status_updated_at
  BEFORE UPDATE ON public.user_account_status
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();-- Remover constraint antiga (user_id, role) se existir
ALTER TABLE public.user_roles
DROP CONSTRAINT IF EXISTS user_roles_user_id_role_key;

-- Adicionar constraint UNIQUE em user_id para permitir ON CONFLICT
ALTER TABLE public.user_roles
ADD CONSTRAINT user_roles_user_id_unique UNIQUE (user_id);-- Garantir que a role 'admin' existe no enum app_role
-- Isso é idempotente e não causa erro se já existir
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE app_role AS ENUM ('admin', 'partner', 'user');
  ELSE
    -- Adicionar 'admin' se não existir
    BEGIN
      ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'admin';
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END;
  END IF;
END $$;-- Adicionar o valor 'partner' ao enum app_role
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'partner';-- Atualizar nome da empresa para Autoridade Investimentos em todos os registros existentes
UPDATE user_branding 
SET 
  company_name = 'Autoridade Investimentos',
  updated_at = now()
WHERE company_name = 'Autoridade Investimentos' OR company_name ILIKE '%referência capital%';-- Atualizar cor primária de contas existentes que ainda usam verde antigo
UPDATE user_branding 
SET 
  primary_color = '#1A4764',
  updated_at = NOW()
WHERE primary_color = '#2a3d35';-- Atualizar logo antiga para nova logo Autoridade Investimentos
UPDATE user_branding 
SET 
  logo_url = '/lovable-uploads/logo-partner-white-text.png',
  updated_at = NOW()
WHERE logo_url = '/lovable-uploads/554a2106-221a-4aeb-b66a-a6e72e8541ec.png';-- Adicionar colunas para configuração de PDFs na tabela user_branding
ALTER TABLE user_branding 
ADD COLUMN pdf_background_color TEXT DEFAULT '#193D32' NOT NULL,
ADD COLUMN pdf_accent_color TEXT DEFAULT '#B78D4A' NOT NULL,
ADD COLUMN pdf_logo_url TEXT;

-- Comentários explicativos
COMMENT ON COLUMN user_branding.pdf_background_color IS 'Cor de fundo dos slides de PDF (hex)';
COMMENT ON COLUMN user_branding.pdf_accent_color IS 'Cor de borda/accent dos PDFs (hex)';
COMMENT ON COLUMN user_branding.pdf_logo_url IS 'Logo específica para aparecer nos PDFs (ícone/marca)';-- Criar tabela de empresas
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
$$;-- Remover função approve_user duplicada (versão antiga sem company_id)
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
$$;-- PHASE 1: Criar infraestrutura
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
ON CONFLICT (user_id) DO NOTHING;-- PHASE 4: Atualizar função approve_user para usar companies
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
$$;-- FASE 1: Adicionar colunas is_active

-- 1.1 Adicionar coluna is_active na tabela companies
ALTER TABLE companies 
ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT true;

CREATE INDEX idx_companies_is_active ON companies(is_active);

COMMENT ON COLUMN companies.is_active IS 'Define se a empresa está ativa no sistema';

-- 1.2 Adicionar coluna is_active na tabela user_account_status
ALTER TABLE user_account_status 
ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT true;

CREATE INDEX idx_user_account_status_is_active ON user_account_status(is_active);

COMMENT ON COLUMN user_account_status.is_active IS 'Define se o usuário está ativo no sistema. Pode ser false mesmo com status=approved, permitindo inativar usuários sem perder histórico de aprovação';-- Inserir registros de status para admins sem status
INSERT INTO user_account_status (user_id, status, is_active, approved_at, approved_by)
SELECT 
  ur.user_id,
  'approved'::text as status,
  true as is_active,
  now() as approved_at,
  (SELECT user_id FROM user_roles WHERE role = 'admin' LIMIT 1) as approved_by
FROM user_roles ur
LEFT JOIN user_account_status uas ON uas.user_id = ur.user_id
WHERE ur.role = 'admin' 
  AND uas.user_id IS NULL;-- Permitir leitura pública da tabela companies para preview de branding
-- Isso é necessário para que o preview funcione sem autenticação
CREATE POLICY "Allow public read access to companies"
  ON companies
  FOR SELECT
  USING (true);-- Atualizar todos os usuários com role 'user' para 'partner'
UPDATE user_roles SET role = 'partner' WHERE role = 'user';

-- Remover 'user' do enum app_role
ALTER TYPE app_role RENAME TO app_role_old;
CREATE TYPE app_role AS ENUM ('admin', 'mentor', 'partner');

-- Atualizar as colunas que usam o tipo
ALTER TABLE user_roles ALTER COLUMN role TYPE app_role USING role::text::app_role;

-- Atualizar a função has_role para usar o novo tipo
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Remover o tipo antigo com CASCADE
DROP TYPE app_role_old CASCADE;-- Create function to get user role bypassing RLS
CREATE OR REPLACE FUNCTION public.get_user_role(target_user_id uuid)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = target_user_id
  LIMIT 1
$$;