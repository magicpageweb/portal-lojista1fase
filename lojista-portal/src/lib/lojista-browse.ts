import { sortLojistasByPlano } from "@/lib/format";
import type { LojistaSortMode } from "@/components/lojista-browse-controls";

export function sortLojistasList(list: any[], mode: LojistaSortMode) {
  if (mode === "az") {
    return [...list].sort((a, b) =>
      (a.nome_fantasia ?? "").localeCompare(b.nome_fantasia ?? "", "pt-BR", { sensitivity: "base" }),
    );
  }
  if (mode === "za") {
    return [...list].sort((a, b) =>
      (b.nome_fantasia ?? "").localeCompare(a.nome_fantasia ?? "", "pt-BR", { sensitivity: "base" }),
    );
  }
  return sortLojistasByPlano(list);
}

export function filterLojistasList(
  lojistas: any[],
  opts: {
    q?: string;
    cat?: string;
    cidadeSlug?: string;
    cidades?: { slug: string; nome: string }[];
  },
) {
  const query = (opts.q ?? "").trim().toLowerCase();
  return lojistas.filter((l: any) => {
    if (opts.cat && l.categorias?.slug !== opts.cat) return false;
    if (opts.cidadeSlug) {
      const slug = l.cidades?.slug ?? null;
      const texto = (l.cidade ?? "").toLowerCase();
      const matchSlug = slug === opts.cidadeSlug;
      const matchTexto =
        opts.cidades?.find((c) => c.slug === opts.cidadeSlug)?.nome?.toLowerCase() === texto;
      if (!matchSlug && !matchTexto) return false;
    }
    if (!query) return true;
    return (
      l.nome_fantasia?.toLowerCase().includes(query) ||
      l.descricao?.toLowerCase().includes(query) ||
      l.slogan?.toLowerCase().includes(query) ||
      l.bairro?.toLowerCase().includes(query) ||
      l.cidade?.toLowerCase().includes(query) ||
      l.categorias?.nome?.toLowerCase().includes(query)
    );
  });
}
