import { createFileRoute } from "@tanstack/react-router";
import { SimplePage, Panel } from "@/components/dashboard/simple";
import { Eye, KeyRound, Database, MessageSquare, ShieldAlert } from "lucide-react";

export const Route = createFileRoute("/dashboard/darkweb")({
  component: DarkWebPage,
});

const leaks = [
  { source: "Telegram — Vazamentos_BR", type: "credenciais", count: "1.240 e-mails", severity: "critical", when: "há 6h" },
  { source: "Fórum darkweb (Tor)", type: "dados de clientes", count: "amostra 500 CPFs", severity: "critical", when: "há 1d" },
  { source: "Pastebin público", type: "menção interna", count: "documento estratégico 2026", severity: "high", when: "há 2d" },
  { source: "Discord — CardShop", type: "cartões pré-pagos", count: "78 registros", severity: "high", when: "há 3d" },
  { source: "Breach Compilation", type: "credenciais antigas", count: "3.2k contas", severity: "medium", when: "há 5d" },
];

function DarkWebPage() {
  return (
    <SimplePage
      eyebrow="Dark Web Monitor"
      title="Vazamentos e menções na dark web"
      description="Rastreamos fóruns Tor, canais Telegram, marketplaces criminosos e paste sites em busca de credenciais, dados e menções à sua marca."
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {[
          { icon: KeyRound, label: "Credenciais expostas", value: "4.518" },
          { icon: Database, label: "Registros de clientes", value: "500" },
          { icon: MessageSquare, label: "Menções (30d)", value: "82" },
          { icon: ShieldAlert, label: "Alertas críticos", value: "6" },
        ].map((s) => (
          <Panel key={s.label}>
            <div className="flex items-center gap-3">
              <s.icon className="h-5 w-5 text-primary" />
              <div className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</div>
            </div>
            <div className="mt-2 font-display text-3xl font-bold text-gradient">{s.value}</div>
          </Panel>
        ))}
      </div>

      <Panel title="Vazamentos detectados">
        <ul className="space-y-3">
          {leaks.map((l, i) => (
            <li key={i} className="flex items-start gap-4 rounded-xl bg-muted/30 p-4">
              <Eye className="mt-0.5 h-5 w-5 text-primary" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">{l.source}</span>
                  <span
                    className={`rounded px-2 py-0.5 text-[10px] uppercase ${
                      l.severity === "critical"
                        ? "bg-destructive/20 text-destructive"
                        : l.severity === "high"
                          ? "bg-warning/20 text-warning"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {l.severity}
                  </span>
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {l.type} · {l.count}
                </div>
              </div>
              <span className="text-xs text-muted-foreground">{l.when}</span>
            </li>
          ))}
        </ul>
      </Panel>
    </SimplePage>
  );
}
