# Portal do Lojista Sindilojas — Status do Projeto

> **Para que serve este arquivo:** contexto vivo do projeto, para não precisar
> recolar histórico a cada sessão. **Atualize ao final de cada sessão de trabalho.**

- **Última atualização:** 2026-09-19 (pós-migration + seed 18)
- **Branch de trabalho:** `cursor/planos-demo-keepalive-1a92` (ainda **não mergeada** na `main`)
- **Prazo:** apresentação à diretoria em **28/09**
- **Produção:** https://lojista.sindilojas-scs.com.br
- **Projeto Supabase de produção:** `finkazcfuadukylmrqyh`
- **Preview local da branch:** http://localhost:8080/ (banner + 18 demos OK)

---

## 1. Onde o projeto está agora (resumo de 30 segundos)

**Banco de produção já tem** a migration de planos e as **18 lojas demo**
(`is_demo=true`, distribuição 8 essencial / 7 vitrine / 3 destaque). As 8 demos
antigas foram removidas.

**Código da branch** ainda **não está na `main`** — o site público
(lojista.sindilojas-scs.com.br) só passa a exibir banner e UI da branch após o merge.
No preview local da branch o banner e as lojas já aparecem.

Lacunas restantes para o dia 28:

1. **UI ainda não diferencia bem os planos** (selo/ordenação/esconder catálogo no Essencial) — ver §5.1.
2. Merge na `main` + secret `SUPABASE_ANON_KEY` para keep-alive — ver §5.4–5.5.

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

| Commit | Conteúdo |
| --- | --- |
| `8ba5798` | Migration: segmentação por plano, `is_demo`, `user_id` anulável |
| `c5989a4` | Catálogo demo de 18 lojistas segmentado por plano |
| `0a7ad59` | Banner de ambiente demo nas páginas públicas |
| `4ca8138` | Keep-alive diário do Supabase via GitHub Actions |
| `58142b8` | Correção do `config.toml` (projeto Supabase) |
| `cc3d373` | Merge da `main` resolvendo o conflito de `config.toml` |
| `b58bc47` | Scripts auxiliares para aplicar e detectar a migration de planos |

### 3.1 Migration

Arquivo: `lojista-portal/supabase/migrations/20260919130000_add_plano_is_demo_and_produto_gating.sql`

- Enum `lojista_plano`, colunas `plano` / `is_demo` / `cnpj_verificado`
- `user_id` anulável + trigger blindando campos admin
- Gating de produto só no INSERT (planos `vitrine`/`destaque`)

### 3.2 Dados demo

- `demo-catalogo.ts` + `seed-demo-lojistas.ts` (dry-run por padrão; `--confirm` / `--purge --confirm`)
- Imagens via `public/demo/` (caminhos `/…` no `publicImage`)

### 3.3 Banner

- `demo-banner.tsx` no `site-header.tsx`
- Texto: *"Portal em fase de implantação — lojas exibidas são exemplos demonstrativos."*
- Confirmado em http://localhost:8080/ após o seed

### 3.4 Keep-alive

- `.github/workflows/supabase-keep-alive.yml` — cron 12:00 UTC + `workflow_dispatch`
- Secret necessário: `SUPABASE_ANON_KEY` (ainda pendente de cadastro manual)

---

## 4. Estado real de produção (2026-09-19)

| Item | Estado |
| --- | --- |
| Migration aplicada em `finkazcfuadukylmrqyh`? | **SIM** (SQL Editor — Success) |
| Seed dos 18 lojistas? | **SIM** — 18 ativos, todos `is_demo=true` |
| Distribuição | **essencial 8 / vitrine 7 / destaque 3** (33 produtos) |
| 8 demos antigas removidas? | **SIM** (lojistas + usuários `@portaldolojista.demo`) |
| Banner no preview local da branch? | **SIM** |
| Banner no domínio público (`main`)? | **NÃO** — falta merge |
| Secret `SUPABASE_ANON_KEY`? | **Pendente** (cadastro manual) |
| `config.toml` → `finkazcfuadukylmrqyh`? | **SIM** (main + branch) |

---

## 5. O que ainda falta antes do dia 28

### 5.1 UI que diferencia os planos — MAIOR LACUNA

A palavra `plano` ainda quase não aparece no frontend. Falta para a apresentação:

- Priorizar Destaque (e depois Vitrine) na ordenação
- Selo visual para Destaque (hoje só o badge `destaque` booleano)
- Esconder galeria/catálogo para Essencial nas páginas públicas
- Exibir/trocar plano no painel admin

### 5.2–5.3 Migration e seed

**Concluídos** nesta sessão.

### 5.4 Mergear a branch na `main`

**Aguardando confirmação explícita** após preview. O keep-alive só agenda na `main`.

### 5.5 Cadastrar o secret `SUPABASE_ANON_KEY` — manual

Settings → Secrets and variables → Actions → `SUPABASE_ANON_KEY` =
chave anon de `lojista-portal/.env.production`. Depois do merge, validar com
`workflow_dispatch`.

---

## 6. Decisões tomadas e o porquê

- **Ficar no Supabase Free** + keep-alive (sem Pro/VPS agora)
- **`user_id` anulável** para pré-cadastro; reivindicar por CNPJ depois
- **Blindar `user_id` no trigger** com coluna anulável
- **Gating de produto só no INSERT** (downgrade não trava edição/remoção)
- **Seed em dry-run por padrão**
- **Projeto correto:** `finkazcfuadukylmrqyh` (não `dosuwmurijxkxgouifbx`)
- **Migration via SQL Editor** (sem guardar senha do banco no `.env`)

---

## 7. Como retomar numa próxima sessão

```bash
git checkout cursor/planos-demo-keepalive-1a92
cd lojista-portal && npm install
npx tsx scripts/seed-demo-lojistas.ts   # dry-run
```

Preview local: `npm run dev` → http://localhost:8080/

Referências:

- `lojista-portal/scripts/README-demo.md`
- Migration: `lojista-portal/supabase/migrations/20260919130000_add_plano_is_demo_and_produto_gating.sql`
