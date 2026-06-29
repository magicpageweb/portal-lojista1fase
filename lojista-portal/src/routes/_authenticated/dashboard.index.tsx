import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, Save, Upload, MapPin, MessageCircle, Eye, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { DashboardShell } from "@/components/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { slugify, publicImage, maskCNPJ, maskPhone, maskCEP, validateCNPJ, validateEmail, validatePhone, validateCEP, validateURL, validateSocialLink } from "@/lib/format";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/_authenticated/dashboard/")({
  component: DashboardPage,
});

function DashboardPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [form, setForm] = useState<any>(null);
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

  const { data: metrics } = useQuery({
    queryKey: ["my-metrics", lojista?.id],
    enabled: !!lojista?.id,
    queryFn: async () => {
      const { data } = await supabase.from("metricas_lojista").select("tipo").eq("lojista_id", lojista!.id);
      const counts = { visualizacao: 0, clique_whatsapp: 0, acesso_mapa: 0, clique_site: 0 };
      (data ?? []).forEach((m: any) => { counts[m.tipo as keyof typeof counts]++; });
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
    return <DashboardShell title="Minha loja"><Loader2 className="mx-auto h-6 w-6 animate-spin" /></DashboardShell>;
  }

  const handleChange = (k: string, v: any) => {
    let formatted = v;
    if (k === "cnpj") formatted = maskCNPJ(v);
    else if (k === "telefone" || k === "whatsapp") formatted = maskPhone(v);
    else if (k === "cep") formatted = maskCEP(v);

    setForm({ ...form, [k]: formatted });

    if (errors[k]) {
      setErrors({ ...errors, [k]: "" });
    }
  };

  const handleUpload = async (file: File, field: "logo_url" | "capa_url") => {
    if (!user) return;
    const ext = file.name.split(".").pop();
    const path = `${user.id}/${field}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("lojistas").upload(path, file, { upsert: true });
    if (error) return toast.error("Erro ao enviar imagem: " + error.message);
    handleChange(field, path);
    toast.success("Imagem enviada");
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!form.nome_fantasia?.trim()) {
      newErrors.nome_fantasia = "Nome fantasia é obrigatório";
    }
    if (form.cnpj && !validateCNPJ(form.cnpj)) {
      newErrors.cnpj = "CNPJ inválido (deve conter 14 dígitos válidos)";
    }
    if (form.email && !validateEmail(form.email)) {
      newErrors.email = "Endereço de e-mail inválido";
    }
    if (form.telefone && !validatePhone(form.telefone)) {
      newErrors.telefone = "Telefone inválido (deve conter DDD + número)";
    }
    if (form.whatsapp && !validatePhone(form.whatsapp)) {
      newErrors.whatsapp = "WhatsApp inválido (deve conter DDD + número)";
    }
    if (form.cep && !validateCEP(form.cep)) {
      newErrors.cep = "CEP inválido (deve conter 8 dígitos)";
    }
    if (form.site && !validateURL(form.site)) {
      newErrors.site = "URL do site inválida (ex: www.sualoja.com.br)";
    }
    if (form.instagram && !validateSocialLink(form.instagram, "instagram")) {
      newErrors.instagram = "Instagram inválido (use @usuario ou link completo)";
    }
    if (form.facebook && !validateSocialLink(form.facebook, "facebook")) {
      newErrors.facebook = "Facebook inválido (use link completo da página)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error("Por favor, corrija os erros no formulário antes de salvar.");
      return;
    }
    setSaving(true);
    const slug = form.slug || slugify(form.nome_fantasia);
    const payload: any = { ...form, slug };
    delete payload.id;
    delete payload.created_at;
    delete payload.updated_at;
    delete payload.status;
    delete payload.destaque;

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

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Dados da loja</CardTitle></CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <Field label="Nome fantasia *" value={form.nome_fantasia} onChange={(v) => handleChange("nome_fantasia", v)} error={errors.nome_fantasia} />
            <Field label="Razão social" value={form.razao_social} onChange={(v) => handleChange("razao_social", v)} error={errors.razao_social} />
            <Field label="CNPJ" value={form.cnpj} onChange={(v) => handleChange("cnpj", v)} error={errors.cnpj} />
            <div className="space-y-2">
              <Label>Categoria</Label>
              <Select value={form.categoria_id ?? ""} onValueChange={(v) => handleChange("categoria_id", v)}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {cats.map((c: any) => <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <Field label="Slogan" value={form.slogan} onChange={(v) => handleChange("slogan", v)} className="md:col-span-2" error={errors.slogan} />
            <div className="md:col-span-2 space-y-2">
              <Label>Descrição</Label>
              <Textarea rows={5} value={form.descricao ?? ""} onChange={(e) => handleChange("descricao", e.target.value)} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Imagens</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <ImageUpload label="Logo" current={form.logo_url} onUpload={(f) => handleUpload(f, "logo_url")} />
            <ImageUpload label="Capa" current={form.capa_url} onUpload={(f) => handleUpload(f, "capa_url")} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Contato e redes</CardTitle></CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <Field label="Telefone" value={form.telefone} onChange={(v) => handleChange("telefone", v)} error={errors.telefone} />
            <Field label="WhatsApp (com DDD)" value={form.whatsapp} onChange={(v) => handleChange("whatsapp", v)} error={errors.whatsapp} />
            <Field label="Email" type="email" value={form.email} onChange={(v) => handleChange("email", v)} error={errors.email} />
            <Field label="Site" value={form.site} onChange={(v) => handleChange("site", v)} error={errors.site} />
            <Field label="Instagram" value={form.instagram} onChange={(v) => handleChange("instagram", v)} error={errors.instagram} />
            <Field label="Facebook" value={form.facebook} onChange={(v) => handleChange("facebook", v)} error={errors.facebook} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Endereço</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Field label="Endereço" value={form.endereco} onChange={(v) => handleChange("endereco", v)} error={errors.endereco} />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Número" value={form.numero} onChange={(v) => handleChange("numero", v)} error={errors.numero} />
              <Field label="CEP" value={form.cep} onChange={(v) => handleChange("cep", v)} error={errors.cep} />
            </div>
            <Field label="Bairro" value={form.bairro} onChange={(v) => handleChange("bairro", v)} error={errors.bairro} />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Cidade" value={form.cidade} onChange={(v) => handleChange("cidade", v)} error={errors.cidade} />
              <Field label="Estado" value={form.estado} onChange={(v) => handleChange("estado", v)} error={errors.estado} />
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}

function Field({ label, value, onChange, type = "text", className = "", error, ...rest }: { label: string; value: any; onChange: (v: string) => void; type?: string; className?: string; error?: string; [k: string]: any }) {
  return (
    <div className={"space-y-2 " + className}>
      <Label className={error ? "text-destructive" : ""}>{label}</Label>
      <Input
        type={type}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className={error ? "border-destructive focus-visible:ring-destructive" : ""}
        {...rest}
      />
      {error && (
        <p className="text-xs font-medium text-destructive animate-fade-in">
          {error}
        </p>
      )}
    </div>
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
          <p className="text-2xl font-bold font-display">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function ImageUpload({ label, current, onUpload }: { label: string; current?: string | null; onUpload: (f: File) => void }) {
  const img = publicImage(current);
  return (
    <div>
      <Label>{label}</Label>
      <label className="mt-2 flex aspect-video cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-border bg-muted/30 transition-colors hover:border-primary">
        {img ? (
          <img src={img} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="text-center text-muted-foreground">
            <Upload className="mx-auto h-6 w-6" />
            <p className="mt-1 text-xs">Clique para enviar</p>
          </div>
        )}
        <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])} />
      </label>
    </div>
  );
}
