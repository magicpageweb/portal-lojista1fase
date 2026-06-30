/**
 * Build do app em lojista-portal/ e copia .vercel/output para a raiz.
 * Necessário porque o repositório é monorepo e a Vercel clona a raiz.
 */
import { execSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const portal = resolve(root, "lojista-portal");
const srcOutput = resolve(portal, ".vercel/output");
const destOutput = resolve(root, ".vercel/output");

/** Vite só expõe VITE_* no bundle do browser — espelha SUPABASE_* se necessário. */
function ensureSupabaseEnv() {
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

function assertSupabaseEnv() {
  ensureSupabaseEnv();
  const missing = [];
  if (!process.env.VITE_SUPABASE_URL) missing.push("VITE_SUPABASE_URL (ou SUPABASE_URL)");
  if (!process.env.VITE_SUPABASE_PUBLISHABLE_KEY) {
    missing.push("VITE_SUPABASE_PUBLISHABLE_KEY (ou SUPABASE_PUBLISHABLE_KEY)");
  }
  if (missing.length) {
    console.error("\n❌ Variáveis Supabase ausentes na Vercel (Settings → Environment Variables):\n");
    for (const v of missing) console.error(`   • ${v}`);
    console.error("\nMarque Production + Preview, salve e faça Redeploy.\n");
    process.exit(1);
  }
}

function run(cmd, cwd) {
  console.log(`\n> ${cmd}  (cwd: ${cwd})\n`);
  execSync(cmd, { cwd, stdio: "inherit", env: process.env });
}

assertSupabaseEnv();

run("npm install", portal);
run("npm run build", portal);

if (!existsSync(srcOutput)) {
  console.error(`Build output não encontrado: ${srcOutput}`);
  console.error("Confirme nitro: { preset: 'vercel' } em lojista-portal/vite.config.ts");
  process.exit(1);
}

const destParent = resolve(root, ".vercel");
if (existsSync(destParent)) {
  rmSync(destParent, { recursive: true, force: true });
}
mkdirSync(destParent, { recursive: true });
cpSync(srcOutput, destOutput, { recursive: true });

console.log(`\n✓ Output copiado para ${destOutput}`);
