import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Scale,
  ShieldAlert,
  FileText,
  Camera,
  Repeat,
  MessageSquare,
  Gavel,
  ArrowRight,
  CheckCircle2,
  Handshake,
  Mail,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/landing/site-header";
import { SiteFooter, CtaBand } from "@/components/landing/pricing-footer";

export const Route = createFileRoute("/juridico")({
  head: () => ({
    meta: [
      { title: "Jurídico · Radar | brands — Base legal e dossiê probatório" },
      {
        name: "description",
        content:
          "Brand bidding e uso indevido de marca sem autorização é concorrência desleal. A Radar | brands transforma cada detecção em dossiê probatório pronto para a mediação, notificação extrajudicial ou ação judicial.",
      },
      { property: "og:title", content: "Jurídico · Radar | brands" },
      {
        property: "og:description",
        content:
          "Base legal, dossiê probatório e rede de escritórios parceiros — a proteção jurídica da sua marca em três degraus.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: JuridicoPage,
});

const evidence = [
  {
    icon: Camera,
    title: "Captura datada",
    text: "Print do anúncio ou publicação com URL final, data, hora e posição no leilão ou feed.",
  },
  {
    icon: Repeat,
    title: "Histórico de reincidência",
    text: "Registro de cada vez que o mesmo infrator reapareceu — prova de que não é erro pontual.",
  },
  {
    icon: MessageSquare,
    title: "Cadeia de mediação",
    text: "E-mails, tentativas de contato e recusas documentadas, na ordem cronológica.",
  },
  {
    icon: FileText,
    title: "Parecer técnico",
    text: "Análise da operação Radar | brands sobre o caso, pronta para anexar ao processo.",
  },
];

const escalation = [
  {
    step: "01",
    icon: Handshake,
    title: "Mediação direta",
    text: "Conversa técnica com o anunciante, evidência empacotada e base legal anexa. Fecha a maioria dos casos em acordo de cessação.",
    stat: "80%",
    statLabel: "dos casos resolvidos aqui",
  },
  {
    step: "02",
    icon: Mail,
    title: "Notificação extrajudicial",
    text: "Carta endereçada ao jurídico do infrator, com tipificação legal anexa. Muda o tom da conversa em 24 horas.",
    stat: "+15%",
    statLabel: "adicionais resolvidos",
  },
  {
    step: "03",
    icon: Gavel,
    title: "Ação judicial",
    text: "Jurídico do cliente ou escritório parceiro Radar | brands entra com a ação — com o dossiê probatório já formado.",
    stat: "Dossiê",
    statLabel: "pronto para juízo",
  },
];

function JuridicoPage() {
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
                <ShieldAlert className="h-3.5 w-3.5 text-primary" />
                Concorrência desleal · base legal
              </div>
              <h1 className="font-display text-4xl font-bold tracking-tight md:text-6xl">
                Uso indevido de marca é{" "}
                <span className="text-gradient">concorrência desleal</span>.
              </h1>
              <p className="mt-6 text-lg text-muted-foreground">
                A maioria das mediações fecha em acordo. Para os casos que
                insistem, cada detecção da Radar | brands já é um dossiê
                probatório pronto para a Justiça.
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
                  <Link to="/como-funciona">
                    Ver como funciona{" "}
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* TIPIFICAÇÃO */}
        <section className="py-20">
          <div className="mx-auto max-w-5xl px-4">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="glass-strong ring-gradient rounded-3xl p-8">
                <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary">
                  A tipificação
                </p>
                <h2 className="mt-3 font-display text-2xl font-bold md:text-3xl">
                  Uma prática prevista em lei
                </h2>
                <p className="mt-4 text-muted-foreground">
                  A jurisprudência brasileira reconhece o uso da marca
                  registrada de terceiro como palavra-chave de anúncio como
                  concorrência desleal — prática prevista no{" "}
                  <span className="text-foreground">art. 195 da Lei da Propriedade Industrial (Lei 9.279/96)</span>.
                  As plataformas permitem o lance tecnicamente, mas isso não
                  torna o ato lícito: a remoção depende de ação do titular da
                  marca.
                </p>
              </div>
              <div className="glass-strong ring-gradient rounded-3xl p-8">
                <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary">
                  O que muda na mediação
                </p>
                <h2 className="mt-3 font-display text-2xl font-bold md:text-3xl">
                  A base legal muda o tom da conversa
                </h2>
                <p className="mt-4 text-muted-foreground">
                  Quando a tipificação legal entra na conversa, o concorrente
                  deixa de ver o brand bidding como "esperteza de mídia" e
                  passa a enxergar o risco. É por isso que a maioria das
                  mediações fecha em acordo antes de qualquer escalada —
                  ninguém quer virar precedente.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* DOSSIÊ */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4">
            <div className="mb-12 text-center">
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary">
                O dossiê probatório
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold md:text-5xl">
                Cada caso vira{" "}
                <span className="text-gradient">evidência pronta</span> para juízo
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                Não é overhead — é subproduto natural da operação. Toda
                detecção que entra em mediação já gera o pacote probatório.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {evidence.map((e) => (
                <div
                  key={e.title}
                  className="glass ring-gradient rounded-2xl p-6"
                >
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground">
                    <e.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-base font-semibold">
                    {e.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {e.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ESCALADA */}
        <section className="relative py-24">
          <div
            className="absolute inset-0"
            style={{ background: "var(--gradient-hero)", opacity: 0.4 }}
          />
          <div className="relative mx-auto max-w-7xl px-4">
            <div className="mb-12 text-center">
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary">
                A escalada
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold md:text-5xl">
                Três degraus, na ordem certa
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {escalation.map((s) => (
                <div
                  key={s.step}
                  className="glass-strong ring-gradient flex flex-col justify-between rounded-3xl p-8"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs text-muted-foreground">
                        {s.step}
                      </span>
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground glow-primary">
                        <s.icon className="h-5 w-5" />
                      </div>
                    </div>
                    <h3 className="mt-6 font-display text-2xl font-semibold">
                      {s.title}
                    </h3>
                    <p className="mt-2 text-muted-foreground">{s.text}</p>
                  </div>
                  <div className="mt-8 flex items-end justify-between border-t border-border/60 pt-6">
                    <span className="font-display text-3xl font-bold text-gradient">
                      {s.stat}
                    </span>
                    <span className="text-right text-xs text-muted-foreground">
                      {s.statLabel}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* REDE */}
        <section className="py-24">
          <div className="mx-auto max-w-7xl px-4">
            <div className="glass ring-gradient rounded-3xl p-10">
              <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary">
                    Rede de escritórios parceiros
                  </p>
                  <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">
                    O cliente não precisa virar{" "}
                    <span className="text-gradient">especialista jurídico</span>
                  </h2>
                  <p className="mt-4 text-muted-foreground">
                    A Radar | brands entrega o dossiê e o caminho — não vende
                    serviço jurídico. Se o caso precisa de ação judicial, o
                    cliente aciona o próprio jurídico interno, agora com tudo
                    pré-empacotado, ou conta com a nossa rede de escritórios
                    parceiros, especializados em propriedade industrial e
                    concorrência desleal digital.
                  </p>
                </div>
                <ul className="space-y-3">
                  {[
                    "Propriedade industrial (Lei 9.279/96)",
                    "Concorrência desleal digital",
                    "Direito marcário e INPI",
                    "Takedown internacional (DMCA e equivalentes)",
                    "Consultoria em compliance de marca",
                  ].map((item) => (
                    <li
                      key={item}
                      className="glass-strong flex items-center gap-3 rounded-xl p-4"
                    >
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      <span className="text-sm font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
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
