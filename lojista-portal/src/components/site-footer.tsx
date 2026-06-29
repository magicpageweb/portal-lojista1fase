import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Mail, MapPin, Phone, Shield, Store } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-secondary/20 bg-secondary text-secondary-foreground">
      <div className="container mx-auto grid gap-10 px-4 py-14 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 font-display text-lg font-bold">
            <span className="grid h-9 w-9 place-items-center rounded-lg gradient-gold">
              <Store className="h-5 w-5 text-secondary" />
            </span>
            <span>
              Sindi<span className="text-primary">lojas</span>
            </span>
          </div>
          <p className="mt-3 text-sm text-secondary-foreground/70">
            Portal oficial do sindicato dos lojistas. Conectamos consumidores ao comércio local.
          </p>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">Portal</h4>
          <ul className="space-y-2 text-sm text-secondary-foreground/80">
            <li><Link to="/lojistas" className="hover:text-primary">Lojistas associados</Link></li>
            <li><Link to="/categorias" className="hover:text-primary">Categorias</Link></li>
            <li><Link to="/auth" className="hover:text-primary">Área do lojista</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">Sindicato</h4>
          <ul className="space-y-2 text-sm text-secondary-foreground/80">
            <li className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Rua do Comércio, 100 — Centro</li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> (00) 0000-0000</li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> contato@sindilojas.org.br</li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">Conecte-se</h4>
          <div className="flex gap-3">
            <a href="#" aria-label="Instagram" className="grid h-10 w-10 place-items-center rounded-full bg-secondary-foreground/10 transition-colors hover:bg-primary hover:text-secondary">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="#" aria-label="Facebook" className="grid h-10 w-10 place-items-center rounded-full bg-secondary-foreground/10 transition-colors hover:bg-primary hover:text-secondary">
              <Facebook className="h-5 w-5" />
            </a>
          </div>
          <div className="mt-6 flex items-center gap-2 rounded-lg border border-secondary-foreground/15 bg-secondary-foreground/5 px-3 py-2 text-xs">
            <Shield className="h-4 w-4 text-primary" />
            <span>Lojistas verificados pelo sindicato</span>
          </div>
        </div>
      </div>
      <div className="border-t border-secondary-foreground/10">
        <div className="container mx-auto flex flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-secondary-foreground/60 md:flex-row">
          <span>
            © {new Date().getFullYear()} Sindilojas. Todos os direitos reservados.
            {" | "}
            Desenvolvido por{" "}
            <a
              href="https://www.magicpage.com.br"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium hover:text-primary transition-colors"
            >
              MagicPage Websites - Desenvolvimento Web
            </a>
          </span>
          <span>Compre local. Apoie o comércio do seu bairro.</span>
        </div>
      </div>
    </footer>
  );
}
