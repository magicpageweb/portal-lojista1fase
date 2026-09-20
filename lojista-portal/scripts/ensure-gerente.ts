/**
 * Garante a conta de gerente (staff não-técnico) do portal.
 *
 * USO
 *   npx tsx scripts/ensure-gerente.ts --confirm
 *
 * Requer SUPABASE_SERVICE_ROLE_KEY no .env local.
 */

import { createClient } from "@supabase/supabase-js";
import type { Database } from "../src/integrations/supabase/types";
import { getSupabaseCredentials } from "./load-env";

const CONFIRMED = process.argv.includes("--confirm");

const EMAIL = process.env.GERENTE_EMAIL ?? "gerente@sindilojas.demo";
const PASSWORD = process.env.GERENTE_PASSWORD ?? "Gerente@Sindilojas28";
const NOME = process.env.GERENTE_NOME ?? "Gerente Sindilojas";

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

  console.log(`Gerente: ${EMAIL}`);
  if (!CONFIRMED) {
    console.log("Dry-run. Para criar/atualizar: npx tsx scripts/ensure-gerente.ts --confirm");
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
    { user_id: user.id, role: "gerente" },
    { onConflict: "user_id,role" },
  );
  if (roleErr) throw roleErr;

  const { data: roles } = await admin.from("user_roles").select("role").eq("user_id", user.id);
  console.log(`Roles: ${(roles ?? []).map((r) => r.role).join(", ")}`);
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
