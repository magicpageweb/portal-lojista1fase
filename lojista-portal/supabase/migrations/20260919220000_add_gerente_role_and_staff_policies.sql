-- Fase 1 RBAC: perfil 'gerente' (staff não-técnico) com permissão de
-- editar lojistas e enviar imagens, sem privilégios extras de roles.

-- ============ ENUM ============
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'gerente';

-- ============ HELPER STAFF ============
CREATE OR REPLACE FUNCTION public.is_staff(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id
      AND role::text IN ('admin', 'gerente')
  )
$$;

REVOKE EXECUTE ON FUNCTION public.is_staff(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_staff(UUID) TO authenticated, service_role;

-- ============ PROTEÇÃO DE CAMPOS ADMIN ============
-- Gerente pode alterar plano/status/destaque (mesmo que admin).
CREATE OR REPLACE FUNCTION public.protect_lojista_admin_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL OR public.is_staff(auth.uid()) THEN
    RETURN NEW;
  END IF;

  IF TG_OP = 'INSERT' THEN
    NEW.status := 'aguardando_aprovacao';
    NEW.destaque := false;
    NEW.plano := 'essencial';
    NEW.is_demo := false;
    NEW.cnpj_verificado := false;
    NEW.user_id := auth.uid();
    RETURN NEW;
  END IF;

  IF TG_OP = 'UPDATE' THEN
    NEW.status := OLD.status;
    NEW.destaque := OLD.destaque;
    NEW.plano := OLD.plano;
    NEW.is_demo := OLD.is_demo;
    NEW.cnpj_verificado := OLD.cnpj_verificado;
    NEW.user_id := OLD.user_id;
    RETURN NEW;
  END IF;

  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.protect_lojista_admin_fields() FROM PUBLIC, anon, authenticated;

-- ============ RLS LOJISTAS: GERENTE ============
DROP POLICY IF EXISTS "Admin ve tudo" ON public.lojistas;
CREATE POLICY "Staff ve tudo" ON public.lojistas
  FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));

DROP POLICY IF EXISTS "Admin atualiza qualquer loja" ON public.lojistas;
CREATE POLICY "Staff atualiza qualquer loja" ON public.lojistas
  FOR UPDATE TO authenticated
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));

-- Aprovação/remoção de lojas permanece exclusiva de admin.
-- Gerente edita conteúdo; admin decide status destrutivo se necessário.
-- (Admin continua coberto por is_staff nas policies acima.)

-- ============ STORAGE: GERENTE PODE GERIR ARQUIVOS ============
DROP POLICY IF EXISTS "Admin gerencia qualquer arquivo lojistas" ON storage.objects;
CREATE POLICY "Staff gerencia qualquer arquivo lojistas" ON storage.objects
  FOR ALL TO authenticated
  USING (bucket_id = 'lojistas' AND public.is_staff(auth.uid()))
  WITH CHECK (bucket_id = 'lojistas' AND public.is_staff(auth.uid()));
