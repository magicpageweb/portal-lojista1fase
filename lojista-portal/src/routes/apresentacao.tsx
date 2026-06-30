import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  CheckCircle2,
  ClipboardList,
  ImagePlus,
  LayoutGrid,
  Package,
  Plus,
  Sparkles,
  Store,
  Trash2,
  TrendingUp,
  Upload,
  Zap,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  maskPhone,
  validateEmail,
  validatePhone,
  validateSocialLink,
  validateURL,
} from "@/lib/format";

export const Route = createFileRoute("/apresentacao")({
  head: () => ({
    meta: [
      { title: "Como funciona | Portal do Lojista Sindilojas" },
      {
        name: "description",
        content:
          "Veja como é simples cadastrar sua loja e produtos no portal Sindilojas. Demonstração interativa para lojistas.",
      },
    ],
  }),
  component: ApresentacaoPage,
});

const FAQ = [
  {
    q: "Como um lojista passa a fazer parte do portal?",
    a: "O lojista cria uma conta, preenche os dados da loja, envia logo e capa, cadastra produtos ou serviços e aguarda a aprovação do Sindilojas. Tudo em poucos passos, pelo painel online.",
  },
  {
    q: "Preciso pagar para ter vitrine no portal?",
    a: "Não. A participação na vitrine digital é voltada ao associado Sindilojas, com foco em visibilidade para o comércio local — sem taxa extra para aparecer no catálogo.",
  },
  {
    q: "O que aparece na página pública da minha loja?",
    a: "Nome, descrição, categoria, logo, imagem de capa, produtos em grade, contatos, WhatsApp, site e redes sociais — tudo organizado para o consumidor encontrar seu negócio.",
  },
  {
    q: "Posso atualizar produtos depois do cadastro?",
    a: "Sim. Pelo painel, o lojista altera textos, fotos e produtos quando quiser, sem depender da equipe do sindicato para cada mudança.",
  },
  {
    q: "Quanto tempo leva para preencher o cadastro?",
    a: "Em média, de 10 a 20 minutos na primeira vez. Com logo e fotos em mãos, o processo é ainda mais rápido.",
  },
  {
    q: "Quem pode ver minha loja depois de publicada?",
    a: "Qualquer pessoa que acesse o portal — moradores da cidade, clientes do bairro e quem busca comércio local nas categorias e na busca de lojistas.",
  },
] as const;

const BENEFITS = [
  {
    icon: Zap,
    title: "Cadastro simples",
    text: "Fluxo guiado, poucos campos e linguagem clara para o lojista.",
  },
  {
    icon: TrendingUp,
    title: "Mais visibilidade",
    text: "Presença na busca, nas categorias e na vitrine do comércio local.",
  },
  {
    icon: LayoutGrid,
    title: "Vitrine digital",
    text: "Logo, capa e produtos organizados em uma página profissional.",
  },
] as const;

const STEPS = [
  "Crie sua conta no portal",
  "Preencha dados, logo e capa",
  "Cadastre produtos ou serviços",
  "Sindilojas aprova e publica",
] as const;

const MAX_PRODUTOS = 3;

type DemoProduto = {
  id: string;
  nome: string;
  descricao: string;
  fotoPreview: string | null;
};

type DemoForm = {
  nome: string;
  descricao: string;
  telefone: string;
  email: string;
  site: string;
  instagram: string;
  facebook: string;
  logoPreview: string | null;
  capaPreview: string | null;
  produtos: DemoProduto[];
};

const emptyForm = (): DemoForm => ({
  nome: "",
  descricao: "",
  telefone: "",
  email: "",
  site: "",
  instagram: "",
  facebook: "",
  logoPreview: null,
  capaPreview: null,
  produtos: [],
});

