-- Adicionar novos campos de branding para dados jurídicos e PDFs
ALTER TABLE user_branding
ADD COLUMN IF NOT EXISTS contract_company_name TEXT DEFAULT 'EMPRESA LTDA',
ADD COLUMN IF NOT EXISTS contract_cnpj TEXT DEFAULT '00.000.000/0001-00',
ADD COLUMN IF NOT EXISTS contract_address TEXT DEFAULT 'Endereço da empresa',
ADD COLUMN IF NOT EXISTS contract_city TEXT DEFAULT 'Cidade, Estado',
ADD COLUMN IF NOT EXISTS contract_cep TEXT DEFAULT '00000-000',
ADD COLUMN IF NOT EXISTS contract_website TEXT DEFAULT 'www.empresa.com.br',
ADD COLUMN IF NOT EXISTS pdf_intro_text TEXT DEFAULT 'Nossa empresa oferece consultoria especializada em investimentos imobiliários, com metodologia comprovada e suporte completo em todas as etapas do seu investimento.';