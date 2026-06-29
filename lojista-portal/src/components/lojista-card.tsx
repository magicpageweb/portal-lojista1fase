import { Link } from "@tanstack/react-router";
import { ExternalLink, MapPin, MessageCircle, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { publicImage } from "@/lib/format";

interface LojistaCardProps {
  lojista: {
    id: string;
    slug: string;
    nome_fantasia: string;
    slogan?: string | null;
    descricao?: string | null;
    bairro?: string | null;
    cidade?: string | null;
    whatsapp?: string | null;
    logo_url?: string | null;
    capa_url?: string | null;
    destaque?: boolean;
    categorias?: { nome: string; cor: string | null } | null;
  };
}

export function LojistaCard({ lojista }: LojistaCardProps) {
  const cap = publicImage(lojista.capa_url);
  const logo = publicImage(lojista.logo_url);
  const catColor = lojista.categorias?.cor ?? "#1A2E5A";

  return (
    <div className="flip-card group h-80 w-full">
      <div className="flip-card-inner shadow-elegant transition-shadow group-hover:shadow-gold">
        {/* Front */}
        <div className="flip-card-front bg-card">
          <div className="relative h-40 overflow-hidden">
            {cap ? (
              <img src={cap} alt={lojista.nome_fantasia} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
            ) : (
              <div className="h-full w-full" style={{ background: `linear-gradient(135deg, ${catColor}, var(--secondary))` }} />
            )}
            {lojista.destaque && (
              <Badge className="absolute right-3 top-3 gradient-gold text-secondary">Destaque</Badge>
            )}
            <div className="absolute -bottom-6 left-4 grid h-14 w-14 place-items-center overflow-hidden rounded-xl border-4 border-card bg-card shadow-elegant">
              {logo ? (
                <img src={logo} alt="" className="h-full w-full object-cover" loading="lazy" />
              ) : (
                <Store className="h-6 w-6 text-secondary" />
              )}
            </div>
          </div>
          <div className="px-4 pb-4 pt-8">
            {lojista.categorias && (
              <span className="text-xs font-medium uppercase tracking-wide" style={{ color: catColor }}>
                {lojista.categorias.nome}
              </span>
            )}
            <h3 className="mt-1 line-clamp-1 font-display text-lg font-bold">{lojista.nome_fantasia}</h3>
            {lojista.slogan && <p className="line-clamp-2 text-sm text-muted-foreground">{lojista.slogan}</p>}
            {(lojista.bairro || lojista.cidade) && (
              <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" /> {[lojista.bairro, lojista.cidade].filter(Boolean).join(" · ")}
              </p>
            )}
          </div>
        </div>

        {/* Back */}
        <div className="flip-card-back bg-secondary p-5 text-secondary-foreground">
          <div className="flex h-full flex-col">
            <h3 className="font-display text-xl font-bold">{lojista.nome_fantasia}</h3>
            {lojista.descricao && (
              <p className="mt-2 line-clamp-4 text-sm text-secondary-foreground/80">{lojista.descricao}</p>
            )}
            <div className="mt-auto flex flex-col gap-2">
              {lojista.whatsapp && (
                <Button asChild size="sm" className="bg-emerald-500 hover:bg-emerald-600">
                  <a
                    href={`https://wa.me/55${lojista.whatsapp.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="mr-1 h-4 w-4" /> WhatsApp
                  </a>
                </Button>
              )}
              <Button asChild size="sm" className="gradient-gold text-secondary hover:opacity-90">
                <Link to="/lojistas/$slug" params={{ slug: lojista.slug }}>
                  Visitar loja <ExternalLink className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
