# 🏪 PORTAL DO LOJISTA — SINDILOJAS
## Plano Completo de Arquitetura, Prompt e Projeto

---

> **Documento de briefing técnico e criativo para desenvolvimento do hotsite**
> Versão 1.0 | Sindilojas | Portal do Lojista Associado

---

## 📌 VISÃO GERAL DO PROJETO

**Nome do produto:** Portal do Lojista Sindilojas
**Tipo:** Hotsite + Painel Administrativo + Vitrine Digital
**Objetivo principal:** Divulgar todos os lojistas associados ao sindicato, gerando visibilidade, tráfego e vendas para os comerciantes locais.
**Público-alvo:** Consumidores finais (vitrine) + Lojistas associados (painel admin)

---

## 🎯 PROMPT MESTRE — PARA DESENVOLVIMENTO

```
Crie um portal web completo chamado "Portal do Lojista" para o Sindilojas
(sindicato dos lojistas). O sistema deve ter duas frentes:

[FRENTE 1 — HOTSITE PÚBLICO]
Um hotsite moderno, dinâmico e com forte apelo visual para divulgar os
lojistas associados ao sindicato. Deve conter:

- Hero section com banner em movimento (parallax multi-layered, partículas
  animadas no fundo, texto principal com efeito Fancy Text rotacionando
  entre "Compre Local", "Apoie o Comércio", "Encontre seu Lojista")
- Vitrine de lojistas em grid responsivo com cards interativos (flip card
  ao hover revelando contato + botão de visitar)
- Filtro de lojistas por categoria (Moda, Alimentação, Serviços, etc.)
  com transição Ajax suave
- Catálogo digital de produtos por loja com lightbox
- Mapa de localização integrado por lojista
- Contador animado de associados, produtos cadastrados e bairros atendidos
- Seção de destaques/vitrines especiais para lojistas em evidência
- Busca inteligente por nome, produto ou categoria
- Rodapé com links do sindicato, redes sociais e selos de credibilidade

[FRENTE 2 — PAINEL ADMINISTRATIVO]
Área restrita para gestão de conteúdo, acessível via login:

- Dashboard do lojista (cada loja gerencia apenas seu próprio perfil)
- Dashboard do administrador Sindilojas (visão geral + aprovações)
- Upload de logo, fotos da loja e fotos de produtos
- Formulário completo: nome da empresa, CNPJ, descrição, slogan,
  segmento, endereço, telefone, WhatsApp, site, redes sociais
- Gerenciamento de catálogo de produtos (nome, foto, preço, descrição)
- Status de publicação (ativo/inativo/aguardando aprovação)
- Métricas básicas: visualizações, cliques no WhatsApp, acessos ao mapa

[DESIGN & UX]
- Identidade visual: cores do Sindilojas (adaptar para amarelo-ouro #F5A623
  e azul-marinho #1A2E5A como base, branco para respiro)
- Tipografia: display bold impactante para títulos, sans-serif limpa para corpo
- Botões com efeitos de hover animado (ripple, glow, slide)
- Seções com scroll reveal (fade-in, slide-up ao entrar na viewport)
- Cards de lojistas com sombra elevada ao hover
- Microinterações em todos os elementos clicáveis
- 100% responsivo (mobile-first)
- Acessibilidade: contraste AAA, navegação por teclado

[SEO TÉCNICO]
- Schema.org para cada lojista (LocalBusiness, Product, Organization)
- Meta tags dinâmicas por lojista (título, descrição, OG image)
- URL amigável: /lojistas/nome-da-loja
- Sitemap XML automático
- Velocidade otimizada: lazy load em imagens, assets minificados
- Rich snippets para produtos e avaliações
```

---

## 🏗️ ARQUITETURA DO SISTEMA

### Estrutura de Páginas

```
PORTAL DO LOJISTA SINDILOJAS
│
├── 🌐 PÚBLICO
│   ├── / (Home — Hotsite principal)
│   ├── /lojistas (Vitrine geral com filtros)
│   ├── /lojistas/[slug-da-loja] (Página individual do lojista)
│   ├── /catalogo (Catálogo digital geral)
│   ├── /catalogo/[slug-da-loja] (Catálogo da loja específica)
│   ├── /mapa (Mapa com todos os associados)
│   ├── /categorias/[categoria] (Ex: /categorias/moda)
│   ├── /busca?q= (Resultados de busca)
│   ├── /sobre (Sobre o Sindilojas)
│   └── /associe-se (Página de captação de novos associados)
│
├── 🔐 ÁREA DO LOJISTA
│   ├── /admin/login
│   ├── /admin/dashboard (Visão geral da loja)
│   ├── /admin/perfil (Dados da empresa)
│   ├── /admin/fotos (Galeria da loja)
│   ├── /admin/produtos (CRUD de produtos)
│   ├── /admin/metricas (Visualizações e cliques)
│   └── /admin/configuracoes
│
└── 🔑 ÁREA DO SINDILOJAS (Super Admin)
    ├── /sindilojas/dashboard
    ├── /sindilojas/lojistas (Gerenciar todos)
    ├── /sindilojas/aprovacoes (Fila de aprovação)
    ├── /sindilojas/destaques (Gerenciar vitrines especiais)
    ├── /sindilojas/categorias
    └── /sindilojas/relatorios
```

