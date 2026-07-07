import { createFileRoute } from "@tanstack/react-router";
import { Panel, SimplePage } from "@/components/dashboard/simple";

const sources = [
  "Google", "Bing", "Instagram", "Facebook", "TikTok", "YouTube",
  "LinkedIn", "Reclame Aqui", "Notícias", "Blogs", "Fóruns", "Marketplaces", "Domínios",
];

export const Route = createFileRoute("/dashboard/monitoring")({
  component: MonitoringPage,
});

function MonitoringPage() {
  return (
    <SimplePage
      eyebrow="Monitoramento"
      title="Fontes ativas"
      description="13 canais rastreados 24/7 com IA de correlação."
    >
      <Panel>
        <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
          {sources.map((s) => (
            <div key={s} className="flex items-center justify-between rounded-lg border border-border/60 bg-card/40 p-3 text-sm">
              <span>{s}</span>
              <span className="flex items-center gap-1 text-xs text-[color:var(--success)]">
                <span className="h-2 w-2 rounded-full bg-[color:var(--success)] animate-pulse-dot" />
                Ativo
              </span>
            </div>
          ))}
        </div>
      </Panel>
    </SimplePage>
  );
}
