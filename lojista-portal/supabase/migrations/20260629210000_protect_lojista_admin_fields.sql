-- P2: Impede que lojistas alterem status e destaque (controle exclusivo do admin).
-- Complementa a sanitização do payload no frontend (dashboard.index.tsx).

CREATE OR REPLACE FUNCTION public.protect_lojista_admin_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- service_role (auth.uid() nulo) e admins mantêm controle total
  IF auth.uid() IS NULL OR public.has_role(auth.uid(), 'admin') THEN
    RETURN NEW;
  END IF;

  IF TG_OP = 'INSERT' THEN
    NEW.status := 'aguardando_aprovacao';
    NEW.destaque := false;
    RETURN NEW;
  END IF;

  IF TG_OP = 'UPDATE' THEN
    NEW.status := OLD.status;
    NEW.destaque := OLD.destaque;
    RETURN NEW;
  END IF;

  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.protect_lojista_admin_fields() FROM PUBLIC, anon, authenticated;

CREATE TRIGGER protect_lojista_admin_fields
  BEFORE INSERT OR UPDATE ON public.lojistas
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_lojista_admin_fields();
