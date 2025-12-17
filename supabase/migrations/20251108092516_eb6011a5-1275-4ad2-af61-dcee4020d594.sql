-- Atualizar todos os usuários com role 'user' para 'partner'
UPDATE user_roles SET role = 'partner' WHERE role = 'user';

-- Remover 'user' do enum app_role
ALTER TYPE app_role RENAME TO app_role_old;
CREATE TYPE app_role AS ENUM ('admin', 'mentor', 'partner');

-- Atualizar as colunas que usam o tipo
ALTER TABLE user_roles ALTER COLUMN role TYPE app_role USING role::text::app_role;

-- Atualizar a função has_role para usar o novo tipo
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Remover o tipo antigo com CASCADE
DROP TYPE app_role_old CASCADE;