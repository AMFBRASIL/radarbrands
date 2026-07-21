import { Link } from "@tanstack/react-router";
import { ArrowRight, Radar, Search, Shield } from "lucide-react";

const KEYWORD_LINKS = [
  { to: "/monitoramento-de-marca" as const, label: "Monitoramento de marca" },
  { to: "/alternativas" as const, label: "Alternativa a Branddi / Make Brands" },
  { to: "/como-funciona" as const, label: "Como funciona o Radar Brands" },
  { to: "/diagnostico" as const, label: "Diagnóstico gratuito" },
  { to: "/juridico" as const, label: "Brand bidding e jurídico" },
];

export function SeoKeywordBand() {
  return (
    <section
      aria-labelledby="seo-keyword-heading"
      className="border-y border-border/50 bg-muted/20 py-16 md:py-20"
    >
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary">
              Brand monitoring · Monitor brands
            </p>
            <h2
              id="seo-keyword-heading"
              className="mt-3 font-display text-3xl font-bold tracking-tight md:text-4xl"
            >
              Radar Brands: monitoramento e proteção de marca com IA
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
              Quem busca <strong className="text-foreground/90">make brands</strong>,{" "}
              <strong className="text-foreground/90">search brands</strong>,{" "}
              <strong className="text-foreground/90">branddi</strong> ou{" "}
              <strong className="text-foreground/90">monitor brands</strong> encontra no{" "}
              <strong className="text-foreground/90">Radar Brands</strong> uma operação completa:
              brand monitoring 24/7, detecção de brand bidding, vigilância de domínios e mediação
              humana — não apenas alertas.
            </p>
          </div>

          <ul className="space-y-2">
            {KEYWORD_LINKS.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className="group flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-card/40 px-4 py-3 text-sm transition hover:border-primary/40 hover:bg-primary/5"
                >
                  <span className="font-medium">{item.label}</span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary" />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            {
              icon: Search,
              title: "Search & brand bidding",
              text: "Monitore Google Ads e buscas que usam o nome da sua marca.",
            },
            {
              icon: Radar,
              title: "Monitor brands 24/7",
              text: "Varredura contínua em domínios, redes e marketplaces.",
            },
            {
              icon: Shield,
              title: "Proteção + mediação",
              text: "Do alerta ao takedown com base jurídica e operação humana.",
            },
          ].map((card) => (
            <div
              key={card.title}
              className="rounded-2xl border border-border/50 bg-background/40 p-5"
            >
              <card.icon className="h-5 w-5 text-primary" aria-hidden />
              <h3 className="mt-3 font-display text-base font-semibold">{card.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{card.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
