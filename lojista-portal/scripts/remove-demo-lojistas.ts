import { createClient } from "@supabase/supabase-js";
import type { Database } from "../src/integrations/supabase/types";
import { DEMO_EMAIL_DOMAIN, DEMO_SLUG_PREFIX } from "./demo-data";
import { getSupabaseCredentials } from "./load-env";

async function listDemoUsers(admin: ReturnType<typeof createClient<Database>>) {
  const users: { id: string; email: string }[] = [];
  let page = 1;
  const perPage = 200;

  while (true) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage });
    if (error) throw error;

    for (const user of data.users) {
      const email = user.email ?? "";
      const isDemoEmail = email.toLowerCase().endsWith(`@${DEMO_EMAIL_DOMAIN}`);
      const isDemoMeta = user.user_metadata?.demo === true;
      if (isDemoEmail || isDemoMeta) {
        users.push({ id: user.id, email });
      }
    }

    if (data.users.length < perPage) break;
    page += 1;
  }

  return users;
}

async function main(): Promise<void> {
  const { url, serviceRoleKey } = getSupabaseCredentials();
  const admin = createClient<Database>(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  console.log("Remoção demo — Portal Lojista Sindilojas");

  const { data: lojistas, error: lojistasError } = await admin
    .from("lojistas")
    .select("id, slug, user_id")
    .like("slug", `${DEMO_SLUG_PREFIX}%`);

  if (lojistasError) throw lojistasError;

  const lojistaIds = (lojistas ?? []).map((l) => l.id);
  console.log(`Lojas demo encontradas: ${lojistaIds.length}`);

  if (lojistaIds.length > 0) {
    const { error: produtosError } = await admin.from("produtos").delete().in("lojista_id", lojistaIds);
    if (produtosError) throw produtosError;
    console.log("  - produtos demo removidos");

    const { error: deleteLojistasError } = await admin.from("lojistas").delete().in("id", lojistaIds);
    if (deleteLojistasError) throw deleteLojistasError;
    console.log("  - lojistas demo removidos");
  }

  const demoUsers = await listDemoUsers(admin);
  console.log(`Usuários demo encontrados: ${demoUsers.length}`);

  for (const user of demoUsers) {
    const { error } = await admin.auth.admin.deleteUser(user.id);
    if (error) {
      console.warn(`  ! falha ao remover usuário ${user.email}: ${error.message}`);
      continue;
    }
    console.log(`  - usuário removido: ${user.email}`);
  }

  const orphanUserIds = (lojistas ?? [])
    .map((l) => l.user_id)
    .filter((id) => !demoUsers.some((u) => u.id === id));

  for (const userId of orphanUserIds) {
    const { error } = await admin.auth.admin.deleteUser(userId);
    if (error) {
      console.warn(`  ! falha ao remover usuário órfão ${userId}: ${error.message}`);
    } else {
      console.log(`  - usuário órfão removido: ${userId}`);
    }
  }

  console.log("\nRemoção demo concluída.");
}

main().catch((err) => {
  console.error("\nFalha na remoção demo:");
  console.error(err);
  process.exit(1);
});
