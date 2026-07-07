import { createFileRoute } from "@tanstack/react-router";
import { SimplePage, Panel } from "@/components/dashboard/simple";
import { Crown, Play, Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/dashboard/briefing")({
  component: BriefingPage,
});

const highlights = [
  { label: "Ameaças bloqueadas", value: "47" },
  { label: "CPC recuperado", value: "R$ 84.320" },
  { label: "Crises contidas", value: "1" },
  { label: "Ações do Autopilot", value: "612" },
];

const past = [
  { week: "Semana 45 · 03–09 nov", audio: "3min 12s", pdf: "2.4 MB" },
  { week: "Semana 44 · 27 out–02 nov", audio: "2min 48s", pdf: "1.9 MB" },
  { week: "Semana 43 · 20–26 out", audio: "3min 05s", pdf: "2.1 MB" },
  { week: "Semana 42 · 13–19 out", audio: "2min 51s", pdf: "1.8 MB" },
];

function BriefingPage() {
  return (
    <SimplePage
      eyebrow="Executive Briefing"
      title="Briefing semanal gerado por IA"
      description="Um resumo em áudio e PDF pronto para o CMO/CEO — feito automaticamente toda segunda-feira às 8h."
    >
      <div className="glass-strong ring-gradient rounded-3xl p-8">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[image:var(--gradient-primary)] glow-primary">
            <Crown className="h-6 w-6 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <div className="text-xs uppercase text-primary">Semana 46 · 10 – 16 novembro</div>
            <h3 className="mt-1 font-display text-2xl font-bold">
              Semana forte: contivemos uma crise em 3h e economizamos R$ 84k em CPC.
            </h3>
            <p className="mt-3 text-muted-foreground">
              Esta semana bloqueamos 47 ameaças à sua marca. O destaque foi uma tentativa
              de crise reputacional no Twitter/X iniciada por um usuário insatisfeito, que
              atingiu 12k retweets em 4h — contida por playbook automático com resposta
              oficial em menos de 3 horas. Além disso, 612 ações do Autopilot resolveram
              casos de baixa complexidade sem intervenção. Recomendamos reforço em
              marketplaces para as próximas 2 semanas devido à proximidade da Black
              Friday.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button className="bg-[image:var(--gradient-primary)] text-primary-foreground">
                <Play className="mr-1 h-4 w-4" /> Ouvir (3min 24s)
              </Button>
              <Button variant="ghost">
                <FileText className="mr-1 h-4 w-4" /> Ver PDF completo
              </Button>
              <Button variant="ghost">
                <Download className="mr-1 h-4 w-4" /> Baixar
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {highlights.map((h) => (
          <Panel key={h.label}>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">{h.label}</div>
            <div className="mt-1 font-display text-3xl font-bold text-gradient">{h.value}</div>
          </Panel>
        ))}
      </div>

      <Panel title="Briefings anteriores">
        <ul className="divide-y divide-border/60">
          {past.map((p) => (
            <li key={p.week} className="flex items-center justify-between py-3">
              <div>
                <div className="text-sm font-medium">{p.week}</div>
                <div className="text-xs text-muted-foreground">
                  Áudio {p.audio} · PDF {p.pdf}
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost">
                  <Play className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </Panel>
    </SimplePage>
  );
}
