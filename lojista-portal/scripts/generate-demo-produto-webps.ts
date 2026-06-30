/**
 * Gera imagens WebP 640×640 simuladas para produtos demo (substituem placeholders sólidos).
 * Tenta foto via Pollinations; fallback: card SVG temático.
 * Uso: npx tsx scripts/generate-demo-produto-webps.ts
 */
import { mkdirSync, existsSync, writeFileSync, unlinkSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { DEMO_STORES } from "./demo-data";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DEMO = resolve(__dirname, "../public/demo");
const SIZE = 640;
const FETCH_TIMEOUT_MS = 45_000;

const CATEGORIA: Record<
  string,
  { bg1: string; bg2: string; accent: string; label: string }
> = {
  moda: { bg1: "#fdf6f0", bg2: "#f5e6d8", accent: "#c47a3a", label: "Moda" },
  alimentacao: { bg1: "#fff8f0", bg2: "#ffe8d4", accent: "#d35400", label: "Alimentação" },
  "beleza-saude": { bg1: "#fff5f8", bg2: "#fce4ec", accent: "#c2185b", label: "Beleza" },
  "casa-decoracao": { bg1: "#f8f5ff", bg2: "#ede7f6", accent: "#7b1fa2", label: "Casa" },
  tecnologia: { bg1: "#f0f4f8", bg2: "#dce6f0", accent: "#1565c0", label: "Tech" },
  automotivo: { bg1: "#f4f6f7", bg2: "#dfe4e8", accent: "#37474f", label: "Auto" },
  papelaria: { bg1: "#e8f4f8", bg2: "#b8dce8", accent: "#2E86AB", label: "Papelaria" },
  "otica-relojoaria": { bg1: "#ede7f6", bg2: "#c5b3e6", accent: "#6C3483", label: "Ótica" },
};

/** Prompts em inglês para geração fotorealista por produto. */
const PRODUTO_PROMPT: Record<string, string> = {
  "Vestido Midi Aurora":
    "elegant midi dress on mannequin, soft pastel colors, fashion boutique product photo, white studio background",
  "Blusa Linho Brisa":
    "linen blouse with puff sleeves, neutral beige color, fashion e-commerce product photo, white background",
  "Calça Wide Leg Areia":
    "wide leg high waist pants sand color, fashion product photography, clean white background",
  "Bolsa Tiracolo Couro Sintético":
    "crossbody leather handbag brown, product photo e-commerce, white background studio lighting",
  "Kimono Estampado Floral":
    "floral print kimono cardigan, fashion product photo, white background",
  "Cinto Fino Dourado":
    "thin golden belt fashion accessory, product photography white background",
  "Pão Francês (dúzia)":
    "fresh french bread baguette dozen bakery product photo, rustic wooden table, warm lighting",
  "Coxinha de Frango (un.)":
    "brazilian coxinha chicken snack golden fried, bakery product photo appetizing",
  "Empada de Palmito":
    "brazilian palm heart empadinha savory pastry, bakery product photo close up",
  "Bolo de Cenoura (fatia)":
    "carrot cake slice with chocolate frosting, dessert product photo appetizing",
  "Café Expresso 50ml":
    "espresso coffee in small white cup, steam rising, cafe product photo",
  "Suco Natural Laranja 300ml":
    "fresh orange juice in glass, natural product photo bright",
  "Torta de Limão (fatia)":
    "lemon pie slice with meringue, dessert product photo white plate",
  "Cesta Café da Manhã (2 pessoas)":
    "breakfast basket with bread fruits juice coffee, gift hamper product photo",
  "Corte Feminino":
    "hair salon woman haircut styling, beauty service photo professional salon",
  "Corte Masculino":
    "barber cutting mens hair, professional barbershop photo",
  "Escova Modeladora":
    "hair blow dry styling brush salon, beauty service photo",
  "Manicure Completa":
    "manicure nail polish hands salon, beauty service photo close up",
  "Hidratação Capilar Profunda":
    "hair treatment mask application salon, beauty service photo",
  "Almofada Veludo 45x45":
    "velvet decorative pillow cushion home decor product photo white background",
  "Luminária de Mesa Nordic":
    "nordic table lamp wood base linen shade, home decor product photo",
  "Tapete Sisal Natural 1,40m":
    "natural sisal rug jute carpet, home decor product photo top view",
  "Kit Quadros Abstratos (3 peças)":
    "abstract art wall frames set of three, home decor product photo",
  "Vaso Cerâmica Terracota G":
    "terracotta ceramic plant pot large, home decor product photo",
  "Cortina Blackout 2,80m":
    "blackout curtain gray fabric draped, home decor product photo",
  'Notebook 14" 8GB/256GB SSD':
    "silver laptop computer 14 inch open, tech product photo white background",
  "Mouse Sem Fio Ergonômico":
    "wireless ergonomic computer mouse, tech product photo white background",
  "Teclado Mecânico RGB":
    "mechanical RGB keyboard, tech product photo white background",
  "Fone Bluetooth Over-Ear":
    "wireless over ear headphones black, tech product photo white background",
  "Formatação + Instalação Windows":
    "computer technician repairing laptop service photo professional",
  "Cabo USB-C 2m Reforçado":
    "usb-c cable coiled white, tech accessory product photo",
  "Suporte Articulado Monitor":
    "monitor arm desk mount, tech accessory product photo",
  "Troca de Óleo + Filtro":
    "car oil change mechanic pouring oil, auto service photo garage",
  "Alinhamento e Balanceamento":
    "car wheel alignment machine garage, auto service photo",
  "Revisão Preventiva Completa":
    "mechanic inspecting car engine hood open, auto service photo",
  "Diagnóstico Eletrônico":
    "automotive diagnostic scanner connected to car, auto service photo",
  "Caderno Universitário 200 folhas":
    "spiral notebook college ruled product photo white background stationery",
  "Kit Canetas Gel (12 cores)":
    "gel pen set twelve colors stationery product photo white background",
  "Mochila Escolar Ergonômica":
    "school backpack ergonomic product photo white background",
  "Armação Acetato Classic":
    "classic acetate eyeglasses frames product photo white background optics",
  "Óculos de Sol Polarizado":
    "polarized sunglasses product photo white background optics store",
  "Relógio Analógico Couro":
    "analog wristwatch leather strap product photo white background watch store",
};

const PRODUTO_ICON: Record<string, string> = {
  "Vestido Midi Aurora": "👗",
  "Blusa Linho Brisa": "👚",
  "Calça Wide Leg Areia": "👖",
  "Bolsa Tiracolo Couro Sintético": "👜",
  "Kimono Estampado Floral": "🌸",
  "Cinto Fino Dourado": "✨",
  "Pão Francês (dúzia)": "🥖",
  "Coxinha de Frango (un.)": "🥟",
  "Empada de Palmito": "🥧",
  "Bolo de Cenoura (fatia)": "🍰",
  "Café Expresso 50ml": "☕",
  "Suco Natural Laranja 300ml": "🍊",
  "Torta de Limão (fatia)": "🍋",
  "Cesta Café da Manhã (2 pessoas)": "🧺",
  "Corte Feminino": "💇‍♀️",
  "Corte Masculino": "💇‍♂️",
  "Escova Modeladora": "💆",
  "Manicure Completa": "💅",
  "Hidratação Capilar Profunda": "✨",
  "Almofada Veludo 45x45": "🛋️",
  "Luminária de Mesa Nordic": "💡",
  "Tapete Sisal Natural 1,40m": "🪴",
  "Kit Quadros Abstratos (3 peças)": "🖼️",
  "Vaso Cerâmica Terracota G": "🏺",
  "Cortina Blackout 2,80m": "🪟",
  'Notebook 14" 8GB/256GB SSD': "💻",
  "Mouse Sem Fio Ergonômico": "🖱️",
  "Teclado Mecânico RGB": "⌨️",
  "Fone Bluetooth Over-Ear": "🎧",
  "Formatação + Instalação Windows": "🔧",
  "Cabo USB-C 2m Reforçado": "🔌",
  "Suporte Articulado Monitor": "🖥️",
  "Troca de Óleo + Filtro": "🛢️",
  "Alinhamento e Balanceamento": "⚙️",
  "Revisão Preventiva Completa": "🔍",
  "Diagnóstico Eletrônico": "📊",
  "Caderno Universitário 200 folhas": "📒",
  "Kit Canetas Gel (12 cores)": "🖊️",
  "Mochila Escolar Ergonômica": "🎒",
  "Armação Acetato Classic": "👓",
  "Óculos de Sol Polarizado": "🕶️",
  "Relógio Analógico Couro": "⌚",
};

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function wrapLines(text: string, maxChars: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length <= maxChars) {
      current = next;
    } else {
      if (current) lines.push(current);
      current = word.length > maxChars ? `${word.slice(0, maxChars - 1)}…` : word;
    }
  }
  if (current) lines.push(current);
  return lines.slice(0, 3);
}

