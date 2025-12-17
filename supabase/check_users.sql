-- =====================================================
-- VERIFICAR USUÁRIOS NO SISTEMA
-- Execute no Supabase Studio → SQL Editor
-- =====================================================

-- Ver todos os usuários cadastrados
SELECT 
  u.id,
  u.email,
  u.created_at,
  r.role,
  s.status,
  s.is_active
FROM auth.users u
LEFT JOIN public.user_roles r ON r.user_id = u.id
LEFT JOIN public.user_account_status s ON s.user_id = u.id
ORDER BY u.created_at DESC;
