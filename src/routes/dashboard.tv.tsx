import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  Maximize2,
  Shield,
  ShieldAlert,
  TrendingUp,
  Zap,
} from "lucide-react";

export const Route = createFileRoute("/dashboard/tv")({
  head: () => ({
    meta: [
      { title: "Modo TV · Radar | brands" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: TvMode,
});

const slides = [
  {
    key: "score",
    eyebrow: "Brand Health Score",
    value: "87",
    unit: "/100",
    label: "Saúde da marca — tendência positiva",
    icon: Shield,
    tone: "from-emerald-500/30 to-primary/20",
  },
  {
    key: "blocked",
    eyebrow: "Ameaças bloqueadas · 24h",
    value: "247",
    unit: "",
    label: "Domínios, ads e perfis falsos derrubados",
    icon: Zap,
    tone: "from-primary/30 to-cyan-500/20",
  },
  {
    key: "revenue",
    eyebrow: "Receita protegida · mês",
    value: "R$ 1,28",
    unit: "M",
    label: "Golpes e brand bidding neutralizados",
    icon: TrendingUp,
    tone: "from-fuchsia-500/25 to-primary/20",
  },
  {
    key: "critical",
    eyebrow: "Alertas críticos ativos",
    value: "3",
    unit: "",
    label: "War Room em standby · SLA 15 min",
    icon: ShieldAlert,
    tone: "from-destructive/30 to-amber-500/20",
  },
  {
    key: "active",
    eyebrow: "Monitoramentos ativos",
    value: "1.284",
    unit: "",
    label: "13 canais rastreados 24/7",
    icon: Activity,
    tone: "from-primary/30 to-emerald-500/20",
  },
];

function TvMode() {
  const [idx, setIdx] = useState(0);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    const s = setInterval(() => setIdx((i) => (i + 1) % slides.length), 6000);
    return () => {
      clearInterval(t);
      clearInterval(s);
    };
  }, []);

  const fullscreen = () => {
    const el = document.documentElement;
    if (!document.fullscreenElement) el.requestFullscreen?.();
    else document.exitFullscreen?.();
  };

  const slide = slides[idx];
  const Icon = slide.icon;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col overflow-hidden bg-background text-foreground">
      {/* Background animado */}
      <div className={`absolute inset-0 bg-gradient-to-br ${slide.tone} transition-all duration-1000`} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent,var(--background)_75%)]" />
      <div className="absolute inset-0 opacity-[0.04] [background-image:linear-gradient(var(--foreground)_1px,transparent_1px),linear-gradient(90deg,var(--foreground)_1px,transparent_1px)] [background-size:60px_60px]" />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between border-b border-border/40 px-6 py-4 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[image:var(--gradient-primary)]">
            <Shield className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <div className="font-display text-sm font-bold">Radar | brands · TV Mode</div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-primary">
              CADBRASIL · Live
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden font-mono text-2xl font-bold tabular-nums md:block">
            {now.toLocaleTimeString("pt-BR")}
          </div>
          <button
            onClick={fullscreen}
            className="rounded-lg border border-border/60 bg-card/40 p-2 hover:bg-muted"
            aria-label="Tela cheia"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
          <Link
            to="/dashboard"
            className="flex items-center gap-2 rounded-lg border border-border/60 bg-card/40 px-3 py-2 text-xs hover:bg-muted"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Sair
          </Link>
        </div>
      </header>

      {/* Slide central */}
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 text-center">
        <div key={slide.key} className="animate-in fade-in slide-in-from-bottom-6 duration-700">
          <Icon className="mx-auto mb-6 h-16 w-16 text-primary" />
          <div className="font-mono text-xs uppercase tracking-[0.4em] text-primary md:text-sm">
            {slide.eyebrow}
          </div>
          <div className="mt-6 font-display text-[10rem] font-black leading-none tracking-tight md:text-[14rem]">
            {slide.value}
            <span className="text-6xl text-muted-foreground md:text-8xl">{slide.unit}</span>
          </div>
          <div className="mt-6 text-lg text-muted-foreground md:text-2xl">{slide.label}</div>
        </div>

        {/* Ticker de alertas */}
        <div className="absolute bottom-8 left-0 right-0 overflow-hidden border-y border-border/40 bg-background/60 py-3 backdrop-blur-sm">
          <div className="flex items-center gap-3 whitespace-nowrap px-6 font-mono text-xs uppercase tracking-widest">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-[color:var(--warning)]" />
            <span className="animate-marquee">
              🛡️ Domínio cadbrasiI.com.br bloqueado · 12 min atrás &nbsp;•&nbsp; ⚡ Anúncio malicioso removido do Google Ads &nbsp;•&nbsp; ✅ Perfil falso @cadbrasil.of derrubado &nbsp;•&nbsp; 🔒 Score subiu 3 pontos essa semana &nbsp;•&nbsp; 🎯 R$ 128.400 em receita protegida hoje &nbsp;•&nbsp;
            </span>
          </div>
        </div>
      </main>

      {/* Indicadores */}
      <div className="absolute bottom-24 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            aria-label={`Slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all ${
              i === idx ? "w-8 bg-primary" : "w-1.5 bg-muted-foreground/40"
            }`}
          />
        ))}
      </div>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: inline-block;
          animation: marquee 40s linear infinite;
        }
      `}</style>
    </div>
  );
}
