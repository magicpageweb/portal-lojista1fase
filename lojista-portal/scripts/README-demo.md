# Seed demo — Portal Lojista Sindilojas

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
| `demo-data.ts` | Dados fictícios das 8 lojas |
| `load-env.ts` | Leitura do `.env` local |
| `seed-demo-lojistas.ts` | Cria usuários + lojas + produtos |
| `remove-demo-lojistas.ts` | Rollback completo |
