/**
 * Carga do catálogo de demonstração (18 lojistas fictícios).
 *
 * SEGURANÇA
 *  - Usa a SUPABASE_SERVICE_ROLE_KEY, que ignora RLS. Rode apenas localmente,
 *    com a chave vinda do .env da sua máquina — nunca em CI público nem em
 *    variável de ambiente de deploy.
 *  - O padrão é DRY-RUN: sem `--confirm` nada é escrito no banco.
 *
 * USO
 *   npx tsx scripts/seed-demo-lojistas.ts              # prévia, não escreve
 *   npx tsx scripts/seed-demo-lojistas.ts --confirm    # aplica a carga
 *   npx tsx scripts/seed-demo-lojistas.ts --purge --confirm   # remove a carga
 *
 * Os registros entram com `is_demo = true` e sem `user_id` (nenhuma conta de
 * acesso é criada). O `--purge` apaga exatamente `is_demo = true`, então
 * associados reais nunca são atingidos.
 */

import { pathToFileURL } from "node:url";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../src/integrations/supabase/types";
import {
  DEMO_CITY,
  DEMO_LOJISTAS,
  DEMO_STATE,
  demoCapaPath,
  demoCnpj,
  demoEmail,
  demoLogoPath,
  demoProdutoPath,
  type DemoLojista,
} from "./demo-catalogo";
import { getSupabaseCredentials } from "./load-env";

type Admin = SupabaseClient<Database>;

const args = new Set(process.argv.slice(2));
const CONFIRMED = args.has("--confirm");
const PURGE = args.has("--purge");

function resumo(): string {
  const porPlano = DEMO_LOJISTAS.reduce<Record<string, number>>((acc, l) => {
    acc[l.plano] = (acc[l.plano] ?? 0) + 1;
    return acc;
  }, {});
  const produtos = DEMO_LOJISTAS.reduce((n, l) => n + l.produtos.length, 0);
  return (
    `${DEMO_LOJISTAS.length} lojistas ` +
    `(essencial ${porPlano.essencial ?? 0} / vitrine ${porPlano.vitrine ?? 0} / destaque ${porPlano.destaque ?? 0}), ` +
    `${produtos} produtos`
  );
}

async function carregarCategorias(admin: Admin): Promise<Map<string, string>> {
  const { data, error } = await admin.from("categorias").select("id, slug");
  if (error) throw error;
  return new Map((data ?? []).map((c) => [c.slug, c.id]));
}

export function montarLojista(loja: DemoLojista, seq: number, categoriaId: string) {
  const pago = loja.plano !== "essencial";
  return {
    user_id: null,
    slug: loja.slug,
    nome_fantasia: loja.nome_fantasia,
    razao_social: loja.razao_social,
    cnpj: demoCnpj(seq),
    cnpj_verificado: false,
    categoria_id: categoriaId,
    bairro: loja.bairro,
    cidade: DEMO_CITY,
    estado: DEMO_STATE,
    telefone: loja.telefone,
    whatsapp: loja.whatsapp,
    email: demoEmail(loja.slug),
    status: "ativo" as const,
    plano: loja.plano,
    destaque: loja.destaque,
    is_demo: true,
    // Plano essencial: sem identidade visual nem conteúdo comercial.
    endereco: pago ? (loja.endereco ?? null) : null,
    numero: pago ? (loja.numero ?? null) : null,
    cep: pago ? (loja.cep ?? null) : null,
    slogan: pago ? (loja.slogan ?? null) : null,
    descricao: pago ? (loja.descricao ?? null) : null,
    site: pago ? (loja.site ?? null) : null,
    instagram: pago ? (loja.instagram ?? null) : null,
    logo_url: pago && loja.pastaImagens ? demoLogoPath(loja.pastaImagens) : null,
    capa_url: pago && loja.pastaImagens ? demoCapaPath(loja.pastaImagens) : null,
  };
}

