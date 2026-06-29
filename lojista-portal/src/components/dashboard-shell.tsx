import { Link, useNavigate } from "@tanstack/react-router";
import { LogOut, Store, LayoutDashboard, Shield, Box } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { ReactNode } from "react";

export function DashboardShell({ children, title }: { children: ReactNode; title?: string }) {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  return (
    <div className="flex min-h-screen bg-muted/30">
      <aside className="hidden w-64 flex-col border-r border-secondary/20 bg-secondary text-secondary-foreground md:flex">
        <Link to="/" className="flex h-16 items-center gap-2 border-b border-secondary-foreground/10 px-5 font-display text-lg font-bold">
          <span className="grid h-9 w-9 place-items-center rounded-lg gradient-gold">
            <Store className="h-5 w-5 text-secondary" />
          </span>
          Sindi<span className="text-primary">lojas</span>
        </Link>
        <nav className="flex-1 space-y-1 p-3">
          <NavItem to="/dashboard" icon={LayoutDashboard} label="Minha loja" />
          <NavItem to="/dashboard/produtos" icon={Box} label="Produtos" />
          {isAdmin && (
            <>
              <div className="mt-6 px-3 text-xs font-semibold uppercase text-secondary-foreground/50">Admin</div>
              <NavItem to="/admin" icon={Shield} label="Painel Admin" />
            </>
          )}
        </nav>
        <div className="border-t border-secondary-foreground/10 p-3">
          <Button onClick={signOut} variant="ghost" className="w-full justify-start text-secondary-foreground hover:bg-secondary-foreground/10">
            <LogOut className="mr-2 h-4 w-4" /> Sair
          </Button>
        </div>
      </aside>

      <main className="flex-1">
        <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
          <h1 className="font-display text-xl font-bold">{title}</h1>
          <Button onClick={signOut} variant="outline" size="sm" className="md:hidden">
            <LogOut className="h-4 w-4" />
          </Button>
        </header>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}

function NavItem({ to, icon: Icon, label }: { to: string; icon: any; label: string }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-secondary-foreground/85 transition-colors hover:bg-secondary-foreground/10"
      activeProps={{ className: "bg-primary text-secondary" }}
      activeOptions={{ exact: false }}
    >
      <Icon className="h-4 w-4" /> {label}
    </Link>
  );
}
