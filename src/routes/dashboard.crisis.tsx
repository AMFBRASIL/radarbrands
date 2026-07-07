import { createFileRoute } from "@tanstack/react-router";
import { SimplePage, Panel } from "@/components/dashboard/simple";
import { Zap, TrendingDown, TrendingUp, Radio } from "lucide-react";

export const Route = createFileRoute("/dashboard/crisis")({
  component: CrisisPage,
});

const timeline = [8, 12, 9, 14, 18, 11, 13, 22, 45, 78, 92, 88, 65, 48];

const signals = [
  { source: "Twitter/X", volume: "+340%", sentiment: -72, sample: "‘Já não confio mais na marca…’ 8.4k retweets" },
  { source: "Reclame Aqui", volume: "+120%", sentiment: -68, sample: "Novas reclamações agrupadas em ‘atendimento’" },
  { source: "Reddit r/brasil", volume: "+210%", sentiment: -55, sample: "Thread com 340 upvotes discutindo caso" },
  { source: "Portais de notícia", volume: "+80%", sentiment: -40, sample: "Menção em 3 veículos B2B" },
];

function CrisisPage() {
  const max = Math.max(...timeline);
  return (
    <SimplePage
      eyebrow="Crisis Radar"
      title="Detecção precoce de crise reputacional"
      description="Correlação de sentimento, volume e portais em tempo real. A IA avisa quando uma crise está começando — não quando já explodiu."
    >
      <div className="glass-strong ring-gradient flex items-center gap-4 rounded-2xl p-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/20 text-destructive">
          <Zap className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <div className="font-display text-lg font-semibold text-destructive">
            Alerta: possível crise em curso
          </div>
          <div className="text-sm text-muted-foreground">
            Volume de menções +340% nas últimas 4h · sentimento caiu 72 pontos · pico previsto em 6h
          </div>
        </div>
        <div className="hidden md:flex flex-col items-end">
          <span className="font-display text-3xl font-bold text-destructive">78</span>
          <span className="text-[10px] uppercase text-muted-foreground">Índice de crise</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Panel title="Volume de menções · últimas 14h">
          <div className="flex h-40 items-end gap-2">
            {timeline.map((v, i) => (
              <div
                key={i}
                className="flex-1 rounded-t-md bg-[image:var(--gradient-primary)] opacity-90"
                style={{ height: `${(v / max) * 100}%` }}
                title={`${v} menções/min`}
              />
            ))}
          </div>
          <div className="mt-3 flex justify-between text-[10px] text-muted-foreground">
            <span>-14h</span>
            <span>agora</span>
          </div>
        </Panel>

        <Panel title="Sentimento (índice)">
          <div className="flex flex-col items-center justify-center py-6">
            <div className="relative h-32 w-32">
              <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                <circle cx="50" cy="50" r="42" stroke="oklch(0.28 0.03 250)" strokeWidth="10" fill="none" />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="oklch(0.62 0.24 22)"
                  strokeWidth="10"
                  fill="none"
                  strokeDasharray={`${(72 / 100) * 264} 264`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <TrendingDown className="h-5 w-5 text-destructive" />
                <span className="font-display text-2xl font-bold text-destructive">-72</span>
              </div>
            </div>
            <div className="mt-3 text-xs text-muted-foreground">variação vs. baseline</div>
          </div>
        </Panel>

        <Panel title="Contenção sugerida pela IA">
          <ol className="space-y-3 text-sm">
            <li className="rounded-lg bg-muted/30 p-3">
              <div className="text-xs uppercase text-primary">01 · próximos 15 min</div>
              Publicar nota oficial nas redes acknowledging o problema.
            </li>
            <li className="rounded-lg bg-muted/30 p-3">
              <div className="text-xs uppercase text-primary">02 · próximas 2h</div>
              Escalar SAC para responder em massa nos 5 threads virais.
            </li>
            <li className="rounded-lg bg-muted/30 p-3">
              <div className="text-xs uppercase text-primary">03 · próximas 24h</div>
              Sala de imprensa e comunicado formal aos veículos.
            </li>
          </ol>
        </Panel>
      </div>

      <Panel title="Sinais correlacionados">
        <ul className="space-y-3">
          {signals.map((s) => (
            <li key={s.source} className="flex items-start gap-4 rounded-xl bg-muted/30 p-4">
              <Radio className="mt-0.5 h-5 w-5 text-primary" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold">{s.source}</span>
                  <span className="rounded bg-destructive/20 px-2 py-0.5 text-[10px] uppercase text-destructive">
                    <TrendingUp className="mr-1 inline h-3 w-3" />
                    {s.volume}
                  </span>
                  <span className="text-xs text-muted-foreground">sentimento {s.sentiment}</span>
                </div>
                <div className="mt-1 text-sm text-muted-foreground">{s.sample}</div>
              </div>
            </li>
          ))}
        </ul>
      </Panel>
    </SimplePage>
  );
}
