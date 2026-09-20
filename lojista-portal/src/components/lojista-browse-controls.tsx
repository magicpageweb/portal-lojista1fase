import { LayoutGrid, List, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export type LojistaViewMode = "grid" | "list";
/** Interno: relevância = ordenação por plano (destaque > vitrine > essencial). */
export type LojistaSortMode = "relevancia" | "az" | "za";

export type CategoriaOption = { id: string; nome: string; slug: string };
export type CidadeOption = { id: string; nome: string; slug: string };

type Props = {
  cats: CategoriaOption[];
  cidades: CidadeOption[];
  cat?: string;
  cidadeSlug?: string;
  sort: LojistaSortMode;
  view: LojistaViewMode;
  onCatChange: (slug: string | undefined) => void;
  onCidadeChange: (slug: string | undefined) => void;
  onSortChange: (sort: LojistaSortMode) => void;
  onViewChange: (view: LojistaViewMode) => void;
  /** Esconde ordenação/toggle (ex.: só filtros no topo). */
  showSortAndView?: boolean;
  className?: string;
};

export function LojistaBrowseControls({
  cats,
  cidades,
  cat,
  cidadeSlug,
  sort,
  view,
  onCatChange,
  onCidadeChange,
  onSortChange,
  onViewChange,
  showSortAndView = true,
  className,
}: Props) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <SlidersHorizontal className="h-4 w-4 shrink-0 text-muted-foreground" />
          <Button
            variant={cat ? "outline" : "default"}
            size="sm"
            onClick={() => onCatChange(undefined)}
            className={cn("shrink-0", !cat && "gradient-gold text-secondary")}
          >
            Todas
          </Button>
          {cats.map((c) => (
            <Button
              key={c.id}
              variant={cat === c.slug ? "default" : "outline"}
              size="sm"
              onClick={() => onCatChange(c.slug)}
              className={cn("shrink-0", cat === c.slug && "gradient-gold text-secondary")}
            >
              {c.nome}
            </Button>
          ))}
        </div>
        <Select
          value={cidadeSlug ?? "todas"}
          onValueChange={(v) => onCidadeChange(v === "todas" ? undefined : v)}
        >
          <SelectTrigger className="h-9 w-full bg-background sm:w-[240px]" aria-label="Filtrar por cidade">
            <SelectValue placeholder="Cidade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas as cidades</SelectItem>
            {cidades.map((c) => (
              <SelectItem key={c.id} value={c.slug}>
                {c.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {showSortAndView && (
        <div className="flex flex-wrap items-center justify-end gap-2">
          <LojistaSortViewControls
            sort={sort}
            view={view}
            onSortChange={onSortChange}
            onViewChange={onViewChange}
          />
        </div>
      )}
    </div>
  );
}

export function LojistaSortViewControls({
  sort,
  view,
  onSortChange,
  onViewChange,
}: {
  sort: LojistaSortMode;
  view: LojistaViewMode;
  onSortChange: (sort: LojistaSortMode) => void;
  onViewChange: (view: LojistaViewMode) => void;
}) {
  return (
    <>
      <Select value={sort} onValueChange={(v) => onSortChange(v as LojistaSortMode)}>
        <SelectTrigger className="h-9 w-[200px] bg-background" aria-label="Ordenar lojistas">
          <SelectValue placeholder="Ordenar" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="relevancia">Mais relevantes</SelectItem>
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
          onClick={() => onViewChange("grid")}
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
          onClick={() => onViewChange("list")}
          aria-pressed={view === "list"}
          aria-label="Lista"
        >
          <List className="h-4 w-4" />
        </Button>
      </div>
    </>
  );
}
