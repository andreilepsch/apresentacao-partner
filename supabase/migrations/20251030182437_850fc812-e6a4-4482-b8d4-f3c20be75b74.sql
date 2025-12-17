-- Create administradoras_info table for consortium administrator details
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
  USING (public.has_role(auth.uid(), 'admin'));