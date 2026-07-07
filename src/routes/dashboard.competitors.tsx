import { createFileRoute } from "@tanstack/react-router";
import { SimplePage, Panel } from "@/components/dashboard/simple";
import { Brain, TrendingUp, ImageIcon, MousePointerClick } from "lucide-react";

export const Route = createFileRoute("/dashboard/competitors")({
  component: CompetitorsPage,
});

const competitors = [
  { name: "concorrente-x.com", share: 34, cpc: "R$ 3,80", creatives: 42, landing: 8 },
  { name: "marca-rival.com.br", share: 22, cpc: "R$ 4,15", creatives: 28, landing: 5 },
  { name: "novo-entrante.io", share: 18, cpc: "R$ 5,90", creatives: 61, landing: 12 },
  { name: "player-legado.br", share: 11, cpc: "R$ 2,45", creatives: 14, landing: 3 },
];

const creatives = [
  { advertiser: "concorrente-x.com", hook: "‘Cansou do X? Migre grátis por 30 dias’", ctr: "4.8%", spend: "R$ 84k/mês" },
  { advertiser: "novo-entrante.io", hook: "Comparativo direto com [sua marca]", ctr: "5.2%", spend: "R$ 62k/mês" },
  { advertiser: "marca-rival.com.br", hook: "50% off para clientes vindos do [seu nome]", ctr: "3.1%", spend: "R$ 48k/mês" },
];

function CompetitorsPage() {
  return (
    <SimplePage
      eyebrow="Competitor Intelligence"
      title="Inteligência competitiva de mídia"
      description="Além de bloquear o brand bidding, mostramos quais criativos, ofertas e landing pages seus concorrentes estão testando contra você."
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {[
          { icon: Brain, label: "Concorrentes rastreados", value: "18" },
          { icon: ImageIcon, label: "Criativos analisados", value: "1.284" },
          { icon: MousePointerClick, label: "Landing pages mapeadas", value: "142" },
          { icon: TrendingUp, label: "Share of Voice", value: "38%" },
        ].map((s) => (
          <Panel key={s.label}>
            <div className="flex items-center gap-3">
              <s.icon className="h-5 w-5 text-primary" />
              <div className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</div>
            </div>
            <div className="mt-2 font-display text-3xl font-bold text-gradient">{s.value}</div>
          </Panel>
        ))}
      </div>

      <Panel title="Share of Voice — leilão do seu nome">
        <ul className="space-y-3">
          {competitors.map((c) => (
            <li key={c.name}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="font-medium">{c.name}</span>
                <span className="text-muted-foreground">
                  {c.share}% · CPC {c.cpc} · {c.creatives} criativos · {c.landing} LPs
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full bg-[image:var(--gradient-primary)]"
                  style={{ width: `${c.share}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel title="Criativos que mais funcionam contra você">
        <ul className="space-y-3">
          {creatives.map((c, i) => (
            <li key={i} className="glass-strong rounded-xl p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs uppercase text-primary">{c.advertiser}</div>
                  <div className="mt-1 font-display text-lg font-semibold">"{c.hook}"</div>
                </div>
                <div className="text-right">
                  <div className="text-sm">CTR <span className="text-primary font-semibold">{c.ctr}</span></div>
                  <div className="text-xs text-muted-foreground">{c.spend}</div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Panel>
    </SimplePage>
  );
}