---

## 📐 WIREFRAME — HOME (Hotsite)

```
┌─────────────────────────────────────────────────────────┐
│  [LOGO SINDILOJAS]    [Vitrine] [Catálogo] [Mapa] [🔍]  │  ← HEADER sticky
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                                                         │
│   ✦ PARTICLES ANIMADAS NO FUNDO ✦                      │
│                                                         │
│   SINDILOJAS                    [imagem parallax        │
│   Portal do                      multi-layer            │
│   "Compre Local /                 com loja ao           │
│    Apoie o Comércio /             fundo]                │
│    Encontre seu Lojista"                                │
│   ← FANCY TEXT animado                                  │
│                                                         │
│   [CONHEÇA OS LOJISTAS ▶]  [SEJA ASSOCIADO]            │
│                                                         │
└─────────────────────────────────────────────────────────┘  ← HERO

┌─────────────────────────────────────────────────────────┐
│  +240 Associados    +1.800 Produtos    +15 Bairros      │  ← COUNTERS animados
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  🔍 Busque por loja, produto ou categoria...            │  ← BUSCA
│  [Moda] [Alimentação] [Serviços] [Saúde] [Casa] [+]    │  ← FILTROS
└─────────────────────────────────────────────────────────┘

┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐
│  [LOGO]    │ │  [LOGO]    │ │  [LOGO]    │ │  [LOGO]    │
│  Loja ABC  │ │  Loja XYZ  │ │  Moda Sul  │ │  Tech Plus │
│  ★★★★☆    │ │  ★★★★★    │ │  ★★★★☆    │ │  ★★★☆☆    │
│  Categoria │ │  Categoria │ │  Categoria │ │  Categoria │
│            │ │            │ │            │ │            │
│ [VER LOJA] │ │ [VER LOJA] │ │ [VER LOJA] │ │ [VER LOJA] │
└────────────┘ └────────────┘ └────────────┘ └────────────┘
← GRID DE LOJISTAS com flip card no hover →

┌─────────────────────────────────────────────────────────┐
│           ⭐ LOJISTAS EM DESTAQUE ⭐                    │  ← DESTAQUES
│  [CARD GRANDE] [CARD GRANDE] [CARD GRANDE]              │    (vitrine paga/especial)
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│              📦 CATÁLOGO DIGITAL                        │
│  Produtos de todos os lojistas em um só lugar           │
│  [Produto] [Produto] [Produto] [Produto] [Produto]      │
│  [Produto] [Produto] [Produto] [Produto] [Produto]      │
│              [VER CATÁLOGO COMPLETO]                    │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│              📍 NOSSOS LOJISTAS NO MAPA                 │
│  [MAPA INTERATIVO COM PINS DOS LOJISTAS]                │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  "Seja um associado Sindilojas"                         │
│  Benefícios + CTA com efeito parallax                   │
│  [QUERO ME ASSOCIAR]                                    │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  RODAPÉ: Logo | Links | Redes | © Sindilojas 2025       │
└─────────────────────────────────────────────────────────┘
```

---

## 📋 WIREFRAME — PÁGINA INDIVIDUAL DO LOJISTA

```
┌─────────────────────────────────────────────────────────┐
│  [FOTO HERO DA LOJA — com parallax scroll]              │
│  [LOGO]  NOME DA LOJA                                   │
│  ★★★★☆  Categoria | Bairro                             │
│  [WhatsApp] [Site] [Instagram] [Ver no Mapa]            │
└─────────────────────────────────────────────────────────┘

┌───────────────────────────┬─────────────────────────────┐
│  SOBRE A EMPRESA          │  LOCALIZAÇÃO                │
│  Descrição completa...    │  [MINI MAPA EMBED]          │
│  Horário de atendimento   │  Endereço completo          │
│  Formas de pagamento      │  Como chegar                │
└───────────────────────────┴─────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  📦 CATÁLOGO DA LOJA                                    │
│  [Produto] [Produto] [Produto] [Produto]                │
│  (lightbox ao clicar, com nome, preço, descrição)       │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  📸 GALERIA DE FOTOS                                    │
│  [Foto] [Foto] [Foto] [Foto] [Foto]                     │
└─────────────────────────────────────────────────────────┘
```

---

## 🎨 IDENTIDADE VISUAL & DESIGN TOKENS

