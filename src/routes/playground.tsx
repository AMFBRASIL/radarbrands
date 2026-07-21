import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Sparkles, Search, ShieldAlert, Globe, Megaphone, ShoppingBag, Users,
  ArrowRight, Loader2, CheckCircle2, TrendingDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/playground")({
  head: () => ({
    meta: [
      { title: "Playground · Simule uma análise Radar | brands" },
      {
        name: "description",
        content:
          "Digite qualquer marca e veja em tempo real como o Radar detectaria domínios falsos, ads infratores e perfis clonados.",
      },
      { property: "og:title", content: "Playground Radar | brands" },
      { property: "og:description", content: "Simule uma análise real de proteção de marca em 30 segundos." },
    ],
  }),
  component: Playground,
});

type Finding = {
  channel: string;
  icon: React.ComponentType<{ className?: string }>;
  status: "scanning" | "done";
  count: number;
  sample: string;
  severity: "critical" | "high" | "medium";
  delay: number;
};

function makeFindings(brand: string): Finding[] {
  const b = brand.trim() || "sua marca";
  const slug = b.toLowerCase().replace(/\s+/g, "");
  return [
    { channel: "Domínios similares", icon: Globe, status: "scanning", count: 7, sample: `${slug}-oficial.com`, severity: "critical", delay: 900 },
    { channel: "Google Ads infratores", icon: Megaphone, status: "scanning", count: 12, sample: `Concorrente A dando lance em "${b}"`, severity: "high", delay: 1800 },
    { channel: "Marketplaces", icon: ShoppingBag, status: "scanning", count: 4, sample: `Produto falsificado no Mercado Livre`, severity: "high", delay: 2700 },
    { channel: "Perfis falsos", icon: Users, status: "scanning", count: 9, sample: `@${slug}.oficial (Instagram)`, severity: "medium", delay: 3400 },
    { channel: "Vazamentos", icon: ShieldAlert, status: "scanning", count: 2, sample: `Credenciais expostas em fórum`, severity: "critical", delay: 4200 },
  ];
}

function Playground() {
  const [brand, setBrand] = useState("");
  const [running, setRunning] = useState(false);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!running) return;
    const fs = makeFindings(brand);
    setFindings(fs);
    setDone(false);
    const timers = fs.map((f, i) =>
      setTimeout(() => {
        setFindings((cur) => cur.map((x, idx) => (idx === i ? { ...x, status: "done" } : x)));
        if (i === fs.length - 1) setDone(true);
      }, f.delay),
    );
    return () => timers.forEach(clearTimeout);
  }, [running, brand]);

  const start = () => {
    if (!brand.trim()) return;
    setRunning(true);
  };

  const totalFound = findings.reduce((s, f) => s + f.count, 0);
  const critical = findings.filter((f) => f.severity === "critical").reduce((s, f) => s + f.count, 0);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/60 bg-background/70 backdrop-blur">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[image:var(--gradient-primary)]">
              <Sparkles className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <span className="font-display text-sm font-bold">Radar | brands</span>
          </Link>
          <Button asChild size="sm" variant="outline">
            <Link to="/register">Criar conta grátis</Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto max-w-5xl px-4 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-primary">
            <Sparkles className="h-3 w-3" /> Playground público · sem cadastro
          </div>
          <h1 className="mt-4 font-display text-4xl font-bold md:text-5xl">
            Simule uma varredura da sua marca
          </h1>
          <p className="mt-3 text-muted-foreground">
            Digite uma marca real e veja em 30 segundos como o Radar identifica ameaças em cada canal.
          </p>
        </div>

        <div className="mx-auto mt-8 flex max-w-xl gap-2">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={brand}
              onChange={(e) => setBrand(e.target.value.slice(0, 60))}
              onKeyDown={(e) => e.key === "Enter" && start()}
              placeholder="Ex.: Havaianas, Nubank, Boticário..."
              className="h-12 pl-10 text-base"
              disabled={running && !done}
            />
          </div>
          <Button size="lg" className="h-12" onClick={start} disabled={!brand.trim() || (running && !done)}>
            {running && !done ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Analisar
          </Button>
        </div>

        {running && (
          <>
            <div className="mx-auto mt-10 grid max-w-4xl gap-4 md:grid-cols-[1fr_1fr]">
              <div className="glass-strong rounded-2xl p-6">
                <div className="font-mono text-[10px] uppercase tracking-widest text-primary">
                  Escaneando canais
                </div>
                <ul className="mt-4 space-y-3">
                  {findings.map((f, i) => (
                    <li key={i} className="flex items-center gap-3 rounded-xl border border-border/60 bg-card/40 p-3">
                      <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                        f.status === "done" ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
                      }`}>
                        <f.icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 text-sm font-medium">
                          {f.channel}
                          {f.status === "done" && (
                            <span className={`rounded px-1.5 py-0.5 text-[10px] font-mono uppercase ${
                              f.severity === "critical"
                                ? "bg-destructive/15 text-destructive"
                                : f.severity === "high"
                                  ? "bg-orange-500/15 text-orange-500"
                                  : "bg-amber-500/15 text-amber-500"
                            }`}>
                              {f.count} ameaças
                            </span>
                          )}
                        </div>
                        {f.status === "done" && (
                          <div className="mt-0.5 truncate font-mono text-[11px] text-muted-foreground">
                            Ex.: {f.sample}
                          </div>
                        )}
                      </div>
                      {f.status === "done"
                        ? <CheckCircle2 className="h-4 w-4 text-primary" />
                        : <Loader2 className="h-4 w-4 animate-spin text-primary" />}
                    </li>
                  ))}
                </ul>
              </div>

              <div className={`relative overflow-hidden rounded-2xl border p-6 transition ${
                done ? "border-destructive/40 bg-[linear-gradient(160deg,color-mix(in_oklab,var(--destructive)_12%,var(--card)),var(--card))]" : "border-border/60 bg-card/40"
              }`}>
                <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-destructive">
                  <TrendingDown className="h-3 w-3" /> Diagnóstico
                </div>
                {!done ? (
                  <div className="mt-4 flex flex-col items-center justify-center py-10 text-muted-foreground">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    <p className="mt-4 text-sm">Compilando resultado...</p>
                  </div>
                ) : (
                  <>
                    <div className="mt-3 font-display text-5xl font-bold text-destructive">{totalFound}</div>
                    <p className="text-sm text-muted-foreground">ameaças ativas contra <strong>{brand}</strong> agora.</p>
                    <div className="mt-4 space-y-2 text-sm">
                      <div className="flex justify-between"><span className="text-muted-foreground">Críticas</span><span className="font-mono text-destructive">{critical}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Cobertura estimada sem Radar</span><span className="font-mono">18%</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Cobertura com Radar ativo</span><span className="font-mono text-primary">96%</span></div>
                    </div>
                    <Button asChild className="mt-6 w-full" size="lg">
                      <Link to="/register">
                        Proteger {brand} agora <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <p className="mt-3 text-center text-[11px] text-muted-foreground">
                      Este é um resultado simulado com dados típicos do setor.
                    </p>
                  </>
                )}
              </div>
            </div>
          </>
        )}

        {!running && (
          <div className="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-3 md:grid-cols-4">
            {["Havaianas", "Nubank", "Ambev", "Natura"].map((b) => (
              <button
                key={b}
                onClick={() => { setBrand(b); setRunning(true); }}
                className="rounded-xl border border-border/60 bg-card/40 p-4 text-sm font-medium transition hover:border-primary/40 hover:bg-primary/5"
              >
                {b}
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
