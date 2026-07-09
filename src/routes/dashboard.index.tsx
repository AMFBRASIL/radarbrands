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

      <BrandHealthScore />


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

const HEALTH_SCORE = 87;
const healthTrend = [72, 74, 71, 76, 78, 80, 79, 82, 84, 83, 85, 87];
const healthBreakdown = [
  { label: "Domínios", value: 94, color: "oklch(0.82 0.17 180)" },
  { label: "Ads", value: 78, color: "oklch(0.72 0.24 22)" },
  { label: "Redes sociais", value: 91, color: "oklch(0.82 0.17 320)" },
  { label: "Dark web", value: 82, color: "oklch(0.6 0.22 260)" },
  { label: "Sentimento", value: 89, color: "oklch(0.85 0.18 150)" },
];

function BrandHealthScore() {
  const score = HEALTH_SCORE;
  const ring = 2 * Math.PI * 46;
  const offset = ring - (score / 100) * ring;
  const tone =
    score >= 85 ? "text-emerald-500" : score >= 70 ? "text-amber-500" : "text-destructive";
  const label =
    score >= 85 ? "Saudável" : score >= 70 ? "Atenção" : "Crítico";

  const trendMax = Math.max(...healthTrend);
  const trendMin = Math.min(...healthTrend);
  const points = healthTrend
    .map((v, i) => {
      const x = (i / (healthTrend.length - 1)) * 100;
      const y = 100 - ((v - trendMin) / (trendMax - trendMin || 1)) * 100;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-[linear-gradient(140deg,color-mix(in_oklab,var(--primary)_14%,var(--card)),var(--card))] p-6 md:p-8">
      <div className="grid gap-8 md:grid-cols-[auto_1fr_1fr] md:items-center">
        {/* Ring */}
        <div className="relative flex h-40 w-40 items-center justify-center">
          <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
            <circle cx="50" cy="50" r="46" stroke="oklch(0.28 0.03 250)" strokeWidth="6" fill="none" />
            <circle
              cx="50"
              cy="50"
              r="46"
              stroke="url(#hs-grad)"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={ring}
              strokeDashoffset={offset}
              style={{ transition: "stroke-dashoffset 1s ease" }}
            />
            <defs>
              <linearGradient id="hs-grad" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stopColor="oklch(0.82 0.17 180)" />
                <stop offset="100%" stopColor="oklch(0.6 0.22 260)" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className={`font-display text-5xl font-bold ${tone}`}>{score}</div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Score /100</div>
          </div>
        </div>

        {/* Text */}
        <div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-primary">Brand Health Score</div>
          <h2 className="mt-1 font-display text-2xl font-bold">
            Sua marca está <span className={tone}>{label.toLowerCase()}</span>
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Score agregado de risco em domínios, ads, redes sociais, dark web e sentimento. Atualizado a cada 15 minutos.
          </p>
          <div className="mt-4 flex gap-2">
            <span className="rounded-full bg-primary/15 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-primary">
              +{score - healthTrend[0]} em 30d
            </span>
            <span className="rounded-full bg-muted px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Meta 90+
            </span>
          </div>
        </div>

        {/* Sparkline */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Últimos 30 dias</span>
            <span className="font-mono text-[10px] text-emerald-500">▲ tendência positiva</span>
          </div>
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-20 w-full">
            <defs>
              <linearGradient id="hs-line" x1="0" x2="1">
                <stop offset="0%" stopColor="oklch(0.82 0.17 180)" />
                <stop offset="100%" stopColor="oklch(0.6 0.22 260)" />
              </linearGradient>
            </defs>
            <polyline points={points} fill="none" stroke="url(#hs-line)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
            <polyline points={`0,100 ${points} 100,100`} fill="url(#hs-line)" opacity="0.15" />
          </svg>
        </div>
      </div>

      {/* Breakdown bars */}
      <div className="mt-6 grid gap-3 md:grid-cols-5">
        {healthBreakdown.map((b) => (
          <div key={b.label} className="rounded-xl border border-border/60 bg-card/40 p-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{b.label}</span>
              <span className="font-mono font-semibold">{b.value}</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-border/60">
              <div className="h-full transition-all" style={{ width: `${b.value}%`, background: b.color }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