function ApresentacaoPage() {
  const [form, setForm] = useState<DemoForm>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const revokeAllPreviews = (data: DemoForm) => {
    if (data.logoPreview) URL.revokeObjectURL(data.logoPreview);
    if (data.capaPreview) URL.revokeObjectURL(data.capaPreview);
    data.produtos.forEach((p) => {
      if (p.fotoPreview) URL.revokeObjectURL(p.fotoPreview);
    });
  };

  const setPreview = (field: "logoPreview" | "capaPreview", file: File | null) => {
    setForm((prev) => {
      const old = prev[field];
      if (old) URL.revokeObjectURL(old);
      return { ...prev, [field]: file ? URL.createObjectURL(file) : null };
    });
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.nome.trim()) next.nome = "Informe o nome da loja";
    if (!form.descricao.trim()) next.descricao = "Uma breve descrição ajuda o consumidor a conhecer seu negócio";
    if (form.telefone && !validatePhone(form.telefone)) next.telefone = "Telefone inválido (DDD + número)";
    if (form.email && !validateEmail(form.email)) next.email = "E-mail inválido";
    if (form.site && !validateURL(form.site)) next.site = "URL inválida (ex.: www.sualoja.com.br)";
    if (form.instagram && !validateSocialLink(form.instagram, "instagram")) {
      next.instagram = "Use @usuario ou link do Instagram";
    }
    if (form.facebook && !validateSocialLink(form.facebook, "facebook")) {
      next.facebook = "Use o link da página no Facebook";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitted(true);
  };

  const addProduto = () => {
    if (form.produtos.length >= MAX_PRODUTOS) return;
    setForm((prev) => ({
      ...prev,
      produtos: [
        ...prev.produtos,
        { id: crypto.randomUUID(), nome: "", descricao: "", fotoPreview: null },
      ],
    }));
  };

  const updateProduto = (id: string, patch: Partial<DemoProduto>) => {
    setForm((prev) => ({
      ...prev,
      produtos: prev.produtos.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    }));
  };

  const removeProduto = (id: string) => {
    setForm((prev) => {
      const target = prev.produtos.find((p) => p.id === id);
      if (target?.fotoPreview) URL.revokeObjectURL(target.fotoPreview);
      return { ...prev, produtos: prev.produtos.filter((p) => p.id !== id) };
    });
  };

  const setProdutoFoto = (id: string, file: File | null) => {
    setForm((prev) => ({
      ...prev,
      produtos: prev.produtos.map((p) => {
        if (p.id !== id) return p;
        if (p.fotoPreview) URL.revokeObjectURL(p.fotoPreview);
        return { ...p, fotoPreview: file ? URL.createObjectURL(file) : null };
      }),
    }));
  };

  const resetDemo = () => {
    revokeAllPreviews(form);
    setForm(emptyForm());
    setErrors({});
    setSubmitted(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="gradient-hero py-16 text-secondary-foreground md:py-20">
        <div className="container mx-auto px-4">
          <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary">
            Demonstração · Reunião Sindilojas
          </Badge>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-extrabold leading-tight md:text-5xl">
            Cadastrar sua loja no portal é simples e rápido
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-secondary-foreground/85">
            Veja, na prática, como o lojista preenche a vitrine digital — sem login e sem gravar dados.
            Ideal para apresentar à diretoria do sindicato.
          </p>
        </div>
      </section>

      <section className="container mx-auto grid gap-10 px-4 py-14 lg:grid-cols-2 lg:items-start lg:gap-10 xl:gap-14">
        <div className="order-2 space-y-6 lg:order-1 lg:sticky lg:top-24">
          <VitrineMockup />

          <Card className="overflow-hidden border-primary/20 shadow-elegant">
            <CardContent className="gradient-hero p-6 text-secondary-foreground">
              <div className="flex items-start gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/20 text-primary">
                  <Sparkles className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="font-display text-xl font-bold">Sua loja no digital, sem complicação</h2>
                  <p className="mt-2 text-sm leading-relaxed text-secondary-foreground/85">
                    O associado Sindilojas monta a vitrine em minutos: identidade visual, catálogo e contatos
                    reunidos em um só lugar — pronto para apresentar ao consumidor da cidade.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {BENEFITS.map((b) => (
              <Card key={b.title} className="shadow-elegant">
                <CardContent className="p-4">
                  <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                    <b.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-3 font-display text-sm font-bold">{b.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{b.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="shadow-elegant">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Como funciona na prática</CardTitle>
              <CardDescription>Quatro passos do cadastro à vitrine publicada.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {STEPS.map((step, i) => (
                <div key={step} className="flex items-center gap-3">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full gradient-gold font-display text-sm font-bold text-secondary shadow-gold">
                    {i + 1}
                  </span>
                  <p className="text-sm font-medium">{step}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <div>
            <div className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-primary" />
              <h2 className="font-display text-xl font-bold">Perguntas frequentes</h2>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Respostas objetivas para a apresentação à diretoria.
            </p>
            <Accordion type="single" collapsible className="mt-4 rounded-2xl border border-border bg-card px-4 shadow-elegant">
              {FAQ.map((item, i) => (
                <AccordionItem key={item.q} value={`faq-${i}`}>
                  <AccordionTrigger className="text-left text-sm font-medium hover:text-primary">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">{item.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>

        <div className="order-1 min-w-0 lg:order-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Store className="h-5 w-5 text-primary" />
              <h2 className="font-display text-2xl font-bold">Simule o cadastro</h2>
            </div>
            <Badge className="border-0 bg-amber-500/15 text-amber-800">Somente demonstração</Badge>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Visual inspirado no painel real, mais amigável para a reunião. Nada é salvo no banco.
          </p>

          {submitted ? (
            <Card className="mt-6 border-primary/30 shadow-gold">
              <CardContent className="p-8 text-center">
                <CheckCircle2 className="mx-auto h-14 w-14 text-primary" />
                <h3 className="mt-4 font-display text-2xl font-bold">Cadastro simulado com sucesso!</h3>
                <p className="mx-auto mt-2 max-w-md text-muted-foreground">
                  Na versão real, a loja <strong>{form.nome || "sua loja"}</strong> seguiria para análise do
                  Sindilojas e, após aprovação, apareceria na vitrine pública do portal.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <Button type="button" variant="outline" onClick={resetDemo}>
                    Simular outro cadastro
                  </Button>
                  <Button asChild className="gradient-gold text-secondary shadow-gold hover:opacity-90">
                    <Link to="/auth">Ir para cadastro real</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-6">
              <Card className="shadow-elegant">
                <CardHeader>
                  <CardTitle className="text-lg">Dados da loja</CardTitle>
                  <CardDescription>Informações que aparecem na vitrine pública.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <DemoField
                    label="Nome da loja *"
                    value={form.nome}
                    onChange={(v) => {
                      setForm({ ...form, nome: v });
                      if (errors.nome) setErrors({ ...errors, nome: "" });
                    }}
                    error={errors.nome}
                    placeholder="Ex.: Papelaria Centro Criativo"
                  />
                  <div className="space-y-2">
                    <Label className={errors.descricao ? "text-destructive" : ""}>Breve descrição *</Label>
                    <Textarea
                      rows={4}
                      value={form.descricao}
                      onChange={(e) => {
                        setForm({ ...form, descricao: e.target.value });
                        if (errors.descricao) setErrors({ ...errors, descricao: "" });
                      }}
                      placeholder="Conte o que sua loja oferece e o diferencial para o bairro."
                      className={errors.descricao ? "border-destructive" : ""}
                    />
                    {errors.descricao && <p className="text-xs font-medium text-destructive">{errors.descricao}</p>}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-elegant">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <ImagePlus className="h-5 w-5 text-primary" /> Imagens
                  </CardTitle>
                  <CardDescription>Logo e capa dão identidade visual à página da loja.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                  <DemoImageUpload
                    label="Logo da loja"
                    hint="Quadrado · WebP ou JPG"
                    preview={form.logoPreview}
                    onFile={(f) => setPreview("logoPreview", f)}
                  />
                  <DemoImageUpload
                    label="Imagem de capa"
                    hint="Paisagem · destaque no topo"
                    preview={form.capaPreview}
                    aspect="video"
                    onFile={(f) => setPreview("capaPreview", f)}
                  />
                </CardContent>
              </Card>

              <Card className="shadow-elegant">
                <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Package className="h-5 w-5 text-primary" /> Produtos de exemplo
                    </CardTitle>
                    <CardDescription>Até {MAX_PRODUTOS} itens para mostrar o catálogo em grade.</CardDescription>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addProduto}
                    disabled={form.produtos.length >= MAX_PRODUTOS}
                  >
                    <Plus className="mr-1 h-4 w-4" /> Adicionar
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {form.produtos.length === 0 ? (
                    <p className="rounded-xl border border-dashed border-border bg-muted/30 px-4 py-8 text-center text-sm text-muted-foreground">
                      Nenhum produto adicionado. Clique em &quot;Adicionar&quot; para simular o catálogo.
                    </p>
                  ) : (
                    form.produtos.map((produto, index) => (
                      <div key={produto.id} className="rounded-xl border border-border bg-muted/20 p-4">
                        <div className="mb-3 flex items-center justify-between">
                          <span className="text-sm font-medium text-muted-foreground">Produto {index + 1}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => removeProduto(produto.id)}
                            aria-label="Remover produto"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_7rem]">
                          <div className="space-y-3">
                            <DemoField
                              label="Nome do produto"
                              value={produto.nome}
                              onChange={(v) => updateProduto(produto.id, { nome: v })}
                              placeholder="Ex.: Caderno universitário"
                            />
                            <DemoField
                              label="Descrição curta"
                              value={produto.descricao}
                              onChange={(v) => updateProduto(produto.id, { descricao: v })}
                              placeholder="Uma linha sobre o item"
                            />
                          </div>
                          <DemoImageUpload
                            label="Foto"
                            hint="Opcional"
                            preview={produto.fotoPreview}
                            aspect="square"
                            compact
                            onFile={(f) => setProdutoFoto(produto.id, f)}
                          />
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              <Card className="shadow-elegant">
                <CardHeader>
                  <CardTitle className="text-lg">Contato e redes</CardTitle>
                  <CardDescription>Telefone, e-mail e links para o consumidor falar com você.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                  <DemoField
                    label="Telefone"
                    value={form.telefone}
                    onChange={(v) => {
                      setForm({ ...form, telefone: maskPhone(v) });
                      if (errors.telefone) setErrors({ ...errors, telefone: "" });
                    }}
                    error={errors.telefone}
                    placeholder="(51) 99999-9999"
                  />
                  <DemoField
                    label="E-mail"
                    type="email"
                    value={form.email}
                    onChange={(v) => {
                      setForm({ ...form, email: v });
                      if (errors.email) setErrors({ ...errors, email: "" });
                    }}
                    error={errors.email}
                    placeholder="contato@sualoja.com.br"
                  />
                  <DemoField
                    label="Site"
                    value={form.site}
                    onChange={(v) => {
                      setForm({ ...form, site: v });
                      if (errors.site) setErrors({ ...errors, site: "" });
                    }}
                    error={errors.site}
                    placeholder="www.sualoja.com.br"
                  />
                  <DemoField
                    label="Instagram"
                    value={form.instagram}
                    onChange={(v) => {
                      setForm({ ...form, instagram: v });
                      if (errors.instagram) setErrors({ ...errors, instagram: "" });
                    }}
                    error={errors.instagram}
                    placeholder="@sualoja"
                  />
                  <DemoField
                    label="Facebook"
                    className="sm:col-span-2"
                    value={form.facebook}
                    onChange={(v) => {
                      setForm({ ...form, facebook: v });
                      if (errors.facebook) setErrors({ ...errors, facebook: "" });
                    }}
                    error={errors.facebook}
                    placeholder="facebook.com/sualoja"
                  />
                </CardContent>
              </Card>

              <Button type="submit" size="lg" className="w-full gradient-gold text-secondary shadow-gold hover:opacity-90 sm:w-auto">
                Simular envio do cadastro
              </Button>
            </form>
          )}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function VitrineMockup() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-elegant">
      <div className="relative h-44 overflow-hidden sm:h-48">
        <img
          src="/demo/demo-papelaria-centro/capa.webp"
          alt=""
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-secondary/90 via-secondary/25 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 flex items-end gap-3 p-4">
          <div className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-xl border-4 border-card bg-card shadow-elegant">
            <img
              src="/demo/demo-papelaria-centro/logo.webp"
              alt=""
              className="h-full w-full object-contain p-1"
              loading="lazy"
            />
          </div>
          <div className="min-w-0 pb-0.5 text-secondary-foreground">
            <p className="truncate font-display text-lg font-bold">Sua loja no portal</p>
            <p className="text-xs text-secondary-foreground/80">Vitrine digital · Sindilojas</p>
          </div>
        </div>
        <Badge className="absolute right-3 top-3 border-0 gradient-gold text-secondary shadow-gold">
          Exemplo real
        </Badge>
      </div>
      <div className="grid grid-cols-3 gap-2 border-t border-border bg-muted/20 p-3">
        {[1, 2, 3].map((n) => (
          <div key={n} className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
            <div className="aspect-square overflow-hidden bg-muted">
              <img
                src={`/demo/demo-papelaria-centro/produtos/${n}.webp`}
                alt=""
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="space-y-1 p-2">
              <div className="h-2 w-full rounded-full bg-muted" />
              <div className="h-2 w-2/3 rounded-full bg-muted/70" />
            </div>
          </div>
        ))}
      </div>
      <p className="border-t border-border px-4 py-2.5 text-center text-xs text-muted-foreground">
        Prévia da vitrine pública — mesmo visual das lojas demo do portal
      </p>
    </div>
  );
}

function DemoField({
  label,
  value,
  onChange,
  error,
  className = "",
  ...rest
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  className?: string;
} & Omit<React.ComponentProps<typeof Input>, "value" | "onChange">) {
  return (
    <div className={`space-y-2 ${className}`}>
      <Label className={error ? "text-destructive" : ""}>{label}</Label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={error ? "border-destructive" : ""}
        {...rest}
      />
      {error && <p className="text-xs font-medium text-destructive">{error}</p>}
    </div>
  );
}

function DemoImageUpload({
  label,
  hint,
  preview,
  onFile,
  aspect = "square",
  compact = false,
}: {
  label: string;
  hint: string;
  preview: string | null;
  onFile: (file: File | null) => void;
  aspect?: "square" | "video";
  compact?: boolean;
}) {
  const aspectClass = aspect === "video" ? "aspect-video" : "aspect-square";

  return (
    <div>
      <Label>{label}</Label>
      <label
        className={`mt-2 flex ${compact ? "h-28" : aspectClass} cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-border bg-muted/30 transition-colors hover:border-primary`}
      >
        {preview ? (
          <img src={preview} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="px-3 text-center text-muted-foreground">
            <Upload className={`mx-auto ${compact ? "h-5 w-5" : "h-6 w-6"}`} />
            <p className="mt-1 text-xs">{hint}</p>
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => onFile(e.target.files?.[0] ?? null)}
        />
      </label>
    </div>
  );
}
