import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, Sparkles, Users } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/sobre")({
  head: () => ({ meta: [{ title: "Sobre | Sindilojas" }] }),
  component: SobrePage,
});

function SobrePage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="gradient-hero py-20 text-secondary-foreground">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-4xl font-extrabold md:text-5xl">Sobre o Sindilojas</h1>
          <p className="mt-3 max-w-2xl text-secondary-foreground/80">
            O sindicato dos lojistas trabalha para fortalecer o comércio local, conectar consumidores aos
            comerciantes e dar voz aos empreendedores do bairro.
          </p>
        </div>
      </section>
      <section className="container mx-auto grid gap-8 px-4 py-16 md:grid-cols-3">
        {[
          { icon: Users, title: "Representatividade", text: "Apoio jurídico, treinamentos e eventos para lojistas associados." },
          { icon: ShieldCheck, title: "Confiança", text: "Selo de verificação para garantir credibilidade ao consumidor." },
          { icon: Sparkles, title: "Visibilidade", text: "Vitrine digital gratuita para divulgar produtos e serviços." },
        ].map((v) => (
          <div key={v.title} className="rounded-2xl border border-border bg-card p-6 shadow-elegant">
            <span className="grid h-12 w-12 place-items-center rounded-xl gradient-gold text-secondary"><v.icon className="h-6 w-6" /></span>
            <h3 className="mt-4 font-display text-xl font-bold">{v.title}</h3>
            <p className="mt-2 text-muted-foreground">{v.text}</p>
          </div>
        ))}
      </section>
      <SiteFooter />
    </div>
  );
}
