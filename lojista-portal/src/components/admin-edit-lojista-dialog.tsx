import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { LojistaFormFields } from "@/components/lojista-form-fields";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  formatLojistaField,
  isPlanoDowngrade,
  lojistaPayloadForStaff,
  validateLojistaForm,
  type LojistaFormValues,
  type LojistaPlano,
} from "@/lib/lojista-form";

type Props = {
  lojistaId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function AdminEditLojistaDialog({ lojistaId, open, onOpenChange }: Props) {
  const qc = useQueryClient();
  const [form, setForm] = useState<LojistaFormValues | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [pendingPlano, setPendingPlano] = useState<LojistaPlano | null>(null);

  const { data: cats = [] } = useQuery({
    queryKey: ["categorias"],
    queryFn: async () => (await supabase.from("categorias").select("*").order("ordem")).data ?? [],
  });

  const { data: cidades = [] } = useQuery({
    queryKey: ["cidades"],
    queryFn: async () => (await supabase.from("cidades").select("id, nome, uf, slug").order("ordem")).data ?? [],
  });

  const { data: lojista, isLoading } = useQuery({
    queryKey: ["admin-edit-lojista", lojistaId],
    enabled: open && !!lojistaId,
    queryFn: async () => {
      const { data, error } = await supabase.from("lojistas").select("*").eq("id", lojistaId!).single();
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (open && lojista) {
      setForm({ ...lojista });
      setErrors({});
    }
    if (!open) {
      setForm(null);
      setPendingPlano(null);
    }
  }, [open, lojista]);

  const handleChange = (key: string, value: string) => {
    setForm((prev) => (prev ? { ...prev, [key]: formatLojistaField(key, value) } : prev));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: "" }));
  };

  const handlePatch = (patch: Partial<LojistaFormValues>) => {
    setForm((prev) => (prev ? { ...prev, ...patch } : prev));
    if (patch.cidade_id && errors.cidade) setErrors((e) => ({ ...e, cidade: "" }));
  };

  const requestPlanoChange = (plano: LojistaPlano) => {
    if (!form) return;
    if (isPlanoDowngrade(form.plano as string, plano)) {
      setPendingPlano(plano);
      return;
    }
    setForm({ ...form, plano });
  };

  const confirmPlanoDowngrade = () => {
    if (!form || !pendingPlano) return;
    setForm({ ...form, plano: pendingPlano });
    setPendingPlano(null);
  };

  const handleSave = async () => {
    if (!form?.id) return;
    const nextErrors = validateLojistaForm(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      toast.error("Corrija os erros no formulário antes de salvar.");
      return;
    }
    setSaving(true);
    const payload = lojistaPayloadForStaff(form) as any;
    const { error } = await supabase.from("lojistas").update(payload).eq("id", form.id);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Lojista atualizado");
    qc.invalidateQueries({ queryKey: ["admin-lojistas"] });
    qc.invalidateQueries({ queryKey: ["admin-stats"] });
    qc.invalidateQueries({ queryKey: ["admin-edit-lojista", form.id] });
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="flex max-h-[92vh] w-[calc(100%-1.5rem)] max-w-4xl flex-col gap-0 overflow-hidden p-0">
          <DialogHeader className="shrink-0 border-b border-border px-6 py-4">
            <DialogTitle className="font-display text-xl">
              Editar lojista{form?.nome_fantasia ? ` — ${form.nome_fantasia}` : ""}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {isLoading || !form ? (
              <div className="flex justify-center py-16">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <LojistaFormFields
                form={form}
                errors={errors}
                cats={cats}
                cidades={cidades}
                onChange={handleChange}
                onPatch={handlePatch}
                uploadFolder={form.id ?? "staff"}
                staffMode
                onPlanoChange={requestPlanoChange}
              />
            )}
          </div>
          <div className="flex shrink-0 justify-end gap-2 border-t border-border px-6 py-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving || !form}
              className="gradient-gold text-secondary shadow-gold"
            >
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Salvar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!pendingPlano} onOpenChange={(o) => !o && setPendingPlano(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Rebaixar plano?</AlertDialogTitle>
            <AlertDialogDescription>
              Ao mudar de um plano superior para {pendingPlano === "essencial" ? "Essencial" : "Vitrine"},
              catálogo de produtos, galeria, site e redes sociais deixarão de aparecer na página pública
              (conforme as regras do plano). Confirma a alteração?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmPlanoDowngrade}>Confirmar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
