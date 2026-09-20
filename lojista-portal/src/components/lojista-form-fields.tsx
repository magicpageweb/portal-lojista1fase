import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUploadField } from "@/components/image-upload-field";
import type { LojistaFormValues, LojistaPlano } from "@/lib/lojista-form";

export { ImageUploadField } from "@/components/image-upload-field";

type Categoria = { id: string; nome: string };

type LojistaFormFieldsProps = {
  form: LojistaFormValues;
  errors: Record<string, string>;
  cats: Categoria[];
  onChange: (key: string, value: string) => void;
  /** Pasta no Storage (user.id ou lojista.id). */
  uploadFolder: string;
  /** Modo admin/gerente: slug read-only + seletor de plano. */
  staffMode?: boolean;
  onPlanoChange?: (plano: LojistaPlano) => void;
};

function Field({
  label,
  value,
  onChange,
  type = "text",
  className = "",
  error,
  readOnly,
  ...rest
}: {
  label: string;
  value: unknown;
  onChange?: (v: string) => void;
  type?: string;
  className?: string;
  error?: string;
  readOnly?: boolean;
  [k: string]: unknown;
}) {
  return (
    <div className={"space-y-2 " + className}>
      <Label className={error ? "text-destructive" : ""}>{label}</Label>
      <Input
        type={type}
        value={(value as string) ?? ""}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        readOnly={readOnly}
        className={
          (error ? "border-destructive focus-visible:ring-destructive " : "") +
          (readOnly ? "cursor-not-allowed bg-muted/50" : "")
        }
        {...rest}
      />
      {error && <p className="text-xs font-medium text-destructive">{error}</p>}
    </div>
  );
}

export function LojistaFormFields({
  form,
  errors,
  cats,
  onChange,
  uploadFolder,
  staffMode = false,
  onPlanoChange,
}: LojistaFormFieldsProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Dados da loja</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <Field
            label="Nome fantasia *"
            value={form.nome_fantasia}
            onChange={(v) => onChange("nome_fantasia", v)}
            error={errors.nome_fantasia}
          />
          <Field
            label="Razão social"
            value={form.razao_social}
            onChange={(v) => onChange("razao_social", v)}
            error={errors.razao_social}
          />
          <Field label="CNPJ" value={form.cnpj} onChange={(v) => onChange("cnpj", v)} error={errors.cnpj} />
          <div className="space-y-2">
            <Label>Categoria</Label>
            <Select value={form.categoria_id ?? ""} onValueChange={(v) => onChange("categoria_id", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {cats.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {staffMode && (
            <>
              <div className="md:col-span-2 space-y-2">
                <Field label="Slug (URL pública)" value={form.slug} readOnly />
                <p className="text-[11px] text-muted-foreground">
                  Alterar a URL requer suporte técnico.
                </p>
              </div>
              <div className="space-y-2">
                <Label>Plano</Label>
                <Select
                  value={(form.plano as string) ?? "essencial"}
                  onValueChange={(v) => onPlanoChange?.(v as LojistaPlano)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="essencial">Essencial</SelectItem>
                    <SelectItem value="vitrine">Vitrine</SelectItem>
                    <SelectItem value="destaque">Destaque</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          <Field
            label="Slogan"
            value={form.slogan}
            onChange={(v) => onChange("slogan", v)}
            className={staffMode ? "" : "md:col-span-2"}
            error={errors.slogan}
          />
          <div className="md:col-span-2 space-y-2">
            <Label>Descrição</Label>
            <Textarea
              rows={5}
              value={form.descricao ?? ""}
              onChange={(e) => onChange("descricao", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Imagens</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ImageUploadField
            label="Logo"
            kind="logo"
            current={form.logo_url}
            folder={uploadFolder}
            fieldName="logo_url"
            onUploaded={(path) => onChange("logo_url", path)}
          />
          <ImageUploadField
            label="Capa"
            kind="capa"
            current={form.capa_url}
            folder={uploadFolder}
            fieldName="capa_url"
            onUploaded={(path) => onChange("capa_url", path)}
          />
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Contato e redes</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <Field label="Telefone" value={form.telefone} onChange={(v) => onChange("telefone", v)} error={errors.telefone} />
          <Field
            label="WhatsApp (com DDD)"
            value={form.whatsapp}
            onChange={(v) => onChange("whatsapp", v)}
            error={errors.whatsapp}
          />
          <Field
            label="Email"
            type="email"
            value={form.email}
            onChange={(v) => onChange("email", v)}
            error={errors.email}
          />
          <Field label="Site" value={form.site} onChange={(v) => onChange("site", v)} error={errors.site} />
          <Field
            label="Instagram"
            value={form.instagram}
            onChange={(v) => onChange("instagram", v)}
            error={errors.instagram}
          />
          <Field
            label="Facebook"
            value={form.facebook}
            onChange={(v) => onChange("facebook", v)}
            error={errors.facebook}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Endereço</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field label="Endereço" value={form.endereco} onChange={(v) => onChange("endereco", v)} error={errors.endereco} />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Número" value={form.numero} onChange={(v) => onChange("numero", v)} error={errors.numero} />
            <Field label="CEP" value={form.cep} onChange={(v) => onChange("cep", v)} error={errors.cep} />
          </div>
          <Field label="Bairro" value={form.bairro} onChange={(v) => onChange("bairro", v)} error={errors.bairro} />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Cidade" value={form.cidade} onChange={(v) => onChange("cidade", v)} error={errors.cidade} />
            <Field label="Estado" value={form.estado} onChange={(v) => onChange("estado", v)} error={errors.estado} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
