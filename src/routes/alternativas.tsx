import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/landing/site-header";
import { SiteFooter, CtaBand } from "@/components/landing/pricing-footer";
import {
  breadcrumbJsonLd,
  buildPageHead,
  faqJsonLd,
  organizationJsonLd,
} from "@/lib/seo";

const competitors = [
  {
    name: "Branddi",
    summary:
      "Ferramenta citada em buscas por proteção de marca. O Radar Brands combina monitoramento com mediação humana e base jurídica para brand bidding.",
  },
  {
    name: "Make Brands",
    summary:
      "Quem pesquisa Make Brands costuma querer vigilância e presença de marca. No Radar Brands o foco é risco, fraude e brand bidding — com operação de remoção.",
  },
  {
    name: "Search Brands",
    summary:
      "Search Brands remete a busca e SERP. O Radar Brands monitora search + Ads + Shopping e age quando o nome da marca é leiloado indevidamente.",
  },
  {
    name: "Monitor Brands",
    summary:
      "Monitor Brands é a intenção clássica de brand monitoring. O Radar Brands entrega monitoramento 24/7 com IA e time que media e escala takedown.",
  },
];

const rows: Array<{ feature: string; radar: boolean; typical: boolean }> = [
  { feature: "Monitoramento 24/7 (brand monitoring)", radar: true, typical: true },
  { feature: "Detecção de brand bidding (Google Ads)", radar: true, typical: true },
  { feature: "Domínios / typosquatting", radar: true, typical: true },
  { feature: "Mediação humana com anunciantes", radar: true, typical: false },
  { feature: "Escalada jurídica / dossiê", radar: true, typical: false },
  { feature: "Dashboard + alertas em tempo real", radar: true, typical: true },
  { feature: "Foco no mercado brasileiro (LGPD / LPI)", radar: true, typical: false },
];

const faq = [
  {
    question: "Radar Brands substitui Branddi?",
    answer:
      "Para times que precisam de monitoramento de marca com mediação e proteção ativa, o Radar Brands é uma alternativa completa ao Branddi e ferramentas semelhantes.",
  },
  {
    question: "Qual a diferença entre Radar Brands e Make Brands / Search Brands?",
    answer:
      "O Radar Brands é uma plataforma de brand intelligence e proteção: monitora, classifica riscos e atua (mediação/takedown). Ferramentas focadas só em busca ou presença de marca costumam parar no alerta.",
  },
  {
    question: "O que significa monitor brands na prática?",
    answer:
      "Significa vigiar continuamente onde sua marca aparece online — anúncios, domínios, redes e marketplaces — e reagir a usos indevidos. É exatamente o que o Radar Brands automatiza e opera.",
  },
];

export const Route = createFileRoute("/alternativas")({
  head: () =>
    buildPageHead({
      title:
        "Radar Brands vs Branddi, Make Brands, Search Brands | Alternativa de Monitor Brands",
      description:
        "Compare Radar Brands com Branddi, Make Brands, Search Brands e soluções de monitor brands. Brand monitoring com IA, mediação e proteção jurídica no Brasil.",
      path: "/alternativas",
      keywords: [
        "alternativa branddi",
        "alternativa make brands",
        "alternativa search brands",
        "monitor brands",
        "radar brands vs branddi",
      ],
      jsonLd: [
        organizationJsonLd(),
        breadcrumbJsonLd([
          { name: "Início", path: "/" },
          { name: "Alternativas", path: "/alternativas" },
        ]),
        faqJsonLd(faq),
      ],
    }),
  component: AlternativasPage,
});

function AlternativasPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main>
        <section className="border-b border-border/50 pt-20 pb-16 md:pt-28 md:pb-20">
          <div className="mx-auto max-w-4xl px-4 text-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary">
              Comparativo · Alternativas
            </p>
            <h1 className="mt-4 font-display text-4xl font-bold leading-tight md:text-5xl">
              Radar Brands vs Branddi, Make Brands e Search Brands
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-muted-foreground">
              Se você pesquisou <strong className="text-foreground/90">Branddi</strong>,{" "}
              <strong className="text-foreground/90">Make Brands</strong>,{" "}
              <strong className="text-foreground/90">Search Brands</strong> ou{" "}
              <strong className="text-foreground/90">monitor brands</strong>, conheça o Radar
              Brands: monitoramento de marca com operação de proteção.
            </p>
            <Button asChild size="lg" className="mt-8 bg-[image:var(--gradient-primary)]">
              <Link to="/diagnostico">
                Testar Radar Brands grátis <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-4">
            <h2 className="font-display text-2xl font-bold md:text-3xl">
              Intenção de busca → resposta Radar Brands
            </h2>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {competitors.map((c) => (
                <article
                  key={c.name}
                  className="rounded-2xl border border-border/60 bg-card/30 p-6"
                >
                  <h3 className="font-display text-lg font-semibold">
                    Buscou {c.name}?
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {c.summary}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-border/50 bg-muted/15 py-16">
          <div className="mx-auto max-w-4xl overflow-x-auto px-4">
            <h2 className="font-display text-2xl font-bold md:text-3xl">
              Radar Brands × ferramentas típicas de monitor brands
            </h2>
            <table className="mt-8 w-full min-w-[520px] text-left text-sm">
              <thead>
                <tr className="border-b border-border/60 text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="py-3 pr-4 font-medium">Recurso</th>
                  <th className="py-3 px-4 font-medium text-primary">Radar Brands</th>
                  <th className="py-3 pl-4 font-medium">Ferramenta típica</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.feature} className="border-b border-border/40">
                    <td className="py-3 pr-4">{row.feature}</td>
                    <td className="px-4 py-3">
                      {row.radar ? (
                        <Check className="h-4 w-4 text-emerald-400" aria-label="Sim" />
                      ) : (
                        <Minus className="h-4 w-4 text-muted-foreground" aria-label="Não" />
                      )}
                    </td>
                    <td className="py-3 pl-4">
                      {row.typical ? (
                        <Check className="h-4 w-4 text-muted-foreground" aria-label="Sim" />
                      ) : (
                        <Minus className="h-4 w-4 text-muted-foreground" aria-label="Não" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-3xl px-4">
            <h2 className="font-display text-2xl font-bold">FAQ</h2>
            <div className="mt-6 space-y-3">
              {faq.map((item) => (
                <details
                  key={item.question}
                  className="rounded-2xl border border-border/60 bg-card/40 p-5"
                >
                  <summary className="cursor-pointer font-medium">{item.question}</summary>
                  <p className="mt-3 text-sm text-muted-foreground">{item.answer}</p>
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
