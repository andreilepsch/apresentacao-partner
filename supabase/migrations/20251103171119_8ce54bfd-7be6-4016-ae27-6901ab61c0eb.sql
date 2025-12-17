-- Atualizar cor primária de contas existentes que ainda usam verde antigo
UPDATE user_branding 
SET 
  primary_color = '#1A4764',
  updated_at = NOW()
WHERE primary_color = '#2a3d35';