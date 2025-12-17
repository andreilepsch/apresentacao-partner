-- Atualizar nome da empresa para Referência Partner em todos os registros existentes
UPDATE user_branding 
SET 
  company_name = 'Referência Partner',
  updated_at = now()
WHERE company_name = 'Referência Capital' OR company_name ILIKE '%referência capital%';