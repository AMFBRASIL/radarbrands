import { createFileRoute } from "@tanstack/react-router";
import { Panel, SimplePage } from "@/components/dashboard/simple";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";

const reports = [
  { title: "Relatório Executivo · Novembro 2026", pages: 24, date: "01/12" },
  { title: "Análise trimestral Q3 2026", pages: 62, date: "05/10" },
  { title: "Auditoria de marca · CADBRASIL", pages: 41, date: "12/09" },
];

export const Route = createFileRoute("/dashboard/reports")({
  component: ReportsPage,
});

function ReportsPage() {
  return (
    <SimplePage
      eyebrow="Relatórios"
      title="Relatórios executivos"
      description="Exportação em PDF com score, riscos, evolução e recomendações."
    >
      <Panel>
        <div className="grid gap-3">
          {reports.map((r) => (
            <div key={r.title} className="flex items-center justify-between rounded-xl border border-border/60 p-4">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-sm font-medium">{r.title}</div>
                  <div className="text-xs text-muted-foreground">{r.pages} páginas · {r.date}</div>
                </div>
              </div>
              <Button size="sm" variant="outline">
                <Download className="mr-2 h-4 w-4" /> PDF
              </Button>
            </div>
          ))}
        </div>
      </Panel>
    </SimplePage>
  );
}
