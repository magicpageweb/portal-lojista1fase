import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { to: "/", label: "Início" },
  { to: "/lojistas", label: "Lojistas" },
  { to: "/categorias", label: "Categorias" },
  { to: "/apresentacao", label: "Como funciona" },
  { to: "/sobre", label: "Sobre" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex shrink-0 items-center" aria-label="Sindilojas — início">
          <img
            src="/Sindilojas_Logo_color.webp"
            alt="Sindilojas"
            className="h-10 w-auto object-contain"
            width={160}
            height={40}
          />
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
              activeProps={{ className: "text-primary" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <Button asChild variant="ghost" size="sm">
            <Link to="/auth">Entrar</Link>
          </Button>
          <Button asChild size="sm" className="gradient-gold text-secondary shadow-gold hover:opacity-90">
            <Link to="/auth">Cadastrar minha loja</Link>
          </Button>
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="rounded-md p-2 md:hidden"
          aria-label="Menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <div className="border-t border-border/60 bg-background md:hidden">
          <div className="container mx-auto flex flex-col gap-1 px-4 py-3">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-2 flex gap-2">
              <Button asChild variant="outline" size="sm" className="flex-1">
                <Link to="/auth">Entrar</Link>
              </Button>
              <Button asChild size="sm" className="flex-1 gradient-gold text-secondary">
                <Link to="/auth">Cadastrar</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
