/**
 * Garante VITE_* no build de produção (Vercel e local).
 * Carrega .env local se existir; na Vercel exige variáveis no painel.
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const portal = resolve(__dirname, "..");
const envPath = resolve(portal, ".env");
const outPath = resolve(portal, ".env.production");

function loadDotEnv(file) {
  if (!existsSync(file)) return;
  for (const line of readFileSync(file, "utf8").split(/\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq < 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = value;
  }
}

function mirrorSupabaseEnv() {
  if (!process.env.VITE_SUPABASE_URL && process.env.SUPABASE_URL) {
    process.env.VITE_SUPABASE_URL = process.env.SUPABASE_URL;
  }
  if (!process.env.VITE_SUPABASE_PUBLISHABLE_KEY && process.env.SUPABASE_PUBLISHABLE_KEY) {
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY;
  }
  if (!process.env.SUPABASE_URL && process.env.VITE_SUPABASE_URL) {
    process.env.SUPABASE_URL = process.env.VITE_SUPABASE_URL;
  }
  if (!process.env.SUPABASE_PUBLISHABLE_KEY && process.env.VITE_SUPABASE_PUBLISHABLE_KEY) {
    process.env.SUPABASE_PUBLISHABLE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  }
}

loadDotEnv(envPath);
mirrorSupabaseEnv();

const onVercel = process.env.VERCEL === "1" || process.env.CI === "true";

if (onVercel) {
  const missing = [];
  if (!process.env.VITE_SUPABASE_URL) missing.push("VITE_SUPABASE_URL");
  if (!process.env.VITE_SUPABASE_PUBLISHABLE_KEY) missing.push("VITE_SUPABASE_PUBLISHABLE_KEY");
  if (missing.length) {
    console.error("\n❌ Supabase: configure na Vercel → Settings → Environment Variables:\n");
    for (const v of missing) console.error(`   • ${v}`);
    console.error("\n   (Aceita também SUPABASE_URL e SUPABASE_PUBLISHABLE_KEY.)\n");
    console.error("   Marque Production + Preview → Save → Redeploy.\n");
    process.exit(1);
  }
}

if (process.env.VITE_SUPABASE_URL && process.env.VITE_SUPABASE_PUBLISHABLE_KEY) {
  const lines = [
    `VITE_SUPABASE_URL=${process.env.VITE_SUPABASE_URL}`,
    `VITE_SUPABASE_PUBLISHABLE_KEY=${process.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
  ];
  if (process.env.VITE_SUPABASE_PROJECT_ID) {
    lines.push(`VITE_SUPABASE_PROJECT_ID=${process.env.VITE_SUPABASE_PROJECT_ID}`);
  }
  writeFileSync(outPath, `${lines.join("\n")}\n`, "utf8");
  console.log(`[prepare-build-env] ${outPath} (${lines.length} variáveis)`);
}
