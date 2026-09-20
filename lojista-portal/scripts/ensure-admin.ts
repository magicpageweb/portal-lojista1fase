/**
 * Garante a conta de administrador geral do portal.
 *
 * USO
 *   npx tsx scripts/ensure-admin.ts --confirm
 *
 * Requer SUPABASE_SERVICE_ROLE_KEY no .env local (não commitar).
 * Credenciais padrão (apresentação) — altere via env se quiser:
 *   ADMIN_EMAIL / ADMIN_PASSWORD
 */

import { createClient } from "@supabase/supabase-js";
import type { Database } from "../src/integrations/supabase/types";
import { getSupabaseCredentials } from "./load-env";

const CONFIRMED = process.argv.includes("--confirm");

const EMAIL = process.env.ADMIN_EMAIL ?? "admin@sindilojas.demo";
const PASSWORD = process.env.ADMIN_PASSWORD ?? "Sindilojas@Admin28";
const NOME = process.env.ADMIN_NOME ?? "Administrador Sindilojas";

async function findUserByEmail(
  admin: ReturnType<typeof createClient<Database>>,
  email: string,
) {
  const target = email.toLowerCase();
  let page = 1;
  for (;;) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 100 });
    if (error) throw error;
    const found = data.users.find((u) => u.email?.toLowerCase() === target);
    if (found) return found;
    if (data.users.length < 100) return null;
    page += 1;
  }
}

async function main() {
  const { url, serviceRoleKey } = getSupabaseCredentials();
  const admin = createClient<Database>(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  console.log(`Admin geral: ${EMAIL}`);
  if (!CONFIRMED) {
    console.log("Dry-run. Para criar/atualizar: npx tsx scripts/ensure-admin.ts --confirm");
    return;
  }

  let user = await findUserByEmail(admin, EMAIL);

  if (!user) {
    const { data, error } = await admin.auth.admin.createUser({
      email: EMAIL,
      password: PASSWORD,
      email_confirm: true,
      user_metadata: { nome: NOME },
    });
    if (error) throw error;
    user = data.user;
    console.log(`Usuário criado: ${user.id}`);
  } else {
    const { error } = await admin.auth.admin.updateUserById(user.id, {
      password: PASSWORD,
      email_confirm: true,
      user_metadata: { ...user.user_metadata, nome: NOME },
    });
    if (error) throw error;
    console.log(`Usuário já existia — senha redefinida: ${user.id}`);
  }

  const { error: roleErr } = await admin.from("user_roles").upsert(
    { user_id: user.id, role: "admin" },
    { onConflict: "user_id,role" },
  );
  if (roleErr) throw roleErr;

  console.log("Role admin garantida.");
  console.log("");
  console.log("Login:");
  console.log(`  URL:   /auth`);
  console.log(`  Email: ${EMAIL}`);
  console.log(`  Senha: ${PASSWORD}`);
  console.log(`  Painel: /admin`);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