function buildFallbackSvg(nome: string, categoriaSlug: string, preco: number | null): string {
  const cat = CATEGORIA[categoriaSlug] ?? CATEGORIA.tecnologia;
  const icon = PRODUTO_ICON[nome] ?? "📦";
  const lines = wrapLines(nome, 22);
  const precoFmt =
    preco != null ? preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) : null;
  const titleY = precoFmt ? 520 - (lines.length - 1) * 28 : 540 - (lines.length - 1) * 28;

  const titleTspans = lines
    .map((line, i) => {
      const dy = i === 0 ? 0 : 28;
      return `<tspan x="320" dy="${dy}">${escapeXml(line)}</tspan>`;
    })
    .join("");

  return `<svg width="${SIZE}" height="${SIZE}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${cat.bg1}"/>
      <stop offset="100%" stop-color="${cat.bg2}"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="16" flood-color="#000000" flood-opacity="0.12"/>
    </filter>
  </defs>
  <rect width="${SIZE}" height="${SIZE}" fill="url(#bg)"/>
  <rect x="120" y="140" width="400" height="320" rx="24" fill="#ffffff" filter="url(#shadow)"/>
  <text x="320" y="320" text-anchor="middle" font-size="120" font-family="Segoe UI Emoji, Apple Color Emoji, sans-serif">${icon}</text>
  <text x="320" y="${titleY}" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="22" font-weight="700" fill="#1a1a2e">${titleTspans}</text>
  ${precoFmt ? `<text x="320" y="560" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="20" font-weight="600" fill="${cat.accent}">${escapeXml(precoFmt)}</text>` : ""}
</svg>`;
}

