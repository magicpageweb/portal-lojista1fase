import { Link } from "@tanstack/react-router";
import { ChevronDown, MapPin, Menu, X } from "lucide-react";
import { Fragment, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DemoBanner } from "@/components/demo-banner";
import { CIDADES_ATUACAO } from "@/lib/cidades";

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
    <>
      <DemoBanner />
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
              <Fragment key={l.to}>
                <Link
                  to={l.to}
                  className="px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
                  activeProps={{ className: "text-primary" }}
                  activeOptions={{ exact: l.to === "/" }}
                >
                  {l.label}
                </Link>
                {l.to === "/categorias" && (
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-foreground/80 outline-none transition-colors hover:text-primary data-[state=open]:text-primary">
                      Municípios <ChevronDown className="h-3.5 w-3.5" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56">
                      {CIDADES_ATUACAO.map((c) => (
                        <DropdownMenuItem key={c.slug} asChild>
                          <Link to="/cidade/$slug" params={{ slug: c.slug }} className="cursor-pointer">
                            <MapPin className="h-4 w-4 text-primary" /> {c.nome}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </Fragment>
            ))}
          </nav>
          <div className="hidden items-center gap-2 md:flex">
            <Button asChild variant="ghost" size="sm">
              <Link to="/auth">Entrar</Link>
            </Button>
            <Button
              asChild
              size="sm"
              className="gradient-gold text-secondary shadow-gold hover:opacity-90"
            >
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
                <Fragment key={l.to}>
                  <Link
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
                  >
                    {l.label}
                  </Link>
                  {l.to === "/categorias" && (
                    <div className="px-3 py-2">
                      <p className="text-sm font-medium">Municípios</p>
                      <div className="mt-1 grid grid-cols-2 gap-1">
                        {CIDADES_ATUACAO.map((c) => (
                          <Link
                            key={c.slug}
                            to="/cidade/$slug"
                            params={{ slug: c.slug }}
                            onClick={() => setOpen(false)}
                            className="rounded-md px-2 py-1.5 text-sm text-foreground/80 hover:bg-accent"
                          >
                            {c.nome}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </Fragment>
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
    </>
  );
}
