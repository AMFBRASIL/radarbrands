import { Check, X, TrendingDown, Sparkles, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

const competitorItems = [
  "Setup fee entre R$ 5.000 e R$ 15.000",
  "Mensalidade fixa de R$ 8.000 a R$ 10.000",
  "Contrato mínimo de 12 meses",
  "Módulos avançados cobrados à parte",
  "Suporte por ticket com SLA de 72h",
  "Sem IA proativa — apenas monitoramento reativo",
];

const usItems = [
  "Sem setup fee — onboarding gratuito em 48h",
  "Investimento sob medida para o seu porte",
  "Contrato flexível — cancele quando quiser",
  "12 módulos avançados de IA inclusos",
  "War room dedicado com SLA de 15 minutos",
  "Threat Graph, Autopilot, Deepfake e Dark Web nativos",
];

export function Investment() {
  return (
    <section id="investimento" className="scroll-mt-24 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-primary">
            <Sparkles className="h-3 w-3" />
            Investimento
          </div>
          <h2 className="mt-4 font-display text-3xl font-bold md:text-5xl">
            O mercado cobra R$ 8.000 a R$ 10.000/mês.
            <span className="text-gradient"> Nós fazemos diferente.</span>
          </h2>
          <p className="mt-4 text-muted-foreground md:text-lg">
            Cansamos de ver marcas pagando fortunas por dashboards travados e relatórios em PDF.
            Na BrandShield AI, o preço é calibrado pelo tamanho da sua operação — e a
            tecnologia é uma geração à frente.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Concorrentes */}
          <div className="relative overflow-hidden rounded-3xl glass p-8 ring-gradient">
            <div className="flex items-center justify-between">
              <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Concorrentes tradicionais
              </div>
              <TrendingDown className="h-4 w-4 text-destructive" />
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="font-display text-5xl font-bold text-muted-foreground/80">
                R$ 8k–10k
              </span>
              <span className="text-sm text-muted-foreground">/mês</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              + setup + módulos avulsos + contrato longo
            </p>
            <ul className="mt-6 space-y-3">
              {competitorItems.map((i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <X className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                  <span>{i}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* BrandShield */}
          <div className="relative overflow-hidden rounded-3xl glass-strong ring-gradient glow-primary p-8">
            <div className="absolute inset-0 grid-bg opacity-40" aria-hidden />
            <div className="relative">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  <div className="font-mono text-[10px] uppercase tracking-widest text-primary">
                    BrandShield AI
                  </div>
                </div>
                <span className="rounded-full bg-[image:var(--gradient-primary)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-primary-foreground">
                  Sob medida
                </span>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="font-display text-5xl font-bold text-gradient">
                  Você decide
                </span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Investimento proporcional ao seu ROI — falamos números na primeira call.
              </p>
              <ul className="mt-6 space-y-3">
                {usItems.map((i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{i}</span>
                  </li>
                ))}
              </ul>
              <Button
                asChild
                className="mt-8 w-full bg-[image:var(--gradient-primary)] text-primary-foreground hover:opacity-90"
              >
                <a href="#contato">Solicitar proposta personalizada</a>
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            { k: "72%", v: "mais barato que a média do mercado" },
            { k: "48h", v: "de onboarding assistido" },
            { k: "15min", v: "de SLA em incidentes críticos" },
          ].map((s) => (
            <div key={s.v} className="rounded-2xl glass p-6 text-center ring-gradient">
              <div className="font-display text-3xl font-bold text-gradient">{s.k}</div>
              <div className="mt-1 text-sm text-muted-foreground">{s.v}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
