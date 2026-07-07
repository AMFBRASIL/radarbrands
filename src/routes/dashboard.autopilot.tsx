import { createFileRoute } from "@tanstack/react-router";
import { SimplePage, Panel } from "@/components/dashboard/simple";
import { Sparkles, Zap, ShieldCheck, Bot, Clock } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/dashboard/autopilot")({
  component: AutopilotPage,
});

const actions = [
  { time: "12:04", channel: "Domain Watch", action: "Notificação enviada ao registrar de brandshiiield.com", status: "success" },
  { time: "11:47", channel: "Google Ads", action: "Report automático de brand bidding contra concorrente-x.com", status: "success" },
  { time: "11:12", channel: "Instagram", action: "Perfil fake @brand.oficial.br reportado (score 98%)", status: "success" },
  { time: "10:55", channel: "Mercado Livre", action: "Anúncio pirata denunciado — aguardando MP", status: "pending" },
  { time: "10:31", channel: "Deepfake", action: "Vídeo TikTok escalado para especialista humano", status: "escalated" },
  { time: "10:08", channel: "Domain Watch", action: "Domínio brand-shield.xyz colocado em observação", status: "success" },
];

const rules = [
  { name: "Auto-takedown de perfis fake (score ≥ 95%)", enabled: true, kind: "safe" },
  { name: "Report automático de brand bidding (score ≥ 90%)", enabled: true, kind: "safe" },
  { name: "Notificação de typosquatting via registrar", enabled: true, kind: "safe" },
  { name: "DMCA automático em conteúdo audiovisual", enabled: false, kind: "advanced" },
  { name: "Escalada jurídica automática (score = 100% + reincidência)", enabled: false, kind: "advanced" },
];

function AutopilotPage() {
  return (
    <SimplePage
      eyebrow="Automação Autônoma"
      title="AI Autopilot"
      description="Deixe a IA executar takedowns de baixa complexidade sem intervenção. Casos ambíguos vão automaticamente para o humano."
    >
      <div className="glass-strong ring-gradient rounded-2xl p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[image:var(--gradient-primary)] glow-primary">
              <Sparkles className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <div className="font-display text-lg font-semibold">Autopilot está ATIVO</div>
              <div className="text-sm text-muted-foreground">
                87 ações executadas nas últimas 24h · 0 falso positivo
              </div>
            </div>
          </div>
          <Switch defaultChecked />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {[
          { icon: Zap, label: "Ações auto (24h)", value: "87" },
          { icon: Clock, label: "Tempo médio", value: "2.3 min" },
          { icon: ShieldCheck, label: "Sucesso", value: "94%" },
          { icon: Bot, label: "Escaladas humano", value: "12" },
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

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Panel title="Regras ativas">
          <ul className="space-y-3">
            {rules.map((r) => (
              <li key={r.name} className="flex items-center justify-between gap-4 rounded-lg bg-muted/30 p-3">
                <div className="min-w-0">
                  <div className="text-sm font-medium">{r.name}</div>
                  <div className="text-[10px] uppercase text-muted-foreground">
                    {r.kind === "safe" ? "Seguro por padrão" : "Requer aprovação enterprise"}
                  </div>
                </div>
                <Switch defaultChecked={r.enabled} />
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Log de ações — ao vivo">
          <ul className="space-y-2">
            {actions.map((a, i) => (
              <li key={i} className="flex items-start gap-3 rounded-lg bg-muted/30 p-3 text-sm">
                <span className="font-mono text-xs text-muted-foreground">{a.time}</span>
                <div className="min-w-0 flex-1">
                  <div className="truncate">{a.action}</div>
                  <div className="text-[10px] uppercase text-muted-foreground">{a.channel}</div>
                </div>
                <span
                  className={`rounded px-2 py-0.5 text-[10px] uppercase ${
                    a.status === "success"
                      ? "bg-success/20 text-success"
                      : a.status === "pending"
                        ? "bg-warning/20 text-warning"
                        : "bg-accent/20 text-accent-foreground"
                  }`}
                >
                  {a.status}
                </span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </SimplePage>
  );
}
