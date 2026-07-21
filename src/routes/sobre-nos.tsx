import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Shield,
  Rocket,
  Target,
  Compass,
  Sparkles,
  Users,
  Globe2,
  TrendingUp,
  Award,
  Heart,
  Zap,
  Lock,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/landing/site-header";
import { SiteFooter, CtaBand } from "@/components/landing/pricing-footer";
import { buildPageHead } from "@/lib/seo";

export const Route = createFileRoute("/sobre-nos")({
  head: () =>
    buildPageHead({
      title: "Sobre nós · Radar Brands — Proteção de marcas com IA",
      description:
        "Somos a Radar Brands: engenheiros, cientistas de dados e especialistas em PI construindo monitoramento e proteção de marca com IA na América Latina.",
      path: "/sobre-nos",
    }),
  component: SobreNosPage,
});

const stats = [
  { value: "+1.200", label: "Marcas protegidas" },
  { value: "+45M", label: "Sinais analisados / mês" },
  { value: "97%", label: "Precisão da IA" },
  { value: "18", label: "Países monitorados" },
];

const values = [
  {
    icon: Shield,
    title: "Proteção sem ruído",
    text: "Alertar por alertar é fácil. Nós entregamos o que importa — falso positivo é problema nosso.",
  },
  {
    icon: Zap,
    title: "Velocidade obsessiva",
    text: "Cada minuto em que uma fraude fica no ar custa reputação e receita. Operamos em tempo real.",
  },
  {
    icon: Lock,
    title: "Segurança por padrão",
    text: "Dados de marca são sensíveis. SOC 2, LGPD e criptografia ponta-a-ponta não são opcionais.",
  },
  {
    icon: Heart,
    title: "Cliente como sócio",
    text: "Reuniões mensais, roadmap compartilhado e WhatsApp direto. Você fala com quem opera.",
  },
];

const timeline = [
  {
    year: "2022",
    title: "A ideia",
    text: "Três fundadores viram uma marca perder R$ 4M em CPC por brand bidding em 90 dias — e começaram a construir a plataforma.",
  },
  {
    year: "2023",
    title: "Primeiros clientes",
    text: "Lançamento do MVP com monitoramento de domínios e Ads. Primeiras 50 marcas embarcadas.",
  },
  {
    year: "2024",
    title: "Brand AI",
    text: "Nossos modelos próprios entram em produção, elevando a precisão para 97% e reduzindo o tempo de reação em 8x.",
  },
  {
    year: "2025",
    title: "Escala regional",
    text: "Expansão para 18 países e integração com marketplaces, redes sociais e o INPI.",
  },
  {
    year: "2026",
    title: "Plataforma completa",
    text: "Brand Monitor, Domain Watch, Social Protection, Ads Guardian, Marketplace e Trademark Center — tudo em uma única fila de ação.",
  },
];

const leadership = [
  {
    name: "Renata Aoki",
    role: "CEO & Cofundadora",
    bio: "Ex-Head de Marketing em fintechs. Cansou de ver orçamento sumir em brand bidding.",
  },
  {
    name: "Diego Farias",
    role: "CTO & Cofundador",
    bio: "Ex-engenheiro de IA em big tech. Lidera os modelos de detecção da Radar | brands.",
  },
  {
    name: "Marina Prates",
    role: "Head Jurídico",
    bio: "Advogada especialista em propriedade industrial e concorrência desleal digital.",
  },
  {
    name: "Lucas Andrade",
    role: "Head de Operações",
    bio: "Coordena o time de mediação — mais de 300 casos abertos por mês.",
  },
];

