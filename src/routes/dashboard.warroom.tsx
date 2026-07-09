import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ShieldAlert, Clock, Zap, PhoneCall, Scale, Megaphone, Users,
  Activity, CheckCircle2, Circle, Play, Pause,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/warroom")({
  head: () => ({
    meta: [{ title: "War Room · Radar | brands" }, { name: "robots", content: "noindex" }],
  }),
  component: WarRoom,
});

const SLA_SECONDS = 15 * 60;

const team = [
  { name: "Marina Souza", role: "CMO", status: "on" as const, avatar: "MS" },
  { name: "Rafael Lopes", role: "Jurídico", status: "on" as const, avatar: "RL" },
  { name: "Camila Freitas", role: "PR / Imprensa", status: "away" as const, avatar: "CF" },
  { name: "Diego Alves", role: "CEO", status: "on" as const, avatar: "DA" },
  { name: "Bruna Reis", role: "SAC Lead", status: "off" as const, avatar: "BR" },
];

const initialSteps = [
  { id: 1, label: "Detectar epicentro da crise", done: true },
  { id: 2, label: "Notificar comitê C-level", done: true },
  { id: 3, label: "Publicar nota holding nas redes", done: false },
  { id: 4, label: "Ativar takedown mass em Ads/Meta", done: false },
  { id: 5, label: "Comunicado para imprensa e portais", done: false },
  { id: 6, label: "Response fine-tune do SAC", done: false },
];

function fmt(s: number) {
  const m = Math.floor(s / 60).toString().padStart(2, "0");
  const sec = (s % 60).toString().padStart(2, "0");
  return `${m}:${sec}`;
}

function WarRoom() {
  const [seconds, setSeconds] = useState(SLA_SECONDS - 7 * 60 - 42);
  const [running, setRunning] = useState(true);
  const [steps, setSteps] = useState(initialSteps);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [running]);

  const pct = (seconds / SLA_SECONDS) * 100;
  const danger = seconds < 3 * 60;

  const toggleStep = (id: number) => {
    setSteps((s) => s.map((x) => (x.id === id ? { ...x, done: !x.done } : x)));
  };

  const trigger = (label: string) => {
    toast.success(`Ação disparada: ${label}`, {
      description: "Playbook em execução. Equipe notificada.",
    });
  };

  const done = steps.filter((s) => s.done).length;
  const progress = (done / steps.length) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-destructive">
            <ShieldAlert className="h-3.5 w-3.5" /> War Room · Incidente #WR-2408
          </div>
          <h1 className="mt-1 font-display text-3xl font-bold">
            Crise ativa: viralização negativa · Twitter/X
          </h1>
          <p className="text-sm text-muted-foreground">
            Início 08:42 · +340% menções · sentimento -72 · previsão de pico em 6h
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setRunning((r) => !r)}>
            {running ? (<><Pause className="mr-1 h-3.5 w-3.5" /> Pausar SLA</>) : (<><Play className="mr-1 h-3.5 w-3.5" /> Retomar</>)}
          </Button>
          <Button size="sm" onClick={() => trigger("Comitê emergencial")}>Chamar comitê</Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        {/* SLA countdown */}
        <div className={`relative overflow-hidden rounded-3xl border p-8 ${danger ? "border-destructive/50 bg-[linear-gradient(160deg,color-mix(in_oklab,var(--destructive)_16%,var(--card)),var(--card))]" : "border-primary/30 bg-[linear-gradient(160deg,color-mix(in_oklab,var(--primary)_10%,var(--card)),var(--card))]"}`}>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                <Clock className="h-3 w-3" /> SLA de resposta pública
              </div>
              <div className={`mt-2 font-display text-7xl font-bold tabular-nums ${danger ? "text-destructive animate-pulse" : "text-foreground"}`}>
                {fmt(seconds)}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Meta: primeira comunicação oficial em até 15 minutos.
              </p>
            </div>
            <div className="rounded-xl border border-border/60 bg-card/40 px-4 py-3 text-right">
              <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Índice</div>
              <div className="font-display text-3xl font-bold text-destructive">78</div>
              <div className="text-[10px] text-muted-foreground">/ 100</div>
            </div>
          </div>

          <div className="mt-6 h-2 overflow-hidden rounded-full bg-border/60">
            <div
              className={`h-full ${danger ? "bg-destructive" : "bg-[image:var(--gradient-primary)]"}`}
              style={{ width: `${pct}%` }}
            />
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              { icon: Megaphone, label: "Publicar nota oficial", color: "text-primary" },
              { icon: Zap, label: "Takedown em massa", color: "text-primary" },
              { icon: Scale, label: "Notificar jurídico", color: "text-primary" },
              { icon: PhoneCall, label: "Alertar C-level", color: "text-destructive" },
            ].map((a) => (
              <button
                key={a.label}
                onClick={() => trigger(a.label)}
                className="group flex flex-col items-start gap-2 rounded-xl border border-border/60 bg-card/40 p-4 text-left transition hover:border-primary/40 hover:bg-primary/5"
              >
                <a.icon className={`h-5 w-5 ${a.color}`} />
                <span className="text-sm font-medium">{a.label}</span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground group-hover:text-primary">
                  Disparar →
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="glass-strong rounded-3xl p-6">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-primary">
            <Users className="h-3 w-3" /> Equipe convocada
          </div>
          <ul className="mt-4 space-y-3">
            {team.map((t) => (
              <li key={t.name} className="flex items-center gap-3 rounded-xl border border-border/60 bg-card/40 p-3">
                <div className="relative h-9 w-9 shrink-0">
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-[image:var(--gradient-primary)] font-display text-xs font-bold text-primary-foreground">
                    {t.avatar}
                  </div>
                  <span
                    className={`absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full ring-2 ring-background ${
                      t.status === "on"
                        ? "bg-[color:var(--success,oklch(0.78_0.18_150))]"
                        : t.status === "away"
                          ? "bg-[color:var(--warning,oklch(0.78_0.16_80))]"
                          : "bg-muted-foreground/60"
                    }`}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  {t.status === "on" ? "Online" : t.status === "away" ? "Away" : "Offline"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Playbook */}
      <div className="glass-strong rounded-3xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-primary">
              <Activity className="h-3 w-3" /> Playbook de contenção
            </div>
            <h3 className="mt-1 font-display text-lg font-semibold">
              {done}/{steps.length} passos executados
            </h3>
          </div>
          <div className="text-right">
            <div className="font-display text-2xl font-bold">{Math.round(progress)}%</div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Progresso</div>
          </div>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-border/60">
          <div className="h-full bg-[image:var(--gradient-primary)] transition-all" style={{ width: `${progress}%` }} />
        </div>

        <ol className="mt-6 space-y-2">
          {steps.map((s) => (
            <li key={s.id}>
              <button
                onClick={() => toggleStep(s.id)}
                className="flex w-full items-center gap-3 rounded-xl border border-border/60 bg-card/40 p-3 text-left transition hover:bg-card/70"
              >
                {s.done ? (
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                ) : (
                  <Circle className="h-5 w-5 shrink-0 text-muted-foreground" />
                )}
                <span className={`font-mono text-[11px] uppercase tracking-widest ${s.done ? "text-muted-foreground line-through" : "text-primary"}`}>
                  {String(s.id).padStart(2, "0")}
                </span>
                <span className={`text-sm ${s.done ? "text-muted-foreground line-through" : ""}`}>
                  {s.label}
                </span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
