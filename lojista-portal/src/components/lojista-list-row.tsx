import { Link } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

function tierBarClass(plano?: string | null) {
  if (plano === "destaque") return "bg-primary";
  if (plano === "vitrine") return "bg-secondary";
  return "bg-transparent";
}

export function LojistaListRow({ lojista }: { lojista: any }) {
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
        className={cn("w-1 shrink-0 self-stretch rounded-full", tierBarClass(plano))}
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
