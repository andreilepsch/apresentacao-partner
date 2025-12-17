-- 1. Adicionar coluna administradora com default
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
'Administradora do consórcio (Canopus, Rodobens). Para adicionar novas: DROP e recrie a constraint check_administradora_valida.';