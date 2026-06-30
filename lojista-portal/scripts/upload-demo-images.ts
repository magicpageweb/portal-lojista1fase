import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "../src/integrations/supabase/types";
import { DEMO_STORES } from "./demo-data";
import {
  demoCapaPath,
  demoLogoPath,
  demoProdutoPath,
  produtoFotoUrl,
} from "./demo-images";
import { getSupabaseCredentials } from "./load-env";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DEMO = resolve(__dirname, "../public/demo");

type ImageKind = "capa" | "logo" | "produto";

function resolveLocalImage(
  slug: string,
  kind: ImageKind,
  ordem?: number,
): { path: string; ext: "webp" | "png"; contentType: string } | null {
  const base =
    kind === "produto"
      ? resolve(PUBLIC_DEMO, slug, "produtos", String(ordem))
      : resolve(PUBLIC_DEMO, slug, kind);

  for (const ext of ["webp", "png"] as const) {
    const full = `${base}.${ext}`;
    if (existsSync(full)) {
      return {
        path: full,
        ext,
        contentType: ext === "webp" ? "image/webp" : "image/png",
      };
    }
  }
  return null;
}

async function uploadFile(
  admin: ReturnType<typeof createClient<Database>>,
  storagePath: string,
  local: { path: string; contentType: string },
): Promise<void> {
  const buffer = readFileSync(local.path);
  const kb = (buffer.length / 1024).toFixed(1);
  const { error } = await admin.storage.from("lojistas").upload(storagePath, buffer, {
    upsert: true,
    contentType: local.contentType,
  });
  if (error) throw error;
  console.log(`    ↑ ${storagePath} (${kb} KB)`);
}

async function main(): Promise<void> {
  const { url, serviceRoleKey } = getSupabaseCredentials();
  const admin = createClient<Database>(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  console.log("Upload imagens demo → Supabase Storage");
  console.log(`Pasta local: ${PUBLIC_DEMO}`);
  console.log("Formato preferido: .webp (fallback: .png)\n");

  for (const store of DEMO_STORES) {
    console.log(`→ ${store.nome_fantasia}`);

    const { data: lojista, error: findError } = await admin
      .from("lojistas")
      .select("id")
      .eq("slug", store.slug)
      .maybeSingle();

    if (findError) throw findError;
    if (!lojista?.id) {
      console.log(`  ! loja não encontrada (${store.slug}), pulando`);
      continue;
    }

    const capaLocal = resolveLocalImage(store.slug, "capa");
    const logoLocal = resolveLocalImage(store.slug, "logo");

    if (!capaLocal || !logoLocal) {
      console.log(`  ! capa/logo ausentes em public/demo/${store.slug}/`);
      console.log("    Esperado: capa.webp e logo.webp");
      continue;
    }

    const capaStorage = demoCapaPath(store.slug).replace(/\.webp$/, `.${capaLocal.ext}`);
    const logoStorage = demoLogoPath(store.slug).replace(/\.webp$/, `.${logoLocal.ext}`);

    await uploadFile(admin, capaStorage, capaLocal);
    await uploadFile(admin, logoStorage, logoLocal);

    const { error: lojistaError } = await admin
      .from("lojistas")
      .update({ capa_url: capaStorage, logo_url: logoStorage })
      .eq("id", lojista.id);

    if (lojistaError) throw lojistaError;

    let produtosComArquivo = 0;
    for (const produto of store.produtos) {
      const local = resolveLocalImage(store.slug, "produto", produto.ordem);
      const foto = local
        ? demoProdutoPath(store.slug, produto.ordem).replace(/\.webp$/, `.${local.ext}`)
        : produtoFotoUrl(produto.nome, store.categoriaSlug);

      if (local) {
        await uploadFile(admin, foto, local);
        produtosComArquivo += 1;
      }

      const { error: produtoError } = await admin
        .from("produtos")
        .update({ foto_url: foto })
        .eq("lojista_id", lojista.id)
        .eq("ordem", produto.ordem);

      if (produtoError) throw produtoError;
    }

    console.log(
      `  ✓ loja atualizada | produtos com arquivo: ${produtosComArquivo}/${store.produtos.length}`,
    );
  }

  console.log("\nConcluído. Atualize /lojistas no navegador (Ctrl+F5).");
}

main().catch((err) => {
  console.error("\nFalha no upload de imagens demo:");
  console.error(err);
  process.exit(1);
});
