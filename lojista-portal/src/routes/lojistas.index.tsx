import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { Search, Store } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { LojistaCard } from "@/components/lojista-card";
import { LojistaGrid } from "@/components/lojista-grid";
import { LojistaListRow } from "@/components/lojista-list-row";
import {
  LojistaBrowseControls,
  LojistaSortViewControls,
  type LojistaSortMode,
  type LojistaViewMode,
} from "@/components/lojista-browse-controls";
import { Input } from "@/components/ui/input";
import { CIDADES_ATUACAO } from "@/lib/cidades";
import { filterLojistasList, sortLojistasList } from "@/lib/lojista-browse";
import { sortLojistasByPlano } from "@/lib/format";

const searchSchema = z.object({
  q: z.string().optional(),
  cat: z.string().optional(),
  cidade: z.string().optional(),
  sort: z.enum(["relevancia", "az", "za"]).optional(),
  view: z.enum(["grid", "list"]).optional(),
});

export const Route = createFileRoute("/lojistas/")({
  validateSearch: searchSchema,
  head: ({ match }) => {
    const cidadeSlug = match.search.cidade;
    const cidadeNome = CIDADES_ATUACAO.find((c) => c.slug === cidadeSlug)?.nome;
    const title = cidadeNome
      ? `Lojistas em ${cidadeNome} | Sindilojas`
      : "Lojistas associados | Sindilojas";
    return {
      meta: [
        { title },
        {
          name: "description",
          content:
            "Explore todos os lojistas associados ao Sindilojas. Filtre por categoria e cidade, busque por nome ou produto.",
        },
      ],
    };
  },
  component: ListPage,
});

function ListPage() {
  const search = useSearch({ from: "/lojistas/" });
  const navigate = useNavigate({ from: "/lojistas/" });
  const [q, setQ] = useState(search.q ?? "");
  const [cat, setCat] = useState<string | undefined>(search.cat);
  const [cidadeSlug, setCidadeSlug] = useState<string | undefined>(search.cidade);
  const [view, setView] = useState<LojistaViewMode>(search.view ?? "grid");
  const [sort, setSort] = useState<LojistaSortMode>(search.sort ?? "relevancia");

  useEffect(() => {
    navigate({
      search: {
        q: q.trim() || undefined,
        cat: cat || undefined,
        cidade: cidadeSlug || undefined,
        sort: sort === "relevancia" ? undefined : sort,
        view: view === "grid" ? undefined : view,
      },
      replace: true,
    });
  }, [q, cat, cidadeSlug, sort, view, navigate]);

  const { data: cats = [] } = useQuery({
    queryKey: ["categorias"],
    queryFn: async () => (await supabase.from("categorias").select("*").order("ordem")).data ?? [],
  });

  const { data: cidades = [] } = useQuery({
    queryKey: ["cidades"],
    queryFn: async () => (await supabase.from("cidades").select("id, nome, slug").order("ordem")).data ?? [],
  });

  const { data: lojistas = [], isLoading } = useQuery({
    queryKey: ["lojistas", "all"],
    queryFn: async () => {
      const { data } = await supabase
        .from("lojistas")
        .select("*, categorias(nome, slug, cor, icone), cidades(nome, slug)")
        .eq("status", "ativo")
        .order("plano", { ascending: false })
        .order("nome_fantasia", { ascending: true });
      return sortLojistasByPlano(data ?? []);
    },
  });

  const filtered = useMemo(
    () =>
      sortLojistasList(
        filterLojistasList(lojistas, { q, cat, cidadeSlug, cidades }),
        sort,
      ),
    [lojistas, q, cat, cidadeSlug, sort, cidades],
  );

  const cidadeNome =
    cidades.find((c: any) => c.slug === cidadeSlug)?.nome ??
    CIDADES_ATUACAO.find((c) => c.slug === cidadeSlug)?.nome;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="gradient-hero py-16 text-secondary-foreground">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-4xl font-extrabold md:text-5xl">
            {cidadeNome ? `Lojistas em ${cidadeNome}` : "Lojistas associados"}
          </h1>
          <p className="mt-2 text-secondary-foreground/80">Encontre o comércio do seu bairro.</p>
          {cidadeSlug && (
            <p className="mt-2 text-sm text-secondary-foreground/70">
              Prefere a página da cidade?{" "}
              <Link
                to="/cidade/$slug"
                params={{ slug: cidadeSlug }}
                className="underline underline-offset-2 hover:text-primary"
              >
                Ver comércio de {cidadeNome ?? cidadeSlug}
              </Link>
            </p>
          )}
          <div className="mt-6 flex items-center gap-2 rounded-2xl border border-primary/20 bg-background/95 p-2 shadow-elegant">
            <Search className="ml-2 h-5 w-5 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar por nome, produto, bairro..."
              className="border-0 bg-transparent text-foreground shadow-none focus-visible:ring-0"
            />
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10">
        <LojistaBrowseControls
          cats={cats}
          cidades={cidades}
          cat={cat}
          cidadeSlug={cidadeSlug}
          sort={sort}
          view={view}
          onCatChange={setCat}
          onCidadeChange={setCidadeSlug}
          onSortChange={setSort}
          onViewChange={setView}
          showSortAndView={false}
          className="mb-4"
        />

        {isLoading ? (
          <p className="text-center text-muted-foreground">Carregando...</p>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-muted/30 px-6 py-20 text-center">
            <Store className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 font-display text-xl font-semibold">Nenhum lojista encontrado</h3>
            <p className="mt-1 text-sm text-muted-foreground">Tente ajustar sua busca ou filtros.</p>
          </div>
        ) : (
          <>
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">{filtered.length} lojista(s) encontrado(s)</p>
              <div className="flex flex-wrap items-center gap-2">
                <LojistaSortViewControls
                  sort={sort}
                  view={view}
                  onSortChange={setSort}
                  onViewChange={setView}
                />
              </div>
            </div>

            {view === "grid" ? (
              <LojistaGrid count={filtered.length}>
                {filtered.map((l: any) => (
                  <LojistaCard key={l.id} lojista={l} />
                ))}
              </LojistaGrid>
            ) : (
              <div className="overflow-hidden rounded-xl border border-border bg-card">
                {filtered.map((l: any) => (
                  <LojistaListRow key={l.id} lojista={l} />
                ))}
              </div>
            )}
          </>
        )}
      </section>
      <SiteFooter />
    </div>
  );
}
