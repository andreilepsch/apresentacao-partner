ALTER TABLE companies ADD COLUMN IF NOT EXISTS logo_negative_url text;

-- Atualizar branding existente para usar media_json se disponível
UPDATE companies 
SET logo_negative_url = null 
WHERE logo_negative_url IS NULL;
