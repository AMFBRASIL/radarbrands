import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Radar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/landing/site-header";
import { SiteFooter, CtaBand } from "@/components/landing/pricing-footer";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  buildPageHead,
  faqJsonLd,
  organizationJsonLd,
  serviceJsonLd,
  SITE,
} from "@/lib/seo";

const faq = [
  {
    question: "O que é monitoramento de marca (brand monitoring / monitor brands)?",
    answer:
      "É o acompanhamento contínuo da presença da sua marca na internet: buscas, anúncios, redes sociais, domínios e marketplaces — para detectar uso indevido, cópias e brand bidding antes que gerem prejuízo.",
  },
  {
    question: "Por que escolher o Radar Brands para monitorar minha marca?",
    answer:
      "O Radar Brands combina IA, alertas em tempo real e mediação humana. Diferente de ferramentas que só avisam, nós atuamos na remoção e na redução de CPC causado por brand bidding.",
  },
  {
    question: "Monitoramento de marca inclui Google Ads?",
    answer:
      "Sim. O Radar Brands monitora brand bidding e leilões que usam o nome da sua marca no Google Ads e Shopping, além de domínios, redes e marketplaces.",
  },
];

export const Route = createFileRoute("/monitoramento-de-marca")({
  head: () =>
    buildPageHead({
      title:
        "Monitoramento de Marca 24/7 | Radar Brands — Brand Monitoring & Monitor Brands",
      description:
        "Monitoramento de marca (brand monitoring / monitor brands) com IA: Google Ads, brand bidding, domínios, redes sociais e marketplaces. Radar Brands — proteção de marca em tempo real.",
      path: "/monitoramento-de-marca",
      keywords: [
        "monitoramento de marca",
        "monitor brands",
        "brand monitoring brasil",
        "monitorar marca google",
        "proteção de marca online",
      ],
      jsonLd: [
        organizationJsonLd(),
        serviceJsonLd(),
        breadcrumbJsonLd([
          { name: "Início", path: "/" },
          { name: "Monitoramento de marca", path: "/monitoramento-de-marca" },
        ]),
        faqJsonLd(faq),
      ],
    }),
  component: MonitoramentoDeMarcaPage,
});

const pillars = [
  {
    title: "Search brands & brand bidding",
    text: "Detecte quem compra o nome da sua marca no Google Ads e Shopping e reduza CPC com mediação.",
  },
  {
    title: "Domínios e typosquatting",
    text: "Vigilância de registros suspeitos e variações que imitam sua marca.",
  },
  {
    title: "Redes e marketplaces",
    text: "Perfis falsos, anúncios clonados e produtos que usam sua identidade sem autorização.",
  },
  {
    title: "Operação, não só alerta",
    text: "Do monitoramento à mediação e takedown — o ciclo completo de proteção de marca.",
  },
];

function MonitoramentoDeMarcaPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main>
        <section className="relative overflow-hidden border-b border-border/50 pt-20 pb-16 md:pt-28 md:pb-24">
          <div className="absolute inset-0 grid-bg opacity-40" aria-hidden />
          <div className="relative mx-auto max-w-4xl px-4 text-center">
            <p className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-primary">
              <Radar className="h-3.5 w-3.5" aria-hidden />
              Brand monitoring · Monitor brands
            </p>
            <h1 className="mt-4 font-display text-4xl font-bold leading-tight md:text-6xl">
              Monitoramento de marca com{" "}
              <span className="text-gradient">Radar Brands</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground md:text-lg">
              Plataforma de <strong className="text-foreground/90">brand monitoring</strong> e{" "}
              <strong className="text-foreground/90">proteção de marca</strong> 24/7. Ideal para
              quem pesquisa make brands, search brands, branddi ou monitor brands — e precisa de
              operação real, não só dashboard.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" className="bg-[image:var(--gradient-primary)]">
                <Link to="/diagnostico">
                  Diagnóstico gratuito <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/alternativas">Comparar alternativas</Link>
              </Button>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              URL canônica: {absoluteUrl("/monitoramento-de-marca")} · {SITE.name}
            </p>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4">
            <h2 className="text-center font-display text-3xl font-bold md:text-4xl">
              O que o monitoramento de marca cobre
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">
              Brand intelligence contínua para proteger reputação, mídia paga e propriedade
              intelectual digital.
            </p>
            <div className="mt-12 grid gap-5 md:grid-cols-2">
              {pillars.map((p) => (
                <article
                  key={p.title}
                  className="rounded-2xl border border-border/60 bg-card/30 p-6"
                >
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
                    <div>
                      <h3 className="font-display text-lg font-semibold">{p.title}</h3>
                      <p className="mt-2 text-sm text-muted-foreground">{p.text}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-border/50 bg-muted/15 py-16 md:py-20">
          <div className="mx-auto max-w-3xl px-4">
            <h2 className="font-display text-2xl font-bold md:text-3xl">Perguntas frequentes</h2>
            <div className="mt-8 space-y-3">
              {faq.map((item) => (
                <details
                  key={item.question}
                  className="rounded-2xl border border-border/60 bg-card/40 p-5"
                >
                  <summary className="cursor-pointer font-medium">{item.question}</summary>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <CtaBand />
      </main>
      <SiteFooter />
    </div>
  );
}
