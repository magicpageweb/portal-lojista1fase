-- Redistribuição das 24 lojas demo entre as 8 cidades (sem criar lojas novas).
-- Depende de 20260920010000_add_cidades_and_lojista_cidade_id.sql
-- NÃO aplicar em produção sem autorização explícita.

-- Santa Cruz do Sul (1D + 1V + 1E)
UPDATE public.lojistas l
SET
  cidade_id = c.id,
  cidade = c.nome,
  estado = c.uf,
  bairro = v.bairro
FROM public.cidades c
JOIN (VALUES
  ('demo-loja-modelo-vestuario', 'Centro'),
  ('demo-loja-exemplo-beleza', 'Higienópolis'),
  ('demo-loja-modelo-confeccoes', 'Universitário')
) AS v(slug, bairro) ON true
WHERE c.slug = 'santa-cruz-do-sul'
  AND l.slug = v.slug
  AND l.is_demo = true;

-- Vera Cruz (1D + 1V + 1E)
UPDATE public.lojistas l
SET
  cidade_id = c.id,
  cidade = c.nome,
  estado = c.uf,
  bairro = v.bairro
FROM public.cidades c
JOIN (VALUES
  ('demo-modelo-casa-decoracao', 'Centro'),
  ('demo-exemplo-calcados', 'Distrito'),
  ('demo-exemplo-boutique-infantil', 'Linha Nova')
) AS v(slug, bairro) ON true
WHERE c.slug = 'vera-cruz'
  AND l.slug = v.slug
  AND l.is_demo = true;

-- Venâncio Aires (1D + 1V + 1E)
UPDATE public.lojistas l
SET
  cidade_id = c.id,
  cidade = c.nome,
  estado = c.uf,
  bairro = v.bairro
FROM public.cidades c
JOIN (VALUES
  ('demo-modelo-otica', 'Centro'),
  ('demo-demonstracao-mercearia', 'Bairro Industrial'),
  ('demo-exemplo-minimercado', 'Interior')
) AS v(slug, bairro) ON true
WHERE c.slug = 'venancio-aires'
  AND l.slug = v.slug
  AND l.is_demo = true;

-- Mato Leitão (1D + 1V + 1E)
UPDATE public.lojistas l
SET
  cidade_id = c.id,
  cidade = c.nome,
  estado = c.uf,
  bairro = v.bairro
FROM public.cidades c
JOIN (VALUES
  ('demo-exemplo-panificadora', 'Centro'),
  ('demo-modelo-lavanderia', 'Linha Nova'),
  ('demo-demonstracao-lanchonete', 'Distrito')
) AS v(slug, bairro) ON true
WHERE c.slug = 'mato-leitao'
  AND l.slug = v.slug
  AND l.is_demo = true;

-- Herveiras (1V + 2E)
UPDATE public.lojistas l
SET
  cidade_id = c.id,
  cidade = c.nome,
  estado = c.uf,
  bairro = v.bairro
FROM public.cidades c
JOIN (VALUES
  ('demo-exemplo-assistencia-tecnica', 'Centro'),
  ('demo-modelo-salao-de-beleza', 'Interior'),
  ('demo-exemplo-auto-pecas', 'Distrito')
) AS v(slug, bairro) ON true
WHERE c.slug = 'herveiras'
  AND l.slug = v.slug
  AND l.is_demo = true;

-- Gramado Xavier (1V + 2E)
UPDATE public.lojistas l
SET
  cidade_id = c.id,
  cidade = c.nome,
  estado = c.uf,
  bairro = v.bairro
FROM public.cidades c
JOIN (VALUES
  ('demo-exemplo-papelaria-grafica', 'Centro'),
  ('demo-loja-modelo-materiais', 'Distrito'),
  ('demo-exemplo-relojoaria', 'Interior')
) AS v(slug, bairro) ON true
WHERE c.slug = 'gramado-xavier'
  AND l.slug = v.slug
  AND l.is_demo = true;

-- Vale do Sol (1V + 2E)
UPDATE public.lojistas l
SET
  cidade_id = c.id,
  cidade = c.nome,
  estado = c.uf,
  bairro = v.bairro
FROM public.cidades c
JOIN (VALUES
  ('demo-demonstracao-auto-servicos', 'Centro'),
  ('demo-exemplo-chaveiro', 'Distrito'),
  ('demo-exemplo-informaticas', 'Interior')
) AS v(slug, bairro) ON true
WHERE c.slug = 'vale-do-sol'
  AND l.slug = v.slug
  AND l.is_demo = true;

-- Sinimbu (1V + 2E)
UPDATE public.lojistas l
SET
  cidade_id = c.id,
  cidade = c.nome,
  estado = c.uf,
  bairro = v.bairro
FROM public.cidades c
JOIN (VALUES
  ('demo-exemplo-artigos-esportivos', 'Centro'),
  ('demo-modelo-papelaria-escolar', 'Distrito'),
  ('demo-modelo-academia-bairro', 'Interior')
) AS v(slug, bairro) ON true
WHERE c.slug = 'sinimbu'
  AND l.slug = v.slug
  AND l.is_demo = true;
