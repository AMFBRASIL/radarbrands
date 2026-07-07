import { createFileRoute } from "@tanstack/react-router";
import { SimplePage, Panel } from "@/components/dashboard/simple";
import { Users, TrendingUp, AlertTriangle, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/dashboard/influencers")({
  component: InfluencersPage,
});

const feed = [
  { name: "@fitcarol", followers: "540k", status: "authorized", sentiment: 92, engagement: "8.4%", note: "Contrato ativo até 12/2026" },
  { name: "@viagens.expert", followers: "1.2M", status: "unauthorized", sentiment: 45, engagement: "3.1%", note: "Usa a marca sem contrato — potencial risco" },
  { name: "@techdaily_br", followers: "230k", status: "viral-positive", sentiment: 88, engagement: "12.7%", note: "Menção espontânea viralizando" },
  { name: "@modaugc", followers: "82k", status: "viral-negative", sentiment: 21, engagement: "22.3%", note: "Reclamação sobre entrega bombando" },
  { name: "@lifestyle.br", followers: "410k", status: "authorized", sentiment: 74, engagement: "5.2%", note: "Contrato + código promocional" },
];

const badge = (s: string) =>
  s === "authorized"
    ? { text: "Autorizado", cls: "bg-success/20 text-success" }
    : s === "unauthorized"
      ? { text: "Sem contrato", cls: "bg-warning/20 text-warning" }
      : s === "viral-positive"
        ? { text: "Viral positivo", cls: "bg-primary/20 text-primary" }
        : { text: "Viral negativo", cls: "bg-destructive/20 text-destructive" };

function InfluencersPage() {
  return (
    <SimplePage
      eyebrow="Influencer & UGC Watch"
      title="Influencers e conteúdo espontâneo"
      description="Sabemos quem está falando da sua marca, com contrato ou sem, e detectamos UGC viralizando antes de virar crise."
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {[
          { icon: Users, label: "Perfis monitorados", value: "1.842" },
          { icon: TrendingUp, label: "UGC viralizando", value: "7" },
          { icon: AlertTriangle, label: "Sem contrato", value: "23" },
          { icon: CheckCircle2, label: "Contratos ativos", value: "58" },
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

      <Panel title="Feed em destaque">
        <div className="space-y-3">
          {feed.map((f) => {
            const b = badge(f.status);
            return (
              <div key={f.name} className="glass-strong rounded-xl p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[image:var(--gradient-primary)] font-display text-sm font-bold text-primary-foreground">
                      {f.name[1].toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold">{f.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {f.followers} · engajamento {f.engagement}
                      </div>
                    </div>
                  </div>
                  <span className={`rounded px-2 py-0.5 text-[10px] uppercase ${b.cls}`}>{b.text}</span>
                </div>
                <div className="mt-3 flex items-center gap-4">
                  <div className="flex-1">
                    <div className="mb-1 flex justify-between text-[10px] uppercase text-muted-foreground">
                      <span>Sentimento</span>
                      <span>{f.sentiment}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-background">
                      <div
                        className="h-full"
                        style={{
                          width: `${f.sentiment}%`,
                          background:
                            f.sentiment > 70
                              ? "oklch(0.75 0.17 155)"
                              : f.sentiment > 40
                                ? "oklch(0.8 0.15 75)"
                                : "oklch(0.62 0.24 22)",
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">{f.note}</div>
              </div>
            );
          })}
        </div>
      </Panel>
    </SimplePage>
  );
}
