import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, Store } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { LojistaCard } from "@/components/lojista-card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const searchSchema = z.object({
  q: z.string().optional(),
  cat: z.string().optional(),
});

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

function ListPage() {
  const search = useSearch({ from: "/lojistas/" });
  const [q, setQ] = useState(search.q ?? "");
  const [cat, setCat] = useState<string | undefined>(search.cat);

  const { data: cats = [] } = useQuery({
    queryKey: ["categorias"],
    queryFn: async () => (await supabase.from("categorias").select("*").order("ordem")).data ?? [],
  });

  const { data: lojistas = [], isLoading } = useQuery({
    queryKey: ["lojistas", "all"],
    queryFn: async () => {
      const { data } = await supabase
        .from("lojistas")
        .select("*, categorias(nome, slug, cor)")
        .eq("status", "ativo")
        .order("destaque", { ascending: false })
        .order("nome_fantasia");
      return data ?? [];
    },
  });

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return lojistas.filter((l: any) => {
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
  }, [lojistas, q, cat]);

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
        <div className="mb-8 flex flex-wrap items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
          <Button
            variant={cat ? "outline" : "default"}
            size="sm"
            onClick={() => setCat(undefined)}
            className={!cat ? "gradient-gold text-secondary" : ""}
          >
            Todas
          </Button>
          {cats.map((c: any) => (
            <Button
              key={c.id}
              variant={cat === c.slug ? "default" : "outline"}
              size="sm"
              onClick={() => setCat(c.slug)}
              className={cat === c.slug ? "gradient-gold text-secondary" : ""}
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
            <p className="mb-6 text-sm text-muted-foreground">{filtered.length} lojista(s) encontrado(s)</p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((l: any) => (
                <LojistaCard key={l.id} lojista={l} />
              ))}
            </div>
          </>
        )}
      </section>
      <SiteFooter />
    </div>
  );
}
