/**
 * Gera capa.webp (1200×480) e logo.webp (256×256) para lojas demo sem arquivos locais.
 * Uso: npx tsx scripts/generate-demo-brand-webps.ts
 */
import { mkdirSync, existsSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { DEMO_STORES } from "./demo-data";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DEMO = resolve(__dirname, "../public/demo");

const CAPA = { w: 1200, h: 480 };
const LOGO = { w: 256, h: 256 };

type BrandTheme = {
  bg1: string;
  bg2: string;
  accent: string;
  icon: string;
  label: string;
};

const THEMES: Record<string, BrandTheme> = {
  papelaria: {
    bg1: "#e8f4f8",
    bg2: "#b8dce8",
    accent: "#2E86AB",
    icon: "✏️",
    label: "Papelaria",
  },
  "otica-relojoaria": {
    bg1: "#ede7f6",
    bg2: "#c5b3e6",
    accent: "#6C3483",
    icon: "👓",
    label: "Ótica",
  },
  moda: { bg1: "#fdf6f0", bg2: "#f5e6d8", accent: "#c47a3a", icon: "👗", label: "Moda" },
  alimentacao: { bg1: "#fff8f0", bg2: "#ffe8d4", accent: "#d35400", icon: "🥖", label: "Alimentação" },
  "beleza-saude": { bg1: "#fff5f8", bg2: "#fce4ec", accent: "#c2185b", icon: "💇", label: "Beleza" },
  "casa-decoracao": { bg1: "#f8f5ff", bg2: "#ede7f6", accent: "#7b1fa2", icon: "🏠", label: "Casa" },
  tecnologia: { bg1: "#f0f4f8", bg2: "#dce6f0", accent: "#1565c0", icon: "💻", label: "Tech" },
  automotivo: { bg1: "#f4f6f7", bg2: "#dfe4e8", accent: "#37474f", icon: "🔧", label: "Auto" },
};

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function wrapTitle(text: string, maxChars: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length <= maxChars) current = next;
    else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines.slice(0, 2);
}

function buildCapaSvg(nome: string, theme: BrandTheme): string {
  const lines = wrapTitle(nome, 28);
  const titleY = 280 - (lines.length - 1) * 36;
  const titleTspans = lines
    .map((line, i) => `<tspan x="600" dy="${i === 0 ? 0 : 36}">${escapeXml(line)}</tspan>`)
    .join("");

  return `<svg width="${CAPA.w}" height="${CAPA.h}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${theme.bg1}"/>
      <stop offset="100%" stop-color="${theme.bg2}"/>
    </linearGradient>
  </defs>
  <rect width="${CAPA.w}" height="${CAPA.h}" fill="url(#bg)"/>
  <circle cx="1050" cy="120" r="180" fill="${theme.accent}" opacity="0.12"/>
  <circle cx="150" cy="400" r="120" fill="${theme.accent}" opacity="0.08"/>
  <text x="600" y="180" text-anchor="middle" font-size="96" font-family="Segoe UI Emoji, Apple Color Emoji, sans-serif">${theme.icon}</text>
  <text x="600" y="${titleY}" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="42" font-weight="800" fill="#1a1a2e">${titleTspans}</text>
  <text x="600" y="380" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="22" font-weight="600" fill="${theme.accent}">${escapeXml(theme.label)} · Demo</text>
</svg>`;
}

function buildLogoSvg(nome: string, theme: BrandTheme): string {
  const initial = nome.trim().charAt(0).toUpperCase();
  return `<svg width="${LOGO.w}" height="${LOGO.h}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${theme.bg1}"/>
      <stop offset="100%" stop-color="${theme.bg2}"/>
    </linearGradient>
  </defs>
  <rect width="${LOGO.w}" height="${LOGO.h}" rx="48" fill="url(#bg)"/>
  <rect x="16" y="16" width="224" height="224" rx="40" fill="#ffffff" opacity="0.85"/>
  <text x="128" y="148" text-anchor="middle" font-size="72" font-family="Segoe UI Emoji, Apple Color Emoji, sans-serif">${theme.icon}</text>
  <text x="128" y="210" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="36" font-weight="800" fill="${theme.accent}">${escapeXml(initial)}</text>
</svg>`;
}

async function toWebp(svg: string, w: number, h: number, quality: number): Promise<Buffer> {
  return sharp(Buffer.from(svg)).resize(w, h).webp({ quality, effort: 4 }).toBuffer();
}

async function main(): Promise<void> {
  const force = process.argv.includes("--force");
  console.log("Gerando capa/logo WebP para lojas demo...\n");

  let criados = 0;

  for (const store of DEMO_STORES) {
    const dir = resolve(PUBLIC_DEMO, store.slug);
    mkdirSync(dir, { recursive: true });

    const theme = THEMES[store.categoriaSlug] ?? THEMES.tecnologia;
    const capaPath = resolve(dir, "capa.webp");
    const logoPath = resolve(dir, "logo.webp");

    if (!existsSync(capaPath) || force) {
      const buffer = await toWebp(buildCapaSvg(store.nome_fantasia, theme), CAPA.w, CAPA.h, 82);
      writeFileSync(capaPath, buffer);
      console.log(`  + ${store.slug}/capa.webp (${(buffer.length / 1024).toFixed(1)} KB)`);
      criados += 1;
    }

    if (!existsSync(logoPath) || force) {
      const buffer = await toWebp(buildLogoSvg(store.nome_fantasia, theme), LOGO.w, LOGO.h, 85);
      writeFileSync(logoPath, buffer);
      console.log(`  + ${store.slug}/logo.webp (${(buffer.length / 1024).toFixed(1)} KB)`);
      criados += 1;
    }
  }

  console.log(`\nConcluído: ${criados} arquivo(s) gerado(s).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
