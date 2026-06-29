import { createFileRoute, redirect } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Check, X, Store, Eye, MessageCircle, MapPin, Users, ShieldOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { DashboardShell } from "@/components/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { publicImage } from "@/lib/format";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/_authenticated/admin/")({
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/auth" });

    const { data: role } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", data.user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!role) throw redirect({ to: "/dashboard" });
  },
  component: AdminPage,
});

function AdminPage() {
  const { isAdmin, loading } = useAuth();
  const qc = useQueryClient();

  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [lojistas, produtos, metricas, aprov] = await Promise.all([
        supabase.from("lojistas").select("id", { count: "exact", head: true }),
        supabase.from("produtos").select("id", { count: "exact", head: true }),
        supabase.from("metricas_lojista").select("id", { count: "exact", head: true }),
        supabase.from("lojistas").select("id", { count: "exact", head: true }).eq("status", "aguardando_aprovacao"),
      ]);
      return {
        lojistas: lojistas.count ?? 0,
        produtos: produtos.count ?? 0,
        metricas: metricas.count ?? 0,
        aprov: aprov.count ?? 0,
      };
    },
    enabled: isAdmin,
  });

  const { data: lojistas = [] } = useQuery({
    queryKey: ["admin-lojistas"],
    queryFn: async () => (await supabase.from("lojistas").select("*, categorias(nome)").order("created_at", { ascending: false })).data ?? [],
    enabled: isAdmin,
  });

  const updateStatus = async (id: string, status: "ativo" | "inativo" | "rejeitado" | "aguardando_aprovacao") => {
    const { error } = await supabase.from("lojistas").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Status atualizado");
    qc.invalidateQueries({ queryKey: ["admin-lojistas"] });
    qc.invalidateQueries({ queryKey: ["admin-stats"] });
  };

  const toggleDestaque = async (id: string, destaque: boolean) => {
    const { error } = await supabase.from("lojistas").update({ destaque }).eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["admin-lojistas"] });
  };

  if (loading) return <DashboardShell title="Admin">Carregando...</DashboardShell>;
  if (!isAdmin) {
    return (
      <DashboardShell title="Admin">
        <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-12 text-center">
          <ShieldOff className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 font-display text-xl font-semibold">Acesso restrito</h3>
          <p className="mt-1 text-sm text-muted-foreground">Você não possui permissão de administrador.</p>
        </div>
      </DashboardShell>
    );
  }

  const aguardando = lojistas.filter((l: any) => l.status === "aguardando_aprovacao");
  const ativos = lojistas.filter((l: any) => l.status === "ativo");
  const inativos = lojistas.filter((l: any) => l.status === "inativo" || l.status === "rejeitado");

  return (
    <DashboardShell title="Painel Administrativo">
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users} label="Total de lojistas" value={stats?.lojistas ?? 0} />
        <StatCard icon={Store} label="Produtos cadastrados" value={stats?.produtos ?? 0} />
        <StatCard icon={Eye} label="Eventos registrados" value={stats?.metricas ?? 0} />
        <StatCard icon={Check} label="Aguardando aprovação" value={stats?.aprov ?? 0} highlight />
      </div>

      <Tabs defaultValue="aprov">
        <TabsList>
          <TabsTrigger value="aprov">Aprovações ({aguardando.length})</TabsTrigger>
          <TabsTrigger value="ativos">Ativos ({ativos.length})</TabsTrigger>
          <TabsTrigger value="inativos">Inativos ({inativos.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="aprov" className="mt-4">
          <LojistaList lojistas={aguardando} onApprove={(id: string) => updateStatus(id, "ativo")} onReject={(id: string) => updateStatus(id, "rejeitado")} />
        </TabsContent>
        <TabsContent value="ativos" className="mt-4">
          <LojistaList lojistas={ativos} onToggleDestaque={toggleDestaque} onDeactivate={(id: string) => updateStatus(id, "inativo")} />
        </TabsContent>
        <TabsContent value="inativos" className="mt-4">
          <LojistaList lojistas={inativos} onActivate={(id: string) => updateStatus(id, "ativo")} />
        </TabsContent>
      </Tabs>
    </DashboardShell>
  );
}

function StatCard({ icon: Icon, label, value, highlight }: any) {
  return (
    <Card className={highlight ? "border-primary shadow-gold" : ""}>
      <CardContent className="flex items-center gap-3 p-5">
        <span className={`grid h-10 w-10 place-items-center rounded-lg ${highlight ? "gradient-gold text-secondary" : "bg-secondary/10 text-secondary"}`}>
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <p className="text-2xl font-bold font-display">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function LojistaList({ lojistas, onApprove, onReject, onActivate, onDeactivate, onToggleDestaque }: any) {
  if (lojistas.length === 0) {
    return <p className="rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground">Nada por aqui.</p>;
  }
  return (
    <div className="space-y-3">
      {lojistas.map((l: any) => {
        const logo = publicImage(l.logo_url);
        return (
          <Card key={l.id}>
            <CardContent className="flex flex-wrap items-center gap-4 p-4">
              <div className="grid h-12 w-12 place-items-center overflow-hidden rounded-lg bg-muted">
                {logo ? <img src={logo} alt="" className="h-full w-full object-cover" /> : <Store className="h-5 w-5 text-muted-foreground" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{l.nome_fantasia}</h3>
                  {l.destaque && <Badge className="gradient-gold text-secondary">Destaque</Badge>}
                </div>
                <p className="text-xs text-muted-foreground">{l.categorias?.nome ?? "Sem categoria"} · {l.cidade ?? "-"} · CNPJ {l.cnpj ?? "—"}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {onApprove && <Button size="sm" onClick={() => onApprove(l.id)} className="bg-emerald-500 hover:bg-emerald-600"><Check className="mr-1 h-4 w-4" /> Aprovar</Button>}
                {onReject && <Button size="sm" variant="outline" onClick={() => onReject(l.id)}><X className="mr-1 h-4 w-4" /> Rejeitar</Button>}
                {onActivate && <Button size="sm" onClick={() => onActivate(l.id)} className="bg-emerald-500 hover:bg-emerald-600">Reativar</Button>}
                {onDeactivate && <Button size="sm" variant="outline" onClick={() => onDeactivate(l.id)}>Desativar</Button>}
                {onToggleDestaque && (
                  <Button size="sm" variant={l.destaque ? "default" : "outline"} onClick={() => onToggleDestaque(l.id, !l.destaque)} className={l.destaque ? "gradient-gold text-secondary" : ""}>
                    {l.destaque ? "Remover destaque" : "Destacar"}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
