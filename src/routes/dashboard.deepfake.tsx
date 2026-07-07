import { createFileRoute } from "@tanstack/react-router";
import { SimplePage, Panel } from "@/components/dashboard/simple";
import { Video, Mic, Play, ShieldAlert, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/dashboard/deepfake")({
  component: DeepfakePage,
});

const detections = [
  {
    kind: "video",
    subject: "CEO Renata Aoki",
    platform: "TikTok",
    handle: "@invest_easy_br",
    confidence: 96,
    status: "critical",
    context: "Suposta indicação de investimento cripto — 340k views em 48h",
    time: "Há 3h",
  },
  {
    kind: "audio",
    subject: "CFO Diego Farias",
    platform: "WhatsApp forward",
    handle: "áudio viral",
    confidence: 89,
    status: "critical",
    context: "Voz clonada solicitando transferência para 'novo fornecedor'",
    time: "Há 8h",
  },
  {
    kind: "video",
    subject: "Embaixadora Marina P.",
    platform: "Instagram Reels",
    handle: "@moda_barata_of",
    confidence: 82,
    status: "high",
    context: "Rosto sobreposto em anúncio de imitação da linha primavera",
    time: "Ontem",
  },
  {
    kind: "video",
    subject: "CEO Renata Aoki",
    platform: "YouTube",
    handle: "canal Fake Interviews",
    confidence: 71,
    status: "medium",
    context: "Entrevista adulterada — palavras trocadas por IA",
    time: "3 dias",
  },
];

function DeepfakePage() {
  return (
    <SimplePage
      eyebrow="IA · Media Forensics"
      title="Deepfake & Voice Clone Detector"
      description="Monitoramos vídeos, áudios e imagens usando o rosto ou voz dos seus executivos e embaixadores em toda a web."
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {[
          { label: "Deepfakes detectados", value: "23", sub: "últimos 30 dias" },
          { label: "Vozes clonadas", value: "8", sub: "3 golpes financeiros" },
          { label: "Takedowns concluídos", value: "17", sub: "média 4h" },
          { label: "Precisão do modelo", value: "94%", sub: "auditado" },
        ].map((s) => (
          <Panel key={s.label}>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</div>
            <div className="mt-1 font-display text-3xl font-bold text-gradient">{s.value}</div>
            <div className="text-xs text-muted-foreground">{s.sub}</div>
          </Panel>
        ))}
      </div>

      <Panel title="Detecções recentes">
        <div className="space-y-3">
          {detections.map((d, i) => (
            <div key={i} className="glass-strong rounded-xl p-4">
              <div className="flex items-start gap-4">
                <div className="relative flex h-20 w-32 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-black">
                  {d.kind === "video" ? (
                    <Video className="h-8 w-8 text-primary/60" />
                  ) : (
                    <Mic className="h-8 w-8 text-primary/60" />
                  )}
                  <div className="animate-shimmer absolute inset-0 opacity-40" />
                  <Play className="absolute h-6 w-6 text-white/80" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold">
                        {d.subject} — {d.platform}
                      </div>
                      <div className="text-xs text-muted-foreground">{d.handle} · {d.time}</div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`font-display text-xl font-bold ${
                          d.status === "critical"
                            ? "text-destructive"
                            : d.status === "high"
                              ? "text-warning"
                              : "text-primary"
                        }`}
                      >
                        {d.confidence}%
                      </div>
                      <div className="text-[10px] uppercase text-muted-foreground">confiança IA</div>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{d.context}</p>
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" className="bg-[image:var(--gradient-primary)] text-primary-foreground">
                      <ShieldAlert className="mr-1 h-3.5 w-3.5" /> Iniciar takedown
                    </Button>
                    <Button size="sm" variant="ghost">
                      <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> Marcar seguro
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </SimplePage>
  );
}
