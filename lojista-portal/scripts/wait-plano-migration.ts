/**
 * Espera a coluna is_demo existir (migration aplicada) e opcionalmente segue o fluxo.
 * Uso: npx tsx scripts/wait-plano-migration.ts
 */
import { createClient } from "@supabase/supabase-js";
import { getSupabaseCredentials, loadEnv } from "./load-env";

loadEnv();

async function hasIsDemoColumn(): Promise<boolean> {
  const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL!;
  const anon =
    process.env.SUPABASE_PUBLISHABLE_KEY ?? process.env.VITE_SUPABASE_PUBLISHABLE_KEY!;
  const res = await fetch(`${url}/rest/v1/lojistas?select=is_demo&limit=1`, {
    headers: { apikey: anon, Authorization: `Bearer ${anon}` },
  });
  if (res.status === 200) return true;
  const body = await res.text();
  if (body.includes("is_demo") && body.includes("does not exist")) return false;
  // 200 with data, or other errors
  return res.ok;
}

async function main() {
  const { url } = getSupabaseCredentials();
  console.log("Aguardando migration (coluna is_demo) em", url);
  for (let i = 1; i <= 60; i++) {
    const ok = await hasIsDemoColumn();
    if (ok) {
      console.log(`OK — is_demo disponível (tentativa ${i}).`);
      process.exit(0);
    }
    console.log(`… ainda sem is_demo (${i}/60), aguardando 5s`);
    await new Promise((r) => setTimeout(r, 5000));
  }
  console.error("Timeout: migration não detectada.");
  process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