async function purge(admin: Admin): Promise<void> {
  console.log("\n== Remoção da carga demo (is_demo = true) ==");

  const { data: demos, error } = await admin
    .from("lojistas")
    .select("id, slug")
    .eq("is_demo", true);
  if (error) throw error;

  const ids = (demos ?? []).map((d) => d.id);
  console.log(`Lojistas demo encontrados: ${ids.length}`);
  if (ids.length === 0) return;

  if (!CONFIRMED) {
    console.log("DRY-RUN: nada removido. Repita com --purge --confirm.");
    return;
  }

  const { error: prodErr } = await admin.from("produtos").delete().in("lojista_id", ids);
  if (prodErr) throw prodErr;
  console.log("  - produtos demo removidos");

  const { error: lojaErr } = await admin.from("lojistas").delete().eq("is_demo", true);
  if (lojaErr) throw lojaErr;
  console.log(`  - ${ids.length} lojistas demo removidos`);
}

async function seed(admin: Admin): Promise<void> {
  const categorias = await carregarCategorias(admin);

  const faltando = [...new Set(DEMO_LOJISTAS.map((l) => l.categoriaSlug))].filter(
    (slug) => !categorias.has(slug),
  );
  if (faltando.length > 0) {
    throw new Error(`Categorias ausentes no banco: ${faltando.join(", ")}`);
  }

  const { data: existentes, error: existentesErr } = await admin
    .from("lojistas")
    .select("slug")
    .in(
      "slug",
      DEMO_LOJISTAS.map((l) => l.slug),
    );
  if (existentesErr) throw existentesErr;
  const jaExiste = new Set((existentes ?? []).map((l) => l.slug));

  const pendentes = DEMO_LOJISTAS.filter((l) => !jaExiste.has(l.slug));
  console.log(`\nJá cadastrados: ${jaExiste.size} | A inserir: ${pendentes.length}`);

  if (!CONFIRMED) {
    console.log("\n-- DRY-RUN: prévia dos registros (nada foi escrito) --");
    for (const loja of pendentes) {
      const seq = DEMO_LOJISTAS.indexOf(loja) + 1;
      const linha = montarLojista(loja, seq, categorias.get(loja.categoriaSlug)!);
      console.log(
        `  [${linha.plano.padEnd(9)}] ${linha.nome_fantasia} — ${loja.categoriaSlug} / ${linha.bairro} — ` +
          `CNPJ ${linha.cnpj} — logo:${linha.logo_url ? "sim" : "não"} — produtos:${loja.produtos.length}`,
      );
    }
    console.log("\nPara aplicar de verdade: npx tsx scripts/seed-demo-lojistas.ts --confirm");
    return;
  }

  for (const loja of pendentes) {
    const seq = DEMO_LOJISTAS.indexOf(loja) + 1;
    const payload = montarLojista(loja, seq, categorias.get(loja.categoriaSlug)!);

    const { data: inserido, error: insErr } = await admin
      .from("lojistas")
      .insert(payload)
      .select("id")
      .single();
    if (insErr) throw insErr;

    console.log(`  + [${loja.plano}] ${loja.nome_fantasia}`);

    if (loja.produtos.length === 0) continue;

    const produtos = loja.produtos.map((p) => ({
      lojista_id: inserido.id,
      nome: p.nome,
      descricao: p.descricao,
      preco: p.preco,
      foto_url: loja.pastaImagens ? demoProdutoPath(loja.pastaImagens, p.imagem) : null,
      ativo: true,
      ordem: p.ordem,
    }));

    const { error: prodErr } = await admin.from("produtos").insert(produtos);
    if (prodErr) throw prodErr;
    console.log(`      ${produtos.length} produtos`);
  }
}

async function main(): Promise<void> {
  const { url, serviceRoleKey } = getSupabaseCredentials();

  console.log("Catálogo demo — Portal do Lojista Sindilojas");
  console.log(`Alvo:  ${url}`);
  console.log(`Carga: ${resumo()}`);
  console.log(`Modo:  ${PURGE ? "PURGE" : "SEED"} / ${CONFIRMED ? "APLICAR" : "DRY-RUN"}`);

  const admin = createClient<Database>(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  if (PURGE) {
    await purge(admin);
  } else {
    await seed(admin);
  }

  console.log("\nConcluído.");
}

// Só executa quando chamado direto na CLI, para permitir importar as funções
// acima em testes sem disparar a carga.
const executadoDireto =
  !!process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (executadoDireto) {
  main().catch((err) => {
    console.error("\nFalha no catálogo demo:");
    console.error(err);
    process.exit(1);
  });
}
