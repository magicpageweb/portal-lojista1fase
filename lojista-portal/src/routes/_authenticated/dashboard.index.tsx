import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, Save, MapPin, MessageCircle, Eye, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { DashboardShell } from "@/components/dashboard-shell";
import { LojistaFormFields } from "@/components/lojista-form-fields";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { slugify } from "@/lib/format";
import {
  formatLojistaField,
  lojistaPayloadForOwner,
  validateLojistaForm,
  type LojistaFormValues,
} from "@/lib/lojista-form";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/_authenticated/dashboard/")({
  component: DashboardPage,
});

function DashboardPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [form, setForm] = useState<LojistaFormValues | null>(null);
  const [saving, setSaving] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: lojista, isLoading } = useQuery({
    queryKey: ["my-lojista", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data } = await supabase.from("lojistas").select("*").eq("user_id", user!.id).maybeSingle();
      return data;
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  const { data: cats = [] } = useQuery({
    queryKey: ["categorias"],
    queryFn: async () => (await supabase.from("categorias").select("*").order("ordem")).data ?? [],
  });

  const { data: cidades = [] } = useQuery({
    queryKey: ["cidades"],
    queryFn: async () => (await supabase.from("cidades").select("id, nome, uf, slug").order("ordem")).data ?? [],
  });

  const { data: metrics } = useQuery({
    queryKey: ["my-metrics", lojista?.id],
    enabled: !!lojista?.id,
    queryFn: async () => {
      const { data } = await supabase.from("metricas_lojista").select("tipo").eq("lojista_id", lojista!.id);
      const counts = { visualizacao: 0, clique_whatsapp: 0, acesso_mapa: 0, clique_site: 0 };
      (data ?? []).forEach((m: any) => {
        counts[m.tipo as keyof typeof counts]++;
      });
      return counts;
    },
  });

  useEffect(() => {
    if (lojista && !initialized) {
      setForm(lojista);
      setInitialized(true);
    } else if (user && !initialized && !form) {
      setForm({ user_id: user.id, nome_fantasia: "", slug: "" });
      setInitialized(true);
    }
  }, [lojista, user, initialized, form]);

  if (isLoading || !form) {
    return (
      <DashboardShell title="Minha loja">
        <Loader2 className="mx-auto h-6 w-6 animate-spin" />
      </DashboardShell>
    );
  }

  const handleChange = (k: string, v: string) => {
    setForm({ ...form, [k]: formatLojistaField(k, v) });
    if (errors[k]) setErrors({ ...errors, [k]: "" });
  };

  const handlePatch = (patch: Partial<LojistaFormValues>) => {
    setForm({ ...form, ...patch });
    if (patch.cidade_id && errors.cidade) setErrors({ ...errors, cidade: "" });
  };

  const handleSave = async () => {
    const nextErrors = validateLojistaForm(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      toast.error("Por favor, corrija os erros no formulário antes de salvar.");
      return;
    }
    setSaving(true);
    const slug = form.slug || slugify(form.nome_fantasia ?? "");
    const payload = { ...lojistaPayloadForOwner(form), slug } as any;

    const op = lojista?.id
      ? supabase.from("lojistas").update(payload).eq("id", lojista.id)
      : supabase.from("lojistas").insert({
          ...payload,
          user_id: user!.id,
          status: "aguardando_aprovacao",
        });

    const { error } = await op;
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success(lojista?.id ? "Perfil atualizado" : "Cadastro enviado! Aguardando aprovação do Sindilojas.");
    setInitialized(false);
    qc.invalidateQueries({ queryKey: ["my-lojista"] });
  };

  const statusLabel: Record<string, { label: string; cls: string }> = {
    aguardando_aprovacao: { label: "Aguardando aprovação", cls: "bg-amber-500/15 text-amber-700" },
    ativo: { label: "Ativo", cls: "bg-emerald-500/15 text-emerald-700" },
    inativo: { label: "Inativo", cls: "bg-muted text-muted-foreground" },
    rejeitado: { label: "Rejeitado", cls: "bg-destructive/15 text-destructive" },
  };
  const st = statusLabel[form.status ?? "aguardando_aprovacao"];
  const uploadFolder = lojista?.id ?? user?.id ?? "draft";

  return (
    <DashboardShell title="Minha loja">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Badge className={st.cls + " border-0"}>{st.label}</Badge>
          {form.slug && form.status === "ativo" && (
            <Button asChild variant="outline" size="sm">
              <a href={`/lojistas/${form.slug}`} target="_blank" rel="noreferrer">
                Ver loja pública <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            </Button>
          )}
        </div>
        <Button onClick={handleSave} disabled={saving} className="gradient-gold text-secondary shadow-gold">
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />} Salvar
        </Button>
      </div>

      {metrics && (
        <div className="mb-6 grid gap-3 sm:grid-cols-3">
          <Metric icon={Eye} label="Visualizações" value={metrics.visualizacao} />
          <Metric icon={MessageCircle} label="Cliques WhatsApp" value={metrics.clique_whatsapp} />
          <Metric icon={MapPin} label="Acessos ao mapa" value={metrics.acesso_mapa} />
        </div>
      )}

      <LojistaFormFields
        form={form}
        errors={errors}
        cats={cats}
        cidades={cidades}
        onChange={handleChange}
        onPatch={handlePatch}
        uploadFolder={uploadFolder}
      />
    </DashboardShell>
  );
}

function Metric({ icon: Icon, label, value }: any) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-5">
        <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <p className="font-display text-2xl font-bold">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}
