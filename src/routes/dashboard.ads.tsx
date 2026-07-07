import { createFileRoute } from "@tanstack/react-router";
import { Panel, SimplePage } from "@/components/dashboard/simple";

const rows = [
  { comp: "Concorrente XYZ", kw: "minha marca", days: 15, spend: "R$ 8.500" },
  { comp: "AcmeCorp", kw: "cadbrasil sistemas", days: 7, spend: "R$ 3.200" },
  { comp: "Beta Tech", kw: "cadbrasil oficial", days: 22, spend: "R$ 12.400" },
];

export const Route = createFileRoute("/dashboard/ads")({
  component: AdsPage,
});

function AdsPage() {
  return (
    <SimplePage
      eyebrow="Ads Guardian"
      title="Google Ads"
      description="Concorrentes comprando sua marca — em tempo real."
    >
      <Panel>
        <div className="overflow-x-auto">
          <div className="min-w-[560px]">
            <div className="grid grid-cols-4 gap-4 border-b border-border/60 pb-3 text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
              <span>Empresa</span>
              <span>Palavra-chave</span>
              <span>Ativo há</span>
              <span className="text-right">Investimento/mês</span>
            </div>
            {rows.map((r) => (
              <div key={r.comp} className="grid grid-cols-4 items-center gap-4 border-b border-border/60 py-4 text-sm last:border-0">
                <span className="font-medium">{r.comp}</span>
                <span className="font-mono text-muted-foreground">"{r.kw}"</span>
                <span className="text-muted-foreground">{r.days} dias</span>
                <span className="text-right font-display font-bold text-gradient">{r.spend}</span>
              </div>
            ))}
          </div>
        </div>
      </Panel>
    </SimplePage>
  );
}
