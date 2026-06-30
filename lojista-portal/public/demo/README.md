# Imagens demo — Portal Lojista

Coloque aqui suas imagens **WebP** otimizadas. O script `upload-demo-images.ts` lê desta pasta e envia ao Supabase Storage.

## Estrutura (uma pasta por loja)

```
public/demo/
├── demo-boutique-luar/
│   ├── capa.webp          ← banner da loja
│   ├── logo.webp          ← ícone quadrado
│   └── produtos/
│       ├── 1.webp         ← ordem do produto no catálogo
│       ├── 2.webp
│       └── ...
├── demo-padaria-horizonte/
│   ├── capa.webp
│   ├── logo.webp
│   └── produtos/
│       └── ...
├── demo-espaco-bela-vila/
├── demo-lar-harmonia/
├── demo-pixel-byte/
├── demo-oficina-rota-certa/
├── demo-papelaria-centro/
└── demo-otica-prime/
```

## Tamanhos recomendados (web)

| Arquivo | Proporção | Dimensão sugerida | Peso alvo |
|---------|-----------|-------------------|-----------|
| `capa.webp` | ~2.5:1 (paisagem) | **1200 × 480 px** | < 150 KB |
| `logo.webp` | 1:1 (quadrado) | **256 × 256 px** | < 40 KB |
| `produtos/N.webp` | 1:1 | **640 × 640 px** | < 80 KB |

## Slugs das 8 lojas demo

| Pasta | Loja |
|-------|------|
| `demo-boutique-luar` | Boutique Luar do Campo |
| `demo-padaria-horizonte` | Padaria Horizonte |
| `demo-espaco-bela-vila` | Espaço Bela Vila |
| `demo-lar-harmonia` | Lar & Harmonia Decorações |
| `demo-pixel-byte` | Pixel & Byte Informática |
| `demo-oficina-rota-certa` | Oficina Rota Certa |
| `demo-papelaria-centro` | Papelaria Centro Criativo |
| `demo-otica-prime` | Ótica & Relojoaria Prime |

## Depois de colocar os arquivos

```powershell
cd lojista-portal

# 0) Capa e logo WebP (gera só o que faltar)
npx tsx scripts/generate-demo-brand-webps.ts

# 1) Gerar WebP simulados dos produtos (640×640, temáticos por categoria)

npx tsx scripts/generate-demo-produto-webps.ts

# 2) (Opcional) Re-tentar produtos que ficaram com fallback SVG
npx tsx scripts/retry-demo-produto-photos.ts

# 3) Remover PNGs duplicados quando já existir .webp
npx tsx scripts/cleanup-demo-pngs.ts

# 4) Enviar ao Supabase e atualizar o site
npx tsx scripts/upload-demo-images.ts
```

Capa e logo: arquivos `.webp` manuais por loja. Produtos: gerados automaticamente pelo script acima.

## Observações

- **Prefira `.webp`** — o script também aceita `.png` se o WebP não existir.
- Produtos sem arquivo local usam placeholder colorido (nome do produto).
- Os PNGs gerados automaticamente (2–3 MB cada) podem ser apagados e substituídos por WebP.
