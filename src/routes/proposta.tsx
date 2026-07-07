import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Shield, Sparkles, Check, Lock, Plus, X, Download,
  Brain, Eye, Globe, Search, ShoppingBag, Users, Zap,
  Radar, Bot, Workflow, TrendingUp, FileAudio, AlertTriangle,
  MessageSquare, Phone, Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { SiteHeader } from "@/components/landing/site-header";

export const Route = createFileRoute("/proposta")({
  head: () => ({
    meta: [
      { title: "Monte sua proposta — Radar | brand" },
      {
        name: "description",
        content:
          "Configure os módulos que sua marca precisa e receba uma proposta personalizada em segundos. Sem preço engessado, sem contrato longo.",
      },
      { property: "og:title", content: "Monte sua proposta — Radar | brand" },
      {
        property: "og:description",
        content:
          "Briefing rápido: informe seus termos, escolha seus módulos e gere uma proposta sob medida.",
      },
    ],
  }),
  component: PropostaPage,
});

type Mod = {
  id: string;
  name: string;
  desc: string;
  price: number;
  icon: React.ComponentType<{ className?: string }>;
  category: "core" | "protection" | "intelligence" | "automation" | "business";
  required?: boolean;
  badge?: "NEW" | "PRO" | "BETA";
};

const MODULES: Mod[] = [
  // CORE — obrigatórios
  { id: "monitoring", name: "Monitoramento 24/7", desc: "Varredura contínua de menções, domínios e resultados de busca.", price: 890, icon: Eye, category: "core", required: true },
  { id: "alerts", name: "Central de Alertas", desc: "Fila de incidentes com priorização e status em tempo real.", price: 390, icon: AlertTriangle, category: "core", required: true },
  { id: "reports", name: "Relatórios Executivos", desc: "PDF/CSV mensais com KPIs de proteção e ROI.", price: 290, icon: FileAudio, category: "core", required: true },

  // PROTECTION
  { id: "domains", name: "Domain Guard", desc: "Detecção de typosquatting, clones e phishing.", price: 690, icon: Globe, category: "protection" },
  { id: "ads", name: "Ad Hijacking", desc: "Monitora Google Ads, Meta Ads e TikTok Ads infratores.", price: 790, icon: Search, category: "protection" },
  { id: "marketplace", name: "Marketplace Watch", desc: "Mercado Livre, Shopee, Amazon e OLX: produtos falsificados.", price: 690, icon: ShoppingBag, category: "protection" },
  { id: "social", name: "Perfis Falsos Sociais", desc: "Instagram, TikTok, Facebook, X e YouTube.", price: 590, icon: Users, category: "protection" },
  { id: "apps", name: "App Store Protection", desc: "Apps falsos usando sua marca em Google Play e App Store.", price: 490, icon: Shield, category: "protection", badge: "NEW" },
  { id: "darkweb", name: "Dark Web Monitor", desc: "Vazamentos de credenciais e menções em fóruns hacker.", price: 890, icon: Lock, category: "protection", badge: "NEW" },

  // INTELLIGENCE
  { id: "threats", name: "Threat Intelligence Graph", desc: "Grafo interativo revelando redes de fraude.", price: 990, icon: Brain, category: "intelligence", badge: "PRO" },
  { id: "predict", name: "Predictive Risk Score", desc: "IA prevê picos de fraude com dados históricos + sazonalidade.", price: 890, icon: TrendingUp, category: "intelligence", badge: "PRO" },
  { id: "deepfake", name: "Deepfake Detector", desc: "Voz e vídeo clonados de executivos e porta-vozes.", price: 990, icon: Sparkles, category: "intelligence", badge: "NEW" },
  { id: "crisis", name: "Crisis Radar", desc: "Detecção precoce de crises reputacionais e contenção sugerida.", price: 690, icon: Radar, category: "intelligence" },
  { id: "competitors", name: "Competitor Intelligence", desc: "Criativos, ofertas e LPs dos concorrentes em tempo real.", price: 590, icon: Eye, category: "intelligence" },

  // AUTOMATION
  { id: "autopilot", name: "AI Autopilot", desc: "Takedowns automáticos em casos de alta confiança (≥95%).", price: 1290, icon: Bot, category: "automation", badge: "PRO" },
  { id: "playbooks", name: "Playbooks No-Code", desc: "Workflows condicionais estilo Zapier.", price: 490, icon: Workflow, category: "automation" },
  { id: "influencers", name: "Influencer & UGC Watch", desc: "Uso indevido da marca por criadores e autorização.", price: 590, icon: Users, category: "automation" },

  // BUSINESS
  { id: "roi", name: "ROI Calculator", desc: "Dashboard de economia + valor de marca protegido.", price: 290, icon: TrendingUp, category: "business" },
  { id: "briefing", name: "Executive Briefing IA", desc: "Resumo semanal em áudio + PDF gerado por IA.", price: 390, icon: FileAudio, category: "business", badge: "NEW" },
  { id: "legal", name: "Central Jurídica", desc: "Ações judiciais, notificações e portfólio de marcas INPI.", price: 690, icon: Shield, category: "business" },
];

