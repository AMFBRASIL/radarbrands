import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowRight,
  Check,
  Globe,
  Instagram,
  Megaphone,
  MessageSquareWarning,
  Newspaper,
  ShoppingBag,
  Sparkles,
  Users,
} from "lucide-react";

const checks = [
  { icon: Globe, label: "Domínios suspeitos" },
  { icon: Instagram, label: "Redes sociais falsas" },
  { icon: Megaphone, label: "Google Ads" },
  { icon: MessageSquareWarning, label: "Reclamações" },
  { icon: ShoppingBag, label: "Marketplaces" },
  { icon: Newspaper, label: "Notícias" },
  { icon: Users, label: "Concorrentes" },
];

export function Hero() {
  const navigate = useNavigate();
  const [brand, setBrand] = useState("");
  const [scanning, setScanning] = useState(false);
  const [done, setDone] = useState<number[]>([]);

  useEffect(() => {
    if (!scanning) return;
    setDone([]);
    let i = 0;
    const id = setInterval(() => {
      setDone((prev) => [...prev, i]);
      i += 1;
      if (i >= checks.length) {
        clearInterval(id);
        setTimeout(() => {
          setScanning(false);
          toast.success("Análise concluída!", {
            description: "Redirecionando para o seu Diagnóstico...",
          });
          setTimeout(() => {
            void navigate({ to: "/diagnostico" });
          }, 1200);
        }, 800);
      }
    }, 280);
    return () => clearInterval(id);
  }, [scanning, navigate]);

  return (
    <section
      className="relative overflow-hidden pt-16 pb-24 md:pt-24 md:pb-32"
      style={{ background: "var(--gradient-hero)" }}
    >
      <div className="absolute inset-0 grid-bg" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-4">
        <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_1fr]">
          <div className="animate-float-up">
            <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs">
              <span className="relative flex h-2 w-2">
                <span className="absolute inset-0 rounded-full bg-primary animate-pulse-dot" />
              </span>
              <span className="font-mono uppercase tracking-widest text-primary">
                Radar Brands
              </span>
              <span className="text-muted-foreground">· brand monitoring 24/7</span>
            </div>

            <h1 className="mt-6 font-display text-4xl font-bold leading-[1.05] md:text-6xl">
              <span className="text-gradient">Radar Brands</span>
              <span className="block mt-2 text-[0.72em] font-semibold leading-tight text-foreground md:mt-3">
                Proteja sua marca antes que alguém use ela contra você
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              Monitoramento de marca com IA — alternativa a Branddi, Make Brands e Search Brands.
              Vigilância 24/7 em Google Ads, domínios, redes sociais e marketplaces, com mediação
              humana e proteção jurídica.
            </p>

            <div id="scan" className="mt-8 rounded-2xl glass-strong p-4 ring-gradient">
              <label className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5 text-primary" /> Digite sua marca ou domínio
              </label>
              <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                <Input
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="ex: minhamarca.com.br"
                  className="h-12 border-border bg-background/60 text-base"
                />
                <Button
                  size="lg"
                  className="h-12 bg-[image:var(--gradient-primary)] text-primary-foreground hover:opacity-90"
                  onClick={() => brand.trim() && setScanning(true)}
                >
                  Escanear agora <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Análise gratuita · sem cartão de crédito · relatório em 90 segundos
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button size="lg" variant="outline" className="border-border/60">
                Analisar minha marca grátis
              </Button>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <div className="flex -space-x-2">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-7 w-7 rounded-full border-2 border-background bg-gradient-to-br from-primary/60 to-accent/60"
                    />
                  ))}
                </div>
                <span>+2.400 marcas protegidas</span>
              </div>
            </div>
          </div>

          {/* Scanner visual */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-3xl glass-strong ring-gradient p-6 glow-primary">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                    Scan em andamento
                  </div>
                  <div className="mt-1 font-display text-lg font-semibold">
                    {brand || "radarbrand.com.br"}
                  </div>
                </div>
                <div className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  {scanning ? "Analisando…" : "Pronto"}
                </div>
              </div>

              <div className="relative mt-5 overflow-hidden rounded-xl border border-border/60 bg-background/40">
                {scanning && (
                  <div
                    className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-primary/60 via-primary/10 to-transparent animate-scan"
                    aria-hidden
                  />
                )}
                <ul className="divide-y divide-border/60">
                  {checks.map((c, idx) => {
                    const complete = done.includes(idx) || !scanning;
                    const Icon = c.icon;
                    return (
                      <li
                        key={c.label}
                        className="flex items-center justify-between px-4 py-3 text-sm"
                      >
                        <span className="flex items-center gap-3">
                          <Icon className="h-4 w-4 text-muted-foreground" />
                          {c.label}
                        </span>
                        {complete ? (
                          <span className="flex items-center gap-1 text-xs font-medium text-primary">
                            <Check className="h-3.5 w-3.5" /> Ok
                          </span>
                        ) : (
                          <span className="font-mono text-xs text-muted-foreground">…</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                <Metric label="Fontes" value="24.9k" />
                <Metric label="Score" value="97" accent />
                <Metric label="Riscos" value="3" />
              </div>
            </div>

            <div className="absolute -bottom-6 -left-6 hidden rounded-2xl glass p-4 md:block">
              <div className="text-xs font-mono uppercase tracking-widest text-destructive">
                Alerta crítico
              </div>
              <div className="mt-1 text-sm font-medium">Domínio parecido detectado</div>
              <div className="text-xs text-muted-foreground">cadbrasiI.com.br · há 2 dias</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Metric({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-xl border border-border/60 bg-background/40 p-3">
      <div
        className={`font-display text-2xl font-bold ${accent ? "text-gradient" : "text-foreground"}`}
      >
        {value}
      </div>
      <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
    </div>
  );
}
