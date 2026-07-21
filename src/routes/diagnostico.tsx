import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Shield, Search, Lock, Eye, AlertTriangle, TrendingUp,
  Globe, Users, ShoppingBag, FileText, ArrowRight, Sparkles,
  CheckCircle2, XCircle, HelpCircle, ChevronRight, Radar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { SiteHeader } from "@/components/landing/site-header";
import { SiteFooter } from "@/components/landing/pricing-footer";
import { buildPageHead } from "@/lib/seo";

export const Route = createFileRoute("/diagnostico")({
  head: () =>
    buildPageHead({
      title: "Diagnóstico de marca grátis · Radar Brands | Monitor Brands",
      description:
        "Descubra em segundos riscos da sua marca online: perfis falsos, domínios clones, brand bidding e impacto estimado. Diagnóstico gratuito Radar Brands.",
      path: "/diagnostico",
    }),
  component: DiagnosticoPage,
});

const TEASER_MODULES = [
  {
    id: "monitoring",
    title: "Monitoramento 24/7",
    desc: "Varredura contínua de menções, domínios e resultados de busca.",
    icon: Eye,
    visible: true,
  },
  {
    id: "domains",
    title: "Domain Guard",
    desc: "Detecção de typosquatting e domínios clone antes que causem dano.",
    icon: Globe,
    visible: true,
  },
  {
    id: "social",
    title: "Perfis Falsos Sociais",
    desc: "Identificação de impersonação no Instagram, TikTok, X e Facebook.",
    icon: Users,
    visible: false,
  },
  {
    id: "ads",
    title: "Ad Hijacking",
    desc: "Monitora anúncios fraudulentos que usam sua marca no Google e Meta.",
    icon: AlertTriangle,
    visible: false,
  },
  {
    id: "marketplace",
    title: "Marketplace Watch",
    desc: "Rastreamento de produtos falsificados em grandes marketplaces.",
    icon: ShoppingBag,
    visible: false,
  },
  {
    id: "ai",
    title: "Brand AI Assistant",
    desc: "Análise preditiva de crises e recomendações de contenção.",
    icon: Sparkles,
    visible: false,
  },
];

const TEASER_THREATS = [
  { label: "Domínios suspeitos", count: "3", locked: false },
  { label: "Perfis falsos ativos", count: "12+", locked: true },
  { label: "Anúncios infratores", count: "8", locked: true },
  { label: "Listagens fraudulentas", count: "5", locked: true },
];

function DiagnosticoPage() {
  const [brand, setBrand] = useState("");
  const [website, setWebsite] = useState("");
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"form" | "scanning" | "report">("form");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!brand.trim() || !website.trim()) return;
    setStep("scanning");
    setTimeout(() => setStep("report"), 2200);
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-4 py-12 md:py-20">
        {step === "form" && (
          <section className="mx-auto max-w-2xl text-center">
            <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/15">
              Diagnóstico gratuito
            </Badge>
            <h1 className="font-display text-3xl font-bold tracking-tight sm:text-5xl">
              Como sua marca está sendo afetada online?
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Faça uma análise rápida e descubra ameaças ocultas — perfis falsos,
              domínios clones, anúncios fraudulentos e o impacto estimado no seu negócio.
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-10 rounded-3xl glass-strong p-6 text-left ring-gradient sm:p-10"
            >
              <div className="space-y-5">
                <div>
                  <Label htmlFor="brand">Nome da marca *</Label>
                  <Input
                    id="brand"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value.slice(0, 80))}
                    placeholder="Ex.: Marca1"
                    className="mt-2"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="site">Site oficial *</Label>
                  <Input
                    id="site"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value.slice(0, 200))}
                    placeholder="marca1.com.br"
                    className="mt-2"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">E-mail corporativo</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value.slice(0, 200))}
                    placeholder="voce@marca1.com"
                    className="mt-2"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="mt-8 w-full bg-[image:var(--gradient-primary)] text-primary-foreground hover:opacity-90"
                size="lg"
              >
                <Search className="mr-2 h-4 w-4" /> Gerar diagnóstico rápido
              </Button>

              <p className="mt-4 text-center text-xs text-muted-foreground">
                Análise simulada para demonstração. Os dados sensíveis são ocultados até a contratação.
              </p>
            </form>
          </section>
        )}

        {step === "scanning" && <ScanningView brand={brand} />}

        {step === "report" && (
          <ReportView brand={brand} website={website} email={email} />
        )}
      </main>

      <SiteFooter />
    </div>
  );
}

