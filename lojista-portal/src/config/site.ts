/** Marca e links do desenvolvedor do portal. */
export const MAGICPAGE = {
  name: "MagicPage Desenvolvimento Web",
  url: "https://www.magicpage.com.br",
} as const;

export function supabaseConfigError(missing: string[]): string {
  return (
    `Variáveis Supabase ausentes (${missing.join(", ")}). ` +
    `Configure o ambiente ou contate ${MAGICPAGE.name}: ${MAGICPAGE.url}`
  );
}
