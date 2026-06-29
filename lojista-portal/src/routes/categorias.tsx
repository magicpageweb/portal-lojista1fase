import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Store } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/categorias")({
  head: () => ({ meta: [{ title: "Categorias | Sindilojas" }] }),
  component: CategoriasPage,
});

function CategoriasPage() {
  const { data: cats = [] } = useQuery({
    queryKey: ["categorias"],
    queryFn: async () => (await supabase.from("categorias").select("*").order("ordem")).data ?? [],
  });
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="gradient-hero py-16 text-secondary-foreground">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-4xl font-extrabold md:text-5xl">Categorias</h1>
          <p className="mt-2 text-secondary-foreground/80">Explore os segmentos do comércio local.</p>
        </div>
      </section>
      <section className="container mx-auto px-4 py-12">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {cats.map((c: any) => (
            <Link
              key={c.id}
              to="/lojistas"
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary hover:shadow-gold"
            >
              <div className="mb-3 grid h-12 w-12 place-items-center rounded-xl text-white" style={{ backgroundColor: c.cor ?? "var(--secondary)" }}>
                <Store className="h-6 w-6" />
              </div>
              <h3 className="font-display text-lg font-semibold">{c.nome}</h3>
              <p className="mt-1 text-sm text-muted-foreground">Ver lojistas</p>
              <ArrowRight className="absolute right-5 top-5 h-4 w-4 text-muted-foreground transition-all group-hover:right-3 group-hover:text-primary" />
            </Link>
          ))}
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
