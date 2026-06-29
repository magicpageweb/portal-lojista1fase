import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Upload, Pencil, Save, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { DashboardShell } from "@/components/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { formatPrice, publicImage } from "@/lib/format";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/_authenticated/dashboard/produtos")({
  component: ProdutosPage,
});

function ProdutosPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [editing, setEditing] = useState<any>(null);
  const [open, setOpen] = useState(false);

  const { data: lojista } = useQuery({
    queryKey: ["my-lojista", user?.id],
    enabled: !!user?.id,
    queryFn: async () => (await supabase.from("lojistas").select("id, nome_fantasia").eq("user_id", user!.id).maybeSingle()).data,
  });

  const { data: produtos = [] } = useQuery({
    queryKey: ["my-produtos", lojista?.id],
    enabled: !!lojista?.id,
    queryFn: async () => (await supabase.from("produtos").select("*").eq("lojista_id", lojista!.id).order("ordem")).data ?? [],
  });

  const openNew = () => { setEditing({ nome: "", preco: null, descricao: "", foto_url: null, ativo: true }); setOpen(true); };
  const openEdit = (p: any) => { setEditing(p); setOpen(true); };

  const handleSave = async () => {
    if (!lojista?.id || !editing) return;
    if (!editing.nome) return toast.error("Informe o nome do produto");
    const payload = { ...editing, lojista_id: lojista.id };
    delete payload.id;
    delete payload.created_at;
    delete payload.updated_at;
    const op = editing.id
      ? supabase.from("produtos").update(payload).eq("id", editing.id)
      : supabase.from("produtos").insert(payload);
    const { error } = await op;
    if (error) return toast.error(error.message);
    toast.success("Produto salvo");
    setOpen(false);
    qc.invalidateQueries({ queryKey: ["my-produtos"] });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remover este produto?")) return;
    const { error } = await supabase.from("produtos").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Removido");
    qc.invalidateQueries({ queryKey: ["my-produtos"] });
  };

  const handleUpload = async (file: File) => {
    if (!user) return;
    const ext = file.name.split(".").pop();
    const path = `${user.id}/produto-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("lojistas").upload(path, file);
    if (error) return toast.error(error.message);
    setEditing({ ...editing, foto_url: path });
    toast.success("Foto enviada");
  };

  if (!lojista) {
    return (
      <DashboardShell title="Produtos">
        <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-12 text-center">
          <p>Você precisa cadastrar sua loja antes de adicionar produtos.</p>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell title="Catálogo de produtos">
      <div className="mb-6 flex justify-between">
        <p className="text-muted-foreground">{produtos.length} produto(s)</p>
        <Button onClick={openNew} className="gradient-gold text-secondary"><Plus className="mr-1 h-4 w-4" /> Novo produto</Button>
      </div>

      {produtos.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-12 text-center text-muted-foreground">
          Nenhum produto cadastrado. Clique em "Novo produto".
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {produtos.map((p: any) => {
            const img = publicImage(p.foto_url);
            return (
              <Card key={p.id} className="overflow-hidden">
                <div className="aspect-square overflow-hidden bg-muted">
                  {img && <img src={img} alt="" className="h-full w-full object-cover" />}
                </div>
                <CardContent className="p-4">
                  <h3 className="line-clamp-1 font-semibold">{p.nome}</h3>
                  {p.preco != null && <p className="font-display text-lg font-bold text-primary">{formatPrice(p.preco)}</p>}
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => openEdit(p)} className="flex-1"><Pencil className="mr-1 h-3 w-3" /> Editar</Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDelete(p.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing?.id ? "Editar produto" : "Novo produto"}</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div className="space-y-2"><Label>Nome *</Label><Input value={editing.nome} onChange={(e) => setEditing({ ...editing, nome: e.target.value })} /></div>
              <div className="space-y-2"><Label>Preço (R$)</Label><Input type="number" step="0.01" value={editing.preco ?? ""} onChange={(e) => setEditing({ ...editing, preco: e.target.value === "" ? null : Number(e.target.value) })} /></div>
              <div className="space-y-2"><Label>Descrição</Label><Textarea rows={3} value={editing.descricao ?? ""} onChange={(e) => setEditing({ ...editing, descricao: e.target.value })} /></div>
              <div>
                <Label>Foto</Label>
                <label className="mt-2 flex aspect-video cursor-pointer items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-border bg-muted/30 hover:border-primary">
                  {editing.foto_url ? (
                    <img src={publicImage(editing.foto_url)} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="text-center text-muted-foreground"><Upload className="mx-auto h-6 w-6" /><p className="text-xs">Enviar foto</p></div>
                  )}
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])} />
                </label>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSave} className="flex-1 gradient-gold text-secondary"><Save className="mr-2 h-4 w-4" /> Salvar</Button>
                <Button variant="outline" onClick={() => setOpen(false)}><X className="h-4 w-4" /></Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardShell>
  );
}
