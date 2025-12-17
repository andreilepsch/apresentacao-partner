-- Atualizar função de validação para aceitar todos os domínios do Grupo Referência
CREATE OR REPLACE FUNCTION public.validate_email_domain()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Lista dos domínios permitidos do Grupo Referência
  IF NEW.email NOT LIKE '%@autoridadeinvestimentos.com.br' 
     AND NEW.email NOT LIKE '%@bankreferencia.com'
     AND NEW.email NOT LIKE '%@gruporeferencia.com'
     AND NEW.email NOT LIKE '%@referenciacapital.me'
     AND NEW.email NOT LIKE '%@referenciacorporate.com'
     AND NEW.email NOT LIKE '%@referenciaholding.com.br'
     AND NEW.email NOT LIKE '%@referenciaimob.com.br' THEN
    RAISE EXCEPTION 'Apenas emails dos domínios do Grupo Referência são permitidos';
  END IF;
  RETURN NEW;
END;
$function$;