-- Adicionar colunas para configuração de PDFs na tabela user_branding
ALTER TABLE user_branding 
ADD COLUMN pdf_background_color TEXT DEFAULT '#193D32' NOT NULL,
ADD COLUMN pdf_accent_color TEXT DEFAULT '#B78D4A' NOT NULL,
ADD COLUMN pdf_logo_url TEXT;

-- Comentários explicativos
COMMENT ON COLUMN user_branding.pdf_background_color IS 'Cor de fundo dos slides de PDF (hex)';
COMMENT ON COLUMN user_branding.pdf_accent_color IS 'Cor de borda/accent dos PDFs (hex)';
COMMENT ON COLUMN user_branding.pdf_logo_url IS 'Logo específica para aparecer nos PDFs (ícone/marca)';