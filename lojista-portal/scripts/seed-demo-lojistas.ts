import { createClient } from "@supabase/supabase-js";
import type { Database } from "../src/integrations/supabase/types";
import {
  DEMO_SEED_PASSWORD,
  DEMO_STORES,
  DEMO_CITY,
  DEMO_STATE,
  DEMO_SLUG_PREFIX,
  demoEmailForStore,
  type DemoStore,
} from "./demo-data";
import { getSupabaseCredentials } from "./load-env";

async function findUserIdByEmail(
  admin: ReturnType<typeof createClient<Database>>,
  email: string,
): Promise<string | null> {
  let page = 1;
  const perPage = 200;

  while (true) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage });
    if (error) throw error;
    const hit = data.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
    if (hit) return hit.id;
    if (data.users.length < perPage) break;
    page += 1;
  }
  return null;
}

async function ensureDemoUser(
  admin: ReturnType<typeof createClient<Database>>,
  store: DemoStore,
): Promise<string> {
  const email = demoEmailForStore(store.slug);

  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email,
    password: DEMO_SEED_PASSWORD,
    email_confirm: true,
    user_metadata: {
      nome: store.nome_fantasia,
      demo: true,
    },
  });

  if (!createError && created.user) {
    console.log(`  + usuário criado: ${email}`);
    return created.user.id;
  }

  if (createError && !/already|registered|exists/i.test(createError.message)) {
    throw createError;
  }

  const existingId = await findUserIdByEmail(admin, email);
  if (!existingId) {
    throw new Error(`Usuário demo já deveria existir, mas não foi encontrado: ${email}`);
  }
  console.log(`  = usuário já existe: ${email}`);
  return existingId;
}

async function getCategoriaId(
  admin: ReturnType<typeof createClient<Database>>,
  slug: string,
): Promise<string> {
  const { data, error } = await admin.from("categorias").select("id").eq("slug", slug).maybeSingle();
  if (error) throw error;
  if (!data?.id) throw new Error(`Categoria não encontrada: ${slug}`);
  return data.id;
}

const DEMO_CATEGORIAS = [
  { nome: "Papelaria", slug: "papelaria", icone: "PenLine", cor: "#2E86AB", ordem: 9 },
  { nome: "Ótica & Relojoaria", slug: "otica-relojoaria", icone: "Glasses", cor: "#6C3483", ordem: 10 },
] as const;

async function ensureDemoCategorias(admin: ReturnType<typeof createClient<Database>>): Promise<void> {
  for (const cat of DEMO_CATEGORIAS) {
    const { data, error } = await admin.from("categorias").select("id").eq("slug", cat.slug).maybeSingle();
    if (error) throw error;
    if (data?.id) continue;

    const { error: insertError } = await admin.from("categorias").insert({
      nome: cat.nome,
      slug: cat.slug,
      icone: cat.icone,
      cor: cat.cor,
      ordem: cat.ordem,
    });
    if (insertError) throw insertError;
    console.log(`  + categoria demo: ${cat.nome} (${cat.slug})`);
  }
}

async function seedStore(
  admin: ReturnType<typeof createClient<Database>>,
  store: DemoStore,
): Promise<void> {
  console.log(`\n→ ${store.nome_fantasia} (${store.slug})`);

  const { data: existingLojista } = await admin
    .from("lojistas")
    .select("id")
    .eq("slug", store.slug)
    .maybeSingle();

  if (existingLojista?.id) {
    console.log(`  = loja já cadastrada (slug ${store.slug}), pulando.`);
    return;
  }

  const userId = await ensureDemoUser(admin, store);
  const categoriaId = await getCategoriaId(admin, store.categoriaSlug);

  const { data: lojista, error: lojistaError } = await admin
    .from("lojistas")
    .insert({
      user_id: userId,
      slug: store.slug,
      nome_fantasia: store.nome_fantasia,
      razao_social: store.razao_social,
      categoria_id: categoriaId,
      descricao: store.descricao,
      slogan: store.slogan,
      telefone: store.telefone,
      whatsapp: store.whatsapp,
      email: demoEmailForStore(store.slug),
      site: store.site,
      endereco: store.endereco,
      numero: store.numero,
      bairro: store.bairro,
      cidade: DEMO_CITY,
      estado: DEMO_STATE,
      cep: store.cep,
      instagram: store.instagram,
      logo_url: store.logo_url,
      capa_url: store.capa_url,
      status: "ativo",
      destaque: store.destaque,
    })
    .select("id")
    .single();

  if (lojistaError) throw lojistaError;
  console.log(`  + loja criada: ${store.slug}`);

  const produtos = store.produtos.map((p) => ({
    lojista_id: lojista.id,
    nome: p.nome,
    descricao: p.descricao,
    preco: p.preco,
    foto_url: p.foto_url,
    ativo: true,
    ordem: p.ordem,
  }));

  const { error: produtosError } = await admin.from("produtos").insert(produtos);
  if (produtosError) throw produtosError;
  console.log(`  + ${produtos.length} produtos inseridos`);
}

async function main(): Promise<void> {
  const { url, serviceRoleKey } = getSupabaseCredentials();
  const admin = createClient<Database>(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  console.log("Seed demo — Portal Lojista Sindilojas");
  console.log(`Cidade: ${DEMO_CITY} / ${DEMO_STATE}`);
  console.log(`Lojas: ${DEMO_STORES.length} | Prefixo slug: ${DEMO_SLUG_PREFIX}`);

  await ensureDemoCategorias(admin);

  for (const store of DEMO_STORES) {
    await seedStore(admin, store);
  }

  console.log("\nConcluído. Abra http://localhost:8080/lojistas para validar.");
}

main().catch((err) => {
  console.error("\nFalha no seed demo:");
  console.error(err);
  process.exit(1);
});