const CATEGORIES: { id: Mod["category"]; label: string; hint: string }[] = [
  { id: "core", label: "Núcleo obrigatório", hint: "Base mínima para o funcionamento da plataforma." },
  { id: "protection", label: "Proteção", hint: "Detecção e takedown em canais externos." },
  { id: "intelligence", label: "Inteligência IA", hint: "Camada preditiva e analítica." },
  { id: "automation", label: "Automação", hint: "Execução autônoma e workflows." },
  { id: "business", label: "Negócio & C-Level", hint: "ROI, portfólio e material executivo." },
];

function PropostaPage() {
  const [step, setStep] = useState<"form" | "proposal">("form");
  const [company, setCompany] = useState("");
  const [website, setWebsite] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [terms, setTerms] = useState<string[]>([""]);
  const [notes, setNotes] = useState("");
  const [enabled, setEnabled] = useState<Record<string, boolean>>(
    Object.fromEntries(MODULES.map((m) => [m.id, m.required ? true : ["domains", "ads", "social"].includes(m.id)])),
  );

  const total = useMemo(
    () => MODULES.filter((m) => enabled[m.id]).reduce((s, m) => s + m.price, 0),
    [enabled],
  );
  const activeCount = useMemo(
    () => MODULES.filter((m) => enabled[m.id]).length,
    [enabled],
  );

  const marketPrice = 8500;
  const savings = Math.max(0, marketPrice - total);

  function toggle(id: string) {
    const mod = MODULES.find((m) => m.id === id);
    if (mod?.required) return;
    setEnabled((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function updateTerm(i: number, v: string) {
    setTerms((t) => t.map((x, idx) => (idx === i ? v : x)));
  }
  function addTerm() {
    setTerms((t) => [...t, ""]);
  }
  function removeTerm(i: number) {
    setTerms((t) => (t.length === 1 ? [""] : t.filter((_, idx) => idx !== i)));
  }

  const canGenerate = company.trim() && website.trim() && contactEmail.trim() && terms.some((t) => t.trim());

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="mx-auto max-w-7xl px-4 py-10">
        {step === "form" ? (
          <>
            <div className="mb-8 text-center">
              <Badge className="mb-3 bg-primary/10 text-primary hover:bg-primary/15">
                Briefing inteligente · 2 minutos
              </Badge>
              <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Monte sua proposta personalizada
              </h1>
              <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
                Configure os módulos que sua marca precisa. Enquanto concorrentes cobram
                R$ 8.000–10.000 em pacotes fechados, aqui você paga só pelo que usa.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
              {/* LEFT — formulário + módulos */}
              <div className="space-y-8">
                {/* Dados */}
                <section className="glass-strong rounded-2xl p-6">
                  <h2 className="font-display text-xl font-semibold">1. Dados da marca</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Precisamos disso para calibrar o monitoramento.
                  </p>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="company">Empresa / Marca *</Label>
                      <Input id="company" value={company} onChange={(e) => setCompany(e.target.value.slice(0, 100))} placeholder="Ex.: Acme Cosméticos" className="mt-1.5" />
                    </div>
                    <div>
                      <Label htmlFor="website">Site oficial *</Label>
                      <Input id="website" value={website} onChange={(e) => setWebsite(e.target.value.slice(0, 200))} placeholder="acme.com.br" className="mt-1.5" />
                    </div>
                    <div>
                      <Label htmlFor="cname">Seu nome</Label>
                      <Input id="cname" value={contactName} onChange={(e) => setContactName(e.target.value.slice(0, 100))} placeholder="Como podemos te chamar?" className="mt-1.5" />
                    </div>
                    <div>
                      <Label htmlFor="cmail">E-mail *</Label>
                      <Input id="cmail" type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value.slice(0, 200))} placeholder="voce@empresa.com" className="mt-1.5" />
                    </div>
                    <div className="sm:col-span-2">
                      <Label htmlFor="cphone">WhatsApp (opcional)</Label>
                      <Input id="cphone" value={contactPhone} onChange={(e) => setContactPhone(e.target.value.slice(0, 30))} placeholder="+55 11 90000-0000" className="mt-1.5" />
                    </div>
                  </div>
                </section>

                {/* Termos */}
                <section className="glass-strong rounded-2xl p-6">
                  <h2 className="font-display text-xl font-semibold">2. Termos a monitorar</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Marca, produtos, executivos, slogans, hashtags. Quanto mais, melhor.
                  </p>
                  <div className="mt-5 space-y-2">
                    {terms.map((t, i) => (
                      <div key={i} className="flex gap-2">
                        <Input value={t} onChange={(e) => updateTerm(i, e.target.value.slice(0, 80))} placeholder={`Termo ${i + 1} (ex.: Acme, Acme Beauty, #acme)`} />
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeTerm(i)} aria-label="Remover termo">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" onClick={addTerm} className="mt-2">
                      <Plus className="mr-1 h-4 w-4" /> Adicionar termo
                    </Button>
                  </div>
                  <div className="mt-5">
                    <Label htmlFor="notes">Contexto adicional (opcional)</Label>
                    <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value.slice(0, 1000))} placeholder="Ex.: sofremos ataques de perfis falsos no Instagram; queremos priorizar marketplaces." className="mt-1.5" rows={3} />
                  </div>
                </section>

                {/* Módulos */}
                <section className="glass-strong rounded-2xl p-6">
                  <h2 className="font-display text-xl font-semibold">3. Módulos da plataforma</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Ative ou desative conforme sua necessidade. Módulos do núcleo são obrigatórios.
                  </p>

                  <div className="mt-6 space-y-8">
                    {CATEGORIES.map((cat) => {
                      const mods = MODULES.filter((m) => m.category === cat.id);
                      return (
                        <div key={cat.id}>
                          <div className="mb-3 flex items-baseline justify-between">
                            <div>
                              <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-primary">
                                {cat.label}
                              </h3>
                              <p className="text-xs text-muted-foreground">{cat.hint}</p>
                            </div>
                          </div>
                          <div className="grid gap-3 sm:grid-cols-2">
                            {mods.map((m) => {
                              const Icon = m.icon;
                              const on = enabled[m.id];
                              return (
                                <label
                                  key={m.id}
                                  className={`relative flex cursor-pointer gap-3 rounded-xl border p-4 transition ${
                                    on
                                      ? "border-primary/40 bg-primary/5"
                                      : "border-border/60 bg-card/40 hover:bg-card/70"
                                  } ${m.required ? "cursor-not-allowed opacity-95" : ""}`}
                                >
                                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${on ? "bg-[image:var(--gradient-primary)] text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                                    <Icon className="h-5 w-5" />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                      <span className="font-medium">{m.name}</span>
                                      {m.badge && (
                                        <Badge variant="secondary" className="h-4 px-1.5 text-[10px]">
                                          {m.badge}
                                        </Badge>
                                      )}
                                      {m.required && (
                                        <Badge variant="outline" className="h-4 border-primary/40 px-1.5 text-[10px] text-primary">
                                          Obrigatório
                                        </Badge>
                                      )}
                                    </div>
                                    <p className="mt-0.5 text-xs text-muted-foreground">{m.desc}</p>
                                    <div className="mt-2 flex items-center justify-between">
                                      <span className="font-mono text-xs text-muted-foreground">
                                        R$ {m.price.toLocaleString("pt-BR")}
                                        <span className="text-[10px]">/mês</span>
                                      </span>
                                      <Switch
                                        checked={on}
                                        disabled={m.required}
                                        onCheckedChange={() => toggle(m.id)}
                                        aria-label={m.name}
                                      />
                                    </div>
                                  </div>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              </div>

              {/* RIGHT — resumo sticky */}
              <aside className="lg:sticky lg:top-24 lg:h-fit">
                <div className="glass-strong rounded-2xl p-6 ring-gradient">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span className="font-mono text-xs uppercase tracking-widest text-primary">
                      Sua proposta
                    </span>
                  </div>
                  <div className="mt-4">
                    <div className="text-xs text-muted-foreground">Mercado cobra</div>
                    <div className="font-mono text-lg text-muted-foreground line-through">
                      R$ {marketPrice.toLocaleString("pt-BR")}/mês
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="text-xs text-muted-foreground">Sua configuração</div>
                    <div className="font-display text-4xl font-bold tracking-tight">
                      R$ {total.toLocaleString("pt-BR")}
                      <span className="text-base font-normal text-muted-foreground">/mês</span>
                    </div>
                    <div className="mt-1 text-xs">
                      <span className="text-primary">{activeCount} módulos ativos</span>
                      {savings > 0 && (
                        <>
                          <span className="mx-2 text-muted-foreground">·</span>
                          <span className="text-emerald-400">
                            economia de R$ {savings.toLocaleString("pt-BR")}/mês
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <ul className="mt-5 space-y-2 text-xs text-muted-foreground">
                    <li className="flex gap-2"><Check className="h-3.5 w-3.5 text-primary" /> Sem setup fee</li>
                    <li className="flex gap-2"><Check className="h-3.5 w-3.5 text-primary" /> Sem contrato mínimo</li>
                    <li className="flex gap-2"><Check className="h-3.5 w-3.5 text-primary" /> Onboarding em 48h</li>
                    <li className="flex gap-2"><Check className="h-3.5 w-3.5 text-primary" /> Suporte humano dedicado</li>
                  </ul>

                  <Button
                    className="mt-6 w-full bg-[image:var(--gradient-primary)] text-primary-foreground hover:opacity-90"
                    disabled={!canGenerate}
                    onClick={() => {
                      setStep("proposal");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    <Zap className="mr-2 h-4 w-4" /> Gerar proposta
                  </Button>
                  {!canGenerate && (
                    <p className="mt-2 text-center text-[11px] text-muted-foreground">
                      Preencha empresa, site, e-mail e ao menos 1 termo.
                    </p>
                  )}
                </div>
              </aside>
            </div>
          </>
        ) : (
          <ProposalView
            company={company}
            website={website}
            contactName={contactName}
            contactEmail={contactEmail}
            contactPhone={contactPhone}
            terms={terms.filter((t) => t.trim())}
            notes={notes}
            enabled={enabled}
            total={total}
            marketPrice={marketPrice}
            onBack={() => setStep("form")}
          />
        )}
      </main>
    </div>
  );
}

function ProposalView(props: {
  company: string; website: string; contactName: string; contactEmail: string; contactPhone: string;
  terms: string[]; notes: string; enabled: Record<string, boolean>;
  total: number; marketPrice: number; onBack: () => void;
}) {
  const { company, website, contactName, contactEmail, contactPhone, terms, notes, enabled, total, marketPrice, onBack } = props;
  const chosen = MODULES.filter((m) => enabled[m.id]);
  const savings = Math.max(0, marketPrice - total);
  const proposalId = useMemo(() => `BS-${Date.now().toString(36).toUpperCase().slice(-6)}`, []);
  const today = new Date().toLocaleDateString("pt-BR");

  const waMsg = encodeURIComponent(
    `Olá! Gerei a proposta ${proposalId} para ${company} — R$ ${total.toLocaleString("pt-BR")}/mês com ${chosen.length} módulos. Quero conversar.`,
  );

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Button variant="ghost" size="sm" onClick={onBack}>← Editar briefing</Button>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => window.print()}>
            <Download className="mr-2 h-4 w-4" /> Baixar PDF
          </Button>
          <Button asChild size="sm" className="bg-[image:var(--gradient-primary)] text-primary-foreground">
            <a href={`https://wa.me/5511900000000?text=${waMsg}`} target="_blank" rel="noreferrer">
              <MessageSquare className="mr-2 h-4 w-4" /> Enviar por WhatsApp
            </a>
          </Button>
        </div>
      </div>

      <article className="glass-strong rounded-2xl p-8 ring-gradient print:bg-white print:text-black">
        {/* Header */}
        <header className="flex flex-wrap items-start justify-between gap-4 border-b border-border/60 pb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[image:var(--gradient-primary)]">
              <Shield className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <div className="font-display text-lg font-bold">Radar | brand</div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-primary">
                Proposta Comercial
              </div>
            </div>
          </div>
          <div className="text-right text-xs text-muted-foreground">
            <div>Proposta <span className="font-mono text-foreground">{proposalId}</span></div>
            <div>Emitida em {today}</div>
            <div>Válida por 15 dias</div>
          </div>
        </header>

        {/* Cliente */}
        <section className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Cliente</div>
            <div className="mt-1 font-display text-xl font-semibold">{company}</div>
            <div className="text-sm text-muted-foreground">{website}</div>
          </div>
          <div className="text-sm">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Contato</div>
            {contactName && <div className="mt-1">{contactName}</div>}
            <div className="flex items-center gap-1.5 text-muted-foreground"><Mail className="h-3.5 w-3.5" /> {contactEmail}</div>
            {contactPhone && (
              <div className="flex items-center gap-1.5 text-muted-foreground"><Phone className="h-3.5 w-3.5" /> {contactPhone}</div>
            )}
          </div>
        </section>

        {/* Escopo */}
        <section className="mt-8">
          <h2 className="font-display text-lg font-semibold">Escopo de monitoramento</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {terms.map((t, i) => (
              <Badge key={i} variant="secondary" className="text-xs">{t}</Badge>
            ))}
          </div>
          {notes && (
            <p className="mt-4 rounded-lg bg-muted/40 p-3 text-sm text-muted-foreground">
              <strong className="text-foreground">Contexto:</strong> {notes}
            </p>
          )}
        </section>

        {/* Módulos */}
        <section className="mt-8">
          <h2 className="font-display text-lg font-semibold">
            Módulos contratados <span className="text-sm font-normal text-muted-foreground">({chosen.length})</span>
          </h2>
          <div className="mt-4 divide-y divide-border/60 rounded-xl border border-border/60">
            {chosen.map((m) => {
              const Icon = m.icon;
              return (
                <div key={m.id} className="flex items-center gap-3 p-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{m.name}</span>
                      {m.required && (
                        <Badge variant="outline" className="h-4 border-primary/40 px-1.5 text-[10px] text-primary">Core</Badge>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">{m.desc}</div>
                  </div>
                  <div className="font-mono text-sm text-muted-foreground">
                    R$ {m.price.toLocaleString("pt-BR")}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Investimento */}
        <section className="mt-8 rounded-xl bg-[image:var(--gradient-primary)] p-6 text-primary-foreground">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-widest opacity-80">Investimento mensal</div>
              <div className="font-display text-4xl font-bold">
                R$ {total.toLocaleString("pt-BR")}
                <span className="text-base font-normal opacity-80">/mês</span>
              </div>
              {savings > 0 && (
                <div className="mt-1 text-xs opacity-90">
                  Você economiza <strong>R$ {savings.toLocaleString("pt-BR")}/mês</strong> vs. mercado
                  (R$ {marketPrice.toLocaleString("pt-BR")}/mês).
                </div>
              )}
            </div>
            <ul className="space-y-1 text-xs opacity-90">
              <li className="flex gap-2"><Check className="h-3.5 w-3.5" /> Sem setup fee</li>
              <li className="flex gap-2"><Check className="h-3.5 w-3.5" /> Sem fidelidade</li>
              <li className="flex gap-2"><Check className="h-3.5 w-3.5" /> Onboarding em 48h</li>
            </ul>
          </div>
        </section>

        {/* Próximos passos */}
        <section className="mt-8">
          <h2 className="font-display text-lg font-semibold">Próximos passos</h2>
          <ol className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><span className="font-mono text-primary">01.</span> Aprovação da proposta e assinatura digital.</li>
            <li><span className="font-mono text-primary">02.</span> Kickoff em até 24h com o time de sucesso.</li>
            <li><span className="font-mono text-primary">03.</span> Configuração dos termos e canais em 48h.</li>
            <li><span className="font-mono text-primary">04.</span> Primeiro relatório executivo em 7 dias.</li>
          </ol>
        </section>

        <footer className="mt-8 border-t border-border/60 pt-4 text-center text-[11px] text-muted-foreground">
          Radar | brand · proposta {proposalId} · confidencial
        </footer>
      </article>
    </div>
  );
}
