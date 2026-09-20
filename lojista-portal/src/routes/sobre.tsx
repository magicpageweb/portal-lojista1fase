import { createFileRoute, Link } from "@tanstack/react-router";
import { Building2, Handshake, MapPin, ShieldCheck, Sparkles, Users } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CIDADES_ATUACAO } from "@/lib/cidades";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre o Sindilojas Vale do Rio Pardo | Portal do Lojista" },
      {
        name: "description",
        content:
          "O Sindilojas Vale do Rio Pardo é entidade patronal do comércio varejista em oito municípios do Vale. Conheça a sede, os serviços aos associados e o Portal do Lojista.",
      },
    ],
  }),
  component: SobrePage,
});

function SobrePage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="gradient-hero py-20 text-secondary-foreground">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-4xl font-extrabold md:text-5xl">Sobre o Sindilojas</h1>
          <p className="mt-3 max-w-3xl text-lg text-secondary-foreground/85">
            Entidade patronal de classe, representante do comércio varejista no Vale do Rio Pardo.
          </p>
        </div>
      </section>

      <section className="container mx-auto max-w-3xl space-y-6 px-4 py-14 text-base leading-relaxed text-foreground/90">
        <p>
          O <strong>Sindilojas Vale do Rio Pardo</strong> é uma entidade patronal de classe, representante
          do comércio varejista, atuando em oito municípios do Vale: Santa Cruz do Sul, Vera Cruz,
          Venâncio Aires, Mato Leitão, Herveiras, Gramado Xavier, Vale do Sol e Sinimbu.
        </p>
        <p>
          A sede fica em <strong>Santa Cruz do Sul</strong>, com estrutura completa para o associado:
          sala de reuniões, salão de festas e auditório — espaços que reforçam a vida associativa e
          o relacionamento entre o comércio local.
        </p>
        <p>
          Aos associados, o Sindilojas oferece serviços e benefícios que fortalecem o dia a dia do
          negócio: convênios de saúde, educação, assessorias, banco de dados, certificação digital e
          parcerias estratégicas. O Portal do Lojista é mais uma ferramenta para dar visibilidade ao
          comércio associado e aproximar consumidores das lojas da região.
        </p>
      </section>

      <section className="border-y border-border bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-2xl font-bold">Municípios de atuação</h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Conheça o comércio associado em cada cidade do Vale do Rio Pardo.
          </p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {CIDADES_ATUACAO.map((c) => (
              <li key={c.slug}>
                <Link
                  to="/cidade/$slug"
                  params={{ slug: c.slug }}
                  className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-3 text-sm font-medium transition-colors hover:border-primary/40 hover:text-primary"
                >
                  <MapPin className="h-4 w-4 shrink-0 text-primary" />
                  {c.nome}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container mx-auto grid gap-8 px-4 py-16 md:grid-cols-3">
        {[
          {
            icon: Users,
            title: "Representatividade",
            text: "Voz do comércio varejista nos oito municípios de atuação, com apoio institucional aos associados.",
          },
          {
            icon: Handshake,
            title: "Serviços ao associado",
            text: "Convênios de saúde e educação, assessorias, banco de dados, certificação digital e parcerias.",
          },
          {
            icon: Building2,
            title: "Estrutura na sede",
            text: "Sala de reuniões, salão de festas e auditório em Santa Cruz do Sul para eventos e encontros.",
          },
          {
            icon: ShieldCheck,
            title: "Confiança",
            text: "Selo de verificação e cadastro associado para garantir credibilidade ao consumidor.",
          },
          {
            icon: Sparkles,
            title: "Visibilidade",
            text: "Vitrine digital no Portal do Lojista para divulgar produtos e serviços do comércio local.",
          },
          {
            icon: MapPin,
            title: "Comércio regional",
            text: "Páginas por cidade para fortalecer o comércio de cada município do Vale do Rio Pardo.",
          },
        ].map((v) => (
          <div key={v.title} className="rounded-2xl border border-border bg-card p-6 shadow-elegant">
            <span className="grid h-12 w-12 place-items-center rounded-xl gradient-gold text-secondary">
              <v.icon className="h-6 w-6" />
            </span>
            <h3 className="mt-4 font-display text-xl font-bold">{v.title}</h3>
            <p className="mt-2 text-muted-foreground">{v.text}</p>
          </div>
        ))}
      </section>
      <SiteFooter />
    </div>
  );
}
