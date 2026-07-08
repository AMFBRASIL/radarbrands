import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Shield, Sparkles, Check, Lock, Plus, X, Rocket,
  Brain, Eye, Globe, Search, ShoppingBag, Users,
  Radar, Bot, Workflow, TrendingUp, FileAudio, AlertTriangle,
  Pencil, CreditCard, ChevronDown, Mouse,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/onboarding")({
  head: () => ({
    meta: [
      { title: "Onboarding · Radar | brands" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OnboardingPage,
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
  { id: "monitoring", name: "Monitoramento 24/7", desc: "Varredura contínua de menções, domínios e resultados de busca.", price: 890, icon: Eye, category: "core", required: true },
  { id: "alerts", name: "Central de Alertas", desc: "Fila de incidentes com priorização e status em tempo real.", price: 390, icon: AlertTriangle, category: "core", required: true },
  { id: "reports", name: "Relatórios Executivos", desc: "PDF/CSV mensais com KPIs de proteção e ROI.", price: 290, icon: FileAudio, category: "core", required: true },

  { id: "domains", name: "Domain Guard", desc: "Detecção de typosquatting, clones e phishing.", price: 690, icon: Globe, category: "protection" },
  { id: "ads", name: "Ad Hijacking", desc: "Monitora Google Ads, Meta Ads e TikTok Ads infratores.", price: 790, icon: Search, category: "protection" },
  { id: "marketplace", name: "Marketplace Watch", desc: "Mercado Livre, Shopee, Amazon e OLX: produtos falsificados.", price: 690, icon: ShoppingBag, category: "protection" },
  { id: "social", name: "Perfis Falsos Sociais", desc: "Instagram, TikTok, Facebook, X e YouTube.", price: 590, icon: Users, category: "protection" },
  { id: "apps", name: "App Store Protection", desc: "Apps falsos usando sua marca em Google Play e App Store.", price: 490, icon: Shield, category: "protection", badge: "NEW" },
  { id: "darkweb", name: "Dark Web Monitor", desc: "Vazamentos de credenciais e menções em fóruns hacker.", price: 890, icon: Lock, category: "protection", badge: "NEW" },

  { id: "threats", name: "Threat Intelligence Graph", desc: "Grafo interativo revelando redes de fraude.", price: 990, icon: Brain, category: "intelligence", badge: "PRO" },
  { id: "predict", name: "Predictive Risk Score", desc: "IA prevê picos de fraude com dados históricos + sazonalidade.", price: 890, icon: TrendingUp, category: "intelligence", badge: "PRO" },
  { id: "deepfake", name: "Deepfake Detector", desc: "Voz e vídeo clonados de executivos e porta-vozes.", price: 990, icon: Sparkles, category: "intelligence", badge: "NEW" },
  { id: "crisis", name: "Crisis Radar", desc: "Detecção precoce de crises reputacionais e contenção sugerida.", price: 690, icon: Radar, category: "intelligence" },
  { id: "competitors", name: "Competitor Intelligence", desc: "Criativos, ofertas e LPs dos concorrentes em tempo real.", price: 590, icon: Eye, category: "intelligence" },

  { id: "autopilot", name: "AI Autopilot", desc: "Takedowns automáticos em casos de alta confiança (≥95%).", price: 1290, icon: Bot, category: "automation", badge: "PRO" },
  { id: "playbooks", name: "Playbooks No-Code", desc: "Workflows condicionais estilo Zapier.", price: 490, icon: Workflow, category: "automation" },
  { id: "influencers", name: "Influencer & UGC Watch", desc: "Uso indevido da marca por criadores e autorização.", price: 590, icon: Users, category: "automation" },

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

type Brand = {
  id: string;
  name: string;
  segment: string;
  description: string;
  terms: string;
};

function newBrand(): Brand {
  return {
    id: crypto.randomUUID(),
    name: "",
    segment: "",
    description: "",
    terms: "",
  };
}

function OnboardingPage() {
  const navigate = useNavigate();
  const [brands, setBrands] = useState<Brand[]>([newBrand()]);
  const [enabled, setEnabled] = useState<Record<string, boolean>>(
    Object.fromEntries(MODULES.map((m) => [m.id, m.required ? true : ["domains", "ads", "social"].includes(m.id)])),
  );
  const [saved, setSaved] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [scrollEl, setScrollEl] = useState<HTMLDivElement | null>(null);
  const [showScrollHint, setShowScrollHint] = useState(false);

  useEffect(() => {
    const el = scrollEl;
    if (!el) return;
    const check = () => {
      const hasScroll = el.scrollHeight > el.clientHeight + 2;
      const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 4;
      setShowScrollHint(hasScroll && !atBottom);
    };
    const id = setTimeout(check, 80);
    el.addEventListener("scroll", check, { passive: true });
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => {
      clearTimeout(id);
      el.removeEventListener("scroll", check);
      ro.disconnect();
    };
  }, [scrollEl]);

  const brandCount = Math.max(1, brands.filter((b) => b.name.trim()).length);
  const perBrand = useMemo(
    () => MODULES.filter((m) => enabled[m.id]).reduce((s, m) => s + m.price, 0),
    [enabled],
  );
  const total = perBrand * brandCount;
  const activeCount = useMemo(
    () => MODULES.filter((m) => enabled[m.id]).length,
    [enabled],
  );
  const activeModules = useMemo(() => MODULES.filter((m) => enabled[m.id]), [enabled]);

  function toggle(id: string) {
    const mod = MODULES.find((m) => m.id === id);
    if (mod?.required) return;
    setEnabled((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function updateBrand(id: string, patch: Partial<Brand>) {
    setBrands((bs) => bs.map((b) => (b.id === id ? { ...b, ...patch } : b)));
  }
  function addBrand() {
    setBrands((bs) => [...bs, newBrand()]);
  }
  function removeBrand(id: string) {
    setBrands((bs) => (bs.length === 1 ? bs : bs.filter((b) => b.id !== id)));
  }

  const canFinish = brands.every((b) => b.name.trim()) && brands.some((b) => b.name.trim());

  function openReview() {
    if (!canFinish) {
      toast.error("Preencha o nome de cada marca para continuar.");
      return;
    }
    setReviewOpen(true);
  }

  function confirmAndPay() {
    setSaved(true);
    try {
      sessionStorage.setItem(
        "rb.onboarding",
        JSON.stringify({
          brands: brands.map((b) => ({ name: b.name, segment: b.segment })),
          modules: activeModules.map((m) => ({ id: m.id, name: m.name, price: m.price })),
          perBrand,
          brandCount,
          total,
        }),
      );
    } catch {}
    toast.success("Onboarding confirmado!", { description: "Redirecionando para o pagamento..." });
    setReviewOpen(false);
    setTimeout(() => navigate({ to: "/dashboard/pagamento" }), 500);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-primary">
            <Rocket className="h-3.5 w-3.5" /> Onboarding
          </div>
          <h1 className="mt-1 font-display text-3xl font-bold">Configure suas marcas</h1>
          <p className="text-sm text-muted-foreground">
            Cadastre as marcas que serão monitoradas e escolha os módulos. O valor mensal é atualizado ao lado em tempo real.
          </p>
        </div>
        <Badge className="bg-primary/10 text-primary hover:bg-primary/15">Setup inicial</Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* LEFT — marcas + módulos */}
        <div className="space-y-6">
          {/* Marcas */}
          <section className="glass-strong rounded-2xl p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-display text-xl font-semibold">1. Suas marcas</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Cadastre cada marca que deve ser protegida. Você pode adicionar quantas quiser.
                </p>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={addBrand}>
                <Plus className="mr-1 h-4 w-4" /> Marca
              </Button>
            </div>

            <div className="mt-5 space-y-5">
              {brands.map((b, idx) => (
                <div key={b.id} className="rounded-xl border border-border/60 bg-card/40 p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/15 font-mono text-[11px] font-semibold text-primary">
                        {idx + 1}
                      </span>
                      <span className="font-medium">
                        {b.name.trim() || `Marca ${idx + 1}`}
                      </span>
                    </div>
                    {brands.length > 1 && (
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeBrand(b.id)} aria-label="Remover marca">
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label>Nome da marca *</Label>
                      <Input
                        value={b.name}
                        onChange={(e) => updateBrand(b.id, { name: e.target.value.slice(0, 100) })}
                        placeholder="Ex.: Acme Beauty"
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label>Segmento / o que faz</Label>
                      <Input
                        value={b.segment}
                        onChange={(e) => updateBrand(b.id, { segment: e.target.value.slice(0, 100) })}
                        placeholder="Ex.: Cosméticos veganos"
                        className="mt-1.5"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Label>Descrição da marca</Label>
                      <Textarea
                        value={b.description}
                        onChange={(e) => updateBrand(b.id, { description: e.target.value.slice(0, 500) })}
                        placeholder="Contexto, público, produtos principais, executivos-chave..."
                        rows={3}
                        className="mt-1.5"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Label>Termos a monitorar</Label>
                      <Input
                        value={b.terms}
                        onChange={(e) => updateBrand(b.id, { terms: e.target.value.slice(0, 300) })}
                        placeholder="Ex.: Acme, Acme Beauty, #acme, acmebeauty.com.br"
                        className="mt-1.5"
                      />
                      <p className="mt-1 text-[11px] text-muted-foreground">
                        Separe por vírgula. Inclua marca, produtos, hashtags e domínios oficiais.
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Módulos */}
          <section className="glass-strong rounded-2xl p-6">
            <h2 className="font-display text-xl font-semibold">2. Módulos contratados</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Ative apenas o que faz sentido. O valor mensal é multiplicado pelo número de marcas.
            </p>

            <div className="mt-6 space-y-8">
              {CATEGORIES.map((cat) => {
                const mods = MODULES.filter((m) => m.category === cat.id);
                return (
                  <div key={cat.id}>
                    <div className="mb-3">
                      <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-primary">
                        {cat.label}
                      </h3>
                      <p className="text-xs text-muted-foreground">{cat.hint}</p>
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
                                  <span className="text-[10px]">/mês por marca</span>
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
        <aside className="lg:sticky lg:top-20 lg:h-fit">
          <div className="glass-strong rounded-2xl p-6 ring-gradient">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="font-mono text-xs uppercase tracking-widest text-primary">
                Sua contratação
              </span>
            </div>

            <div className="mt-4">
              <div className="text-xs text-muted-foreground">Total mensal</div>
              <div className="font-display text-4xl font-bold tracking-tight">
                R$ {total.toLocaleString("pt-BR")}
                <span className="text-base font-normal text-muted-foreground">/mês</span>
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                R$ {perBrand.toLocaleString("pt-BR")} × {brandCount} marca{brandCount > 1 ? "s" : ""}
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-border/60 bg-card/40 p-3">
                <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Marcas
                </div>
                <div className="mt-1 font-display text-2xl font-bold">{brandCount}</div>
              </div>
              <div className="rounded-xl border border-border/60 bg-card/40 p-3">
                <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Módulos
                </div>
                <div className="mt-1 font-display text-2xl font-bold">{activeCount}</div>
              </div>
            </div>

            <ul className="mt-5 space-y-2 text-xs text-muted-foreground">
              <li className="flex gap-2"><Check className="h-3.5 w-3.5 text-primary" /> Sem setup fee</li>
              <li className="flex gap-2"><Check className="h-3.5 w-3.5 text-primary" /> Sem contrato mínimo</li>
              <li className="flex gap-2"><Check className="h-3.5 w-3.5 text-primary" /> Cancele quando quiser</li>
              <li className="flex gap-2"><Check className="h-3.5 w-3.5 text-primary" /> Ativação em até 24h</li>
            </ul>

            <Button
              className="mt-6 w-full"
              size="lg"
              onClick={openReview}
              disabled={!canFinish || saved}
            >
              {saved ? (
                <><Check className="mr-2 h-4 w-4" /> Configuração salva</>
              ) : (
                <>Revisar e concluir</>
              )}
            </Button>

            <p className="mt-3 text-center text-[11px] text-muted-foreground">
              Você poderá adicionar novas marcas e módulos depois em Configurações.
            </p>
          </div>
        </aside>
      </div>

      {/* Review Dialog */}
      <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" /> Revisão do onboarding
            </DialogTitle>
            <DialogDescription>
              Confirme os dados antes de seguir para o pagamento da primeira mensalidade.
            </DialogDescription>
          </DialogHeader>

          <div className="relative">
            <style>{`
              .rb-scroll-hide::-webkit-scrollbar { display: none !important; }
            `}</style>
            <div
              ref={setScrollEl}
              className="rb-scroll-hide max-h-[60vh] space-y-5 overflow-y-auto pr-1"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              <section>
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-primary">
                    Marcas ({brandCount})
                  </h4>
                </div>
                <div className="space-y-2">
                  {brands.map((b, i) => (
                    <div key={b.id} className="rounded-lg border border-border/60 bg-card/40 p-3 text-sm">
                      <div className="font-medium">{i + 1}. {b.name || `Marca ${i + 1}`}</div>
                      {b.segment && <div className="text-xs text-muted-foreground">{b.segment}</div>}
                      {b.terms && <div className="mt-1 font-mono text-[11px] text-muted-foreground">Termos: {b.terms}</div>}
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h4 className="mb-2 font-display text-sm font-semibold uppercase tracking-wider text-primary">
                  Módulos ({activeCount})
                </h4>
                <div className="grid gap-2 sm:grid-cols-2">
                  {activeModules.map((m) => (
                    <div key={m.id} className="flex items-center justify-between rounded-lg border border-border/60 bg-card/40 px-3 py-2 text-sm">
                      <span className="truncate">{m.name}</span>
                      <span className="font-mono text-xs text-muted-foreground">R$ {m.price.toLocaleString("pt-BR")}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-xl border border-primary/30 bg-primary/5 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">R$ {perBrand.toLocaleString("pt-BR")} × {brandCount} marca{brandCount > 1 ? "s" : ""}</span>
                  <span className="font-display text-2xl font-bold">
                    R$ {total.toLocaleString("pt-BR")}<span className="text-sm font-normal text-muted-foreground">/mês</span>
                  </span>
                </div>
              </section>
            </div>

            {showScrollHint && (
              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex flex-col items-center justify-end pb-2 pt-10">
                <div className="flex flex-col items-center gap-0.5 rounded-full bg-card px-3 py-2 text-[10px] font-medium text-primary shadow-lg ring-1 ring-primary/30 backdrop-blur-sm">
                  <Mouse className="h-3.5 w-3.5" />
                  <span>Desça para ver mais</span>
                  <ChevronDown className="h-3.5 w-3.5 animate-bounce" />
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-2">
            <Button variant="outline" onClick={() => setReviewOpen(false)}>
              <Pencil className="mr-2 h-4 w-4" /> Editar
            </Button>
            <Button onClick={confirmAndPay}>
              <CreditCard className="mr-2 h-4 w-4" /> Confirmar e pagar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
