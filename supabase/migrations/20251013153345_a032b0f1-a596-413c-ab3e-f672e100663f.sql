-- Parte 1: Preparação da tabela credit_price para gestão avançada de grupos e créditos

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
COMMENT ON CONSTRAINT unique_credit_per_group ON credit_price IS 'Previne inserção de valores de crédito duplicados no mesmo grupo da mesma administradora';