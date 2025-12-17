-- Create table for administradoras information
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
);