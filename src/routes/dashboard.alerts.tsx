import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

const alerts = [
  { risk: "Alto", src: "Google Ads", desc: "Concorrente XYZ comprando 'minha marca'", date: "Hoje 10:32", status: "Pendente", tone: "danger" },
  { risk: "Crítico", src: "Domínios", desc: "cadbrasiI.com.br registrado há 2 dias", date: "Hoje 09:15", status: "Em análise", tone: "danger" },
  { risk: "Médio", src: "Instagram", desc: "Perfil falso @cadbrasil.of", date: "Ontem", status: "Reportado", tone: "warning" },
  { risk: "Alto", src: "Mercado Livre", desc: "3 produtos falsificados detectados", date: "Ontem", status: "Pendente", tone: "danger" },
  { risk: "Baixo", src: "Reclame Aqui", desc: "Reclamação com menção da marca", date: "2 dias", status: "Resolvido", tone: "success" },
  { risk: "Médio", src: "TikTok", desc: "Vídeo usando logotipo sem autorização", date: "3 dias", status: "Pendente", tone: "warning" },
] as const;

export const Route = createFileRoute("/dashboard/alerts")({
  component: AlertsPage,
});

function AlertsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-xs font-mono uppercase tracking-widest text-primary">Central</div>
          <h1 className="mt-1 font-display text-3xl font-bold">Alertas</h1>
          <p className="text-sm text-muted-foreground">12 abertos · 3 críticos</p>
        </div>
        <Button className="bg-[image:var(--gradient-primary)] text-primary-foreground hover:opacity-90">
          <Sparkles className="mr-2 h-4 w-4" /> Resolver todos com IA
        </Button>
      </div>

      <div className="overflow-hidden rounded-2xl glass ring-gradient">
        <div className="grid grid-cols-[100px_140px_1fr_120px_120px_140px] gap-4 border-b border-border/60 px-5 py-3 text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
          <span>Risco</span>
          <span>Fonte</span>
          <span>Descrição</span>
          <span>Data</span>
          <span>Status</span>
          <span className="text-right">Ação</span>
        </div>
        {alerts.map((a, i) => (
          <div
            key={i}
            className="grid grid-cols-[100px_140px_1fr_120px_120px_140px] items-center gap-4 border-b border-border/60 px-5 py-4 text-sm last:border-0 hover:bg-muted/20"
          >
            <span
              className={`inline-flex w-fit items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                a.tone === "danger"
                  ? "bg-destructive/15 text-destructive"
                  : a.tone === "warning"
                  ? "bg-[color:var(--warning)]/15 text-[color:var(--warning)]"
                  : "bg-[color:var(--success)]/15 text-[color:var(--success)]"
              }`}
            >
              🔴 {a.risk}
            </span>
            <span className="text-muted-foreground">{a.src}</span>
            <span>{a.desc}</span>
            <span className="text-muted-foreground">{a.date}</span>
            <span className="text-muted-foreground">{a.status}</span>
            <div className="text-right">
              <Button size="sm" variant="outline" className="border-primary/40 text-primary hover:bg-primary/10">
                <Sparkles className="mr-1 h-3.5 w-3.5" /> Resolver com IA
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
