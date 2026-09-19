/**
 * Aplica a migration de planos/is_demo via conexão Postgres direta.
 *
 * Requer no .env (Settings → Database → Database password):
 *   SUPABASE_DB_PASSWORD=...
 * ou
 *   DATABASE_URL=postgresql://postgres:...@db.<ref>.supabase.co:5432/postgres
 *
 * Uso: npx tsx scripts/apply-migration-plano.ts
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnv, getSupabaseCredentials } from "./load-env";

const __dirname = dirname(fileURLToPath(import.meta.url));
const MIGRATION = resolve(
  __dirname,
  "../supabase/migrations/20260919130000_add_plano_is_demo_and_produto_gating.sql",
);

async function main() {
  loadEnv();
  const { url } = getSupabaseCredentials();
  const ref = new URL(url).hostname.split(".")[0];

  if (!existsSync(MIGRATION)) {
    throw new Error(`Migration não encontrada: ${MIGRATION}`);
  }
  const sql = readFileSync(MIGRATION, "utf8");

  const databaseUrl =
    process.env.DATABASE_URL ||
    (process.env.SUPABASE_DB_PASSWORD
      ? `postgresql://postgres.${ref}:${encodeURIComponent(process.env.SUPABASE_DB_PASSWORD)}@aws-0-sa-east-1.pooler.supabase.com:6543/postgres`
      : null);

  if (!databaseUrl) {
    console.error(
      "Falta SUPABASE_DB_PASSWORD ou DATABASE_URL no .env.\n" +
        "Alternativa: rode o SQL no dashboard:\n" +
        `https://supabase.com/dashboard/project/${ref}/sql/new`,
    );
    process.exit(2);
  }

  const { default: postgres } = await import("postgres");
  const sqlClient = postgres(databaseUrl, { max: 1, prepare: false });
  try {
    await sqlClient.unsafe(sql);
    console.log("Migration aplicada com sucesso.");
  } finally {
    await sqlClient.end({ timeout: 5 });
  }
}

main().catch((err) => {
  console.error("Falha ao aplicar migration:");
  console.error(err);
  process.exit(1);
});
