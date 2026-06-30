/**
 * Re-tenta gerar fotos para produtos que ficaram com fallback SVG (< 12 KB).
 * Uso: npx tsx scripts/retry-demo-produto-photos.ts
 */
import { readFileSync, writeFileSync, unlinkSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { DEMO_STORES } from "./demo-data";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DEMO = resolve(__dirname, "../public/demo");
const SIZE = 640;
const SVG_MAX_KB = 12;
const FETCH_TIMEOUT_MS = 60_000;

const PRODUTO_PROMPT: Record<string, string> = {
  "Kimono Estampado Floral":
    "floral kimono cardigan fashion product photo white background studio",
  "Coxinha de Frango (un.)":
    "brazilian coxinha fried snack golden crispy product photo",
  "Empada de Palmito":
    "brazilian savory empadinha pastry product photo appetizing",
  "Suco Natural Laranja 300ml":
    "fresh orange juice glass natural product photo bright",
  "Corte Feminino": "woman haircut salon beauty service professional photo",
  "Corte Masculino": "barber mens haircut professional photo",
  "Escova Modeladora": "hair blow dry brush salon beauty photo",
  "Manicure Completa": "manicure nail polish salon hands photo",
  "Luminária de Mesa Nordic": "nordic table lamp wood product photo white background",
  "Tapete Sisal Natural 1,40m": "natural jute sisal rug product photo top view",
  "Kit Quadros Abstratos (3 peças)": "abstract wall art frames set product photo",
  "Vaso Cerâmica Terracota G": "terracotta ceramic plant pot product photo",
  "Cortina Blackout 2,80m": "gray blackout curtain fabric product photo",
  'Notebook 14" 8GB/256GB SSD': "silver laptop computer product photo white background",
  "Mouse Sem Fio Ergonômico": "wireless ergonomic mouse product photo white background",
  "Formatação + Instalação Windows": "computer repair technician laptop service photo",
  "Cabo USB-C 2m Reforçado": "usb-c charging cable product photo white background",
  "Suporte Articulado Monitor": "monitor arm desk mount product photo",
  "Troca de Óleo + Filtro": "car oil change mechanic garage service photo",
};

function seedFor(slug: string, ordem: number, attempt: number): number {
  let h = attempt * 997;
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
    if (buf.length < 4096) return null;
    return buf;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

async function main(): Promise<void> {
  console.log("Re-tentando fotos para WebP pequenos (fallback SVG)...\n");
  let atualizados = 0;

  for (const store of DEMO_STORES) {
    for (const produto of store.produtos) {
      const webpPath = resolve(PUBLIC_DEMO, store.slug, "produtos", `${produto.ordem}.webp`);
      if (!existsSync(webpPath)) continue;

      const sizeKb = readFileSync(webpPath).length / 1024;
      if (sizeKb >= SVG_MAX_KB) continue;

      const prompt =
        PRODUTO_PROMPT[produto.nome] ??
        `professional product photo ${produto.nome}, e-commerce white background`;

      for (let attempt = 1; attempt <= 3; attempt += 1) {
        const seed = seedFor(store.slug, produto.ordem, attempt);
        const photo = await fetchPhoto(prompt, seed);
        if (!photo) continue;

        try {
          const webp = await sharp(photo)
            .resize(SIZE, SIZE, { fit: "cover", position: "centre" })
            .webp({ quality: 85, effort: 4 })
            .toBuffer();

          if (webp.length / 1024 < SVG_MAX_KB) continue;

          writeFileSync(webpPath, webp);
          const pngPath = resolve(PUBLIC_DEMO, store.slug, "produtos", `${produto.ordem}.png`);
          if (existsSync(pngPath)) unlinkSync(pngPath);

          console.log(
            `  ✓ ${store.slug}/produtos/${produto.ordem}.webp (${(webp.length / 1024).toFixed(1)} KB) — ${produto.nome}`,
          );
          atualizados += 1;
          break;
        } catch {
          /* próxima tentativa */
        }
      }
    }
  }

  console.log(`\n${atualizados} imagem(ns) atualizada(s) com foto.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
