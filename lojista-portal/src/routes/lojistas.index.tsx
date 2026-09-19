import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { LayoutGrid, List, MapPin, Search, SlidersHorizontal, Store } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { LojistaCard } from "@/components/lojista-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { sortLojistasByPlano } from "@/lib/format";
import { cn } from "@/lib/utils";

const searchSchema = z.object({
  q: z.string().optional(),
  cat: z.string().optional(),
});

type ViewMode = "grid" | "list";
type SortMode = "plano" | "az" | "za";

export const Route = createFileRoute("/lojistas/")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Lojistas associados | Sindilojas" },
      { name: "description", content: "Explore todos os lojistas associados ao Sindilojas. Filtre por categoria, busque por nome ou produto." },
    ],
  }),
  component: ListPage,
});

function sortLojistas(list: any[], mode: SortMode) {
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

function planoBarClass(plano?: string | null) {
  if (plano === "destaque") return "bg-primary";
  if (plano === "vitrine") return "bg-secondary";
  return "bg-transparent";
}

function LojistaListRow({ lojista }: { lojista: any }) {
  const plano = lojista.plano ?? (lojista.destaque ? "destaque" : "essencial");
  const catNome = lojista.categorias?.nome;
  const local = [lojista.bairro, lojista.cidade].filter(Boolean).join(" · ");

  return (
    <Link
      to="/lojistas/$slug"
      params={{ slug: lojista.slug }}
      className="group flex min-w-0 items-stretch gap-3 border-b border-border px-1 py-3 transition-colors hover:bg-muted/40"
    >
      <span
        aria-hidden
        className={cn("w-1 shrink-0 self-stretch rounded-full", planoBarClass(plano))}
        title={plano === "destaque" ? "Destaque" : plano === "vitrine" ? "Vitrine" : undefined}
      />
      <div className="min-w-0 flex-1">
        <p className="truncate font-display text-base font-semibold text-foreground group-hover:text-primary">
          {lojista.nome_fantasia}
        </p>
        <p className="mt-0.5 flex min-w-0 flex-wrap items-center gap-x-2 gap-y-0.5 text-sm text-muted-foreground">
          {catNome && (
            <span className="truncate font-medium" style={{ color: lojista.categorias?.cor ?? undefined }}>
              {catNome}
            </span>
          )}
          {catNome && local && <span className="text-border">·</span>}
          {local && (
            <span className="inline-flex min-w-0 items-center gap-1 truncate">
              <MapPin className="h-3 w-3 shrink-0" />
              {local}
            </span>
          )}
        </p>
      </div>
    </Link>
  );
}

function ListPage() {
  const search = useSearch({ from: "/lojistas/" });
  const [q, setQ] = useState(search.q ?? "");
  const [cat, setCat] = useState<string | undefined>(search.cat);
  const [view, setView] = useState<ViewMode>("grid");
  const [sort, setSort] = useState<SortMode>("plano");

  const { data: cats = [] } = useQuery({
    queryKey: ["categorias"],
    queryFn: async () => (await supabase.from("categorias").select("*").order("ordem")).data ?? [],
  });

  const { data: lojistas = [], isLoading } = useQuery({
    queryKey: ["lojistas", "all"],
    queryFn: async () => {
      const { data } = await supabase
        .from("lojistas")
        .select("*, categorias(nome, slug, cor, icone)")
        .eq("status", "ativo")
        .order("plano", { ascending: false })
        .order("nome_fantasia", { ascending: true });
      return sortLojistasByPlano(data ?? []);
    },
  });

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    const list = lojistas.filter((l: any) => {
      if (cat && l.categorias?.slug !== cat) return false;
      if (!query) return true;
      return (
        l.nome_fantasia?.toLowerCase().includes(query) ||
        l.descricao?.toLowerCase().includes(query) ||
        l.slogan?.toLowerCase().includes(query) ||
        l.bairro?.toLowerCase().includes(query) ||
        l.categorias?.nome?.toLowerCase().includes(query)
      );
    });
    return sortLojistas(list, sort);
  }, [lojistas, q, cat, sort]);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="gradient-hero py-16 text-secondary-foreground">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-4xl font-extrabold md:text-5xl">Lojistas associados</h1>
          <p className="mt-2 text-secondary-foreground/80">Encontre o comércio do seu bairro.</p>
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
        <div className="mb-8 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <SlidersHorizontal className="h-4 w-4 shrink-0 text-muted-foreground" />
          <Button
            variant={cat ? "outline" : "default"}
            size="sm"
            onClick={() => setCat(undefined)}
            className={cn("shrink-0", !cat && "gradient-gold text-secondary")}
          >
            Todas
          </Button>
          {cats.map((c: any) => (
            <Button
              key={c.id}
              variant={cat === c.slug ? "default" : "outline"}
              size="sm"
              onClick={() => setCat(c.slug)}
              className={cn("shrink-0", cat === c.slug && "gradient-gold text-secondary")}
            >
              {c.nome}
            </Button>
          ))}
        </div>

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
                <Select value={sort} onValueChange={(v) => setSort(v as SortMode)}>
                  <SelectTrigger className="h-9 w-[200px] bg-background" aria-label="Ordenar lojistas">
                    <SelectValue placeholder="Ordenar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="plano">Padrão (por plano)</SelectItem>
                    <SelectItem value="az">Nome A-Z</SelectItem>
                    <SelectItem value="za">Nome Z-A</SelectItem>
                  </SelectContent>
                </Select>
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
            </div>

            {view === "grid" ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filtered.map((l: any) => (
                  <LojistaCard key={l.id} lojista={l} />
                ))}
              </div>
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
