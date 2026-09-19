import type { LucideIcon } from "lucide-react";
import {
  Car,
  Dumbbell,
  Home,
  Laptop,
  Shirt,
  Sparkles,
  Store,
  UtensilsCrossed,
  Wrench,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  Shirt,
  UtensilsCrossed,
  Wrench,
  Sparkles,
  Home,
  Dumbbell,
  Laptop,
  Car,
  Store,
};

/** Resolve o ícone Lucide a partir do campo `categorias.icone` (seed). */
export function getCategoryIcon(icone?: string | null): LucideIcon {
  if (!icone) return Store;
  return ICONS[icone] ?? Store;
}
