/**
 * Baixa placeholders PNG dos produtos demo para public/demo/{slug}/produtos/{ordem}.png
 * Converta cada arquivo para .webp e rode upload-demo-images.ts
 */
import { mkdirSync, existsSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { DEMO_STORES } from "./demo-data";
import { produtoFotoUrl } from "./demo-images";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DEMO = resolve(__dirname, "../public/demo");

async function main(): Promise<void> {
  console.log("Preparando PNGs de produtos em public/demo/.../produtos/\n");

  let criados = 0;
  let pulados = 0;

  for (const store of DEMO_STORES) {
    const dir = resolve(PUBLIC_DEMO, store.slug, "produtos");
    mkdirSync(dir, { recursive: true });

    for (const produto of store.produtos) {
      const pngPath = resolve(dir, `${produto.ordem}.png`);
      const webpPath = resolve(dir, `${produto.ordem}.webp`);

      if (existsSync(webpPath)) {
        pulados += 1;
        continue;
      }
      if (existsSync(pngPath)) {
        console.log(`  = ${store.slug}/produtos/${produto.ordem}.png (já existe)`);
        pulados += 1;
        continue;
      }

      const url = produtoFotoUrl(produto.nome, store.categoriaSlug);
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Falha ao baixar ${url}: ${res.status}`);

      const buf = Buffer.from(await res.arrayBuffer());
      writeFileSync(pngPath, buf);
      const kb = (buf.length / 1024).toFixed(1);
      console.log(`  + ${store.slug}/produtos/${produto.ordem}.png (${kb} KB) — ${produto.nome}`);
      criados += 1;
    }
  }

  console.log(`\nConcluído: ${criados} criados, ${pulados} pulados.`);
  console.log("Próximo: converta cada .png para .webp e rode upload-demo-images.ts");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
