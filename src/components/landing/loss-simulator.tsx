import { useMemo, useState } from "react";
import { TrendingDown, ShieldCheck, Calculator, ArrowRight } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

const BRL = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

export function LossSimulator() {
  const [revenue, setRevenue] = useState(5_000_000); // faturamento anual
  const [digital, setDigital] = useState(40); // % vindo do digital
  const [sector, setSector] = useState<"beauty" | "fashion" | "food" | "tech" | "finance">("beauty");

  const sectorRisk: Record<typeof sector, number> = {
    beauty: 0.062,
    fashion: 0.078,
    food: 0.041,
    tech: 0.053,
    finance: 0.089,
  };

  const numbers = useMemo(() => {
    const digitalRevenue = revenue * (digital / 100);
    const risk = sectorRisk[sector];
    const brandBidding = digitalRevenue * 0.028;
    const fakeProducts = digitalRevenue * 0.041 * (sector === "fashion" ? 1.6 : 1);
    const reputational = revenue * 0.006;
    const totalLoss = brandBidding + fakeProducts + reputational;
    const protectable = totalLoss * 0.82;
    return { digitalRevenue, risk, brandBidding, fakeProducts, reputational, totalLoss, protectable };
  }, [revenue, digital, sector]);

  return (
    <section className="relative overflow-hidden py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,color-mix(in_oklab,var(--destructive)_18%,transparent),transparent_60%)]" />
      <div className="container relative mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-destructive/30 bg-destructive/10 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-destructive">
            <Calculator className="h-3 w-3" /> Simulador de perda silenciosa
          </div>
          <h2 className="mt-4 font-display text-4xl font-bold md:text-5xl">
            Quanto sua marca já está{" "}
            <span className="bg-[image:linear-gradient(90deg,oklch(0.62_0.24_22),oklch(0.72_0.2_40))] bg-clip-text text-transparent">
              perdendo agora
            </span>?
          </h2>
          <p className="mt-3 text-muted-foreground">
            Estimativa baseada em benchmarks de fraude, brand bidding e falsificação por setor.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
          {/* Inputs */}
          <div className="glass-strong rounded-3xl p-6 md:p-8">
            <div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Faturamento anual</label>
                <span className="font-mono text-sm text-primary">{BRL(revenue)}</span>
              </div>
              <Slider
                value={[revenue]}
                onValueChange={(v) => setRevenue(v[0])}
                min={500_000}
                max={200_000_000}
                step={500_000}
                className="mt-3"
              />
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">% vindo do digital</label>
                <span className="font-mono text-sm text-primary">{digital}%</span>
              </div>
              <Slider
                value={[digital]}
                onValueChange={(v) => setDigital(v[0])}
                min={5}
                max={100}
                step={1}
                className="mt-3"
              />
            </div>

            <div className="mt-6">
              <label className="text-sm font-medium">Setor</label>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {(["beauty", "fashion", "food", "tech", "finance"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSector(s)}
                    className={`rounded-lg border px-2 py-1.5 text-xs transition ${
                      sector === s
                        ? "border-primary/40 bg-primary/10 text-primary"
                        : "border-border/60 hover:bg-muted/40"
                    }`}
                  >
                    {s === "beauty" && "Beleza"}
                    {s === "fashion" && "Moda"}
                    {s === "food" && "Alimentos"}
                    {s === "tech" && "Tech/SaaS"}
                    {s === "finance" && "Finanças"}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 space-y-2 border-t border-border/60 pt-6 text-sm">
              <Line label="Perdas com brand bidding" value={numbers.brandBidding} />
              <Line label="Falsificação em marketplaces" value={numbers.fakeProducts} />
              <Line label="Impacto reputacional" value={numbers.reputational} />
            </div>
          </div>

          {/* Result */}
          <div className="relative overflow-hidden rounded-3xl border border-destructive/30 bg-[linear-gradient(160deg,color-mix(in_oklab,var(--destructive)_10%,var(--card)),var(--card))] p-6 md:p-8">
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-destructive">
              <TrendingDown className="h-3 w-3" /> Perda estimada anual
            </div>
            <div className="mt-3 font-display text-5xl font-bold text-destructive md:text-6xl">
              {BRL(numbers.totalLoss)}
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Equivalente a <strong>{BRL(numbers.totalLoss / 12)}</strong> por mês evaporando da sua receita.
            </p>

            <div className="my-6 h-px bg-border/60" />

            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-primary">
              <ShieldCheck className="h-3 w-3" /> Com Radar | brands você recupera
            </div>
            <div className="mt-3 font-display text-4xl font-bold md:text-5xl">
              <span className="bg-[image:var(--gradient-primary)] bg-clip-text text-transparent">
                até {BRL(numbers.protectable)}
              </span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Média de 82% de contenção após 90 dias de proteção ativa.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/register">
                  Começar agora <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/diagnostico">Fazer diagnóstico gratuito</Link>
              </Button>
            </div>

            <div className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-destructive/20 blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Line({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-mono text-destructive">-{BRL(value)}</span>
    </div>
  );
}
