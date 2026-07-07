import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Radar,
  Brain,
  Handshake,
  Trophy,
  Repeat,
  ShieldCheck,
  MessageSquare,
  FileBarChart,
  CalendarClock,
  Wallet,
  ArrowRight,
  Sparkles,
  Bot,
  Users,
  Activity,
  Scale,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/landing/site-header";
import { SiteFooter, CtaBand } from "@/components/landing/pricing-footer";

export const Route = createFileRoute("/como-funciona")({
  head: () => ({
    meta: [
      { title: "Como funciona · BrandShield AI — Proteção de marca com IA" },
      {
        name: "description",
        content:
          "Do monitoramento 24/7 à mediação humana: entenda o ciclo BrandShield AI que combina inteligência artificial e especialistas para blindar sua marca em domínios, redes sociais, Ads e marketplaces.",
      },
      { property: "og:title", content: "Como funciona · BrandShield AI" },
      {
        property: "og:description",
        content:
          "Monitoria, Inteligência, Mediação e Sucesso — o método BrandShield AI para proteger sua marca em tempo real.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HowItWorksPage,
});

const differentiators = [
  {
    icon: MessageSquare,
    title: "Atendimento dedicado",
    text: "Canal direto com nossos especialistas via WhatsApp e Slack, com SLA claro por severidade.",
  },
  {
    icon: FileBarChart,
    title: "Relatórios sob medida",
    text: "Dashboards e relatórios customizados para marketing, jurídico e C-level.",
  },
  {
    icon: CalendarClock,
    title: "Acompanhamento estratégico",
    text: "Reuniões mensais de resultado, roadmap de proteção e próximos passos de blindagem.",
  },
  {
    icon: Wallet,
    title: "Custo-benefício comprovado",
    text: "Substitua ferramentas isoladas, escritórios jurídicos e times internos por uma plataforma integrada.",
  },
];

const cycle = [
  {
    icon: Radar,
    title: "Monitoramento",
    text: "Buscamos ameaças à sua marca 24/7 em domínios, SERPs, Ads, redes sociais e marketplaces.",
  },
  {
    icon: Brain,
    title: "Classificação",
    text: "Nossa IA + especialistas validam e separam risco crítico de ruído. Falso positivo é problema nosso.",
  },
  {
    icon: Handshake,
    title: "Atuação",
    text: "Notificação amigável, takedown ou escalada jurídica — com base legal e pressão comercial.",
  },
  {
    icon: Trophy,
    title: "Resultados",
    text: "Métricas claras de ROI, economia de CPC e ameaças neutralizadas — no seu dashboard.",
  },
  {
    icon: Repeat,
    title: "Acompanhamento",
    text: "Rastreamento ativo contra reincidência até o problema desaparecer por completo.",
  },
];

const method = [
  {
    tag: "// 01 · Monitoria",
    icon: Activity,
    title: "Varredura ininterrupta",
    text: "Cada canal, cada SERP, cada lance no seu nome — em tempo real, dia e noite, em todos os países onde sua marca opera.",
    stat: "24/7",
    statLabel: "Em Google, Meta, TikTok, INPI e marketplaces",
  },
  {
    tag: "// 02 · Inteligência",
    icon: Bot,
    title: "Classificação com IA + humano",
    text: "Modelos próprios classificam autor, severidade, impacto financeiro e padrão de reincidência. O Brand AI Assistant sugere ação em segundos.",
    stat: "97%",
    statLabel: "Precisão pré-mediação",
  },
  {
    tag: "// 03 · Mediação",
    icon: Users,
    title: "Especialistas na mesa",
    text: "Não é report via formulário. É conversa técnica, base legal e pressão comercial — feita por um time que faz mediação de brand bidding todos os dias.",
    stat: "+300",
    statLabel: "Mediações ativas por mês",
  },
  {
    tag: "// 04 · Sucesso",
    icon: Trophy,
    title: "CPC cai. Cliques voltam.",
    text: "Concorrente para de dar lance. Fraude sai do ar. Reincidência monitorada — resultado real no dashboard, sem você mexer no orçamento.",
    stat: "-50%",
    statLabel: "CPC médio em 90 dias",
  },
];

const stack = [
  { icon: ShieldCheck, label: "Brand Monitor" },
  { icon: Sparkles, label: "Brand Intelligence AI" },
  { icon: Radar, label: "Domain Watch" },
  { icon: Users, label: "Social Protection" },
  { icon: Activity, label: "Ads Guardian" },
  { icon: Scale, label: "Trademark Center" },
];

function HowItWorksPage() {
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
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-dot" />
                Tecnologia BrandShield
              </div>
              <h1 className="font-display text-4xl font-bold tracking-tight md:text-6xl">
                Uma extensão da sua equipe na{" "}
                <span className="text-gradient">proteção da marca</span>.
              </h1>
              <p className="mt-6 text-lg text-muted-foreground">
                IA de fronteira somada a especialistas humanos para proteger o
                maior ativo da sua empresa: a sua marca. Sem formulários. Sem
                falso positivo. Sem headcount extra.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Button
                  size="lg"
                  asChild
                  className="bg-[image:var(--gradient-primary)] text-primary-foreground hover:opacity-90"
                >
                  <Link to="/">Solicitar auditoria gratuita</Link>
                </Button>
                <Button variant="ghost" size="lg" asChild>
                  <Link to="/dashboard">
                    Ver o dashboard <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Differentiator cards */}
            <div className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {differentiators.map((d) => (
                <div
                  key={d.title}
                  className="glass ring-gradient rounded-2xl p-6"
                >
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground">
                    <d.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-base font-semibold">
                    {d.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">{d.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CYCLE */}
        <section className="relative py-24">
          <div className="mx-auto max-w-7xl px-4">
            <div className="mb-14 text-center">
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary">
                Ciclo de proteção
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold md:text-5xl">
                Como o ciclo BrandShield roda todos os dias
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                Cinco etapas conectadas — da coleta de sinais à extinção da
                ameaça — orquestradas por IA e supervisionadas por
                especialistas.
              </p>
            </div>

            <div className="relative">
              {/* connector line */}
              <div
                className="pointer-events-none absolute left-0 right-0 top-6 hidden h-px lg:block"
                style={{ background: "var(--gradient-border)" }}
              />
              <ol className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-5">
                {cycle.map((step, i) => (
                  <li
                    key={step.title}
                    className="glass-strong ring-gradient relative rounded-2xl p-6"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground glow-primary">
                        <step.icon className="h-6 w-6" />
                      </div>
                      <span className="font-mono text-xs text-muted-foreground">
                        0{i + 1}
                      </span>
                    </div>
                    <h3 className="font-display text-lg font-semibold">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {step.text}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* METHOD */}
        <section className="relative py-24">
          <div
            className="absolute inset-0"
            style={{ background: "var(--gradient-hero)", opacity: 0.4 }}
          />
          <div className="relative mx-auto max-w-7xl px-4">
            <div className="mb-14 text-center">
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary">
                O método BrandShield
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold md:text-5xl">
                Monitoria. Inteligência.{" "}
                <span className="text-gradient">Mediação</span>. Sucesso.
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                Quatro camadas que ninguém mais opera junto. O passo central —
                a mediação — é trabalho de gente especialista, não de
                formulário de takedown.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {method.map((m) => (
                <div
                  key={m.title}
                  className="glass-strong ring-gradient flex flex-col justify-between rounded-3xl p-8"
                >
                  <div>
                    <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
                      {m.tag}
                    </p>
                    <div className="mt-5 flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground">
                        <m.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-display text-2xl font-semibold">
                          {m.title}
                        </h3>
                        <p className="mt-2 text-muted-foreground">{m.text}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex items-end justify-between border-t border-border/60 pt-6">
                    <span className="font-display text-4xl font-bold text-gradient">
                      {m.stat}
                    </span>
                    <span className="max-w-[55%] text-right text-xs text-muted-foreground">
                      {m.statLabel}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* STACK */}
        <section className="py-24">
          <div className="mx-auto max-w-7xl px-4">
            <div className="glass ring-gradient rounded-3xl p-10">
              <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2">
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary">
                    Uma plataforma. Todos os canais.
                  </p>
                  <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">
                    Seis módulos integrados operando 24/7 pela sua marca
                  </h2>
                  <p className="mt-4 text-muted-foreground">
                    Deixamos de operar em silos. Domínio, SERP, Ads, redes,
                    marketplaces e propriedade intelectual — tudo dentro do
                    mesmo dashboard, com uma única fila de ação.
                  </p>
                  <div className="mt-6">
                    <Button asChild variant="ghost">
                      <Link to="/dashboard">
                        Explorar o produto{" "}
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {stack.map((s) => (
                    <div
                      key={s.label}
                      className="glass-strong flex items-center gap-3 rounded-xl p-4"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-primary">
                        <s.icon className="h-5 w-5" />
                      </div>
                      <span className="text-sm font-medium">{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <CtaBand />
      </main>

      <SiteFooter />
    </div>
  );
}
