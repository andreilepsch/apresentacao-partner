-- Permitir leitura pública da tabela companies para preview de branding
-- Isso é necessário para que o preview funcione sem autenticação
CREATE POLICY "Allow public read access to companies"
  ON companies
  FOR SELECT
  USING (true);