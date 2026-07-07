import { createFileRoute } from "@tanstack/react-router";
import { Globe, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const rows = [
  { d: "cadbrasiI.com.br", risk: "Alto", note: "typo (I/i)", days: 2 },
  { d: "cadbrasil-oficial.net", risk: "Médio", note: "logotipo copiado", days: 14 },
  { d: "cad-brasil.shop", risk: "Baixo", note: "sem uso ativo", days: 30 },
  { d: "cadbrasil.ai", risk: "Médio", note: "landing suspeita", days: 5 },
  { d: "cadbrasil-store.com", risk: "Alto", note: "phishing detectado", days: 1 },
];

export const Route = createFileRoute("/dashboard/domains")({
  component: DomainsPage,
});

function DomainsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-xs font-mono uppercase tracking-widest text-primary">Domain Watch</div>
          <h1 className="mt-1 font-display text-3xl font-bold">Monitoramento de domínios</h1>
        </div>
        <Button className="bg-[image:var(--gradient-primary)] text-primary-foreground hover:opacity-90">
          <Plus className="mr-2 h-4 w-4" /> Adicionar domínio
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          { l: "Domínios rastreados", v: "48" },
          { l: "Correspondências", v: "12" },
          { l: "Ameaças críticas", v: "3", tone: "danger" },
          { l: "SSLs suspeitos", v: "5", tone: "warning" },
        ].map((s) => (
          <div key={s.l} className="glass rounded-2xl p-5 ring-gradient">
            <Globe className="h-5 w-5 text-primary" />
            <div
              className={`mt-3 font-display text-3xl font-bold ${
                s.tone === "danger"
                  ? "text-destructive"
                  : s.tone === "warning"
                  ? "text-[color:var(--warning)]"
                  : ""
              }`}
            >
              {s.v}
            </div>
            <div className="text-xs text-muted-foreground">{s.l}</div>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl glass ring-gradient">
        <div className="overflow-x-auto">
          <div className="min-w-[720px]">
            <div className="grid grid-cols-[1.5fr_100px_1fr_100px_140px] gap-4 border-b border-border/60 px-5 py-3 text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
              <span>Domínio</span>
              <span>Risco</span>
              <span>Observação</span>
              <span>Registrado</span>
              <span className="text-right">Ação</span>
            </div>
            {rows.map((r) => (
              <div
                key={r.d}
                className="grid grid-cols-[1.5fr_100px_1fr_100px_140px] items-center gap-4 border-b border-border/60 px-5 py-4 text-sm last:border-0"
              >
                <span className="font-mono">{r.d}</span>
                <span
                  className={`inline-flex w-fit rounded-full px-2 py-0.5 text-xs ${
                    r.risk === "Alto"
                      ? "bg-destructive/15 text-destructive"
                      : r.risk === "Médio"
                      ? "bg-[color:var(--warning)]/15 text-[color:var(--warning)]"
                      : "bg-[color:var(--success)]/15 text-[color:var(--success)]"
                  }`}
                >
                  {r.risk}
                </span>
                <span className="text-muted-foreground">{r.note}</span>
                <span className="text-muted-foreground">{r.days}d atrás</span>
                <div className="text-right">
                  <Button size="sm" variant="outline">
                    Take-down
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