### Paleta de Cores
```
Primária:     #1A2E5A  (Azul-marinho Sindilojas — institucional, confiança)
Destaque:     #F5A623  (Amarelo-ouro — energia, comércio, otimismo)
Neutro claro: #F8F9FC  (Fundo de seções alternadas)
Escuro:       #0D1B35  (Background hero, seções escuras)
Sucesso:      #2ECC71  (Status ativo, aprovado)
Alerta:       #E74C3C  (Status pendente, erro)
Texto:        #2C3E50  (Corpo de texto principal)
```

### Tipografia
```
Display:  "Poppins" Bold 700/800 — títulos de impacto, hero
Corpo:    "Inter" Regular 400/500 — textos, descrições
UI:       "Poppins" SemiBold 600 — botões, labels, navegação
```

### Efeitos & Animações Essential Addons

| Seção | Efeito EA |
|---|---|
| Hero background | Particles (estrelas/pontos dourados) |
| Hero imagem | Parallax Multi-Layered |
| Título hero | Fancy Text (rotação de frases) |
| Entrada de seções | Interactive Animations (scroll reveal) |
| Cards de lojistas | Flip Box (hover = contatos) |
| Contadores | Counter (animação ao entrar na viewport) |
| Botões CTA | Creative Buttons (hover com glow dourado) |
| Cards produtos | Hover Interaction (zoom + overlay) |
| Seção "Seja associado" | Parallax Scroll + Liquid Glass |
| Tooltips de informação | Advanced Tooltip |

---

## 🗄️ MODELO DE DADOS — CADASTRO DO LOJISTA

### Tabela: `lojistas`
```
id                  (int, PK)
slug                (varchar — para URL /lojistas/nome-da-loja)
status              (enum: ativo | inativo | pendente)
destaque            (boolean)
data_cadastro       (datetime)
aprovado_em         (datetime)

-- DADOS DA EMPRESA
razao_social        (varchar)
nome_fantasia       (varchar)
cnpj                (varchar)
descricao           (text — para SEO)
slogan              (varchar)
segmento_id         (FK categorias)
ano_fundacao        (int)

-- CONTATOS
telefone            (varchar)
whatsapp            (varchar)
email               (varchar)
site                (varchar)

-- REDES SOCIAIS
instagram           (varchar)
facebook            (varchar)
tiktok              (varchar)

-- ENDEREÇO (para mapa)
cep                 (varchar)
logradouro          (varchar)
numero              (varchar)
complemento         (varchar)
bairro              (varchar)
cidade              (varchar)
estado              (varchar)
latitude            (decimal)
longitude           (decimal)

-- HORÁRIOS
horario_seg_sex     (varchar)
horario_sabado      (varchar)
horario_domingo     (varchar)

-- MÍDIA
logo_url            (varchar)
foto_capa_url       (varchar)
galeria             (JSON array de URLs)

-- SEO
meta_title          (varchar)
meta_description    (text)
og_image_url        (varchar)
```

### Tabela: `produtos`
```
id                  (int, PK)
lojista_id          (FK lojistas)
nome                (varchar)
descricao           (text)
preco               (decimal)
preco_promocional   (decimal, nullable)
categoria           (varchar)
foto_url            (varchar)
fotos_extras        (JSON)
ativo               (boolean)
ordem               (int)
```

---

## 🔍 ESTRATÉGIA SEO

### Schema.org por Lojista
```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Nome da Loja",
  "description": "Descrição da loja otimizada...",
  "url": "https://portaldolojista.sindilojas.com.br/lojistas/nome-da-loja",
  "logo": "URL do logo",
  "image": "URL da foto capa",
  "telephone": "+55 xx xxxxx-xxxx",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Rua...",
    "addressLocality": "Cidade",
    "addressRegion": "Estado",
    "postalCode": "xxxxx-xxx",
    "addressCountry": "BR"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": -00.000,
    "longitude": -00.000
  },
  "openingHoursSpecification": [...],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Catálogo de Produtos",
    "itemListElement": [...]
  },
  "memberOf": {
    "@type": "Organization",
    "name": "Sindilojas"
  }
}
```

### Checklist SEO On-Page
- [ ] URL canônica por lojista: `/lojistas/[slug]`
- [ ] Title tag dinâmica: `{Nome da Loja} | Portal do Lojista Sindilojas`
- [ ] Meta description única por lojista (a partir da descrição cadastrada)
- [ ] Open Graph e Twitter Cards com foto da loja
- [ ] Sitemap XML auto-gerado com todas as lojas ativas
- [ ] robots.txt configurado
- [ ] Breadcrumb schema em todas as páginas internas
- [ ] Imagens com `alt` gerado automaticamente
- [ ] Lazy loading em todas as imagens
- [ ] Core Web Vitals otimizados (LCP < 2.5s, CLS < 0.1)
- [ ] Paginação com `rel="next"` e `rel="prev"`
- [ ] Hreflang (se multi-idioma no futuro)

