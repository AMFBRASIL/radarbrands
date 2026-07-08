import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Check,
  X,
  Sparkles,
  Network,
  Radar,
  FileAudio,
  Eye,
  Smartphone,
  Zap,
  Brain,
  Workflow,
  Wallet,
  Crown,
  ArrowRight,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/landing/site-header";
import { SiteFooter, CtaBand } from "@/components/landing/pricing-footer";

export const Route = createFileRoute("/diferencial")({
  head: () => ({
    meta: [
      { title: "Diferencial · Radar | brands vs. concorrentes" },
      {
        name: "description",
        content:
          "Comparativo entre Radar | brands e as demais plataformas de proteção de marca: Threat Graph, IA preditiva, deepfake, dark web, playbooks e ROI em tempo real.",
      },
      { property: "og:title", content: "Radar | brands vs. concorrentes" },
      {
        property: "og:description",
        content:
          "Veja por que a Radar | brands vai muito além do brand bidding — 12 diferenciais que ninguém mais entrega.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DiferencialPage,
});

const differentials = [
  {
    icon: Network,
    title: "Threat Intelligence Graph",
    desc: "Grafo visual conectando fraudadores, domínios, perfis fakes e CNPJs. Você vê o grupo por trás — não só a ocorrência.",
  },
  {
    icon: Radar,
    title: "Predictive Risk Score",
    desc: "IA prevê onde a próxima fraude vai aparecer com base em histórico, sazonalidade e eventos (Black Friday, lançamentos).",
  },
  {
    icon: Sparkles,
    title: "AI Autopilot",
    desc: "Modo autônomo: a IA executa takedowns de baixa complexidade (score ≥ 95%) e só escala casos ambíguos para humanos.",
  },
  {
    icon: FileAudio,
    title: "Deepfake & Voice Clone Detector",
    desc: "Monitora vídeos e áudios usando o rosto ou voz dos seus executivos e embaixadores em toda a web.",
  },
  {
    icon: Eye,
    title: "Dark Web Monitor",
    desc: "Vazamento de credenciais, dados de clientes e menções em fóruns Tor, Telegram e Discord criminosos.",
  },
  {
    icon: Smartphone,
    title: "App Store Protection",
    desc: "Apps falsos na Google Play, App Store e APKs pirata — canal ignorado por 100% dos concorrentes brasileiros.",
  },
  {
    icon: Zap,
    title: "Crisis Radar",
    desc: "Detecção precoce de crise com correlação de sentimento, volume e portais em tempo real — antes de virar manchete.",
  },
  {
    icon: Brain,
    title: "Competitor Intelligence",
    desc: "Não só bloqueamos o brand bidding: mostramos quais criativos, ofertas e LPs seus concorrentes testam contra você.",
  },
  {
    icon: Workflow,
    title: "Playbooks configuráveis",
    desc: "Workflows estilo Zapier: 'se X, faça Y+Z+W'. Sem código, integrado a Slack, Teams, Jira e SIEM.",
  },
  {
    icon: Wallet,
    title: "ROI Calculator ao vivo",
    desc: "Cada caso resolvido vira R$ economizados ou receita protegida. O CFO adora, o C-level entende na hora.",
  },
  {
    icon: Crown,
    title: "Executive Briefing por IA",
    desc: "Resumo semanal em áudio + PDF para CMO/CEO. Gerado automaticamente pela IA toda segunda às 8h.",
  },
  {
    icon: Trophy,
    title: "White-label para agências",
    desc: "Sua agência revende o Radar | brands com marca própria. Nenhum concorrente oferece esse modelo B2B2B.",
  },
];

type Cell = boolean | "partial";
const compareRows: { area: string; us: Cell; them: Cell; note?: string }[] = [
  { area: "Monitoramento 24/7 (Ads + domínios)", us: true, them: true },
  { area: "Mediação humana de brand bidding", us: true, them: true },
  { area: "Base legal + dossiê probatório", us: true, them: true },
  { area: "Threat Intelligence Graph", us: true, them: false, note: "Ninguém mais oferece" },
  { area: "IA Preditiva (Risk Score)", us: true, them: false },
  { area: "AI Autopilot autônomo", us: true, them: "partial", note: "Concorrentes fazem só automação básica" },
  { area: "Deepfake & Voice Clone Detector", us: true, them: false },
  { area: "Dark Web Monitor", us: true, them: false },
  { area: "App Store Protection (Play/App Store)", us: true, them: false },
  { area: "Crisis Radar em tempo real", us: true, them: "partial" },
  { area: "Competitor Intelligence (criativos + LPs)", us: true, them: false },
  { area: "Marketplace Monitoring (ML/Amazon)", us: true, them: true },
  { area: "Redes sociais (perfis fake + UGC)", us: true, them: "partial" },
  { area: "Playbooks configuráveis (no-code)", us: true, them: false },
  { area: "Integração Slack / Teams / Jira nativa", us: true, them: "partial" },
  { area: "ROI Calculator em tempo real", us: true, them: false },
  { area: "Executive Briefing por IA (áudio+PDF)", us: true, them: false },
  { area: "White-label para agências", us: true, them: false },
  { area: "API pública + Webhooks", us: true, them: "partial" },
  { area: "LGPD + SOC 2 Type II", us: true, them: true },
];

function CellMark({ v }: { v: Cell }) {
  if (v === true)
    return (
      <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
        <Check className="h-5 w-5" strokeWidth={3} />
      </div>
    );
  if (v === "partial")
    return (
      <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-warning/15 text-warning">
        <span className="font-mono text-xs">±</span>
      </div>
    );
  return (
    <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-destructive/15 text-destructive">
      <X className="h-5 w-5" strokeWidth={3} />
    </div>
  );
}

function DiferencialPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main>
        {/* HERO */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 grid-bg opacity-60" />
          <div
            className="absolute inset-0"
            style={{ background: "var(--gradient-hero)" }}
          />
          <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-20 md:pt-28">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/40 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
                <Trophy className="h-3.5 w-3.5 text-primary" />
                Comparativo · Radar | brands vs. concorrentes
              </div>
              <h1 className="font-display text-4xl font-bold tracking-tight md:text-6xl">
                Por que a Radar | brands vai muito{" "}
                <span className="text-gradient">além do brand bidding</span>.
              </h1>
              <p className="mt-6 text-lg text-muted-foreground">
                As demais plataformas do mercado protegem 1 ou 2 canais.
                A Radar | brands entrega 12 diferenciais que ninguém mais opera —
                de Threat Graph a Deepfake, de IA preditiva a Executive
                Briefing por IA.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Button
                  size="lg"
                  asChild
                  className="bg-[image:var(--gradient-primary)] text-primary-foreground hover:opacity-90"
                >
                  <Link to="/dashboard">Ver dashboard ao vivo</Link>
                </Button>
                <Button variant="ghost" size="lg" asChild>
                  <Link to="/como-funciona">
                    Como funciona <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* 12 DIFERENCIAIS */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4">
            <div className="mb-12 text-center">
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary">
                Nossos 12 diferenciais
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold md:text-5xl">
                Módulos que <span className="text-gradient">ninguém mais</span> entrega
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {differentials.map((d) => (
                <div key={d.title} className="glass ring-gradient rounded-2xl p-6">
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground">
                    <d.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-base font-semibold">
                    {d.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">{d.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TABELA COMPARATIVA */}
        <section className="relative py-20">
          <div
            className="absolute inset-0"
            style={{ background: "var(--gradient-hero)", opacity: 0.4 }}
          />
          <div className="relative mx-auto max-w-6xl px-4">
            <div className="mb-10 text-center">
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary">
                Comparativo cabeça a cabeça
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold md:text-5xl">
                Radar | brands vs. o resto do mercado
              </h2>
            </div>

            <div className="glass-strong ring-gradient overflow-hidden rounded-3xl">
              <div className="grid grid-cols-[1fr_120px_140px] items-center gap-4 border-b border-border/60 p-4 md:grid-cols-[1fr_160px_160px] md:p-6">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">
                  Recurso
                </div>
                <div className="text-center">
                  <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg bg-[image:var(--gradient-primary)] glow-primary">
                    <Sparkles className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div className="mt-1 font-display text-sm font-bold">Radar | brands</div>
                </div>
                <div className="text-center">
                  <div className="mx-auto h-9 w-9 rounded-lg bg-muted" />
                  <div className="mt-1 text-sm text-muted-foreground">Concorrente médio</div>
                </div>
              </div>

              <ul>
                {compareRows.map((r, i) => (
                  <li
                    key={r.area}
                    className={`grid grid-cols-[1fr_120px_140px] items-center gap-4 p-4 md:grid-cols-[1fr_160px_160px] md:p-5 ${
                      i % 2 === 0 ? "bg-background/20" : ""
                    }`}
                  >
                    <div>
                      <div className="text-sm font-medium">{r.area}</div>
                      {r.note && (
                        <div className="mt-0.5 text-[10px] uppercase text-primary">{r.note}</div>
                      )}
                    </div>
                    <CellMark v={r.us} />
                    <CellMark v={r.them} />
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
              <span className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded bg-primary/15 text-primary">
                  <Check className="h-3 w-3" />
                </span>
                Disponível
              </span>
              <span className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded bg-warning/15 text-warning">
                  <span className="font-mono text-[10px]">±</span>
                </span>
                Parcial / limitado
              </span>
              <span className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded bg-destructive/15 text-destructive">
                  <X className="h-3 w-3" />
                </span>
                Não oferecido
              </span>
            </div>
          </div>
        </section>

        <CtaBand />
      </main>

      <SiteFooter />
    </div>
  );
}
