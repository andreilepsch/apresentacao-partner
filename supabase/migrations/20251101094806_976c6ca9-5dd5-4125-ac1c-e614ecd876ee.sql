-- FASE 1: Sistema de Aprovação de Usuários

-- 1. Criar tabela user_account_status
CREATE TABLE IF NOT EXISTS public.user_account_status (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  requested_at timestamptz NOT NULL DEFAULT now(),
  approved_at timestamptz,
  approved_by uuid,
  rejection_reason text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. Enable RLS
ALTER TABLE public.user_account_status ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies
CREATE POLICY "Admins can manage all statuses"
  ON public.user_account_status FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view their own status"
  ON public.user_account_status FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- 4. Atualizar trigger para criar status pendente (SEM atribuir role)
CREATE OR REPLACE FUNCTION public.handle_new_user_branding()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert default branding for new user
  INSERT INTO public.user_branding (user_id, company_name, logo_url, primary_color, secondary_color, accent_color)
  VALUES (
    NEW.id,
    'Autoridade Investimentos',
    '/lovable-uploads/554a2106-221a-4aeb-b66a-a6e72e8541ec.png',
    '#2a3d35',
    '#c9a45c',
    '#e8f5e8'
  );
  
  -- Criar status pendente (SEM atribuir role ainda!)
  INSERT INTO public.user_account_status (user_id, status)
  VALUES (NEW.id, 'pending');
  
  RETURN NEW;
END;
$$;

-- 5. Criar função para aprovar usuário (usando text em vez de enum para o parâmetro)
CREATE OR REPLACE FUNCTION public.approve_user(
  _user_id uuid,
  _role text DEFAULT 'partner'
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Verificar se admin
  IF NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only admins can approve users';
  END IF;
  
  -- Validar role
  IF _role NOT IN ('admin', 'partner', 'user') THEN
    RAISE EXCEPTION 'Invalid role: %', _role;
  END IF;
  
  -- Atualizar status
  UPDATE public.user_account_status
  SET status = 'approved',
      approved_at = now(),
      approved_by = auth.uid()
  WHERE user_id = _user_id;
  
  -- Atribuir role (cast text para app_role)
  INSERT INTO public.user_roles (user_id, role)
  VALUES (_user_id, _role::app_role)
  ON CONFLICT (user_id) DO UPDATE SET role = _role::app_role;
END;
$$;

-- 6. Criar função para rejeitar usuário
CREATE OR REPLACE FUNCTION public.reject_user(
  _user_id uuid,
  _reason text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Verificar se admin
  IF NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only admins can reject users';
  END IF;
  
  -- Atualizar status
  UPDATE public.user_account_status
  SET status = 'rejected',
      rejection_reason = _reason,
      approved_by = auth.uid(),
      approved_at = now()
  WHERE user_id = _user_id;
END;
$$;

-- 7. Trigger para updated_at
CREATE TRIGGER update_user_account_status_updated_at
  BEFORE UPDATE ON public.user_account_status
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();