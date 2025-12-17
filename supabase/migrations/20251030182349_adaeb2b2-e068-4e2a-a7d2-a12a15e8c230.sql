-- Create grupos_consorcio table for consortium group information
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
  WITH CHECK (public.has_role(auth.uid(), 'admin'));