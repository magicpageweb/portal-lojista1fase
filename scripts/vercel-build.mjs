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

function run(cmd, cwd) {
  console.log(`\n> ${cmd}  (cwd: ${cwd})\n`);
  execSync(cmd, { cwd, stdio: "inherit", env: process.env });
}

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
