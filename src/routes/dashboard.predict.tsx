import { createFileRoute } from "@tanstack/react-router";
import { SimplePage, Panel } from "@/components/dashboard/simple";
import { TrendingUp, AlertTriangle, Calendar, Target } from "lucide-react";

export const Route = createFileRoute("/dashboard/predict")({
  component: PredictPage,
});

const predictions = [
  { channel: "Google Ads — 'seu nome' + cupom", risk: 92, when: "próximos 7 dias", reason: "Black Friday se aproximando + histórico de 3 anos" },
  { channel: "Marketplaces (Mercado Livre)", risk: 87, when: "próximos 14 dias", reason: "Lançamento de produto detectado em suas redes" },
  { channel: "Instagram — perfis fake", risk: 74, when: "próximos 30 dias", reason: "Padrão sazonal + campanha influencer ativa" },
  { channel: "Domínios typosquatting", risk: 61, when: "próximos 30 dias", reason: "Reincidência do Grupo Alpha após 45 dias" },
  { channel: "TikTok — deepfake CEO", risk: 44, when: "próximos 60 dias", reason: "Entrevista pública recente do executivo" },
];

const heatmap = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  intensity: Math.floor(30 + Math.random() * 70),
}));

function PredictPage() {
  return (
    <SimplePage
      eyebrow="IA Preditiva"
      title="Predictive Risk Score"
      description="Nossa IA prevê onde e quando as próximas ameaças vão aparecer — para você reforçar a proteção antes delas."
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {[
          { icon: AlertTriangle, label: "Risco geral (7 dias)", value: "Alto", color: "text-warning" },
          { icon: Target, label: "Precisão do modelo", value: "89%", color: "text-primary" },
          { icon: Calendar, label: "Próximo pico previsto", value: "18/11", color: "text-primary" },
        ].map((s) => (
          <Panel key={s.label}>
            <div className="flex items-center gap-3">
              <s.icon className={`h-5 w-5 ${s.color}`} />
              <div className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</div>
            </div>
            <div className={`mt-2 font-display text-3xl font-bold ${s.color}`}>{s.value}</div>
          </Panel>
        ))}
      </div>

      <Panel title="Ameaças previstas nos próximos 60 dias">
        <ul className="space-y-3">
          {predictions.map((p) => (
            <li key={p.channel} className="rounded-xl bg-muted/30 p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold">{p.channel}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{p.when} · {p.reason}</div>
                </div>
                <div className="text-right">
                  <div
                    className={`font-display text-2xl font-bold ${
                      p.risk >= 80 ? "text-destructive" : p.risk >= 60 ? "text-warning" : "text-primary"
                    }`}
                  >
                    {p.risk}%
                  </div>
                  <div className="text-[10px] uppercase text-muted-foreground">risco</div>
                </div>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-background">
                <div
                  className="h-full bg-[image:var(--gradient-primary)]"
                  style={{ width: `${p.risk}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel title="Mapa de calor — próximos 30 dias">
        <div className="grid grid-cols-15 gap-1" style={{ gridTemplateColumns: "repeat(15, minmax(0, 1fr))" }}>
          {heatmap.map((h) => (
            <div
              key={h.day}
              className="aspect-square rounded"
              style={{ background: `oklch(0.82 0.17 180 / ${h.intensity / 100})` }}
              title={`Dia ${h.day} — intensidade ${h.intensity}%`}
            />
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between text-[10px] text-muted-foreground">
          <span>Hoje</span>
          <span className="flex items-center gap-2">
            Baixo
            <div className="h-2 w-24 rounded-full bg-[linear-gradient(90deg,oklch(0.82_0.17_180/0.1),oklch(0.82_0.17_180/1))]" />
            Alto
          </span>
          <span>+30 dias</span>
        </div>
      </Panel>
    </SimplePage>
  );
}
