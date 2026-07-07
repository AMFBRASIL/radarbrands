import { createFileRoute } from "@tanstack/react-router";
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardHome,
});

const trend = Array.from({ length: 30 }).map((_, i) => ({
  d: `${i + 1}`,
  score: 82 + Math.round(Math.sin(i / 3) * 6 + i / 3),
  alerts: Math.max(0, Math.round(6 + Math.cos(i / 2) * 4)),
}));

const cards = [
  { label: "Score de proteção", value: "97/100", icon: ShieldCheck, tone: "primary", delta: "+3" },
  { label: "Monitoramentos ativos", value: "1.284", icon: Activity, tone: "default", delta: "+42" },
  { label: "Alertas totais", value: "12", icon: AlertTriangle, tone: "warning", delta: "+4" },
  { label: "Críticos", value: "3", icon: Sparkles, tone: "danger", delta: "+1" },
];

const recent = [
  { risk: "Alto", src: "Google Ads", desc: "Concorrente XYZ usando sua marca", date: "Hoje", tone: "danger" as const },
  { risk: "Crítico", src: "Domínios", desc: "cadbrasiI.com.br registrado", date: "Hoje", tone: "danger" as const },
  { risk: "Médio", src: "Instagram", desc: "Perfil falso @cadbrasil.of", date: "Ontem", tone: "warning" as const },
  { risk: "Baixo", src: "Marketplace", desc: "Revendedor não autorizado", date: "2 dias", tone: "success" as const },
];

function DashboardHome() {
  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs font-mono uppercase tracking-widest text-primary">
          Visão geral
        </div>
        <h1 className="mt-1 font-display text-3xl font-bold">Saúde da sua marca</h1>
        <p className="text-sm text-muted-foreground">
          Últimos 30 dias · atualizado há 2 minutos
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {cards.map((c) => {
          const Icon = c.icon;
          const color =
            c.tone === "danger"
              ? "text-destructive"
              : c.tone === "warning"
              ? "text-[color:var(--warning)]"
              : c.tone === "primary"
              ? "text-primary"
              : "text-foreground";
          return (
            <div key={c.label} className="glass rounded-2xl p-5 ring-gradient">
              <div className="flex items-center justify-between">
                <Icon className={`h-5 w-5 ${color}`} />
                <span className="inline-flex items-center gap-1 rounded-full bg-muted/50 px-2 py-0.5 text-[10px] font-mono text-muted-foreground">
                  <ArrowUpRight className="h-3 w-3" /> {c.delta}
                </span>
              </div>
              <div className={`mt-4 font-display text-3xl font-bold ${color}`}>{c.value}</div>
              <div className="text-xs text-muted-foreground">{c.label}</div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <div className="glass rounded-2xl p-5 ring-gradient">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                Saúde da Marca
              </div>
              <div className="font-display text-lg font-semibold">Score protetivo (30d)</div>
            </div>
            <div className="text-xs text-muted-foreground">Meta 95+</div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend}>
                <defs>
                  <linearGradient id="gs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.82 0.17 180)" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="oklch(0.82 0.17 180)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="oklch(1 0 0 / 0.06)" vertical={false} />
                <XAxis dataKey="d" stroke="oklch(0.68 0.02 240)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="oklch(0.68 0.02 240)" fontSize={11} tickLine={false} axisLine={false} domain={[60, 100]} />
                <Tooltip
                  contentStyle={{
                    background: "oklch(0.19 0.035 250)",
                    border: "1px solid oklch(1 0 0 / 0.08)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Area type="monotone" dataKey="score" stroke="oklch(0.82 0.17 180)" strokeWidth={2} fill="url(#gs)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass rounded-2xl p-5 ring-gradient">
          <div className="flex items-center justify-between">
            <div className="font-display text-lg font-semibold">Alertas recentes</div>
            <a className="text-xs text-primary hover:underline" href="/dashboard/alerts">
              Ver todos
            </a>
          </div>
          <ul className="mt-3 divide-y divide-border/60">
            {recent.map((r, i) => (
              <li key={i} className="flex items-start justify-between gap-3 py-3">
                <div>
                  <div className="text-sm font-medium">{r.desc}</div>
                  <div className="text-xs text-muted-foreground">
                    {r.src} · {r.date}
                  </div>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                    r.tone === "danger"
                      ? "bg-destructive/15 text-destructive"
                      : r.tone === "warning"
                      ? "bg-[color:var(--warning)]/15 text-[color:var(--warning)]"
                      : "bg-[color:var(--success)]/15 text-[color:var(--success)]"
                  }`}
                >
                  {r.risk}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