function seedFor(slug: string, ordem: number): number {
  let h = 0;
  const key = `${slug}-${ordem}`;
  for (let i = 0; i < key.length; i += 1) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  return h % 999_999;
}

async function fetchPhoto(prompt: string, seed: number): Promise<Buffer | null> {
  const url =
    `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}` +
    `?width=${SIZE}&height=${SIZE}&seed=${seed}&nologo=true&enhance=true`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) return null;
    const ct = res.headers.get("content-type") ?? "";
    if (!ct.startsWith("image/")) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 2048) return null;
    return buf;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

async function toWebp(source: Buffer): Promise<Buffer> {
  return sharp(source)
    .resize(SIZE, SIZE, { fit: "cover", position: "centre" })
    .webp({ quality: 85, effort: 4 })
    .toBuffer();
}

async function generateImage(
  slug: string,
  nome: string,
  categoriaSlug: string,
  preco: number | null,
  ordem: number,
): Promise<{ buffer: Buffer; source: "photo" | "svg" }> {
  const prompt =
    PRODUTO_PROMPT[nome] ??
    `professional product photo ${nome}, e-commerce white background, studio lighting`;
  const seed = seedFor(slug, ordem);

  const photo = await fetchPhoto(prompt, seed);
  if (photo) {
    try {
      return { buffer: await toWebp(photo), source: "photo" };
    } catch {
      /* fallback abaixo */
    }
  }

  const svg = buildFallbackSvg(nome, categoriaSlug, preco);
  const buffer = await sharp(Buffer.from(svg)).resize(SIZE, SIZE).webp({ quality: 88 }).toBuffer();
  return { buffer, source: "svg" };
}

async function main(): Promise<void> {
  const force = process.argv.includes("--force");
  console.log("Gerando WebP simulados para produtos demo...\n");

  let criados = 0;
  let fotos = 0;
  let svgFallback = 0;
  let pngRemovidos = 0;

  for (const store of DEMO_STORES) {
    const dir = resolve(PUBLIC_DEMO, store.slug, "produtos");
    mkdirSync(dir, { recursive: true });

    for (const produto of store.produtos) {
      const webpPath = resolve(dir, `${produto.ordem}.webp`);
      const pngPath = resolve(dir, `${produto.ordem}.png`);

      if (existsSync(webpPath) && !force) {
        console.log(`  = ${store.slug}/produtos/${produto.ordem}.webp (já existe)`);
        continue;
      }

      const { buffer, source } = await generateImage(
        store.slug,
        produto.nome,
        store.categoriaSlug,
        produto.preco,
        produto.ordem,
      );

      writeFileSync(webpPath, buffer);

      if (existsSync(pngPath)) {
        unlinkSync(pngPath);
        pngRemovidos += 1;
      }

      if (source === "photo") fotos += 1;
      else svgFallback += 1;

      const kb = (buffer.length / 1024).toFixed(1);
      const tag = source === "photo" ? "foto" : "svg";
      console.log(
        `  + ${store.slug}/produtos/${produto.ordem}.webp (${kb} KB, ${tag}) — ${produto.nome}`,
      );
      criados += 1;
    }
  }

  console.log(`\nConcluído: ${criados} WebP | ${fotos} fotos | ${svgFallback} SVG fallback`);
  if (pngRemovidos) console.log(`${pngRemovidos} PNG removido(s).`);
  console.log("Próximo: npx tsx scripts/upload-demo-images.ts");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
