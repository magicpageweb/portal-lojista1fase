import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, LayoutGrid, List, MapPin, Store } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { LojistaCard } from "@/components/lojista-card";
import { Button } from "@/components/ui/button";
import { CIDADES_ATUACAO, textoInstitucionalCidade } from "@/lib/cidades";
import { sortLojistasByPlano } from "@/lib/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/cidade/$slug")({
  head: ({ params }) => {
    const known = CIDADES_ATUACAO.find((c) => c.slug === params.slug);
    const nome = known?.nome ?? params.slug;
    return {
      meta: [
        { title: `Comércio de ${nome} — Portal do Lojista Sindilojas` },
        {
          name: "description",
          content: `Comércio de ${nome} — lojas associadas ao Sindilojas Vale do Rio Pardo. Conheça o comércio local verificado.`,
        },
      ],
    };
  },
  component: CidadePage,
});

function CidadeNotFound({ slug }: { slug: string }) {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="container mx-auto px-4 py-24 text-center">
        <MapPin className="mx-auto h-12 w-12 text-muted-foreground" />
        <h1 className="mt-4 font-display text-3xl font-bold">Cidade não encontrada</h1>
        <p className="mt-2 text-muted-foreground">
          “{slug}” não faz parte da área de atuação do Sindilojas.
        </p>
        <Button asChild className="mt-6 gradient-gold text-secondary">
          <Link to="/lojistas">Ver todos os lojistas</Link>
        </Button>
      </div>
      <SiteFooter />
    </div>
  );
}

type ViewMode = "grid" | "list";

function CidadePage() {
  const { slug } = Route.useParams();
  const [view, setView] = useState<ViewMode>("grid");

  const { data: cidade, isLoading: loadingCidade, isFetched } = useQuery({
    queryKey: ["cidade", slug],
    queryFn: async () => {
      const { data } = await supabase.from("cidades").select("*").eq("slug", slug).maybeSingle();
      return data;
    },
  });

  const { data: lojistas = [], isLoading: loadingLojas } = useQuery({
    queryKey: ["lojistas", "cidade", cidade?.id],
    enabled: !!cidade?.id,
    queryFn: async () => {
      const { data } = await supabase
        .from("lojistas")
        .select("*, categorias(nome, slug, cor, icone)")
        .eq("status", "ativo")
        .eq("cidade_id", cidade!.id)
        .order("plano", { ascending: false })
        .order("nome_fantasia", { ascending: true });
      return sortLojistasByPlano(data ?? []);
    },
  });

  const sorted = useMemo(() => sortLojistasByPlano(lojistas), [lojistas]);

  useEffect(() => {
    if (!cidade) return;
    document.title = `Comércio de ${cidade.nome} — Portal do Lojista Sindilojas`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta && cidade.meta_description) {
      meta.setAttribute("content", cidade.meta_description);
    }
  }, [cidade]);

  if (loadingCidade) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <p className="container py-20 text-center text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  if (isFetched && !cidade) {
    return <CidadeNotFound slug={slug} />;
  }

  if (!cidade) return null;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="gradient-hero py-16 text-secondary-foreground">
        <div className="container mx-auto px-4">
          <Link
            to="/lojistas"
            className="mb-4 inline-flex items-center gap-1 text-sm text-secondary-foreground/70 hover:text-secondary-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Todos os lojistas
          </Link>
          <h1 className="font-display text-4xl font-extrabold md:text-5xl">
            Comércio de {cidade.nome}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-secondary-foreground/85 md:text-lg">
            {textoInstitucionalCidade(cidade.nome)}
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10">
        {loadingLojas ? (
          <p className="text-center text-muted-foreground">Carregando...</p>
        ) : sorted.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-muted/30 px-6 py-20 text-center">
            <Store className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 font-display text-xl font-semibold">Nenhum lojista nesta cidade</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Em breve novos associados de {cidade.nome} aparecerão aqui.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                {sorted.length} lojista(s) em {cidade.nome}
              </p>
              <div
                className="inline-flex rounded-md border border-border bg-background p-0.5"
                role="group"
                aria-label="Modo de visualização"
              >
                <Button
                  type="button"
                  size="sm"
                  variant={view === "grid" ? "default" : "ghost"}
                  className={cn("h-8 px-2.5", view === "grid" && "gradient-gold text-secondary")}
                  onClick={() => setView("grid")}
                  aria-pressed={view === "grid"}
                  aria-label="Grade"
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={view === "list" ? "default" : "ghost"}
                  className={cn("h-8 px-2.5", view === "list" && "gradient-gold text-secondary")}
                  onClick={() => setView("list")}
                  aria-pressed={view === "list"}
                  aria-label="Lista"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {view === "grid" ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {sorted.map((l: any) => (
                  <LojistaCard key={l.id} lojista={l} />
                ))}
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border border-border bg-card">
                {sorted.map((l: any) => {
                  const local = [l.bairro, l.cidade].filter(Boolean).join(" · ");
                  return (
                    <Link
                      key={l.id}
                      to="/lojistas/$slug"
                      params={{ slug: l.slug }}
                      className="flex min-w-0 items-center gap-3 border-b border-border px-4 py-3 transition-colors hover:bg-muted/40"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-display text-base font-semibold">{l.nome_fantasia}</p>
                        <p className="mt-0.5 truncate text-sm text-muted-foreground">
                          {l.categorias?.nome}
                          {local ? ` · ${local}` : ""}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </>
        )}
      </section>
      <SiteFooter />
    </div>
  );
}
