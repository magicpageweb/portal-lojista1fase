import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ArrowLeft, ExternalLink, Facebook, Globe, Instagram, MapPin, MessageCircle, Phone, ShieldCheck, Store } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { formatPhone, formatPrice, publicImage } from "@/lib/format";

export const Route = createFileRoute("/lojistas/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug} | Sindilojas` },
      { name: "description", content: "Perfil completo do lojista no Portal Sindilojas." },
    ],
  }),
  component: LojistaDetail,
  errorComponent: () => <NotFoundView />,
  notFoundComponent: () => <NotFoundView />,
});

function NotFoundView() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="container mx-auto px-4 py-24 text-center">
        <Store className="mx-auto h-12 w-12 text-muted-foreground" />
        <h1 className="mt-4 font-display text-3xl font-bold">Lojista não encontrado</h1>
        <Button asChild className="mt-6 gradient-gold text-secondary">
          <Link to="/lojistas">Ver todos os lojistas</Link>
        </Button>
      </div>
      <SiteFooter />
    </div>
  );
}

function LojistaDetail() {
  const { slug } = Route.useParams();
  const { data: lojista, isLoading } = useQuery({
    queryKey: ["lojista", slug],
    queryFn: async () => {
      const { data } = await supabase
        .from("lojistas")
        .select("*, categorias(nome, slug, cor)")
        .eq("slug", slug)
        .eq("status", "ativo")
        .maybeSingle();
      return data;
    },
  });

  const { data: produtos = [] } = useQuery({
    queryKey: ["produtos", lojista?.id],
    enabled: !!lojista?.id,
    queryFn: async () => {
      const { data } = await supabase
        .from("produtos")
        .select("*")
        .eq("lojista_id", lojista!.id)
        .eq("ativo", true)
        .order("ordem");
      return data ?? [];
    },
  });

  useEffect(() => {
    if (lojista?.id) {
      supabase.from("metricas_lojista").insert({ lojista_id: lojista.id, tipo: "visualizacao" });
    }
  }, [lojista?.id]);

  if (isLoading) return <div className="min-h-screen bg-background"><SiteHeader /><p className="container py-20 text-center">Carregando...</p></div>;
  if (!lojista) return <NotFoundView />;

  const logo = publicImage(lojista.logo_url);
  const capa = publicImage(lojista.capa_url);
  const catColor = (lojista.categorias as any)?.cor ?? "#1A2E5A";
  const enderecoCompleto = [lojista.endereco, lojista.numero, lojista.bairro, lojista.cidade, lojista.estado].filter(Boolean).join(", ");
  const mapEmbed = enderecoCompleto
    ? `https://www.google.com/maps?q=${encodeURIComponent(enderecoCompleto)}&output=embed`
    : null;
  const mapLink = enderecoCompleto
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(enderecoCompleto)}`
    : null;

  const trackClick = (tipo: "clique_whatsapp" | "acesso_mapa" | "clique_site") => {
    supabase.from("metricas_lojista").insert({ lojista_id: lojista.id, tipo });
  };

  // JSON-LD schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: lojista.nome_fantasia,
    description: lojista.descricao,
    image: capa,
    telephone: lojista.telefone,
    address: enderecoCompleto ? {
      "@type": "PostalAddress",
      streetAddress: [lojista.endereco, lojista.numero].filter(Boolean).join(", "),
      addressLocality: lojista.cidade,
      addressRegion: lojista.estado,
      postalCode: lojista.cep,
    } : undefined,
    url: lojista.site,
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <section className="relative h-72 overflow-hidden md:h-96">
        {capa ? (
          <img src={capa} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full" style={{ background: `linear-gradient(135deg, ${catColor}, var(--secondary))` }} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      </section>

      <div className="container mx-auto px-4">
        <Link to="/lojistas" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> Todos os lojistas
        </Link>

        <div className="relative -mt-24 grid gap-8 md:grid-cols-3">
          <aside className="md:col-span-1">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-elegant">
              <div className="-mt-16 grid h-24 w-24 place-items-center overflow-hidden rounded-2xl border-4 border-card bg-card shadow-gold">
                {logo ? <img src={logo} alt="" className="h-full w-full object-cover" /> : <Store className="h-10 w-10 text-secondary" />}
              </div>
              {lojista.categorias && (
                <Badge className="mt-4" style={{ backgroundColor: catColor, color: "white" }}>
                  {(lojista.categorias as any).nome}
                </Badge>
              )}
              <h1 className="mt-2 font-display text-3xl font-extrabold">{lojista.nome_fantasia}</h1>
              {lojista.slogan && <p className="mt-1 text-sm italic text-muted-foreground">"{lojista.slogan}"</p>}

              <div className="mt-5 flex items-center gap-2 text-xs text-emerald-600">
                <ShieldCheck className="h-4 w-4" /> Verificado pelo Sindilojas
              </div>

              <div className="mt-6 space-y-3">
                {lojista.whatsapp && (
                  <Button asChild className="w-full bg-emerald-500 hover:bg-emerald-600" onClick={() => trackClick("clique_whatsapp")}>
                    <a href={`https://wa.me/55${lojista.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="mr-2 h-4 w-4" /> Falar no WhatsApp
                    </a>
                  </Button>
                )}
                {lojista.telefone && (
                  <Button asChild variant="outline" className="w-full">
                    <a href={`tel:${lojista.telefone}`}>
                      <Phone className="mr-2 h-4 w-4" /> {formatPhone(lojista.telefone)}
                    </a>
                  </Button>
                )}
                {lojista.site && (
                  <Button asChild variant="outline" className="w-full" onClick={() => trackClick("clique_site")}>
                    <a href={lojista.site} target="_blank" rel="noopener noreferrer">
                      <Globe className="mr-2 h-4 w-4" /> Site
                    </a>
                  </Button>
                )}
                <div className="flex gap-2">
                  {lojista.instagram && (
                    <Button asChild variant="outline" size="icon" className="flex-1">
                      <a href={lojista.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Instagram className="h-4 w-4" /></a>
                    </Button>
                  )}
                  {lojista.facebook && (
                    <Button asChild variant="outline" size="icon" className="flex-1">
                      <a href={lojista.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook"><Facebook className="h-4 w-4" /></a>
                    </Button>
                  )}
                </div>
              </div>

              {enderecoCompleto && (
                <div className="mt-6 border-t border-border pt-6">
                  <h3 className="flex items-center gap-2 font-semibold"><MapPin className="h-4 w-4 text-primary" /> Endereço</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{enderecoCompleto}</p>
                  {mapLink && (
                    <Button asChild variant="link" className="mt-1 h-auto p-0 text-primary" onClick={() => trackClick("acesso_mapa")}>
                      <a href={mapLink} target="_blank" rel="noopener noreferrer">Abrir no mapa <ExternalLink className="ml-1 h-3 w-3" /></a>
                    </Button>
                  )}
                </div>
              )}
            </div>
          </aside>

          <main className="space-y-10 md:col-span-2">
            {lojista.descricao && (
              <section>
                <h2 className="font-display text-2xl font-bold">Sobre a loja</h2>
                <p className="mt-3 whitespace-pre-line text-foreground/85">{lojista.descricao}</p>
              </section>
            )}

            {produtos.length > 0 && (
              <section>
                <h2 className="font-display text-2xl font-bold">Catálogo de produtos</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {produtos.map((p: any) => <ProdutoCard key={p.id} produto={p} />)}
                </div>
              </section>
            )}

            {mapEmbed && (
              <section>
                <h2 className="font-display text-2xl font-bold">Localização</h2>
                <div className="mt-4 overflow-hidden rounded-2xl border border-border shadow-elegant">
                  <iframe
                    src={mapEmbed}
                    width="100%"
                    height="360"
                    style={{ border: 0 }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Mapa da loja"
                  />
                </div>
              </section>
            )}
          </main>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}

function ProdutoCard({ produto }: { produto: any }) {
  const [open, setOpen] = useState(false);
  const img = publicImage(produto.foto_url);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="group overflow-hidden rounded-xl border border-border bg-card text-left shadow-elegant transition-all hover:-translate-y-1 hover:shadow-gold">
          <div className="aspect-square overflow-hidden bg-muted">
            {img ? (
              <img src={img} alt={produto.nome} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
            ) : (
              <div className="grid h-full w-full place-items-center text-muted-foreground"><Store className="h-8 w-8" /></div>
            )}
          </div>
          <div className="p-3">
            <h4 className="line-clamp-1 font-semibold">{produto.nome}</h4>
            {produto.preco != null && <p className="mt-0.5 font-display text-lg font-bold text-primary">{formatPrice(produto.preco)}</p>}
          </div>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="aspect-square overflow-hidden rounded-lg bg-muted">
            {img && <img src={img} alt={produto.nome} className="h-full w-full object-cover" />}
          </div>
          <div>
            <h3 className="font-display text-2xl font-bold">{produto.nome}</h3>
            {produto.preco != null && <p className="mt-1 font-display text-3xl font-extrabold text-primary">{formatPrice(produto.preco)}</p>}
            {produto.descricao && <p className="mt-4 whitespace-pre-line text-foreground/80">{produto.descricao}</p>}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
