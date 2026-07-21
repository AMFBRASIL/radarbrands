import {
  AlertOctagon,
  ArrowRight,
  Gavel,
  Scale,
  Search,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { HOME_FAQ } from "@/lib/seo";

/* ---------------- Seção: Por que agora (IA + brand search) ---------------- */
export function WhyNow() {
  const bars = [
    { year: "2023", pct: 38, label: "antes da IA" },
    { year: "2024", pct: 54 },
    { year: "2025", pct: 72 },
    { year: "2026", pct: 86, label: "era da IA", accent: true },
  ];
  return (
    <section className="scroll-mt-24 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-primary">
              <Sparkles className="h-3 w-3" /> Por que agora
            </div>
            <h2 className="mt-4 font-display text-3xl font-bold md:text-5xl">
              Seus termos de marca
              <span className="text-gradient"> nunca pesaram tanto na conta.</span>
            </h2>
            <p className="mt-5 text-muted-foreground md:text-lg">
              Topo de funil migrou pra IA. A pessoa pergunta, compara e lê com ChatGPT,
              Perplexity e Gemini — mas, <strong className="text-foreground">na hora
              de comprar, ela volta pro Google e digita o nome da sua marca</strong>.
              Cada busca do tipo "marca" passa a representar uma fatia maior da campanha.
            </p>
            <p className="mt-4 text-muted-foreground md:text-lg">
              E cada lance de concorrente no seu nome dói o dobro do que doía dois anos atrás,
              porque o leilão fica concentrado num conjunto cada vez menor de termos com cada
              vez mais intenção de compra.
            </p>
          </div>

          <div className="rounded-3xl glass-strong p-6 ring-gradient md:p-8">
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Peso do brand search no tráfego pago
            </div>
            <div className="mt-1 text-sm text-muted-foreground">
              índice médio · clientes Radar | brands
            </div>
            <div className="mt-8 space-y-5">
              {bars.map((b) => (
                <div key={b.year}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-mono text-muted-foreground">{b.year}</span>
                    <span
                      className={`font-display text-2xl font-bold ${b.accent ? "text-gradient" : "text-foreground"}`}
                    >
                      {b.pct}%
                    </span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-background/60">
                    <div
                      className={`h-full rounded-full ${b.accent ? "bg-[image:var(--gradient-primary)]" : "bg-primary/40"}`}
                      style={{ width: `${b.pct}%` }}
                    />
                  </div>
                  {b.label && (
                    <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      {b.label}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Seção: O ataque silencioso ---------------- */
export function SilentAttack() {
  const enemies = [
    {
      n: "01",
      icon: Target,
      title: "Concorrentes desleais desviando seus melhores clientes.",
      desc: "Compram o nome da sua marca em leilão de palavras-chave. Aparecem em cima do seu anúncio oficial — você paga mais caro pelo próprio tráfego e perde a venda no clique.",
      tag: "Mais comum em B2B e fintechs",
      metric: "↓ 50% CPC",
    },
    {
      n: "02",
      icon: Users,
      title: "Afiliados oportunistas burlando sua política comercial.",
      desc: "Pegam carona no seu nome para faturar comissão sem trazer cliente novo. Sequestram conversões orgânicas e inflam seu CAC sem você perceber.",
      tag: "Marcas com programa de afiliados",
      metric: "↑ 38% CAC efetivo",
    },
    {
      n: "03",
      icon: AlertOctagon,
      title: "Revendedores não autorizados controlando seus preços.",
      desc: "Anunciam no Google Shopping levando para listings paralelos — quebram MAP, canibalizam o canal oficial e somem com a margem.",
      tag: "Varejo, beleza, eletrônicos",
      metric: "↓ margem em 4 cliques",
    },
  ];
  return (
    <section className="scroll-mt-24 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-primary">
            <Search className="h-3 w-3" /> O ataque silencioso
          </div>
          <h2 className="mt-4 font-display text-3xl font-bold md:text-5xl">
            Reconheça o inimigo
            <span className="text-gradient"> no leilão da sua marca.</span>
          </h2>
          <p className="mt-4 text-muted-foreground md:text-lg">
            Três tipos de anunciante dando lance no seu nome agora mesmo — cada um com um
            motivo diferente para estar lá, e o mesmo efeito no seu CPC.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {enemies.map((e) => {
            const Icon = e.icon;
            return (
              <div
                key={e.n}
                className="group relative overflow-hidden rounded-3xl glass p-6 ring-gradient transition-all hover:-translate-y-1 hover:glow-primary"
              >
                <div className="flex items-start justify-between">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    // {e.n}
                  </div>
                  <div className="rounded-xl bg-primary/10 p-2">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <h3 className="mt-6 font-display text-xl font-semibold leading-snug">
                  {e.title}
                </h3>
                <p className="mt-3 text-sm text-muted-foreground">{e.desc}</p>
                <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-4 text-xs">
                  <span className="text-muted-foreground">{e.tag}</span>
                  <span className="font-mono font-medium text-destructive">{e.metric}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Seção: Base legal ---------------- */
export function LegalBase() {
  const steps = [
    {
      n: "01",
      title: "Mediação direta",
      desc: "Conversa técnica com o concorrente, evidência empacotada e argumentação que mostra que continuar custa mais do que parar.",
      badge: "Fecha 80% dos casos",
    },
    {
      n: "02",
      title: "Notificação extrajudicial",
      desc: "Carta com base legal anexa, endereçada ao jurídico do concorrente. Muda o tom da conversa em 24h.",
      badge: "Fecha 15% adicionais",
    },
    {
      n: "03",
      title: "Ação judicial",
      desc: "Jurídico do cliente ou escritório parceiro entra com a ação. Dossiê probatório já está pronto — sem trabalho duplicado.",
      badge: "Dossiê pronto",
    },
  ];
  return (
    <section className="scroll-mt-24 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:items-start">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-primary">
              <Scale className="h-3 w-3" /> Concorrência desleal · base legal
            </div>
            <h2 className="mt-4 font-display text-3xl font-bold md:text-5xl">
              Brand bidding não autorizado é
              <span className="text-gradient"> crime de concorrência desleal.</span>
            </h2>
            <p className="mt-5 text-muted-foreground md:text-lg">
              A maioria das mediações fecha em acordo. Para os que insistem, a Radar | brands
              já chega na mesa com o dossiê pronto: prints datados, logs de leilão, evidência
              de reincidência. A jurisprudência brasileira{" "}
              <span className="font-mono text-primary">(LPI · art. 195)</span> reconhece a
              prática como ilícita.
            </p>
            <p className="mt-4 text-muted-foreground md:text-lg">
              Se o caso precisa escalar, o jurídico interno do seu time ou a rede de
              escritórios parceiros entra com a ação — com o material probatório já formado
              pela nossa operação.
            </p>
            <Button
              asChild
              className="mt-8 bg-[image:var(--gradient-primary)] text-primary-foreground hover:opacity-90"
            >
              <a href="#contato">
                Conhecer o dossiê <ArrowRight className="ml-1 h-4 w-4" />
              </a>
            </Button>
          </div>

          <ol className="relative space-y-4 border-l border-border/60 pl-6">
            {steps.map((s) => (
              <li key={s.n} className="relative">
                <span className="absolute -left-[34px] flex h-6 w-6 items-center justify-center rounded-full bg-[image:var(--gradient-primary)] font-mono text-[10px] font-bold text-primary-foreground">
                  {s.n}
                </span>
                <div className="rounded-2xl glass p-5 ring-gradient">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="flex items-center gap-2 font-display text-lg font-semibold">
                      <Gavel className="h-4 w-4 text-primary" />
                      {s.title}
                    </h3>
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-widest text-primary">
                      {s.badge}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Seção: Mediação vira receita ---------------- */
export function MediationRevenue() {
  const stats = [
    { k: "50%", v: "Redução média de CPC no brand" },
    { k: "+300", v: "Marcas brasileiras protegidas" },
    { k: "97%", v: "Taxa de sucesso em mediações" },
    { k: "24/7", v: "Operação contínua do começo ao fim" },
  ];
  return (
    <section
      className="relative scroll-mt-24 overflow-hidden py-20 md:py-28"
      style={{ background: "var(--gradient-hero)" }}
    >
      <div className="absolute inset-0 grid-bg opacity-40" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-4">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-primary">
            <TrendingUp className="h-3 w-3" /> O que muda no seu dashboard
          </div>
          <h2 className="mt-4 font-display text-3xl font-bold md:text-5xl">
            Cada mediação é
            <span className="text-gradient"> receita que volta pro seu funil.</span>
          </h2>
          <p className="mt-4 text-muted-foreground md:text-lg">
            Marcas que blindam o leilão do próprio nome com a Radar | brands pagam menos por
            clique de marca, recuperam tráfego perdido e{" "}
            <strong className="text-foreground">
              melhoram o ROAS sem mexer em uma linha do orçamento de mídia
            </strong>
            .
          </p>
          <Button
            asChild
            size="lg"
            className="mt-8 bg-[image:var(--gradient-primary)] text-primary-foreground hover:opacity-90"
          >
            <a href="#contato">
              Reduza seu CPC agora <Zap className="ml-1 h-4 w-4" />
            </a>
          </Button>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.v}
              className="rounded-2xl glass-strong p-6 text-center ring-gradient"
            >
              <div className="font-display text-4xl font-bold text-gradient">{s.k}</div>
              <div className="mt-2 text-xs text-muted-foreground">{s.v}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Seção: Ferramenta vs Especialista ---------------- */
export function ToolVsSpecialist() {
  const tool = [
    "Identifica brand bidding por dashboard.",
    "Envia alerta por e-mail e te avisa que tem algo errado.",
    "Deixa você abrir tickets na plataforma, sem suporte humano.",
    "Sem mediação direta com o concorrente.",
    "Sem dossiê probatório para escalada jurídica.",
    "Reincidência é problema seu de novo no próximo mês.",
  ];
  const us = [
    "Monitora o Google 24/7 — busca e Shopping — com IA + classificação humana.",
    "Mediação direta conduzida por time especialista.",
    "Notificação extrajudicial e base legal embutidas.",
    "Dossiê probatório formado em paralelo, pronto para ação judicial.",
    "Rede de escritórios parceiros se o caso escalar.",
    "Reincidência monitorada e remediada automaticamente.",
  ];
  return (
    <section className="scroll-mt-24 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-primary">
            Por que especialista
          </div>
          <h2 className="mt-4 font-display text-3xl font-bold md:text-5xl">
            Ferramenta vê o problema.
            <span className="text-gradient"> Radar | brands resolve.</span>
          </h2>
          <p className="mt-4 text-muted-foreground md:text-lg">
            A diferença não é monitorar — é o que acontece depois. Brand bidding sai via
            mediação ativa, não via formulário de report.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl glass p-8 ring-gradient">
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              // Ferramenta de monitoramento
            </div>
            <h3 className="mt-3 font-display text-xl font-semibold text-muted-foreground">
              Vê o problema. Te entrega o relatório.
            </h3>
            <ul className="mt-6 space-y-3">
              {tool.map((t) => (
                <li key={t} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/60" />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative overflow-hidden rounded-3xl glass-strong p-8 ring-gradient glow-primary">
            <div className="absolute inset-0 grid-bg opacity-40" aria-hidden />
            <div className="relative">
              <div className="font-mono text-[10px] uppercase tracking-widest text-primary">
                // Radar | brands
              </div>
              <h3 className="mt-3 font-display text-xl font-semibold">
                Detecta, classifica e resolve do começo ao fim.
              </h3>
              <ul className="mt-6 space-y-3">
                {us.map((t) => (
                  <li key={t} className="flex items-start gap-3 text-sm">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- FAQ ---------------- */
export function BrandFAQ() {
  const faq = HOME_FAQ.map((item) => ({ q: item.question, a: item.answer }));
  return (
    <section id="faq" className="scroll-mt-24 py-20 md:py-28">
      <div className="mx-auto max-w-4xl px-4">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-primary">
            Dúvidas frequentes
          </div>
          <h2 className="mt-4 font-display text-3xl font-bold md:text-5xl">
            Radar Brands e monitoramento de marca em
            <span className="text-gradient"> perguntas.</span>
          </h2>
        </div>

        <div className="mt-12 space-y-3">
          {faq.map((f, i) => (
            <details
              key={i}
              className="group rounded-2xl glass p-5 ring-gradient open:glow-primary"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-4 font-display text-base font-semibold">
                <span>{f.q}</span>
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
