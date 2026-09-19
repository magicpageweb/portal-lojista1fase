import { useQuery } from "@tanstack/react-query";
import { Info } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Aviso exibido enquanto houver loja de demonstração publicada.
 *
 * A RLS só devolve lojistas com status 'ativo' para visitantes anônimos, então
 * a contagem já reflete apenas o que está no ar. Assim que a carga demo for
 * removida (ou despublicada), o aviso some sozinho.
 */
export function DemoBanner() {
  const { data: temDemo } = useQuery({
    queryKey: ["tem-lojista-demo"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("lojistas")
        .select("id", { count: "exact", head: true })
        .eq("is_demo", true)
        .eq("status", "ativo");
      if (error) return false;
      return (count ?? 0) > 0;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  if (!temDemo) return null;

  return (
    <div className="border-b border-primary/25 bg-primary/10 text-foreground/80">
      <div className="container mx-auto flex items-center justify-center gap-2 px-4 py-1.5 text-center text-xs sm:text-sm">
        <Info className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
        <span>Portal em fase de implantação — lojas exibidas são exemplos demonstrativos.</span>
      </div>
    </div>
  );
}