---

## ⚙️ STACK TECNOLÓGICO RECOMENDADO

### Opção A — WordPress + Elementor + Essential Addons (Recomendada)
```
CMS:          WordPress 6.x
Page Builder: Elementor Pro
Addons:       Essential Addons for Elementor (PRO)
Tema base:    Hello Elementor (tema leve oficial)
CPT:          Custom Post Types para lojistas e produtos
Plugins:      
  - ACF Pro (campos customizados)
  - YOAST SEO Premium (SEO automático por loja)
  - Google Maps (integração de mapa)
  - WP Rocket (cache e performance)
  - Imagify (compressão de imagens)
  - LoginPress (tela de login personalizada)
  - Members (controle de permissões por papel)
```

### Opção B — Next.js + CMS Headless
```
Frontend:     Next.js 14 (App Router, SSG/ISR)
CMS:          Strapi ou Payload CMS
Banco:        PostgreSQL
Storage:      Cloudflare R2 / AWS S3 (fotos)
Deploy:       Vercel + Railway
```

---

## 🔐 PERFIS DE ACESSO

| Perfil | O que pode fazer |
|---|---|
| **Visitante** | Ver vitrine, buscar, ver catálogo, acessar mapa |
| **Lojista** | Login próprio, editar apenas sua loja e produtos |
| **Editor Sindilojas** | Aprovar cadastros, gerenciar destaques |
| **Admin Sindilojas** | Acesso total + relatórios + categorias |

---

## 📱 RESPONSIVIDADE — BREAKPOINTS

```
Mobile:   320px–767px   (1 coluna no grid de lojistas)
Tablet:   768px–1023px  (2 colunas)
Desktop:  1024px–1279px (3 colunas)
Wide:     1280px+        (4 colunas)
```

---

## 📊 MÉTRICAS DO PAINEL DO LOJISTA

Cada lojista vê em seu dashboard:
- Visualizações da página da loja (últimos 30 dias)
- Cliques no botão WhatsApp
- Cliques em "Como Chegar" (mapa)
- Produtos mais visualizados
- Posição nos resultados de busca interna
- Status da conta (ativo/pendente/destaque)

---

## 🗓️ CRONOGRAMA DE DESENVOLVIMENTO

| Fase | Entregável | Prazo estimado |
|---|---|---|
| **Fase 1** | Briefing, wireframes, aprovação de layout | Semana 1–2 |
| **Fase 2** | Setup WordPress + Elementor + plugins base | Semana 3 |
| **Fase 3** | Desenvolvimento do hotsite público (home + vitrine + catálogo) | Semana 4–6 |
| **Fase 4** | Páginas individuais de lojistas + mapa | Semana 7–8 |
| **Fase 5** | Painel administrativo do lojista | Semana 9–11 |
| **Fase 6** | Painel do Sindilojas (super admin) | Semana 12 |
| **Fase 7** | SEO técnico + Schema.org + otimização | Semana 13 |
| **Fase 8** | Testes, ajustes, treinamento e go-live | Semana 14–15 |

---

## ✅ CHECKLIST DE LANÇAMENTO

### Técnico
- [ ] SSL ativo no domínio
- [ ] CDN configurado
- [ ] Backup automático diário
- [ ] Formulário de login com 2FA para admin
- [ ] Rate limiting nas APIs
- [ ] LGPD: banner de cookies + política de privacidade
- [ ] Teste de velocidade Google PageSpeed > 90

### Conteúdo
- [ ] Pelo menos 20 lojistas cadastrados antes do go-live
- [ ] Todas as categorias criadas
- [ ] Banners do hero finalizados
- [ ] Textos institucionais do Sindilojas revisados
- [ ] E-mail template para novos associados

### SEO
- [ ] Google Search Console configurado
- [ ] Google Analytics 4 instalado
- [ ] Sitemap submetido
- [ ] Todas as páginas indexáveis testadas

---

## 💡 DIFERENCIAIS COMPETITIVOS DO PORTAL

1. **Catálogo digital por loja** com fotos de produtos e preços
2. **Mapa interativo** mostrando todos os associados na cidade
3. **Busca unificada** de produtos em todas as lojas ao mesmo tempo
4. **SEO individual** por lojista — cada loja aparece no Google
5. **Dashboard de métricas** — lojista sabe quantas pessoas o viram
6. **Destaque pago** — vitrines especiais para lojistas premium
7. **Integração WhatsApp** — botão direto no card de cada loja
8. **Selo de associado** — credibilidade para os consumidores

---

*Documento elaborado para o Sindilojas — Portal do Lojista*
*Todos os direitos reservados ao Sindicato dos Lojistas*
