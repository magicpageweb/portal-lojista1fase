# Portal do Lojista Sindilojas — Status do Projeto

> **Para que serve este arquivo:** contexto vivo do projeto, para não precisar
> recolar histórico a cada sessão. **Atualize ao final de cada sessão de trabalho.**

- **Última atualização:** 2026-09-19
- **Branch de trabalho:** `cursor/planos-demo-keepalive-1a92` (ainda **não mergeada** na `main`)
- **Prazo:** apresentação à diretoria em **28/09**
- **Produção:** https://lojista.sindilojas-scs.com.br (no ar, respondendo HTTP 200)
- **Projeto Supabase de produção:** `finkazcfuadukylmrqyh`

---

## 1. Onde o projeto está agora (resumo de 30 segundos)

O **código** do modelo de 3 planos está pronto na branch, mas **nada disso foi
aplicado em produção ainda**. O banco de produção continua com o schema antigo e
com os 8 lojistas demo da carga anterior. Faltam, em ordem de risco:

1. A **UI ainda não diferencia os planos** — hoje não há priorização de listagem
   nem selo de Destaque. É o maior buraco para a apresentação (ver §5.1).
2. A migration **não foi aplicada** e o seed dos 18 **não rodou** (ver §4).
3. O keep-alive **só liga depois do merge na `main`** (ver §5.4).

---

## 2. Modelo de negócio (decidido)

| Plano | Cobrança | O que inclui |
| --- | --- | --- |
| **Essencial** | Gratuito, automático para os ~308 associados | Dados básicos de contato. Sem logo obrigatório, sem catálogo de produtos. |
| **Vitrine** | Pago | Logo, capa, galeria e catálogo de produtos. |
| **Destaque** | Pago premium | Tudo do Vitrine + prioridade nas listagens + selo visual. |

A lista real dos 308 associados **ainda não existe**. Para a apresentação usamos
**18 lojistas fictícios** marcados com `is_demo = true`, distribuídos em
**8 Essencial / 7 Vitrine / 3 Destaque**.

---

## 3. O que já foi implementado (na branch)

Commits da branch, do mais antigo para o mais recente:

| Commit | Conteúdo |
| --- | --- |
| `8ba5798` | Migration: segmentação por plano, `is_demo`, `user_id` anulável |
| `c5989a4` | Catálogo demo de 18 lojistas segmentado por plano |
| `0a7ad59` | Banner de ambiente demo nas páginas públicas |
| `4ca8138` | Keep-alive diário do Supabase via GitHub Actions |
| `58142b8` | Correção do `config.toml` (projeto Supabase) |
| `cc3d373` | Merge da `main` resolvendo o conflito de `config.toml` |
| `b58bc47` | Scripts auxiliares para aplicar e detectar a migration de planos |

### 3.1 Migration — `lojista-portal/supabase/migrations/20260919130000_add_plano_is_demo_and_produto_gating.sql`

- Cria o enum `public.lojista_plano` (`essencial` / `vitrine` / `destaque`).
- Adiciona em `lojistas`: `plano` (default `essencial`), `is_demo` (default
  `false`) e `cnpj_verificado` (default `false`), com índices em `plano` e um
  índice parcial em `is_demo = true`.
- Torna `user_id` **anulável**.
- Amplia o trigger `protect_lojista_admin_fields`: além de `status` e `destaque`,
  agora também blinda `plano`, `is_demo`, `cnpj_verificado` e `user_id` contra
  alteração por lojista comum. `service_role` e admins seguem com controle total.
- Divide a policy de `produtos`: o **INSERT** passa a exigir plano pago
  (`vitrine`/`destaque`); UPDATE e DELETE continuam liberados para o dono.

### 3.2 Dados demo — `lojista-portal/scripts/`

- `demo-catalogo.ts`: define os 18 lojistas (8/7/3 confirmado) e seus produtos.
  Slugs com prefixo `demo-`. Os 10 lojistas de plano pago apontam para pastas de
  imagem em `public/demo/` (67 arquivos, todas as pastas referenciadas existem).
