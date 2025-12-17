-- Atualizar logo antiga para nova logo Autoridade Investimentos
UPDATE user_branding 
SET 
  logo_url = '/lovable-uploads/logo-partner-white-text.png',
  updated_at = NOW()
WHERE logo_url = '/lovable-uploads/554a2106-221a-4aeb-b66a-a6e72e8541ec.png';