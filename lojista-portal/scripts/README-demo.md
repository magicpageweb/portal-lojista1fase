# Seed demo — Portal Lojista Sindilojas

> **Catálogo atual (18 lojas, segmentado por plano):** veja
> [Catálogo de demonstração por plano](#catálogo-de-demonstração-por-plano) no
> fim deste arquivo. É o fluxo usado hoje.
>
> As seções abaixo descrevem a carga **antiga** de 8 lojas, mantida porque os
> scripts de imagem (`upload-demo-images.ts`, geradores de webp) ainda se
> apoiam em `demo-data.ts`.

Scripts para popular e remover **8 lojas fictícias** de demonstração.

## Pré-requisitos

1. Node 20+ instalado
2. Arquivo `lojista-portal/.env` (copie de `.env.example`) com:
   - `VITE_SUPABASE_URL` ou `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY` (**não commitar**)

   Obtenha a service role em: Supabase Dashboard → Project Settings → API → `service_role` (secret).

3. Migrations do projeto já aplicadas no Supabase remoto

## O que é criado

| Item | Detalhe |
|------|---------|
| Usuários | 8 contas `demo-*@portaldolojista.demo` |
| Lojas | 8 registros `slug` com prefixo `demo-` |
| Produtos | 42 produtos ativos (6 novos sem preço na vitrine) |
| Cidade | Santa Cruz do Sul / RS |
| Telefones | DDD 51 |
| Métricas | **Não** são criadas |
| Imagens | URLs externas (Unsplash) |

Senha das contas demo: `DemoPortal2026!` (somente demonstração).

## Rodar o seed

```powershell
cd "E:\GITHUB JOBs\PortalLojista-1fase\lojista-portal"
npx tsx scripts/seed-demo-lojistas.ts
```

Idempotente: se o `slug` demo já existir, a loja é pulada.

## Atualizar imagens demo (capas, logos e produtos)

Depois do seed, envie as imagens geradas para o Supabase Storage:

```powershell
npx tsx scripts/upload-demo-images.ts
```

Arquivos locais em `public/demo/{slug}/capa.png` e `logo.png`.

## Remover tudo demo

```powershell
cd "E:\GITHUB JOBs\PortalLojista-1fase\lojista-portal"
npx tsx scripts/remove-demo-lojistas.ts
```

Remove:

- produtos das lojas `demo-%`
- lojistas `demo-%`
- usuários com e-mail `@portaldolojista.demo` ou `user_metadata.demo = true`

## Validar no portal

1. `npm run dev`
2. Abrir http://localhost:8080/lojistas
3. Conferir destaques na home (Boutique Luar + Padaria Horizonte)

## Arquivos

| Arquivo | Função |
|---------|--------|
| `demo-data.ts` | Dados fictícios das 8 lojas (carga antiga) |
| `load-env.ts` | Leitura do `.env` local |
| `remove-demo-lojistas.ts` | Rollback da carga antiga (por slug `demo-%`) |

---

## Catálogo de demonstração por plano

Carga atual: **18 lojistas fictícios** para apresentação, distribuídos entre os
três planos.

| Plano | Qtd. | Conteúdo |
|---|---|---|
| `essencial` | 8 | Só nome, categoria, bairro, cidade, telefone e WhatsApp — sem logo, capa, descrição ou produtos |
| `vitrine` | 7 | Logo, capa, descrição comercial e 3 produtos cada |
| `destaque` | 3 | Igual ao vitrine, com `destaque = true` (prioridade na listagem e selo) |

Total: 33 produtos, 5 categorias e 16 bairros, para os filtros terem conteúdo.

### Como os dados são reconhecíveis como teste

- `is_demo = true` em todos os registros — é a chave para remover a carga
  inteira sem tocar em associado real;
- nomes genéricos (`Loja Modelo…`, `Exemplo…`, `Demonstração…`);
- CNPJ sempre iniciado em `00` (com dígitos verificadores válidos, então
  passam na validação do painel);
- e-mails em `@demo.sindilojas.local`;
- `slug` com prefixo `demo-`;
- `user_id` nulo — **nenhuma conta de acesso é criada**.

As imagens reaproveitam as pastas já versionadas em `public/demo/` e são
servidas pelo próprio portal, então a carga **não depende** de upload no
Supabase Storage.

### Pré-requisitos

1. Migration `20260919130000_add_plano_is_demo_and_produto_gating.sql` aplicada
   (é ela que cria `plano`, `is_demo` e torna `user_id` anulável).
2. `.env` local com `SUPABASE_URL` (ou `VITE_SUPABASE_URL`) e
   `SUPABASE_SERVICE_ROLE_KEY`. **Nunca** commitar essa chave nem configurá-la
   em CI ou na Vercel.

### Comandos

O padrão é **dry-run**: sem `--confirm` nada é escrito no banco.

```bash
cd lojista-portal

# 1. Prévia — lista o que seria inserido, sem tocar no banco
npx tsx scripts/seed-demo-lojistas.ts

# 2. Aplicar a carga
npx tsx scripts/seed-demo-lojistas.ts --confirm

# 3. Remover toda a carga demo (apaga exatamente is_demo = true)
npx tsx scripts/seed-demo-lojistas.ts --purge --confirm
```

O seed é idempotente: lojas cujo `slug` já existe são puladas.

### Validar no portal

1. `npm run dev`
2. Abrir <http://localhost:8080/lojistas>
3. Conferir: as 3 lojas `destaque` aparecem primeiro com o selo, as `vitrine`
   exibem logo/capa, e as `essencial` aparecem sem imagem.
4. O aviso *"Portal em fase de implantação — lojas exibidas são exemplos
   demonstrativos."* aparece no topo enquanto existir loja demo publicada.

### Arquivos

| Arquivo | Função |
|---------|--------|
| `demo-catalogo.ts` | Dados dos 18 lojistas + geração de CNPJ de teste |
| `seed-demo-lojistas.ts` | Carga e remoção (`--confirm`, `--purge`) |
