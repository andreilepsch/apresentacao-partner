CREATE OR REPLACE FUNCTION public.reset_user_to_pending(_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Verificar permissões (apenas admin pode executar)
  IF NOT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Acesso negado. Apenas administradores podem resetar usuários.';
  END IF;

  -- Reseta o status para pending
  UPDATE public.user_account_status
  SET status = 'pending',
      approved_at = NULL,
      approved_by = NULL,
      is_active = FALSE
  WHERE user_id = _user_id;

  -- Opcional: Remover da tabela de roles para limpar o estado
  DELETE FROM public.user_roles WHERE user_id = _user_id;

END;
$$;
