-- Garantir que a role 'admin' existe no enum app_role
-- Isso é idempotente e não causa erro se já existir
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE app_role AS ENUM ('admin', 'partner', 'user');
  ELSE
    -- Adicionar 'admin' se não existir
    BEGIN
      ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'admin';
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END;
  END IF;
END $$;