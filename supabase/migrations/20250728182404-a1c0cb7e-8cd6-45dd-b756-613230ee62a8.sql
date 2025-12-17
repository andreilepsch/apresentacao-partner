-- Corrigir search_path da função validate_email_domain
CREATE OR REPLACE FUNCTION public.validate_email_domain()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = 'public'
AS $$
BEGIN
  IF NEW.email NOT LIKE '%@referenciacapital.com.br' THEN
    RAISE EXCEPTION 'Only @referenciacapital.com.br email addresses are allowed';
  END IF;
  RETURN NEW;
END;
$$;