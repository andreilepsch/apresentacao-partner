-- Remover constraint antiga (user_id, role) se existir
ALTER TABLE public.user_roles
DROP CONSTRAINT IF EXISTS user_roles_user_id_role_key;

-- Adicionar constraint UNIQUE em user_id para permitir ON CONFLICT
ALTER TABLE public.user_roles
ADD CONSTRAINT user_roles_user_id_unique UNIQUE (user_id);