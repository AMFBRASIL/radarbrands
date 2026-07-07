import { createFileRoute } from "@tanstack/react-router";
import { SimplePage, Panel } from "@/components/dashboard/simple";
import { Workflow, Plus, Play, Pause, Slack, Mail, Gavel, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/dashboard/playbooks")({
  component: PlaybooksPage,
});

const playbooks = [
  {
    name: "Typosquatting crítico",
    trigger: "Domínio typosquatting E score ≥ 80",
    actions: ["Notificar registrar", "Alertar #juridico no Slack", "Abrir ticket no Jira"],
    runs: 42,
    active: true,
  },
  {
    name: "Perfil fake alto risco",
    trigger: "Instagram/TikTok fake E seguidores > 5k",
    actions: ["Report automático", "E-mail para marketing", "Adicionar ao Threat Graph"],
    runs: 128,
    active: true,
  },
  {
    name: "Crise reputacional",
    trigger: "Índice de crise > 70",
    actions: ["Ligar para CMO", "Slack #crise-war-room", "Gerar briefing IA em 5min"],
    runs: 3,
    active: true,
  },
  {
    name: "Deepfake com CEO",
    trigger: "Deepfake E rosto = CEO E confiança > 85%",
    actions: ["Escalar para especialista humano", "DMCA automático", "Notificar compliance"],
    runs: 6,
    active: false,
  },
];

const iconFor = (a: string) =>
  a.includes("Slack") ? Slack : a.includes("mail") || a.includes("E-mail") ? Mail : a.includes("urídic") || a.includes("DMCA") ? Gavel : Bot;

function PlaybooksPage() {
  return (
    <SimplePage
      eyebrow="Automação · Workflows"
      title="Playbooks de resposta"
      description="Configure fluxos automáticos estilo Zapier: se X acontece, faça Y, Z e W. Sem código."
    >
      <div className="flex justify-end">
        <Button className="bg-[image:var(--gradient-primary)] text-primary-foreground">
          <Plus className="mr-1 h-4 w-4" /> Novo playbook
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {playbooks.map((p) => (
          <div key={p.name} className="glass-strong ring-gradient rounded-2xl p-6">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground">
                  <Workflow className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-display text-lg font-semibold">{p.name}</div>
                  <div className="text-xs text-muted-foreground">Executado {p.runs}× este mês</div>
                </div>
              </div>
              <Button size="sm" variant="ghost">
                {p.active ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
            </div>

            <div className="mt-4 rounded-lg bg-muted/30 p-3">
              <div className="text-[10px] uppercase text-primary">Trigger</div>
              <div className="mt-1 font-mono text-xs">{p.trigger}</div>
            </div>

            <div className="mt-3 space-y-2">
              <div className="text-[10px] uppercase text-primary">Ações</div>
              {p.actions.map((a) => {
                const Icon = iconFor(a);
                return (
                  <div key={a} className="flex items-center gap-2 rounded-md bg-background/40 p-2 text-sm">
                    <Icon className="h-4 w-4 text-primary" />
                    {a}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </SimplePage>
  );
}
