import { createFileRoute } from "@tanstack/react-router";
import { SimplePage, Panel } from "@/components/dashboard/simple";
import { Wallet, TrendingUp, DollarSign, Target } from "lucide-react";

export const Route = createFileRoute("/dashboard/roi")({
  component: RoiPage,
});

const breakdown = [
  { label: "CPC recuperado (brand bidding)", value: 184320, color: "oklch(0.82 0.17 180)" },
  { label: "Vendas protegidas (marketplaces)", value: 92450, color: "oklch(0.55 0.19 260)" },
  { label: "Prevenção de fraudes (dark web)", value: 45800, color: "oklch(0.75 0.17 155)" },
  { label: "Contenção de crise reputacional", value: 68000, color: "oklch(0.8 0.15 75)" },
  { label: "Valor de marca (INPI + takedowns)", value: 32200, color: "oklch(0.62 0.24 22)" },
];

const total = breakdown.reduce((s, b) => s + b.value, 0);
const cost = 12000;
const roi = ((total - cost) / cost) * 100;

const brl = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

function RoiPage() {
  return (
    <SimplePage
      eyebrow="ROI Calculator"
      title="Retorno real da BrandShield"
      description="Cada ameaça neutralizada vira R$ economizados ou receita protegida. Números atualizados em tempo real."
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="glass-strong ring-gradient rounded-2xl p-6 lg:col-span-2">
          <div className="flex items-center gap-3">
            <Wallet className="h-5 w-5 text-primary" />
            <span className="text-xs uppercase tracking-wider text-muted-foreground">
              Economia + receita protegida · últimos 90 dias
            </span>
          </div>
          <div className="mt-3 font-display text-5xl font-bold text-gradient">{brl(total)}</div>
          <div className="mt-1 text-sm text-muted-foreground">
            Custo da plataforma no período: {brl(cost)} · ROI de{" "}
            <span className="font-semibold text-primary">{roi.toFixed(0)}%</span>
          </div>
        </div>

        <Panel>
          <div className="flex items-center gap-3">
            <Target className="h-5 w-5 text-primary" />
            <span className="text-xs uppercase tracking-wider text-muted-foreground">Ameaças neutralizadas</span>
          </div>
          <div className="mt-2 font-display text-4xl font-bold text-gradient">312</div>
          <div className="mt-4 flex items-center gap-2 text-xs">
            <TrendingUp className="h-4 w-4 text-success" />
            <span className="text-success">+28%</span>
            <span className="text-muted-foreground">vs. trimestre anterior</span>
          </div>
        </Panel>
      </div>

      <Panel title="Onde o dinheiro está sendo protegido">
        <div className="flex h-6 overflow-hidden rounded-full">
          {breakdown.map((b) => (
            <div
              key={b.label}
              style={{ width: `${(b.value / total) * 100}%`, background: b.color }}
              title={`${b.label} — ${brl(b.value)}`}
            />
          ))}
        </div>
        <ul className="mt-6 space-y-3">
          {breakdown.map((b) => (
            <li key={b.label} className="flex items-center gap-3">
              <span className="h-3 w-3 rounded-full" style={{ background: b.color }} />
              <span className="flex-1 text-sm">{b.label}</span>
              <span className="font-display font-semibold">{brl(b.value)}</span>
              <span className="w-12 text-right text-xs text-muted-foreground">
                {((b.value / total) * 100).toFixed(0)}%
              </span>
            </li>
          ))}
        </ul>
      </Panel>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {[
          { icon: DollarSign, label: "CPC médio antes", value: "R$ 4,18" },
          { icon: TrendingUp, label: "CPC médio agora", value: "R$ 2,07" },
          { icon: Wallet, label: "Custo por ameaça resolvida", value: "R$ 38" },
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
    </SimplePage>
  );
}