function SobreNosPage() {
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
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                Sobre a Radar | brands
              </div>
              <h1 className="font-display text-4xl font-bold tracking-tight md:text-6xl">
                Construindo a plataforma mais{" "}
                <span className="text-gradient">avançada</span> de proteção de
                marcas da América Latina.
              </h1>
              <p className="mt-6 text-lg text-muted-foreground">
                Somos engenheiros, cientistas de dados e especialistas em
                propriedade intelectual reunidos por uma única obsessão:
                blindar o maior ativo da sua empresa contra fraude, cópia e
                concorrência desleal.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Button
                  size="lg"
                  asChild
                  className="bg-[image:var(--gradient-primary)] text-primary-foreground hover:opacity-90"
                >
                  <Link to="/">Falar com o time</Link>
                </Button>
                <Button variant="ghost" size="lg" asChild>
                  <Link to="/como-funciona">
                    Como funciona <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-4">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="glass ring-gradient rounded-2xl p-6 text-center"
                >
                  <div className="font-display text-3xl font-bold text-gradient md:text-4xl">
                    {s.value}
                  </div>
                  <div className="mt-2 text-xs uppercase tracking-wider text-muted-foreground">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* MISSÃO / VISÃO */}
        <section className="py-20">
          <div className="mx-auto max-w-6xl px-4">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {[
                {
                  icon: Target,
                  tag: "Missão",
                  title: "Devolver o controle da marca para quem a construiu.",
                  text: "Cada empresa merece operar sem ver seu nome sequestrado por fraudadores, concorrentes ou bots.",
                },
                {
                  icon: Compass,
                  tag: "Visão",
                  title: "Ser a infraestrutura padrão de proteção de marca.",
                  text: "Como um firewall — invisível quando funciona, indispensável quando falta.",
                },
                {
                  icon: Rocket,
                  tag: "Método",
                  title: "IA de fronteira somada a especialistas humanos.",
                  text: "Automação nunca substitui julgamento em casos críticos. Nós fazemos os dois trabalharem juntos.",
                },
              ].map((b) => (
                <div
                  key={b.tag}
                  className="glass-strong ring-gradient rounded-3xl p-8"
                >
                  <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground">
                    <b.icon className="h-5 w-5" />
                  </div>
                  <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary">
                    {b.tag}
                  </p>
                  <h3 className="mt-2 font-display text-xl font-semibold">
                    {b.title}
                  </h3>
                  <p className="mt-3 text-sm text-muted-foreground">
                    {b.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* VALORES */}
        <section className="relative py-24">
          <div
            className="absolute inset-0"
            style={{ background: "var(--gradient-hero)", opacity: 0.4 }}
          />
          <div className="relative mx-auto max-w-7xl px-4">
            <div className="mb-12 text-center">
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary">
                Nossos valores
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold md:text-5xl">
                O que{" "}
                <span className="text-gradient">nos guia</span> todos os dias
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {values.map((v) => (
                <div
                  key={v.title}
                  className="glass ring-gradient rounded-2xl p-6"
                >
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground">
                    <v.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-base font-semibold">
                    {v.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">{v.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TIMELINE */}
        <section className="py-24">
          <div className="mx-auto max-w-5xl px-4">
            <div className="mb-12 text-center">
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary">
                Nossa história
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold md:text-5xl">
                De uma dor real a uma{" "}
                <span className="text-gradient">plataforma completa</span>
              </h2>
            </div>

            <ol className="relative border-l border-border/60 pl-6 md:pl-8">
              {timeline.map((t) => (
                <li key={t.year} className="mb-10 last:mb-0">
                  <span className="absolute -left-2 flex h-4 w-4 items-center justify-center rounded-full bg-[image:var(--gradient-primary)] ring-4 ring-background" />
                  <div className="glass ring-gradient rounded-2xl p-6">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs text-primary">
                        {t.year}
                      </span>
                      <h3 className="font-display text-lg font-semibold">
                        {t.title}
                      </h3>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {t.text}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* LIDERANÇA */}
        <section className="py-24">
          <div className="mx-auto max-w-7xl px-4">
            <div className="mb-12 text-center">
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary">
                Liderança
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold md:text-5xl">
                Time que{" "}
                <span className="text-gradient">opera</span>, não só supervisiona
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {leadership.map((p) => (
                <div
                  key={p.name}
                  className="glass-strong ring-gradient rounded-2xl p-6"
                >
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[image:var(--gradient-primary)] font-display text-lg font-bold text-primary-foreground">
                    {p.name
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")}
                  </div>
                  <h3 className="font-display text-base font-semibold">
                    {p.name}
                  </h3>
                  <p className="text-xs uppercase tracking-wider text-primary">
                    {p.role}
                  </p>
                  <p className="mt-3 text-sm text-muted-foreground">{p.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SELOS */}
        <section className="pb-24">
          <div className="mx-auto max-w-6xl px-4">
            <div className="glass ring-gradient rounded-3xl p-10">
              <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                {[
                  { icon: Award, label: "SOC 2 Type II" },
                  { icon: Lock, label: "LGPD Compliant" },
                  { icon: Globe2, label: "18 países" },
                  { icon: TrendingUp, label: "Backed by top VCs" },
                ].map((b) => (
                  <div
                    key={b.label}
                    className="flex items-center gap-3 text-sm"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-primary">
                      <b.icon className="h-5 w-5" />
                    </div>
                    <span className="font-medium">{b.label}</span>
                  </div>
                ))}
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
