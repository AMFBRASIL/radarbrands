import {
  Bot,
  Command,
  FlaskConical,
  Gift,
  Heart,
  Radar,
  ShieldAlert,
  Signal,
  Sparkles,
  Tv,
  Users,
} from "lucide-react";

const features = [
  {
    icon: Heart,
    tag: "Score exclusivo",
    title: "Brand Health Score",
    desc: "Um único índice de 0 a 100 que agrega risco em domínios, ads, redes, dark web e sentimento. Atualizado a cada 15 min.",
  },
  {
    icon: ShieldAlert,
    tag: "Live · SLA 15 min",
    title: "War Room de Crise",
    desc: "Sala de guerra digital com countdown, playbook interativo e ações rápidas (takedown, jurídico, C-level) em um clique.",
  },
  {
    icon: Sparkles,
    tag: "Simulador",
    title: "Quanto sua marca perde?",
    desc: "Descubra em 30s quanto você está perdendo com brand bidding, falsificações e crises — antes mesmo de contratar.",
  },
  {
    icon: FlaskConical,
    tag: "Playground",
    title: "Teste com sua própria marca",
    desc: "Rode uma varredura demo aberta ao público. Veja a IA escaneando ameaças em tempo real, sem cadastro.",
  },
  {
    icon: Gift,
    tag: "Semanal",
    title: "Semana Radar (estilo Wrapped)",
    desc: 'Resumo automático em stories: "Esta semana protegemos R$ X, bloqueamos Y anúncios e Z domínios". Pronto pra compartilhar.',
  },
  {
    icon: Signal,
    tag: "Transparência",
    title: "Status pública",
    desc: "Página aberta com o uptime real de todos os crawlers (Google, Meta, Marketplaces, Dark Web). Zero caixa-preta.",
  },
  {
    icon: Users,
    tag: "Onboarding",
    title: "Time inteiro em 1 minuto",
    desc: "Convide CMO, jurídico e TI ainda no setup, com permissões prontas (Admin, Editor, Viewer).",
  },
  {
    icon: Command,
    tag: "Atalho ⌘K",
    title: "Command Palette global",
    desc: "Estilo Linear/Raycast: aperte ⌘K em qualquer tela e navegue, busque marcas e dispare ações em segundos.",
  },
  {
    icon: Bot,
    tag: "IA contextual",
    title: "Radar AI flutuante",
    desc: 'Pergunte "quantos alertas críticos essa semana?" ou "gere um resumo pro CEO". A IA responde com dados da sua conta.',
  },
  {
    icon: Radar,
    tag: "Tempo real",
    title: "Notificações inteligentes",
    desc: "Sino no topo pisca com ameaças críticas, agrupa por severidade e permite dispensar/tratar sem sair do fluxo.",
  },
  {
    icon: Tv,
    tag: "SOC style",
    title: "Modo TV / Apresentação",
    desc: "Coloque num telão do time: KPIs gigantes, Brand Health Score pulsando e ticker de ameaças bloqueadas ao vivo.",
  },
];

export function ExclusiveFeatures() {
  return (
    <section id="exclusivos" className="scroll-mt-24 border-y border-border/60 bg-gradient-to-b from-background via-primary/5 to-background py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-primary">
            <Sparkles className="h-3 w-3" /> Recursos exclusivos
          </div>
          <h2 className="mt-4 font-display text-3xl font-bold md:text-5xl">
            O que nenhum concorrente entrega
          </h2>
          <p className="mt-4 text-muted-foreground md:text-lg">
            11 diferenciais que transformam brand protection numa experiência de produto
            — não em relatório em PDF.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card/60 p-6 transition hover:-translate-y-1 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10"
              >
                <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary/10 opacity-0 blur-3xl transition-opacity group-hover:opacity-100" />
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[image:var(--gradient-primary)] shadow-lg shadow-primary/20">
                      <Icon className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <span className="rounded-full border border-primary/20 bg-primary/5 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-primary">
                      {f.tag}
                    </span>
                  </div>
                  <h3 className="mt-5 font-display text-lg font-bold">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="/playground"
            className="inline-flex items-center gap-2 rounded-full bg-[image:var(--gradient-primary)] px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition hover:scale-105"
          >
            <FlaskConical className="h-4 w-4" /> Testar no Playground
          </a>
          <a
            href="/status"
            className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card px-6 py-3 text-sm font-semibold transition hover:bg-muted"
          >
            <Signal className="h-4 w-4" /> Ver status pública
          </a>
        </div>
      </div>
    </section>
  );
}
