# Portal do Lojista — Sindilojas (Fase 1)

Monorepo da fase 1 do Portal do Lojista Sindilojas. A aplicação web está em **`lojista-portal/`** (React 19, TanStack Start, Vite, Supabase).

## Desenvolvimento local

```powershell
cd lojista-portal
cp .env.example .env   # Windows: copy .env.example .env
npm install
npm run dev
```

Abra `http://localhost:8080`.

## Segurança e variáveis de ambiente

| Variável | Onde usar | Commitar? |
|----------|-----------|-----------|
| `VITE_SUPABASE_URL` | Build (cliente) | Não — configurar na Vercel |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Build (cliente) | Não — chave **anon/publishable** (protegida por RLS) |
| `SUPABASE_URL` | SSR / middleware | Não — Vercel env |
| `SUPABASE_PUBLISHABLE_KEY` | SSR / middleware | Não — Vercel env |
| `SUPABASE_SERVICE_ROLE_KEY` | **Somente scripts locais** (`scripts/`) | **Nunca** — não usar na Vercel |

- O arquivo `.env` está no `.gitignore` em todo o repositório.
- Use `lojista-portal/.env.example` como modelo.
- **Não** commite `whois db supabase.txt`, arquivos `.zip` de backup nem chaves `service_role`.
- Se uma `service_role` foi exposta, **rotacione** em Supabase → Project Settings → API.

## Deploy na Vercel

1. Importe o repositório [magicpageweb/portal-lojista1fase](https://github.com/magicpageweb/portal-lojista1fase).
2. **Root Directory:** deixe em branco (raiz do repo). O script `vercel-build` compila `lojista-portal/` e publica o output.
   - Alternativa: Root Directory = `lojista-portal` (deploy direto, sem wrapper na raiz).
3. **Environment Variables** (Production + Preview):

   ```
   VITE_SUPABASE_URL=https://SEU_PROJECT_REF.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=<anon ou publishable key>
   SUPABASE_URL=https://SEU_PROJECT_REF.supabase.co
   SUPABASE_PUBLISHABLE_KEY=<mesma chave publishable>
   ```

5. Deploy. Não adicione `SUPABASE_SERVICE_ROLE_KEY` na Vercel — o app em produção não precisa dela.

O `vite.config.ts` em `lojista-portal/` usa `nitro: { preset: "vercel" }` — sem isso o build gera artefato Cloudflare e a Vercel retorna **404**.

## Scripts demo (opcional, local)

Ver `lojista-portal/scripts/README-demo.md`. Requer `SUPABASE_SERVICE_ROLE_KEY` apenas no `.env` local.

## Documentação

- Plano completo: `SINDILOJAS_Portal_do_Lojista_Plano_Completo.md`
- Imagens demo: `lojista-portal/public/demo/README.md`
