/**
 * Remove capa.png / logo.png quando existir o .webp equivalente.
 * Remove produtos/N.png quando existir produtos/N.webp.
 */
import { existsSync, unlinkSync, readdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { DEMO_STORES } from "./demo-data";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DEMO = resolve(__dirname, "../public/demo");

function removeIfWebpExists(pngPath: string, webpPath: string): boolean {
  if (existsSync(webpPath) && existsSync(pngPath)) {
    unlinkSync(pngPath);
    console.log(`  - removido ${pngPath.replace(PUBLIC_DEMO + "\\", "").replace(PUBLIC_DEMO + "/", "")}`);
    return true;
  }
  return false;
}

function main(): void {
  console.log("Limpando PNGs duplicados (quando .webp existe)...\n");
  let removidos = 0;

  for (const store of DEMO_STORES) {
    const base = resolve(PUBLIC_DEMO, store.slug);
    if (removeIfWebpExists(resolve(base, "capa.png"), resolve(base, "capa.webp"))) removidos += 1;
    if (removeIfWebpExists(resolve(base, "logo.png"), resolve(base, "logo.webp"))) removidos += 1;

    const prodDir = resolve(base, "produtos");
    if (!existsSync(prodDir)) continue;

    for (const file of readdirSync(prodDir)) {
      const m = /^(\d+)\.png$/.exec(file);
      if (!m) continue;
      const ordem = m[1];
      if (
        removeIfWebpExists(
          resolve(prodDir, `${ordem}.png`),
          resolve(prodDir, `${ordem}.webp`),
        )
      ) {
        removidos += 1;
      }
    }
  }

  console.log(`\n${removidos} arquivo(s) PNG removido(s).`);
}

main();
