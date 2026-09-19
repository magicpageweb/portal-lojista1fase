-- Segmentação por plano (essencial/vitrine/destaque), marcação de dados demo
-- e liberação de lojistas sem conta de acesso vinculada.
--
-- Contexto: a carga inicial do catálogo (associados importados em lote e lojas
-- de demonstração) precisa existir antes de o lojista criar login, por isso
-- `user_id` passa a aceitar NULL.

-- ============ ENUM DE PLANO ============
CREATE TYPE public.lojista_plano AS ENUM ('essencial', 'vitrine', 'destaque');

-- ============ NOVAS COLUNAS ============
ALTER TABLE public.lojistas
  ADD COLUMN plano public.lojista_plano NOT NULL DEFAULT 'essencial',
  ADD COLUMN is_demo BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN cnpj_verificado BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX idx_lojistas_plano ON public.lojistas(plano);
CREATE INDEX idx_lojistas_is_demo ON public.lojistas(is_demo) WHERE is_demo = true;

-- Lojas importadas/demo existem antes de o lojista criar login.
ALTER TABLE public.lojistas ALTER COLUMN user_id DROP NOT NULL;

-- ============ PROTEÇÃO DE CAMPOS ADMINISTRATIVOS ============
-- Acrescenta `plano` ao conjunto já protegido (`status`, `destaque`) e fixa
-- `user_id`: com a coluna anulável, um lojista poderia desvincular a própria
-- loja ou reatribuí-la a outro usuário via UPDATE direto na API.
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

-- ============ CADASTRO DE PRODUTOS RESTRITO POR PLANO ============
-- A policy anterior era FOR ALL; ela é dividida para que apenas o INSERT exija
-- plano pago. Editar/remover continua liberado para que um lojista rebaixado a
-- 'essencial' ainda consiga gerenciar o que já havia cadastrado.
DROP POLICY IF EXISTS "Lojista gerencia seus produtos" ON public.produtos;

CREATE POLICY "Lojista cria produtos em plano pago" ON public.produtos
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.lojistas l
      WHERE l.id = lojista_id
        AND l.user_id = auth.uid()
        AND l.plano IN ('vitrine', 'destaque')
    )
  );

CREATE POLICY "Lojista atualiza seus produtos" ON public.produtos
  FOR UPDATE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.lojistas l WHERE l.id = lojista_id AND l.user_id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.lojistas l WHERE l.id = lojista_id AND l.user_id = auth.uid())
  );

CREATE POLICY "Lojista remove seus produtos" ON public.produtos
  FOR DELETE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.lojistas l WHERE l.id = lojista_id AND l.user_id = auth.uid())
  );
