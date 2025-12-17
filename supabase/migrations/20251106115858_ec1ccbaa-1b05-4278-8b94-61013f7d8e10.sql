-- Inserir registros de status para admins sem status
INSERT INTO user_account_status (user_id, status, is_active, approved_at, approved_by)
SELECT 
  ur.user_id,
  'approved'::text as status,
  true as is_active,
  now() as approved_at,
  (SELECT user_id FROM user_roles WHERE role = 'admin' LIMIT 1) as approved_by
FROM user_roles ur
LEFT JOIN user_account_status uas ON uas.user_id = ur.user_id
WHERE ur.role = 'admin' 
  AND uas.user_id IS NULL;