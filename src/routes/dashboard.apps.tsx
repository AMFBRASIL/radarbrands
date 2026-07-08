import { createFileRoute } from "@tanstack/react-router";
import { SimplePage, Panel } from "@/components/dashboard/simple";
import { Smartphone, Star, Download, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/dashboard/apps")({
  component: AppsPage,
});

const fakes = [
  { name: "Radar | brands Pro", store: "Google Play", dev: "Dev_BR_Studio", installs: "10k+", rating: 2.1, severity: "critical" },
  { name: "Radar Brand Manager", store: "App Store", dev: "Anon LLC", installs: "5k+", rating: 3.4, severity: "high" },
  { name: "BrandShieId AI (I maiúsculo)", store: "APK pirata", dev: "apk-livre.net", installs: "?", rating: 0, severity: "critical" },
  { name: "Radar Brand Lite", store: "Google Play", dev: "Fake Devs", installs: "1k+", rating: 1.8, severity: "medium" },
];

function AppsPage() {
  return (
    <SimplePage
      eyebrow="App Store Protection"
      title="Apps falsos usando sua marca"
      description="Monitoramos Google Play, App Store, sites de APK pirata e lojas alternativas 24/7 em busca de aplicativos que copiam sua identidade."
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {[
          { label: "Apps monitorados", value: "42" },
          { label: "Falsos ativos", value: "12" },
          { label: "Removidos (30d)", value: "18" },
          { label: "Instalações bloqueadas", value: "~48k" },
        ].map((s) => (
          <Panel key={s.label}>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</div>
            <div className="mt-1 font-display text-3xl font-bold text-gradient">{s.value}</div>
          </Panel>
        ))}
      </div>

      <Panel title="Fila de takedown">
        <div className="space-y-3">
          {fakes.map((f, i) => (
            <div key={i} className="glass-strong flex flex-wrap items-center gap-4 rounded-xl p-4 sm:flex-nowrap">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-muted">
                <Smartphone className="h-6 w-6 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="truncate text-sm font-semibold">{f.name}</span>
                  <span
                    className={`rounded px-2 py-0.5 text-[10px] uppercase ${
                      f.severity === "critical"
                        ? "bg-destructive/20 text-destructive"
                        : f.severity === "high"
                          ? "bg-warning/20 text-warning"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {f.severity}
                  </span>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                  <span>{f.store}</span>
                  <span>· {f.dev}</span>
                  <span className="flex items-center gap-1">
                    <Download className="h-3 w-3" /> {f.installs}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="h-3 w-3" /> {f.rating || "-"}
                  </span>
                </div>
              </div>
              <Button size="sm" className="ml-auto shrink-0 bg-[image:var(--gradient-primary)] text-primary-foreground">
                <ShieldAlert className="mr-1 h-3.5 w-3.5" /> Takedown
              </Button>
            </div>
          ))}
        </div>
      </Panel>
    </SimplePage>
  );
}
