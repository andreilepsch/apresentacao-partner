-- Add participantes_atual column to grupos_consorcio table
ALTER TABLE public.grupos_consorcio 
ADD COLUMN participantes_atual integer NOT NULL DEFAULT 0;

-- Add comment to explain the difference
COMMENT ON COLUMN public.grupos_consorcio.participantes_atual IS 'Número atual de participantes ativos no grupo (atualizado mensalmente)';
COMMENT ON COLUMN public.grupos_consorcio.capacidade_cotas IS 'Capacidade total de cotas do grupo (valor fixo)';