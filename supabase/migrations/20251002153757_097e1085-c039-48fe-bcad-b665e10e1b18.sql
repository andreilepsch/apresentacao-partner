-- ===================================================================
-- MIGRAÇÃO: Dados Compartilhados em Equipe
-- Descrição: Permite que todos os usuários autenticados vejam e editem
--            todos os grupos de consórcio e suas análises mensais
-- ===================================================================

-- 1. Atualizar políticas da tabela grupos_consorcio
-- Drop políticas antigas que restringem ao próprio usuário
DROP POLICY IF EXISTS "Users can view their own groups" ON grupos_consorcio;
DROP POLICY IF EXISTS "Users can insert their own groups" ON grupos_consorcio;
DROP POLICY IF EXISTS "Users can update their own groups" ON grupos_consorcio;
DROP POLICY IF EXISTS "Users can delete their own groups" ON grupos_consorcio;

-- Criar novas políticas para acesso compartilhado
CREATE POLICY "Authenticated users can view all groups"
  ON grupos_consorcio
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert groups"
  ON grupos_consorcio
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users can update all groups"
  ON grupos_consorcio
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete all groups"
  ON grupos_consorcio
  FOR DELETE
  TO authenticated
  USING (true);

-- 2. Atualizar políticas da tabela analises_mensais
-- Drop políticas antigas que restringem baseado no dono do grupo
DROP POLICY IF EXISTS "Users can view analyses of their groups" ON analises_mensais;
DROP POLICY IF EXISTS "Users can insert analyses for their groups" ON analises_mensais;
DROP POLICY IF EXISTS "Users can update analyses of their groups" ON analises_mensais;
DROP POLICY IF EXISTS "Users can delete analyses of their groups" ON analises_mensais;

-- Criar novas políticas para acesso compartilhado
CREATE POLICY "Authenticated users can view all analyses"
  ON analises_mensais
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert analyses"
  ON analises_mensais
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update all analyses"
  ON analises_mensais
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete all analyses"
  ON analises_mensais
  FOR DELETE
  TO authenticated
  USING (true);

-- NOTA: O campo user_id é mantido em grupos_consorcio para fins de auditoria
-- (saber quem criou cada grupo), mas não é mais usado para restringir acesso