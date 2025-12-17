-- FASE 1: Adicionar colunas is_active

-- 1.1 Adicionar coluna is_active na tabela companies
ALTER TABLE companies 
ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT true;

CREATE INDEX idx_companies_is_active ON companies(is_active);

COMMENT ON COLUMN companies.is_active IS 'Define se a empresa está ativa no sistema';

-- 1.2 Adicionar coluna is_active na tabela user_account_status
ALTER TABLE user_account_status 
ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT true;

CREATE INDEX idx_user_account_status_is_active ON user_account_status(is_active);

COMMENT ON COLUMN user_account_status.is_active IS 'Define se o usuário está ativo no sistema. Pode ser false mesmo com status=approved, permitindo inativar usuários sem perder histórico de aprovação';