- `seed-demo-lojistas.ts`: insere a carga com `is_demo = true`, `status = 'ativo'`
  e `user_id = null`. **O padrão é dry-run** — sem `--confirm` nada é escrito.
  Suporta `--purge --confirm` para remover a carga (critério: `is_demo = true`).
- Usa `SUPABASE_SERVICE_ROLE_KEY`, que ignora RLS: rodar **apenas localmente**.
- `apply-migration-plano.ts`: aplica a migration por conexão Postgres direta,
  usando `SUPABASE_DB_PASSWORD` ou `DATABASE_URL` do `.env`. **Atenção:** ele faz
  `import("postgres")`, e o pacote `postgres` não está no `package.json` nem
  instalado — é preciso `npm i postgres` antes de usar, ou aplicar o SQL pelo
  dashboard.
- `wait-plano-migration.ts`: faz polling até a coluna `is_demo` aparecer na API,
  para encadear o seed logo depois de a migration ser aplicada pelo dashboard.

### 3.3 Banner de ambiente demo

- `src/components/demo-banner.tsx`, montado no `site-header.tsx`.
- Consulta se existe algum lojista com `is_demo = true` e, em caso positivo,
  exibe o aviso não-bloqueante: *"Portal em fase de implantação — lojas exibidas
  são exemplos demonstrativos"*.

### 3.4 Keep-alive do Supabase Free

- `.github/workflows/supabase-keep-alive.yml`: cron diário às 12:00 UTC
  (09:00 America/Sao_Paulo) + `workflow_dispatch`.
- Faz um `GET` na REST API e falha o job se a resposta não for HTTP 200.
- A chave vem do secret `SUPABASE_ANON_KEY` — **não** está hardcoded no YAML.
- Nenhum endpoint novo foi criado na aplicação para isso.

---

## 4. Estado real de produção (verificado em 19/09, somente leitura)

| Item | Estado |
| --- | --- |
| Migration aplicada em `finkazcfuadukylmrqyh`? | **NÃO.** As colunas `plano`, `is_demo` e `cnpj_verificado` não existem no banco. |
| Seed dos 18 lojistas rodou? | **NÃO.** Produção tem **8 lojistas** (a carga demo antiga), 42 produtos e 10 categorias. |
| Secret `SUPABASE_ANON_KEY` cadastrado? | **Não verificável por aqui** — o token do agente recebe `HTTP 403` ao ler secrets. Confirmação é manual (§5.5). |
| Keep-alive já rodou? | **NÃO.** O repositório não tem nenhum workflow registrado; o arquivo só existe na branch. |
| `config.toml` corrigido? | **SIM**, nos dois lados (`bb83043` na `main` e `58142b8` na branch). Conflito resolvido no merge `a3e3f52`. |

---

## 5. O que ainda falta antes do dia 28

### 5.1 UI que diferencia os planos — MAIOR LACUNA

A palavra `plano` **não aparece em nenhum lugar do frontend** hoje. O banco vai
saber o plano de cada loja, mas a tela não mostra diferença nenhuma. Sem isso, a
apresentação não demonstra o modelo de 3 planos. Falta:

- Priorizar Destaque (e depois Vitrine) na ordenação das listagens.
- Selo visual para o plano Destaque.
- Esconder galeria/catálogo para lojas Essencial nas páginas públicas.
- Exibir e permitir troca de plano no painel admin.

### 5.2 Aplicar a migration em produção

Três caminhos possíveis:

1. **Dashboard** (mais direto, sem dependência nova): colar o SQL da migration em
   https://supabase.com/dashboard/project/finkazcfuadukylmrqyh/sql/new
2. **`apply-migration-plano.ts`**: precisa de `SUPABASE_DB_PASSWORD` (ou
   `DATABASE_URL`) no `.env` **e** de `npm i postgres`, que ainda falta.
3. **Supabase CLI**: `supabase link` + `supabase db push`, também com a senha do banco.

Depois de aplicada, `wait-plano-migration.ts` confirma que a coluna `is_demo` já
está visível na API antes de rodar o seed.

A migration foi validada contra um PostgreSQL 16 local com um bootstrap que emula
o Supabase (schema `auth`, `auth.uid()`, roles e grants padrão), incluindo os
testes de RLS.

