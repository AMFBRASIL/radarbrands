import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, AlertTriangle, XCircle, Activity, Shield } from "lucide-react";

export const Route = createFileRoute("/status")({
  head: () => ({
    meta: [
      { title: "Status · Radar | brands" },
      { name: "description", content: "Saúde em tempo real dos crawlers, integrações e infraestrutura do Radar | brands." },
      { property: "og:title", content: "Status Radar | brands" },
      { property: "og:description", content: "Uptime e saúde de todos os canais monitorados." },
    ],
  }),
  component: StatusPage,
});

type Health = "operational" | "degraded" | "down";

const overall: Health = "operational";

const groups: { name: string; items: { name: string; status: Health; uptime: number; latency: number }[] }[] = [
  {
    name: "Canais monitorados",
    items: [
      { name: "Google Ads Crawler", status: "operational", uptime: 99.98, latency: 240 },
      { name: "Meta Ads Crawler", status: "operational", uptime: 99.94, latency: 310 },
      { name: "TikTok Ads Crawler", status: "degraded", uptime: 98.72, latency: 890 },
      { name: "Instagram Scraper", status: "operational", uptime: 99.91, latency: 420 },
      { name: "TikTok Scraper", status: "operational", uptime: 99.87, latency: 480 },
      { name: "Mercado Livre", status: "operational", uptime: 99.99, latency: 180 },
      { name: "Shopee BR", status: "operational", uptime: 99.86, latency: 260 },
      { name: "Amazon BR", status: "operational", uptime: 99.92, latency: 200 },
      { name: "Dark Web Feeds", status: "operational", uptime: 99.7, latency: 1200 },
      { name: "Registro.br + Whois", status: "operational", uptime: 100, latency: 90 },
    ],
  },
  {
    name: "Plataforma",
    items: [
      { name: "API Pública", status: "operational", uptime: 99.99, latency: 85 },
      { name: "Dashboard Web", status: "operational", uptime: 100, latency: 40 },
      { name: "Alertas em tempo real", status: "operational", uptime: 99.96, latency: 60 },
      { name: "AI Autopilot", status: "operational", uptime: 99.93, latency: 320 },
    ],
  },
];

const incidents = [
  {
    date: "07 jul 2026 · 03:12",
    title: "TikTok Ads Crawler: latência elevada",
    status: "monitoring" as const,
    text: "TikTok aplicou novo rate-limit. Aumentamos pool de proxies; monitorando.",
  },
  {
    date: "02 jul 2026 · 14:40",
    title: "Instagram Scraper: intermitência (resolvido)",
    status: "resolved" as const,
    text: "Rotina de coleta caiu por 22min após update do endpoint. Substituído por fallback.",
  },
];

function badge(s: Health) {
  if (s === "operational") return { label: "Operacional", cls: "bg-emerald-500/15 text-emerald-500", Icon: CheckCircle2 };
  if (s === "degraded") return { label: "Degradado", cls: "bg-amber-500/15 text-amber-500", Icon: AlertTriangle };
  return { label: "Fora do ar", cls: "bg-destructive/15 text-destructive", Icon: XCircle };
}

function StatusPage() {
  const ob = badge(overall);
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/60 bg-background/70 backdrop-blur">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[image:var(--gradient-primary)]">
              <Shield className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <span className="font-display text-sm font-bold">Radar | brands</span>
            <span className="text-xs text-muted-foreground">/ status</span>
          </Link>
          <a href="https://twitter.com" className="text-xs text-primary hover:underline">Assinar atualizações →</a>
        </div>
      </header>

      <main className="container mx-auto max-w-5xl px-4 py-12">
        <div className={`glass-strong flex items-center gap-4 rounded-3xl p-6 ${overall === "operational" ? "ring-1 ring-emerald-500/30" : ""}`}>
          <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${ob.cls}`}>
            <ob.Icon className="h-7 w-7" />
          </div>
          <div className="flex-1">
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Status geral</div>
            <div className="font-display text-2xl font-bold">
              {overall === "operational"
                ? "Todos os sistemas operacionais"
                : overall === "degraded"
                  ? "Alguns sistemas com degradação"
                  : "Incidente crítico em curso"}
            </div>
            <div className="text-sm text-muted-foreground">Atualizado agora · uptime médio de 99,94% nos últimos 90d</div>
          </div>
          <div className="hidden text-right md:block">
            <div className="font-display text-3xl font-bold text-primary">99.94%</div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">90 dias</div>
          </div>
        </div>

        {/* Groups */}
        <div className="mt-8 space-y-6">
          {groups.map((g) => (
            <section key={g.name} className="glass rounded-2xl p-6">
              <h3 className="font-display text-lg font-semibold">{g.name}</h3>
              <ul className="mt-4 divide-y divide-border/60">
                {g.items.map((it) => {
                  const b = badge(it.status);
                  return (
                    <li key={it.name} className="flex items-center gap-4 py-3">
                      <div className="flex-1">
                        <div className="text-sm font-medium">{it.name}</div>
                        <div className="mt-2 flex gap-0.5">
                          {Array.from({ length: 60 }).map((_, i) => {
                            const bad = it.status === "degraded" && i > 50;
                            return (
                              <span
                                key={i}
                                className={`h-6 flex-1 rounded-sm ${bad ? "bg-amber-500/70" : "bg-emerald-500/70"}`}
                              />
                            );
                          })}
                        </div>
                      </div>
                      <div className="hidden w-24 text-right text-xs text-muted-foreground md:block">
                        <div className="font-mono">{it.uptime}%</div>
                        <div>{it.latency}ms</div>
                      </div>
                      <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest ${b.cls}`}>
                        {b.label}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>

        <section className="mt-8 glass rounded-2xl p-6">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />
            <h3 className="font-display text-lg font-semibold">Histórico de incidentes</h3>
          </div>
          <ul className="mt-4 space-y-3">
            {incidents.map((i) => (
              <li key={i.title} className="rounded-xl border border-border/60 bg-card/40 p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">{i.title}</div>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest ${
                    i.status === "resolved" ? "bg-emerald-500/15 text-emerald-500" : "bg-amber-500/15 text-amber-500"
                  }`}>
                    {i.status === "resolved" ? "Resolvido" : "Monitorando"}
                  </span>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">{i.date}</div>
                <p className="mt-2 text-sm text-muted-foreground">{i.text}</p>
              </li>
            ))}
          </ul>
        </section>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          Dados agregados e anonimizados. Nenhuma informação de clientes é exposta nesta página.
        </p>
      </main>
    </div>
  );
}
