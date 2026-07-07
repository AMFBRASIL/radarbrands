import { useState, useEffect, type ComponentType, type ReactNode } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, ChevronLeft, ChevronRight, Sparkles, Zap } from "lucide-react";

export type WizardStep = {
  key: string;
  title: string;
  subtitle: string;
  content: ReactNode;
};

export type WizardPreset = {
  id: string;
  title: string;
  desc: string;
  icon?: ComponentType<{ className?: string }>;
  tag?: string;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  eyebrow: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
  gradient: string;
  presets: WizardPreset[];
  configStep: ReactNode;
  reviewSummary: { label: string; value: string }[];
};

export function SettingsWizard({
  open,
  onOpenChange,
  title,
  eyebrow,
  description,
  icon: Icon,
  gradient,
  presets,
  configStep,
  reviewSummary,
}: Props) {
  const [stepIndex, setStepIndex] = useState(0);
  const [preset, setPreset] = useState<string>(presets[0]?.id ?? "");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (open) {
      setStepIndex(0);
      setPreset(presets[0]?.id ?? "");
      setSaved(false);
    }
  }, [open, presets]);

  const steps: WizardStep[] = [
    {
      key: "preset",
      title: "Escolha um preset",
      subtitle: "Comece com uma configuração recomendada",
      content: (
        <div className="grid gap-3 sm:grid-cols-2">
          {presets.map((p) => {
            const selected = preset === p.id;
            const PIcon = p.icon ?? Sparkles;
            return (
              <button
                key={p.id}
                onClick={() => setPreset(p.id)}
                className={cn(
                  "group relative flex flex-col items-start gap-3 overflow-hidden rounded-2xl border p-5 text-left transition-all",
                  selected
                    ? "border-primary bg-primary/10 shadow-[var(--shadow-glow)]"
                    : "border-border/60 bg-card/40 hover:-translate-y-0.5 hover:border-primary/50",
                )}
              >
                <div className="flex w-full items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-glow)]">
                    <PIcon className="h-5 w-5" />
                  </div>
                  {selected && (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Check className="h-3.5 w-3.5" />
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-base font-semibold">{p.title}</h3>
                    {p.tag && (
                      <span className="rounded bg-primary/15 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-primary">
                        {p.tag}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{p.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      ),
    },
    {
      key: "config",
      title: "Configurar detalhes",
      subtitle: "Ajuste os campos específicos deste módulo",
      content: <div className="space-y-4">{configStep}</div>,
    },
    {
      key: "review",
      title: "Revisar & salvar",
      subtitle: "Confira as configurações antes de aplicar",
      content: (
        <div className="space-y-4">
          <div className="rounded-2xl border border-border/60 bg-card/40 p-5">
            <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-primary">
              <Zap className="h-3.5 w-3.5" /> Resumo
            </div>
            <dl className="grid gap-3 sm:grid-cols-2">
              <div className="col-span-full flex items-center justify-between border-b border-border/40 pb-2">
                <dt className="text-xs text-muted-foreground">Preset selecionado</dt>
                <dd className="text-sm font-medium">
                  {presets.find((p) => p.id === preset)?.title ?? "—"}
                </dd>
              </div>
              {reviewSummary.map((r) => (
                <div key={r.label} className="flex items-center justify-between">
                  <dt className="text-xs text-muted-foreground">{r.label}</dt>
                  <dd className="text-sm font-medium">{r.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          {saved ? (
            <div className="flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
              <Check className="h-4 w-4" /> Configurações salvas com sucesso.
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">
              Ao aplicar, todas as áreas afetadas serão atualizadas imediatamente.
            </p>
          )}
        </div>
      ),
    },
  ];

  const step = steps[stepIndex];
  const progress = ((stepIndex + 1) / steps.length) * 100;
  const isLast = stepIndex === steps.length - 1;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl gap-0 overflow-hidden border-border/60 bg-background/95 p-0 sm:rounded-2xl">
        <div className="grid h-[85vh] max-h-[860px] grid-cols-1 md:grid-cols-[320px_1fr]">
          {/* LEFT PANEL */}
          <aside className="relative hidden overflow-hidden border-r border-border/60 md:block">
            <div className={cn("absolute inset-0 bg-gradient-to-br", gradient)} />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,hsl(var(--primary)/0.35),transparent_55%),radial-gradient(circle_at_80%_90%,hsl(var(--primary)/0.25),transparent_50%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.55),rgba(0,0,0,0.85))]" />
            <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(hsl(var(--foreground))_1px,transparent_1px),linear-gradient(90deg,hsl(var(--foreground))_1px,transparent_1px)] [background-size:32px_32px]" />

            <div className="relative flex h-full flex-col p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-glow)]">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-primary">
                    {eyebrow}
                  </div>
                  <div className="font-display text-lg font-bold leading-tight text-white">
                    {title}
                  </div>
                </div>
              </div>

              <p className="mt-3 text-xs leading-relaxed text-white/70">{description}</p>

              {/* Progress */}
              <div className="mt-6">
                <div className="mb-2 flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-white/60">
                  <span>Passo {stepIndex + 1} de {steps.length}</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-[image:var(--gradient-primary)] transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Steps list */}
              <ol className="mt-6 space-y-2">
                {steps.map((s, i) => {
                  const active = i === stepIndex;
                  const done = i < stepIndex;
                  return (
                    <li key={s.key}>
                      <button
                        onClick={() => setStepIndex(i)}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-all",
                          active
                            ? "border-primary/60 bg-primary/15"
                            : done
                              ? "border-white/10 bg-white/5"
                              : "border-white/5 bg-transparent hover:bg-white/5",
                        )}
                      >
                        <div
                          className={cn(
                            "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold",
                            active
                              ? "bg-primary text-primary-foreground shadow-[var(--shadow-glow)]"
                              : done
                                ? "bg-emerald-500/80 text-white"
                                : "bg-white/10 text-white/60",
                          )}
                        >
                          {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
                        </div>
                        <div className="min-w-0">
                          <div className={cn("text-sm font-medium", active ? "text-white" : "text-white/80")}>
                            {s.title}
                          </div>
                          <div className="truncate text-[11px] text-white/50">{s.subtitle}</div>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ol>

              <div className="mt-auto pt-6">
                <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-[11px] text-white/60">
                  <div className="mb-1 flex items-center gap-1.5 text-white/80">
                    <Sparkles className="h-3.5 w-3.5 text-primary" /> Dica
                  </div>
                  Você pode reabrir este wizard a qualquer momento — mudanças são versionadas em auditoria.
                </div>
              </div>
            </div>
          </aside>

          {/* RIGHT PANEL */}
          <section className="flex min-h-0 flex-col">
            <header className="border-b border-border/60 px-8 py-5">
              <div className="font-mono text-[10px] uppercase tracking-widest text-primary">
                {step.subtitle}
              </div>
              <h2 className="font-display text-2xl font-bold">{step.title}</h2>
            </header>

            <div className="flex-1 overflow-y-auto px-8 py-6 scrollbar-none">
              {step.content}
            </div>

            <footer className="flex items-center justify-between border-t border-border/60 bg-card/40 px-8 py-4">
              <Button
                variant="outline"
                onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
                disabled={stepIndex === 0}
              >
                <ChevronLeft className="mr-1 h-4 w-4" /> Voltar
              </Button>
              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={() => onOpenChange(false)}>
                  Cancelar
                </Button>
                {isLast ? (
                  <Button
                    onClick={() => {
                      setSaved(true);
                      setTimeout(() => onOpenChange(false), 900);
                    }}
                    disabled={saved}
                  >
                    {saved ? "Salvo ✓" : "Aplicar configurações"}
                  </Button>
                ) : (
                  <Button onClick={() => setStepIndex((i) => Math.min(steps.length - 1, i + 1))}>
                    Continuar <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                )}
              </div>
            </footer>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
