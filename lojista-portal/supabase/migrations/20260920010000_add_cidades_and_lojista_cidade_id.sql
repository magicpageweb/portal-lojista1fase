-- Segmentação por cidades de atuação do Sindilojas Vale do Rio Pardo.
-- NÃO aplicar em produção sem autorização explícita.

-- ============ TABELA CIDADES ============
CREATE TABLE public.cidades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  uf TEXT NOT NULL DEFAULT 'RS',
  meta_description TEXT,
  ordem INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_cidades_ordem ON public.cidades(ordem);

GRANT SELECT ON public.cidades TO anon, authenticated;
GRANT ALL ON public.cidades TO service_role;
ALTER TABLE public.cidades ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Publico ve cidades" ON public.cidades
  FOR SELECT TO anon, authenticated USING (true);

CREATE TRIGGER update_cidades_updated_at
  BEFORE UPDATE ON public.cidades
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ SEED 8 CIDADES ============
INSERT INTO public.cidades (nome, slug, uf, meta_description, ordem) VALUES
  (
    'Santa Cruz do Sul',
    'santa-cruz-do-sul',
    'RS',
    'Comércio de Santa Cruz do Sul — lojas associadas ao Sindilojas Vale do Rio Pardo. Encontre comércio local verificado na sede da região.',
    1
  ),
  (
    'Vera Cruz',
    'vera-cruz',
    'RS',
    'Comércio de Vera Cruz — Portal do Lojista Sindilojas. Conheça lojas e serviços associados no município de Vera Cruz/RS.',
    2
  ),
  (
    'Venâncio Aires',
    'venancio-aires',
    'RS',
    'Comércio de Venâncio Aires — Portal do Lojista Sindilojas. Encontre o comércio varejista associado em Venâncio Aires/RS.',
    3
  ),
  (
    'Mato Leitão',
    'mato-leitao',
    'RS',
    'Comércio de Mato Leitão — Portal do Lojista Sindilojas. Lojas e serviços do município de Mato Leitão/RS.',
    4
  ),
  (
    'Herveiras',
    'herveiras',
    'RS',
    'Comércio de Herveiras — Portal do Lojista Sindilojas. Conheça o comércio local associado em Herveiras/RS.',
    5
  ),
  (
    'Gramado Xavier',
    'gramado-xavier',
    'RS',
    'Comércio de Gramado Xavier — Portal do Lojista Sindilojas. Lojas associadas no município de Gramado Xavier/RS.',
    6
  ),
  (
    'Vale do Sol',
    'vale-do-sol',
    'RS',
    'Comércio de Vale do Sol — Portal do Lojista Sindilojas. Encontre comércio varejista associado em Vale do Sol/RS.',
    7
  ),
  (
    'Sinimbu',
    'sinimbu',
    'RS',
    'Comércio de Sinimbu — Portal do Lojista Sindilojas. Lojas e serviços associados no município de Sinimbu/RS.',
    8
  );

-- ============ FK EM LOJISTAS ============
ALTER TABLE public.lojistas
  ADD COLUMN cidade_id UUID REFERENCES public.cidades(id) ON DELETE SET NULL;

CREATE INDEX idx_lojistas_cidade_id ON public.lojistas(cidade_id);

-- Backfill: registros com cidade textual = Santa Cruz do Sul (padrão atual do demo)
UPDATE public.lojistas l
SET cidade_id = c.id
FROM public.cidades c
WHERE c.slug = 'santa-cruz-do-sul'
  AND l.cidade_id IS NULL
  AND (
    l.cidade IS NULL
    OR lower(trim(l.cidade)) IN ('santa cruz do sul', 'santa-cruz-do-sul')
  );

-- Demais registros com cidade textual conhecida (match case-insensitive pelo nome)
UPDATE public.lojistas l
SET cidade_id = c.id
FROM public.cidades c
WHERE l.cidade_id IS NULL
  AND l.cidade IS NOT NULL
  AND lower(trim(l.cidade)) = lower(c.nome);
