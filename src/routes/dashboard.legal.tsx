import { createFileRoute } from "@tanstack/react-router";
import { Panel, SimplePage } from "@/components/dashboard/simple";
import { Button } from "@/components/ui/button";
import { FileText, Gavel } from "lucide-react";

const cases = [
  { title: "Notificação extrajudicial · cadbrasiI.com.br", status: "Rascunho IA", tone: "warning" },
  { title: "Take-down Instagram · @cadbrasil.of", status: "Enviado", tone: "primary" },
  { title: "Oposição INPI · BRAND SHIELD IA", status: "Em preparação", tone: "warning" },
];

export const Route = createFileRoute("/dashboard/legal")({
  component: LegalPage,
});

function LegalPage() {
  return (
    <SimplePage
      eyebrow="Jurídico"
      title="Documentos e ações legais"
      description="Take-downs, oposições e notificações — assistidos por IA."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Panel title="Casos abertos">
          <ul className="space-y-3">
            {cases.map((c) => (
              <li key={c.title} className="flex items-center justify-between rounded-xl border border-border/60 p-3">
                <div className="flex items-center gap-3">
                  <Gavel className="h-4 w-4 text-primary" />
                  <span className="text-sm">{c.title}</span>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-[10px] ${c.tone === "primary" ? "bg-primary/15 text-primary" : "bg-[color:var(--warning)]/15 text-[color:var(--warning)]"}`}>
                  {c.status}
                </span>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="Trademark Center">
          <div className="text-sm text-muted-foreground">
            Marca CADBRASIL · 3 classes · Vigência 2033
          </div>
          <Button className="mt-4 bg-[image:var(--gradient-primary)] text-primary-foreground hover:opacity-90">
            <FileText className="mr-2 h-4 w-4" /> Gerar documento com IA
          </Button>
        </Panel>
      </div>
    </SimplePage>
  );
}
