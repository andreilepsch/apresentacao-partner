-- Create table for consortium groups
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
  EXECUTE FUNCTION public.update_updated_at_column();