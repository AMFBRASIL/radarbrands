import { createFileRoute } from "@tanstack/react-router";
import { Panel, SimplePage } from "@/components/dashboard/simple";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/dashboard/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <SimplePage eyebrow="Configurações" title="Preferências" description="Marca, alertas e integrações.">
      <div className="grid gap-4 md:grid-cols-2">
        <Panel title="Marca monitorada">
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Nome da marca</Label>
              <Input defaultValue="CADBRASIL" className="mt-1 bg-card/60" />
            </div>
            <div>
              <Label className="text-xs">Domínio principal</Label>
              <Input defaultValue="cadbrasil.com.br" className="mt-1 bg-card/60" />
            </div>
          </div>
        </Panel>
        <Panel title="Notificações">
          <div className="space-y-3">
            {[
              "Alertas críticos por e-mail",
              "Digest semanal",
              "Notificações push (Slack)",
              "SMS para críticos",
            ].map((n, i) => (
              <div key={n} className="flex items-center justify-between rounded-lg border border-border/60 p-3">
                <span className="text-sm">{n}</span>
                <Switch defaultChecked={i < 2} />
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </SimplePage>
  );
}
