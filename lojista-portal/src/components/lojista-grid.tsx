import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Grid responsivo que completa a última linha com células invisíveis,
 * evitando "buraco" visual quando a quantidade não fecha o número de colunas.
 */
export function LojistaGrid({
  children,
  count,
  className,
}: {
  children: ReactNode;
  count: number;
  className?: string;
}) {
  const pad2 = count % 2 === 0 ? 0 : 1;
  const pad3 = count % 3 === 0 ? 0 : 3 - (count % 3);
  const pad4 = count % 4 === 0 ? 0 : 4 - (count % 4);

  return (
    <div className={cn("grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4", className)}>
      {children}
      {Array.from({ length: pad2 }).map((_, i) => (
        <div
          key={`pad2-${i}`}
          aria-hidden
          className="pointer-events-none invisible hidden min-h-0 sm:block lg:hidden"
        />
      ))}
      {Array.from({ length: pad3 }).map((_, i) => (
        <div
          key={`pad3-${i}`}
          aria-hidden
          className="pointer-events-none invisible hidden min-h-0 lg:block xl:hidden"
        />
      ))}
      {Array.from({ length: pad4 }).map((_, i) => (
        <div
          key={`pad4-${i}`}
          aria-hidden
          className="pointer-events-none invisible hidden min-h-0 xl:block"
        />
      ))}
    </div>
  );
}
