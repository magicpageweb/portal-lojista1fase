import {
  maskCEP,
  maskCNPJ,
  maskPhone,
  validateCEP,
  validateCNPJ,
  validateEmail,
  validatePhone,
  validateSocialLink,
  validateURL,
} from "@/lib/format";

export type LojistaPlano = "essencial" | "vitrine" | "destaque";

export type LojistaFormValues = {
  id?: string;
  nome_fantasia?: string | null;
  razao_social?: string | null;
  cnpj?: string | null;
  categoria_id?: string | null;
  slogan?: string | null;
  descricao?: string | null;
  telefone?: string | null;
  whatsapp?: string | null;
  email?: string | null;
  site?: string | null;
  instagram?: string | null;
  facebook?: string | null;
  endereco?: string | null;
  numero?: string | null;
  cep?: string | null;
  bairro?: string | null;
  cidade?: string | null;
  estado?: string | null;
  logo_url?: string | null;
  capa_url?: string | null;
  slug?: string | null;
  plano?: LojistaPlano | string | null;
  status?: string | null;
  destaque?: boolean | null;
  user_id?: string | null;
  [key: string]: unknown;
};

export const PLANO_LEVEL: Record<string, number> = {
  essencial: 0,
  vitrine: 1,
  destaque: 2,
};

export function isPlanoDowngrade(from?: string | null, to?: string | null): boolean {
  const a = PLANO_LEVEL[from ?? "essencial"] ?? 0;
  const b = PLANO_LEVEL[to ?? "essencial"] ?? 0;
  return b < a;
}

/** Aplica máscaras nos campos sensíveis ao digitar. */
export function formatLojistaField(key: string, value: string): string {
  if (key === "cnpj") return maskCNPJ(value);
  if (key === "telefone" || key === "whatsapp") return maskPhone(value);
  if (key === "cep") return maskCEP(value);
  return value;
}

/** Validações compartilhadas entre dashboard do lojista e painel admin/gerente. */
export function validateLojistaForm(form: LojistaFormValues): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!form.nome_fantasia?.trim()) {
    errors.nome_fantasia = "Nome fantasia é obrigatório";
  }
  if (form.cnpj && !validateCNPJ(form.cnpj)) {
    errors.cnpj = "CNPJ inválido (deve conter 14 dígitos válidos)";
  }
  if (form.email && !validateEmail(form.email)) {
    errors.email = "Endereço de e-mail inválido";
  }
  if (form.telefone && !validatePhone(form.telefone)) {
    errors.telefone = "Telefone inválido (deve conter DDD + número)";
  }
  if (form.whatsapp && !validatePhone(form.whatsapp)) {
    errors.whatsapp = "WhatsApp inválido (deve conter DDD + número)";
  }
  if (form.cep && !validateCEP(form.cep)) {
    errors.cep = "CEP inválido (deve conter 8 dígitos)";
  }
  if (form.site && !validateURL(form.site)) {
    errors.site = "URL do site inválida (ex: www.sualoja.com.br)";
  }
  if (form.instagram && !validateSocialLink(form.instagram, "instagram")) {
    errors.instagram = "Instagram inválido (use @usuario ou link completo)";
  }
  if (form.facebook && !validateSocialLink(form.facebook, "facebook")) {
    errors.facebook = "Facebook inválido (use link completo da página)";
  }

  return errors;
}

/** Remove campos de sistema que o lojista não deve gravar pelo dashboard. */
export function lojistaPayloadForOwner(form: LojistaFormValues) {
  const payload: Record<string, unknown> = { ...form };
  delete payload.id;
  delete payload.created_at;
  delete payload.updated_at;
  delete payload.status;
  delete payload.destaque;
  delete payload.plano;
  delete payload.is_demo;
  delete payload.cnpj_verificado;
  delete payload.categorias;
  return payload;
}

/** Payload admin/gerente: pode alterar plano (e sincroniza destaque). */
export function lojistaPayloadForStaff(form: LojistaFormValues) {
  const payload: Record<string, unknown> = { ...form };
  delete payload.id;
  delete payload.created_at;
  delete payload.updated_at;
  delete payload.categorias;
  delete payload.slug; // slug read-only no v1
  if (payload.plano === "destaque") payload.destaque = true;
  else if (payload.plano) payload.destaque = false;
  return payload;
}
