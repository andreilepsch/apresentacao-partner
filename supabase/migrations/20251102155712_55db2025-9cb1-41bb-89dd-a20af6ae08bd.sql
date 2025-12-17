-- Atualizar nome da empresa para Autoridade Investimentos em todos os registros existentes
UPDATE user_branding 
SET 
  company_name = 'Autoridade Investimentos',
  updated_at = now()
WHERE company_name = 'Autoridade Investimentos' OR company_name ILIKE '%referência capital%';