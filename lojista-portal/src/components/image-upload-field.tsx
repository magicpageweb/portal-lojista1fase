import { useState } from "react";
import { Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { publicImage } from "@/lib/format";
import {
  imageUploadHint,
  prepareAndUploadImage,
  type ImageKind,
} from "@/lib/image-upload";

type ImageUploadFieldProps = {
  label: string;
  kind: ImageKind;
  current?: string | null;
  folder: string;
  fieldName?: string;
  onUploaded: (path: string) => void;
  className?: string;
};

export function ImageUploadField({
  label,
  kind,
  current,
  folder,
  fieldName,
  onUploaded,
  className = "",
}: ImageUploadFieldProps) {
  const [busy, setBusy] = useState(false);
  const img = publicImage(current);
  const hint = imageUploadHint(kind);

  const onPick = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true);
    try {
      const { path } = await prepareAndUploadImage({ file, kind, folder, fieldName });
      onUploaded(path);
      toast.success(`${label} enviada`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao enviar imagem");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={className}>
      <Label>{label}</Label>
      <label className="relative mt-2 flex aspect-video cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-border bg-muted/30 transition-colors hover:border-primary">
        {busy ? (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin" />
            <p className="text-xs">Otimizando e enviando…</p>
          </div>
        ) : img ? (
          <img src={img} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="text-center text-muted-foreground">
            <Upload className="mx-auto h-6 w-6" />
            <p className="mt-1 text-xs">Clique para enviar</p>
          </div>
        )}
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp,.png,.jpg,.jpeg,.webp"
          className="hidden"
          disabled={busy}
          onChange={(e) => {
            const f = e.target.files?.[0];
            e.target.value = "";
            void onPick(f);
          }}
        />
      </label>
      <p className="mt-1.5 text-[11px] leading-snug text-muted-foreground">{hint}</p>
    </div>
  );
}
