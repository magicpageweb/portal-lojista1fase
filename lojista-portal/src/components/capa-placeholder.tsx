import { getCategoryIcon } from "@/lib/category-icon";
import { cn } from "@/lib/utils";

interface CapaPlaceholderProps {
  nomeFantasia: string;
  catColor?: string | null;
  catIcone?: string | null;
  /** Densidade visual: card de listagem vs hero da página. */
  size?: "card" | "hero";
  className?: string;
}

/**
 * Placeholder quando não há capa_url: gradiente por categoria +
 * nome da loja em branco e ícone de categoria em destaque.
 */
export function CapaPlaceholder({
  nomeFantasia,
  catColor,
  catIcone,
  size = "card",
  className,
}: CapaPlaceholderProps) {
  const color = catColor ?? "#1A2E5A";
  const Icon = getCategoryIcon(catIcone);
  const isHero = size === "hero";

  return (
    <div
      className={cn("relative h-full w-full overflow-hidden", className)}
      style={{ background: `linear-gradient(135deg, ${color}, var(--secondary))` }}
    >
      {/* Ícone grande em baixa opacidade como padrão de fundo */}
      <Icon
        aria-hidden
        className={cn(
          "pointer-events-none absolute text-white/15",
          isHero
            ? "-right-6 -bottom-4 h-56 w-56 md:h-72 md:w-72"
            : "-right-3 -bottom-2 h-28 w-28",
        )}
        strokeWidth={1.25}
      />

      <div
        className={cn(
          "relative z-10 flex h-full flex-col justify-end",
          isHero ? "px-6 pb-16 pt-8 md:px-10 md:pb-24" : "px-4 pb-10 pt-4",
        )}
      >
        <div className="flex min-w-0 items-end gap-2.5">
          <span
            className={cn(
              "grid shrink-0 place-items-center rounded-lg bg-white/20 text-white shadow-sm backdrop-blur-[2px]",
              isHero ? "h-12 w-12 md:h-14 md:w-14" : "h-9 w-9",
            )}
          >
            <Icon className={cn(isHero ? "h-6 w-6 md:h-7 md:w-7" : "h-5 w-5")} strokeWidth={2} />
          </span>
          <p
            className={cn(
              "min-w-0 flex-1 font-display font-bold leading-tight text-white drop-shadow-sm",
              isHero
                ? "line-clamp-2 text-2xl md:text-4xl"
                : "truncate text-base sm:text-lg",
            )}
            title={nomeFantasia}
          >
            {nomeFantasia}
          </p>
        </div>
      </div>
    </div>
  );
}
