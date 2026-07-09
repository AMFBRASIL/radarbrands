import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Sparkles, ChevronLeft, ChevronRight, Share2, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/wrapped")({
  head: () => ({
    meta: [{ title: "Semana Radar · Radar | brands" }, { name: "robots", content: "noindex" }],
  }),
  component: Wrapped,
});

type Slide = {
  eyebrow: string;
  title: React.ReactNode;
  sub?: string;
  bg: string;
  stat?: string;
  hint?: string;
};

const BRL = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

const slides: Slide[] = [
  {
    eyebrow: "Semana 27 · 2026",
    title: "Sua semana no Radar",
    sub: "6 dias, 24h por dia. Aqui está o resumo do que protegemos por você.",
    bg: "linear-gradient(140deg, oklch(0.32 0.14 265), oklch(0.22 0.08 250))",
    hint: "Toque para começar",
  },
  {
    eyebrow: "Receita protegida",
    title: (
      <>
        Você guardou{" "}
        <span className="bg-[image:linear-gradient(90deg,oklch(0.9_0.18_150),oklch(0.85_0.15_170))] bg-clip-text text-transparent">
          {BRL(428_900)}
        </span>{" "}
        da sua receita
      </>
    ),
    sub: "Cálculo baseado nos ataques neutralizados e conversões que teriam sido desviadas.",
    bg: "linear-gradient(140deg, oklch(0.28 0.12 180), oklch(0.18 0.05 210))",
    stat: "+34% vs semana anterior",
  },
  {
    eyebrow: "Anúncios derrubados",
    title: (
      <>
        <span className="bg-[image:linear-gradient(90deg,oklch(0.72_0.24_22),oklch(0.82_0.2_45))] bg-clip-text text-transparent">
          312 ads
        </span>{" "}
        infratores fora do ar
      </>
    ),
    sub: "Concorrentes usando sua marca em Google Ads, Meta e TikTok. Todos removidos.",
    bg: "linear-gradient(140deg, oklch(0.32 0.14 30), oklch(0.2 0.08 20))",
    stat: "Média do setor: 74",
  },
  {
    eyebrow: "Domínios bloqueados",
    title: (
      <>
        <span className="bg-[image:linear-gradient(90deg,oklch(0.82_0.17_180),oklch(0.9_0.14_200))] bg-clip-text text-transparent">
          17 clones
        </span>{" "}
        neutralizados
      </>
    ),
    sub: "Domínios de phishing e typosquatting registrados nas últimas semanas.",
    bg: "linear-gradient(140deg, oklch(0.24 0.1 220), oklch(0.16 0.05 240))",
    stat: "3 críticos · 14 médios",
  },
  {
    eyebrow: "Perfis falsos",
    title: (
      <>
        <span className="bg-[image:linear-gradient(90deg,oklch(0.85_0.18_320),oklch(0.75_0.22_300))] bg-clip-text text-transparent">
          48 perfis
        </span>{" "}
        derrubados nas redes
      </>
    ),
    sub: "Instagram, TikTok e Facebook. Contas se passando pela marca e por executivos.",
    bg: "linear-gradient(140deg, oklch(0.28 0.12 320), oklch(0.18 0.06 300))",
    stat: "1.2M seguidores expostos ao risco",
  },
  {
    eyebrow: "Highlight da semana",
    title: (
      <>
        Você é <em className="not-italic bg-[image:var(--gradient-primary)] bg-clip-text text-transparent">top 3%</em>{" "}
        em resposta a crises
      </>
    ),
    sub: "Tempo médio de resposta: 4min 12s. A média do seu setor é 47min.",
    bg: "linear-gradient(140deg, oklch(0.3 0.13 265), oklch(0.2 0.08 260))",
    stat: "SLA cumprido em 100% dos alertas críticos",
  },
  {
    eyebrow: "Sua semana",
    title: "Continue firme.",
    sub: "Enquanto você lê isso, o Radar já está monitorando +14.200 sinais de novo.",
    bg: "linear-gradient(140deg, oklch(0.22 0.08 250), oklch(0.14 0.04 240))",
    hint: "Compartilhe com sua equipe",
  },
];

function Wrapped() {
  const [i, setI] = useState(0);
  const [auto, setAuto] = useState(true);
  const slide = slides[i];

  useEffect(() => {
    if (!auto || i === 0 || i === slides.length - 1) return;
    const id = setTimeout(() => setI((x) => Math.min(x + 1, slides.length - 1)), 4500);
    return () => clearTimeout(id);
  }, [i, auto]);

  const share = () => {
    setAuto(false);
    toast.success("Link copiado", { description: "Compartilhe seu Wrapped com o time." });
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-primary">
          <Sparkles className="h-3.5 w-3.5" /> Semana Radar · resumo IA
        </div>
        <h1 className="mt-1 font-display text-3xl font-bold">Sua semana protegida</h1>
        <p className="text-sm text-muted-foreground">
          Gerado automaticamente toda segunda. Compartilhe com a equipe em um clique.
        </p>
      </div>

      <div className="relative mx-auto aspect-[9/16] w-full max-w-sm overflow-hidden rounded-3xl shadow-2xl md:aspect-[16/10] md:max-w-3xl">
        <div className="absolute inset-0 transition-all duration-500" style={{ background: slide.bg }} />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,color-mix(in_oklab,white_10%,transparent),transparent_60%)]" />

        {/* Top progress */}
        <div className="absolute inset-x-4 top-4 flex gap-1.5">
          {slides.map((_, idx) => (
            <div key={idx} className="h-1 flex-1 overflow-hidden rounded-full bg-white/20">
              <div
                className={`h-full bg-white transition-all ${idx < i ? "w-full" : idx === i ? "w-full animate-pulse" : "w-0"}`}
              />
            </div>
          ))}
        </div>

        <button
          onClick={() => { setAuto(false); setI((x) => Math.max(0, x - 1)); }}
          className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/20 p-2 text-white backdrop-blur transition hover:bg-black/40"
          aria-label="Anterior"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={() => { setAuto(false); setI((x) => Math.min(slides.length - 1, x + 1)); }}
          className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/20 p-2 text-white backdrop-blur transition hover:bg-black/40"
          aria-label="Próximo"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        <div key={i} className="relative flex h-full flex-col justify-between p-8 text-white [animation:wrappedIn_.5s_ease-out] md:p-14">
          <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/70">
            {slide.eyebrow}
          </div>

          <div className="max-w-xl">
            <h2 className="font-display text-4xl font-bold leading-tight md:text-6xl">
              {slide.title}
            </h2>
            {slide.sub && <p className="mt-4 text-sm text-white/80 md:text-base">{slide.sub}</p>}
            {slide.stat && (
              <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 font-mono text-[11px] uppercase tracking-widest backdrop-blur">
                {slide.stat}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="font-mono text-[10px] uppercase tracking-widest text-white/60">
              {i + 1}/{slides.length}
            </div>
            {i === 0 ? (
              <Button size="sm" variant="secondary" onClick={() => setI(1)}>
                <Play className="mr-1 h-3 w-3" /> {slide.hint}
              </Button>
            ) : i === slides.length - 1 ? (
              <Button size="sm" variant="secondary" onClick={share}>
                <Share2 className="mr-1 h-3 w-3" /> Compartilhar
              </Button>
            ) : null}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes wrappedIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
