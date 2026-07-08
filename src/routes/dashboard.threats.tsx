import { createFileRoute } from "@tanstack/react-router";
import { SimplePage, Panel } from "@/components/dashboard/simple";
import { Network, AlertTriangle, Building2, User, Globe } from "lucide-react";

export const Route = createFileRoute("/dashboard/threats")({
  component: ThreatsPage,
});

const nodes = [
  { id: "hub", label: "Grupo Alpha Fraud Ring", type: "hub", severity: "critical", x: 50, y: 50, connections: 12 },
  { id: "n1", label: "brandshiiield.com", type: "domain", severity: "high", x: 15, y: 20 },
  { id: "n2", label: "@brand_oficial_br", type: "social", severity: "high", x: 85, y: 25 },
  { id: "n3", label: "CNPJ 32.***.***/0001-11", type: "entity", severity: "critical", x: 20, y: 80 },
  { id: "n4", label: "app 'Radar | brands Pro'", type: "app", severity: "medium", x: 80, y: 78 },
  { id: "n5", label: "brand-shield.xyz", type: "domain", severity: "medium", x: 10, y: 55 },
  { id: "n6", label: "@radarbrand.oficial", type: "social", severity: "high", x: 90, y: 55 },
];

const iconFor = (t: string) =>
  t === "domain" ? Globe : t === "social" ? User : t === "entity" ? Building2 : t === "app" ? AlertTriangle : Network;

const colorFor = (s: string) =>
  s === "critical" ? "text-destructive" : s === "high" ? "text-warning" : "text-primary";

function ThreatsPage() {
  return (
    <SimplePage
      eyebrow="Threat Intelligence"
      title="Threat Graph"
      description="Grafo de ameaças correlacionadas — descubra os grupos por trás das fraudes, não só as ocorrências."
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        {[
          { label: "Grupos identificados", value: "7", sub: "3 críticos" },
          { label: "Entidades mapeadas", value: "184", sub: "+12 esta semana" },
          { label: "Reincidência média", value: "4.2x", sub: "por infrator" },
          { label: "Casos correlacionados", value: "312", sub: "última análise" },
        ].map((s) => (
          <Panel key={s.label}>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</div>
            <div className="mt-1 font-display text-3xl font-bold text-gradient">{s.value}</div>
            <div className="text-xs text-muted-foreground">{s.sub}</div>
          </Panel>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Panel title="Grafo — Grupo Alpha Fraud Ring">
            <div className="relative h-[420px] overflow-hidden rounded-xl bg-background/40">
              <svg className="absolute inset-0 h-full w-full">
                {nodes.filter((n) => n.id !== "hub").map((n) => (
                  <line
                    key={n.id}
                    x1="50%"
                    y1="50%"
                    x2={`${n.x}%`}
                    y2={`${n.y}%`}
                    stroke="oklch(0.82 0.17 180 / 0.35)"
                    strokeWidth={1}
                    strokeDasharray="4 4"
                  />
                ))}
              </svg>
              {nodes.map((n) => {
                const Icon = iconFor(n.type);
                const size = n.type === "hub" ? "h-16 w-16" : "h-12 w-12";
                return (
                  <div
                    key={n.id}
                    className="absolute -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${n.x}%`, top: `${n.y}%` }}
                  >
                    <div
                      className={`glass-strong flex ${size} items-center justify-center rounded-full ring-gradient ${
                        n.type === "hub" ? "glow-primary" : ""
                      }`}
                    >
                      <Icon className={`h-5 w-5 ${colorFor(n.severity)}`} />
                    </div>
                    <div className="mt-2 max-w-[140px] text-center text-[10px] text-muted-foreground">
                      {n.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </Panel>
        </div>

        <Panel title="Entidades no grupo">
          <ul className="space-y-3">
            {nodes.map((n) => {
              const Icon = iconFor(n.type);
              return (
                <li key={n.id} className="flex items-start gap-3 rounded-lg bg-muted/30 p-3">
                  <Icon className={`h-4 w-4 shrink-0 ${colorFor(n.severity)}`} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{n.label}</div>
                    <div className="text-xs uppercase text-muted-foreground">{n.type} · {n.severity}</div>
                  </div>
                </li>
              );
            })}
          </ul>
        </Panel>
      </div>
    </SimplePage>
  );
}
