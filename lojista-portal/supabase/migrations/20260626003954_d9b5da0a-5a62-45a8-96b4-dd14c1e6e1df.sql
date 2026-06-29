
-- Revoga EXECUTE de roles públicos nas SECURITY DEFINER functions
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
-- has_role precisa ser chamada por usuários autenticados (em RLS policies),
-- mas RLS roda como o owner da policy, então podemos restringir e ainda funcionar.
-- Mantemos EXECUTE para authenticated pois é usada em condições de policy.
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, app_role) FROM PUBLIC, anon;
