import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, MapPin, Search, ShieldCheck, Sparkles, Store, TrendingUp, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { LojistaCard } from "@/components/lojista-card";
import { useReveal } from "@/hooks/use-reveal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Portal do Lojista | Sindilojas" },
      { name: "description", content: "Descubra lojistas associados ao Sindilojas. Compre local, encontre produtos e serviços perto de você." },
    ],
  }),
  component: Home,
});

const ROTATING = ["Compre Local", "Apoie o Comércio", "Encontre seu Lojista"];

function Home() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <Hero />
      <Counters />
      <FeaturedStores />
      <CategoriesGrid />
      <CtaJoin />
      <SiteFooter />
    </div>
  );
}

function Hero() {
  const [idx, setIdx] = useState(0);
  const [q, setQ] = useState("");
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % ROTATING.length), 2800);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative overflow-hidden gradient-hero text-secondary-foreground">
      {/* Particle layer */}
      <div className="pointer-events-none absolute inset-0 opacity-50">
        {Array.from({ length: 24 }).map((_, i) => (
          <span
            key={i}
            className="absolute block rounded-full bg-primary/30 animate-float"
            style={{
              left: `${(i * 37) % 100}%`,
              top: `${(i * 53) % 100}%`,
              width: `${4 + (i % 5) * 2}px`,
              height: `${4 + (i % 5) * 2}px`,
              animationDelay: `${(i * 0.3) % 6}s`,
              animationDuration: `${5 + (i % 4)}s`,
            }}
          />
        ))}
      </div>
      {/* parallax blobs */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-primary/20 blur-3xl animate-pulse-glow" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-secondary-glow/30 blur-3xl animate-pulse-glow" style={{ animationDelay: "1.5s" }} />

      <div className="container relative z-10 mx-auto grid gap-10 px-4 pb-16 pt-24 md:grid-cols-[minmax(0,1fr)_minmax(0,46%)] md:items-end md:gap-6 md:pb-0 md:pt-28 lg:pt-32">
        <div className="flex flex-col justify-center animate-fade-up md:pb-20 lg:pb-24">
          <Badge variant="outline" className="w-fit border-primary/40 bg-primary/10 text-primary">
            <Sparkles className="mr-1.5 h-3.5 w-3.5" /> Portal oficial Sindilojas
          </Badge>
          <h1 className="mt-4 font-display text-5xl font-extrabold leading-[1.05] md:text-6xl lg:text-7xl">
            <span className="block text-secondary-foreground">Descubra,</span>
            <span
              key={idx}
              className="block bg-gradient-to-r from-primary via-primary-glow to-primary bg-[length:200%_100%] bg-clip-text text-transparent animate-fade-up"
              style={{ backgroundPosition: "0% 50%" }}
            >
              {ROTATING[idx]}
            </span>
          </h1>
          <p className="mt-5 max-w-lg text-lg text-secondary-foreground/80">
            Conheça os lojistas associados, explore produtos exclusivos e fortaleça o comércio do seu bairro.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (q.trim()) {
                window.location.href = `/lojistas?q=${encodeURIComponent(q)}`;
              }
            }}
            className="mt-8 flex gap-2 rounded-2xl border border-primary/20 bg-background/95 p-2 shadow-elegant"
          >
            <div className="flex flex-1 items-center gap-2 px-3">
              <Search className="h-5 w-5 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Buscar loja, produto ou categoria..."
                className="border-0 bg-transparent text-foreground shadow-none focus-visible:ring-0"
              />
            </div>
            <Button type="submit" size="lg" className="gradient-gold text-secondary shadow-gold hover:opacity-90">
              Buscar <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </form>

          <div className="mt-6 flex flex-wrap gap-2 text-sm text-secondary-foreground/70">
            <span>Populares:</span>
            {["Moda", "Alimentação", "Beleza", "Serviços"].map((tag) => (
              <Link
                key={tag}
                to="/lojistas"
                className="rounded-full border border-secondary-foreground/20 px-3 py-0.5 transition-colors hover:border-primary hover:text-primary"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>

        {/* Composição premium — imagem ancorada na base do hero (desktop/tablet) */}
        <div
          className="relative hidden min-h-[22rem] md:block lg:min-h-[26rem]"
          aria-hidden
        >
          <div className="pointer-events-none absolute bottom-[12%] right-[0%] h-[58%] w-[95%] rounded-full bg-primary/25 blur-[72px] animate-pulse-glow" />
          <div className="pointer-events-none absolute bottom-[18%] right-[8%] h-[42%] w-[55%] rounded-full bg-primary-glow/15 blur-[48px] animate-pulse-glow" style={{ animationDelay: "2s" }} />

          <div className="absolute inset-x-0 bottom-0 flex justify-end animate-hero-enter">
            <div className="relative animate-hero-float">
              <img
                src="/banner-hero-img01.webp"
                alt=""
                width={720}
                height={540}
                loading="eager"
                fetchPriority="high"
                className="hero-banner-cutout relative z-10 max-h-[min(520px,72vh)] w-auto max-w-[125%] object-contain object-bottom mix-blend-screen drop-shadow-[0_24px_48px_rgba(0,0,0,0.35)]"
              />
              <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-l from-secondary/50 via-transparent to-transparent" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-24 bg-gradient-to-t from-[oklch(0.22_0.06_265)] to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Counters() {
  const { data } = useQuery({
    queryKey: ["counters"],
    queryFn: async () => {
      const [lojistas, produtos, bairros] = await Promise.all([
        supabase.from("lojistas").select("id", { count: "exact", head: true }).eq("status", "ativo"),
        supabase.from("produtos").select("id", { count: "exact", head: true }).eq("ativo", true),
        supabase.from("lojistas").select("bairro").eq("status", "ativo").not("bairro", "is", null),
      ]);
      const unique = new Set((bairros.data ?? []).map((b: any) => (b.bairro ?? "").toLowerCase()).filter(Boolean));
      return {
        lojistas: lojistas.count ?? 0,
        produtos: produtos.count ?? 0,
        bairros: unique.size,
      };
    },
  });
  const ref = useReveal<HTMLDivElement>();
  const items = [
    { icon: Users, label: "Associados", value: data?.lojistas ?? 0, color: "text-primary" },
    { icon: TrendingUp, label: "Produtos cadastrados", value: data?.produtos ?? 0, color: "text-secondary" },
    { icon: MapPin, label: "Bairros atendidos", value: data?.bairros ?? 0, color: "text-primary" },
    { icon: ShieldCheck, label: "Verificados", value: data?.lojistas ?? 0, color: "text-secondary" },
  ];
  return (
    <section ref={ref} className="reveal container mx-auto px-4 py-16">
      <div className="grid gap-4 rounded-3xl border border-border bg-card p-6 shadow-elegant sm:grid-cols-2 md:grid-cols-4 md:p-10">
        {items.map((it) => (
          <div key={it.label} className="text-center">
            <it.icon className={`mx-auto h-8 w-8 ${it.color}`} />
            <AnimatedNumber value={it.value} className="mt-3 block font-display text-4xl font-extrabold text-foreground md:text-5xl" />
            <p className="mt-1 text-sm font-medium text-muted-foreground">{it.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function AnimatedNumber({ value, className }: { value: number; className?: string }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const dur = 1200;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return <span className={className}>{n.toLocaleString("pt-BR")}</span>;
}

function FeaturedStores() {
  const { data: lojistas = [] } = useQuery({
    queryKey: ["lojistas", "destaque"],
    queryFn: async () => {
      const { data } = await supabase
        .from("lojistas")
        .select("*, categorias(nome, slug, cor)")
        .eq("status", "ativo")
        .order("destaque", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(8);
      return data ?? [];
    },
  });
  const ref = useReveal<HTMLDivElement>();
  return (
    <section ref={ref} className="reveal container mx-auto px-4 py-16">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary">Vitrine especial</Badge>
          <h2 className="mt-3 font-display text-3xl font-extrabold md:text-4xl">Lojistas em destaque</h2>
          <p className="mt-1 text-muted-foreground">Conheça quem está movimentando o comércio local.</p>
        </div>
        <Button asChild variant="outline" className="hidden md:inline-flex">
          <Link to="/lojistas">Ver todos <ArrowRight className="ml-1 h-4 w-4" /></Link>
        </Button>
      </div>
      {lojistas.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {lojistas.map((l: any) => (
            <LojistaCard key={l.id} lojista={l} />
          ))}
        </div>
      )}
    </section>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-muted/30 px-6 py-16 text-center">
      <Store className="mx-auto h-12 w-12 text-muted-foreground" />
      <h3 className="mt-4 font-display text-xl font-semibold">Em breve, novos lojistas!</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Estamos recebendo cadastros. Quer ser um dos primeiros associados?
      </p>
      <Button asChild className="mt-5 gradient-gold text-secondary shadow-gold">
        <Link to="/auth">Cadastrar minha loja</Link>
      </Button>
    </div>
  );
}

function CategoriesGrid() {
  const { data: cats = [] } = useQuery({
    queryKey: ["categorias"],
    queryFn: async () => (await supabase.from("categorias").select("*").order("ordem")).data ?? [],
  });
  const ref = useReveal<HTMLDivElement>();
  return (
    <section ref={ref} className="reveal container mx-auto px-4 py-16">
      <div className="mb-10 text-center">
        <Badge variant="outline" className="border-secondary/30 bg-secondary/5 text-secondary">Explore</Badge>
        <h2 className="mt-3 font-display text-3xl font-extrabold md:text-4xl">Categorias</h2>
        <p className="mt-2 text-muted-foreground">Encontre o lojista ideal para você.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        {cats.map((c: any) => (
          <Link
            key={c.id}
            to="/lojistas"
            className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary hover:shadow-gold"
          >
            <div
              className="mb-3 grid h-12 w-12 place-items-center rounded-xl text-white"
              style={{ backgroundColor: c.cor ?? "var(--secondary)" }}
            >
              <Store className="h-6 w-6" />
            </div>
            <h3 className="font-display text-lg font-semibold">{c.nome}</h3>
            <p className="mt-1 text-sm text-muted-foreground">Ver lojistas</p>
            <ArrowRight className="absolute right-5 top-5 h-4 w-4 text-muted-foreground transition-all group-hover:right-3 group-hover:text-primary" />
          </Link>
        ))}
      </div>
    </section>
  );
}

function CtaJoin() {
  const ref = useReveal<HTMLDivElement>();
  return (
    <section ref={ref} className="reveal container mx-auto px-4 py-16">
      <div className="relative overflow-hidden rounded-3xl gradient-hero p-10 text-center text-secondary-foreground md:p-16">
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <Sparkles className="mx-auto h-10 w-10 text-primary" />
        <h2 className="mt-4 font-display text-3xl font-extrabold md:text-5xl">
          Faça parte do <span className="text-primary">Sindilojas</span>
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-secondary-foreground/80">
          Cadastre sua loja gratuitamente, ganhe visibilidade e conquiste novos clientes do seu bairro.
        </p>
        <Button asChild size="lg" className="mt-6 gradient-gold text-secondary shadow-gold hover:opacity-90">
          <Link to="/auth">Cadastrar minha loja <ArrowRight className="ml-2 h-5 w-5" /></Link>
        </Button>
      </div>
    </section>
  );
}