### 5.3 Rodar o seed e decidir o destino dos 8 lojistas demo antigos

**Atenção:** os 8 lojistas que já estão em produção têm slug `demo-*` mas vão
ficar com `is_demo = false` (é o default da coluna nova). Consequências:

- O `--purge` do seed novo **não remove** esses 8 (ele filtra por `is_demo = true`).
- Rodando o seed como está, produção fica com **26 lojistas** (8 antigos + 18 novos).
- Não há colisão de slug entre as duas cargas, então o seed não quebra — só soma.

Decidir antes de rodar: remover os 8 antigos (o `remove-demo-lojistas.ts` apaga por
prefixo de slug `demo-`, pegando as duas cargas), marcá-los como `is_demo = true`,
ou deixar os 26. Recomendado remover, para a distribuição 8/7/3 ficar limpa.

*Detalhe cosmético:* duas pastas de imagem (`demo-padaria-horizonte` e
`demo-boutique-luar`) são reaproveitadas por 2 lojistas cada, então dois pares de
lojas aparecem com o mesmo logo e capa.

### 5.4 Mergear a branch na `main`

O keep-alive só passa a existir para o GitHub Actions quando o workflow estiver no
branch padrão — `schedule` e `workflow_dispatch` são ignorados fora da `main`.
Enquanto não mergear, o projeto Free segue sujeito à pausa por inatividade.

### 5.5 Cadastrar o secret `SUPABASE_ANON_KEY` — manual

O token do agente não tem permissão para gravar secrets. Cadastrar em
**Settings → Secrets and variables → Actions → New repository secret**, com o
nome exato `SUPABASE_ANON_KEY` e o valor da chave anon/publishable do projeto
`finkazcfuadukylmrqyh` (a mesma de `lojista-portal/.env.production`). Depois do
merge, validar rodando o workflow manualmente pela aba Actions.

---

## 6. Decisões tomadas e o porquê

- **Ficar no Supabase Free.** Sem migração para VPS/Hostgator e sem upgrade para
  Pro agora. O custo da pausa por inatividade é resolvido com o keep-alive diário,
  que é bem mais barato que o Pro.
- **`user_id` anulável.** Permite pré-cadastrar os 308 associados (e os demos) antes
  de existir conta de autenticação. O fluxo de "reivindicar cadastro" por CNPJ fica
  para depois — daí também a coluna `cnpj_verificado`, já criada para esse uso.
- **Blindar `user_id` no trigger.** Com a coluna anulável, um lojista poderia
  desvincular a própria loja ou reatribuí-la a outro usuário via UPDATE direto na
  API. O trigger agora congela esse campo para não-admins.
- **Gating de produto só no INSERT.** Um lojista rebaixado para Essencial continua
  podendo editar e apagar o que já cadastrou; ele só não pode criar produto novo.
  Evita deixar dado órfão e inacessível após downgrade.
- **Seed em dry-run por padrão.** Nenhuma escrita em produção sem `--confirm`
  explícito, e a service role key nunca sai de script local.
- **Projeto Supabase correto é `finkazcfuadukylmrqyh`.** O `dosuwmurijxkxgouifbx`
  do `config.toml` era do scaffold original e nunca recebeu dados — um `db push`
  descuidado aplicaria migration no banco errado. Confirmado por DNS, resposta da
  API e histórico do git.
- **Imagens demo servidas de `public/`.** O `publicImage()` passou a deixar passar
  caminhos que começam com `/`, em vez de sempre prefixar a URL do Supabase Storage.
  Assim a carga demo não depende de upload para o bucket.

---

## 7. Como retomar numa próxima sessão

```bash
git checkout cursor/planos-demo-keepalive-1a92
cd lojista-portal && npm install

# conferir a carga demo sem escrever nada (dry-run é o padrão)
npx tsx scripts/seed-demo-lojistas.ts
```

Referências rápidas:

- Briefing original: `SINDILOJAS_Portal_do_Lojista_Plano_Completo.md`
- Notas da carga demo: `lojista-portal/scripts/README-demo.md`
- Migration mais recente: `lojista-portal/supabase/migrations/20260919130000_add_plano_is_demo_and_produto_gating.sql`
