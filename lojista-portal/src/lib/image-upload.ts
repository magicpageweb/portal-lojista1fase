import imageCompression from "browser-image-compression";
import { supabase } from "@/integrations/supabase/client";

export type ImageKind = "logo" | "capa" | "produto";

const ACCEPTED = new Set(["image/jpeg", "image/jpg", "image/png", "image/webp"]);

const LIMITS: Record<
  ImageKind,
  { maxInputBytes: number; maxWidthOrHeight: number; label: string; hint: string }
> = {
  logo: {
    maxInputBytes: 2 * 1024 * 1024,
    maxWidthOrHeight: 500,
    label: "Logo",
    hint: "PNG, JPG ou WebP · até 2 MB · redimensionamos para no máximo 500×500 px",
  },
  capa: {
    maxInputBytes: 5 * 1024 * 1024,
    maxWidthOrHeight: 1600,
    label: "Capa",
    hint: "PNG, JPG ou WebP · até 5 MB · redimensionamos para no máximo 1600 px de largura",
  },
  produto: {
    maxInputBytes: 3 * 1024 * 1024,
    maxWidthOrHeight: 1000,
    label: "Foto do produto",
    hint: "PNG, JPG ou WebP · até 3 MB · redimensionamos para no máximo 1000 px de largura",
  },
};

export function imageUploadHint(kind: ImageKind): string {
  return LIMITS[kind].hint;
}

export function validateImageFile(file: File, kind: ImageKind): string | null {
  const mime = (file.type || "").toLowerCase();
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  const okExt = ["jpg", "jpeg", "png", "webp"].includes(ext);
  if (!ACCEPTED.has(mime) && !okExt) {
    return "Formato não aceito. Use PNG, JPG ou WebP.";
  }
  const limit = LIMITS[kind];
  if (file.size > limit.maxInputBytes) {
    const mb = Math.round(limit.maxInputBytes / (1024 * 1024));
    return `Arquivo muito grande para ${limit.label.toLowerCase()}. Máximo: ${mb} MB.`;
  }
  return null;
}

export async function compressImageFile(file: File, kind: ImageKind): Promise<File> {
  const { maxWidthOrHeight } = LIMITS[kind];
  const compressed = await imageCompression(file, {
    maxWidthOrHeight,
    maxSizeMB: kind === "logo" ? 0.4 : kind === "produto" ? 0.8 : 1.2,
    useWebWorker: true,
    fileType: file.type === "image/png" ? "image/png" : "image/webp",
    initialQuality: 0.82,
  });
  const base = file.name.replace(/\.[^.]+$/, "") || kind;
  const outName = `${base}.${compressed.type.includes("png") ? "png" : "webp"}`;
  return new File([compressed], outName, { type: compressed.type, lastModified: Date.now() });
}

/**
 * Valida → comprime → sobe para o bucket `lojistas`.
 * Retorna o path relativo salvo no Storage.
 */
export async function prepareAndUploadImage(opts: {
  file: File;
  kind: ImageKind;
  folder: string;
  fieldName?: string;
}): Promise<{ path: string }> {
  const error = validateImageFile(opts.file, opts.kind);
  if (error) throw new Error(error);

  const compressed = await compressImageFile(opts.file, opts.kind);
  const ext = compressed.name.split(".").pop() || "webp";
  const field = opts.fieldName ?? opts.kind;
  const path = `${opts.folder.replace(/\/$/, "")}/${field}-${Date.now()}.${ext}`;

  const { error: upErr } = await supabase.storage.from("lojistas").upload(path, compressed, {
    upsert: true,
    contentType: compressed.type,
  });
  if (upErr) throw new Error(upErr.message);
  return { path };
}
