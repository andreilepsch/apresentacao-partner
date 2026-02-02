-- Migration to allow any email domain for signups
-- Drops the trigger and function that restricted signups to @autoridadeinvestimentos.com.br

DROP TRIGGER IF EXISTS validate_email_domain_trigger ON auth.users;
DROP FUNCTION IF EXISTS public.validate_email_domain();

NOTIFY pgrst, 'reload schema';