function ScanningView({ brand }: { brand: string }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
      <div className="relative flex h-24 w-24 items-center justify-center">
        <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
        <div className="absolute inset-4 rounded-full bg-primary/10" />
        <Radar className="relative h-10 w-10 animate-spin text-primary" style={{ animationDuration: "2s" }} />
      </div>
      <h2 className="mt-8 font-display text-2xl font-semibold">Escaneando {brand || "sua marca"}...</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Buscando domínios, redes sociais, marketplaces e anúncios.
      </p>
      <div className="mt-8 flex w-full max-w-md flex-col gap-2 text-left text-sm text-muted-foreground">
        {[
          "Indexando menções públicas...",
          "Mapeando canais de risco...",
          "Calculando impacto estimado...",
        ].map((t, i) => (
          <div key={i} className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            <span>{t}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReportView({ brand, website }: { brand: string; website: string; email: string }) {
  return (
    <div className="space-y-8">
      {/* Header do relatório */}
      <section className="rounded-3xl glass-strong p-6 ring-gradient sm:p-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <Badge variant="secondary" className="mb-3">
              Relatório reservado
            </Badge>
            <h1 className="font-display text-3xl font-bold tracking-tight">
              Diagnóstico: {brand}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">{website}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge variant="outline" className="border-primary/40 text-primary">
                <Globe className="mr-1 h-3 w-3" /> Web
              </Badge>
              <Badge variant="outline" className="border-primary/40 text-primary">
                <Users className="mr-1 h-3 w-3" /> Social
              </Badge>
              <Badge variant="outline" className="border-primary/40 text-primary">
                <ShoppingBag className="mr-1 h-3 w-3" /> Marketplaces
              </Badge>
            </div>
          </div>

          <div className="min-w-[220px] rounded-2xl bg-muted/40 p-5 text-center">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">
              Saúde da marca
            </div>
            <div className="mt-2 font-display text-5xl font-bold text-primary">
              62<span className="text-2xl text-muted-foreground">/100</span>
            </div>
            <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-warning/10 px-2 py-1 text-xs text-warning">
              <AlertTriangle className="h-3 w-3" /> Risco moderado
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* Coluna principal */}
        <div className="space-y-8">
          {/* Ameaças detectadas */}
          <section className="rounded-3xl glass-strong p-6 ring-gradient sm:p-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="font-display text-xl font-semibold">Ameaças detectadas</h2>
                <p className="text-sm text-muted-foreground">
                  Resumo dos riscos encontrados nos últimos 30 dias.
                </p>
              </div>
              <Lock className="h-5 w-5 text-muted-foreground" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {TEASER_THREATS.map((t) => (
                <div
                  key={t.label}
                  className={`relative overflow-hidden rounded-2xl border p-5 ${
                    t.locked
                      ? "border-border/40 bg-muted/30"
                      : "border-primary/30 bg-primary/5"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{t.label}</span>
                    {t.locked ? (
                      <Lock className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <XCircle className="h-4 w-4 text-destructive" />
                    )}
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    {t.locked ? (
                      <>
                        <span className="select-none font-display text-3xl font-bold blur-md">
                          {t.count}
                        </span>
                        <span className="text-xs text-muted-foreground">ocorrências</span>
                      </>
                    ) : (
                      <>
                        <span className="font-display text-3xl font-bold text-foreground">
                          {t.count}
                        </span>
                        <span className="text-xs text-muted-foreground">detectados</span>
                      </>
                    )}
                  </div>
                  {t.locked && (
                    <div className="mt-3 inline-flex items-center gap-1 text-xs text-primary">
                      <Lock className="h-3 w-3" /> Detalhes disponíveis na proposta
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Impacto financeiro */}
          <section className="relative overflow-hidden rounded-3xl glass-strong p-6 ring-gradient sm:p-8">
            <div className="absolute inset-0 grid-bg" aria-hidden />
            <div className="relative">
              <div className="mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h2 className="font-display text-xl font-semibold">Impacto estimado</h2>
              </div>
              <p className="max-w-xl text-sm text-muted-foreground">
                Com base em setor, ticket médio e volume de busca, estimamos o prejuízo
                mensal atribuído às ameaças ativas. O valor exato só é liberado no relatório completo.
              </p>

              <div className="mt-6 inline-flex select-none items-center gap-3 rounded-2xl bg-muted/60 px-6 py-4">
                <span className="font-display text-4xl font-bold blur-md sm:text-5xl">
                  R$ 000.000
                </span>
                <span className="text-sm text-muted-foreground">/mês estimado</span>
                <Lock className="h-5 w-5 text-primary" />
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Badge variant="outline" className="border-warning/40 text-warning">
                  Perda de receita
                </Badge>
                <Badge variant="outline" className="border-destructive/40 text-destructive">
                  Desgaste reputacional
                </Badge>
                <Badge variant="outline" className="border-primary/40 text-primary">
                  Custo de recuperação
                </Badge>
              </div>
            </div>
          </section>

          {/* Módulos recomendados */}
          <section className="rounded-3xl glass-strong p-6 ring-gradient sm:p-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="font-display text-xl font-semibold">Módulos recomendados</h2>
                <p className="text-sm text-muted-foreground">
                  Tecnologia Radar | brands para combater cada vetor de risco.
                </p>
              </div>
              <Sparkles className="h-5 w-5 text-primary" />
            </div>

            <div className="space-y-3">
              {TEASER_MODULES.map((m) => {
                const Icon = m.icon;
                return (
                  <div
                    key={m.id}
                    className={`flex items-center gap-4 rounded-2xl border p-4 transition ${
                      m.visible
                        ? "border-primary/30 bg-primary/5"
                        : "border-border/40 bg-muted/20"
                    }`}
                  >
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                        m.visible
                          ? "bg-[image:var(--gradient-primary)] text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{m.title}</span>
                        {!m.visible && (
                          <Badge variant="secondary" className="h-4 px-1.5 text-[10px]">
                            <Lock className="mr-1 h-2.5 w-2.5" /> Proposta
                          </Badge>
                        )}
                      </div>
                      <p className="mt-0.5 text-sm text-muted-foreground">{m.desc}</p>
                    </div>
                    {m.visible ? (
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                    ) : (
                      <HelpCircle className="h-5 w-5 shrink-0 text-muted-foreground" />
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* Sidebar CTA */}
        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <div className="rounded-3xl glass-strong p-6 ring-gradient">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <span className="font-mono text-xs uppercase tracking-widest text-primary">
                Relatório completo
              </span>
            </div>
            <h3 className="mt-4 font-display text-2xl font-bold">
              Quer ver os dados reais da sua marca?
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              O diagnóstico completo inclui: domínios clone, perfis falsos, anúncios
              infratores, impacto financeiro detalhado e um plano de ação personalizado.
            </p>

            <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                Relatório executivo em PDF
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                Análise de canais de risco
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                Proposta com preços e módulos
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                Onboarding em 48h
              </li>
            </ul>

            <Button
              asChild
              size="lg"
              className="mt-6 w-full bg-[image:var(--gradient-primary)] text-primary-foreground hover:opacity-90"
            >
              <Link to="/proposta">
                Ver proposta online <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>

            <Button asChild variant="outline" className="mt-3 w-full">
              <a href="/#contato">Falar com um especialista</a>
            </Button>

            <div className="mt-5 flex items-center gap-2 rounded-xl bg-muted/40 p-3 text-xs text-muted-foreground">
              <Shield className="h-4 w-4 text-primary" />
              Seus dados são tratados de forma confidencial.
            </div>
          </div>
        </aside>
      </div>

      {/* Seção de curiosidade */}
      <section className="rounded-3xl glass-strong p-6 text-center ring-gradient sm:p-10">
        <h2 className="font-display text-2xl font-bold">
          A tecnologia da Radar | brands já protegeu marcas como a sua
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
          Empresas que atuam em e-commerce, SaaS, varejo e serviços reduziram em até 70%
          o tempo de resposta a crises e recuperaram receita perdida com anúncios e
          marketplaces fraudulentos.
        </p>
        <Button
          asChild
          size="lg"
          className="mt-6 bg-[image:var(--gradient-primary)] text-primary-foreground hover:opacity-90"
        >
          <Link to="/proposta">
            Quero minha proposta personalizada <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </section>
    </div>
  );
}
