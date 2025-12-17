-- Adicionar novos campos parametrizáveis na tabela user_branding
ALTER TABLE public.user_branding
ADD COLUMN IF NOT EXISTS feedback_question TEXT DEFAULT 'De 0 a 10 quanto você gostou do nosso atendimento?',
ADD COLUMN IF NOT EXISTS authority_quote TEXT DEFAULT 'A credibilidade conquistada junto à mídia especializada reflete nosso compromisso com a transparência e excelência nos resultados.',
ADD COLUMN IF NOT EXISTS authority_quote_author TEXT DEFAULT 'CEO',
ADD COLUMN IF NOT EXISTS authority_quote_role TEXT DEFAULT 'CEO da Empresa';