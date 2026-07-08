import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import {
  Building2,
  Check,
  ChevronLeft,
  ChevronRight,
  Globe,
  Rocket,
  Shield,
  Sparkles,
  Target,
  Users,
  FileText,
  KeyRound,
  Loader2,
  Trash2,
  Plus,
} from "lucide-react";

export const Route = createFileRoute("/dashboard/onboarding")({
  head: () => ({
    meta: [
      { title: "Onboarding · Radar | brands" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OnboardingPage,
});

type StepDef = {
  key: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
};

const steps: StepDef[] = [
  { key: "company", title: "Empresa", subtitle: "Dados institucionais", icon: Building2 },
  { key: "contact", title: "Contatos", subtitle: "Time responsável", icon: Users },
  { key: "brands", title: "Marcas", subtitle: "Portfólio a proteger", icon: Shield },
  { key: "assets", title: "Ativos digitais", subtitle: "Domínios & perfis", icon: Globe },
  { key: "scope", title: "Escopo", subtitle: "Módulos e regras", icon: Target },
  { key: "legal", title: "Jurídico", subtitle: "Documentos & procuração", icon: FileText },
  { key: "access", title: "Acessos", subtitle: "Integrações & credenciais", icon: KeyRound },
  { key: "review", title: "Revisão", subtitle: "Concluir onboarding", icon: Sparkles },
];

type Brand = { name: string; category: string; trademark: string };
type Asset = { type: string; value: string };
type Contact = { name: string; email: string; role: string };

function OnboardingPage() {
  const navigate = useNavigate();
  const [stepIndex, setStepIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  // Company
  const [legalName, setLegalName] = useState("");
  const [tradeName, setTradeName] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [segment, setSegment] = useState("");
  const [size, setSize] = useState("");
  const [country, setCountry] = useState("Brasil");
  const [address, setAddress] = useState("");

  // Contacts
  const [contacts, setContacts] = useState<Contact[]>([
    { name: "", email: "", role: "Contato principal" },
  ]);

  // Brands
  const [brands, setBrands] = useState<Brand[]>([
    { name: "", category: "", trademark: "" },
  ]);

  // Assets
  const [assets, setAssets] = useState<Asset[]>([
    { type: "domain", value: "" },
  ]);

  // Scope
  const [modules, setModules] = useState<Record<string, boolean>>({
    domains: true,
    social: true,
    ads: false,
    marketplace: true,
    darkweb: false,
    apps: false,
  });
  const [priority, setPriority] = useState("balanced");
  const [notes, setNotes] = useState("");

  // Legal
  const [hasPoa, setHasPoa] = useState(false);
  const [poaNotes, setPoaNotes] = useState("");
  const [legalContact, setLegalContact] = useState("");

  // Access
  const [gscConnected, setGscConnected] = useState(false);
  const [analyticsConnected, setAnalyticsConnected] = useState(false);
  const [slackWebhook, setSlackWebhook] = useState("");
  const [emailAlerts, setEmailAlerts] = useState("");

  const [acceptTerms, setAcceptTerms] = useState(false);

  const step = steps[stepIndex];
  const progress = ((stepIndex + 1) / steps.length) * 100;
  const isLast = stepIndex === steps.length - 1;

  const next = () => setStepIndex((i) => Math.min(steps.length - 1, i + 1));
  const back = () => setStepIndex((i) => Math.max(0, i - 1));

  const submit = () => {
    if (!acceptTerms) {
      toast.error("Aceite os termos para concluir");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast.success("Onboarding concluído!", {
        description: "Sua conta será configurada em minutos.",
      });
      setTimeout(() => navigate({ to: "/dashboard" }), 800);
    }, 1200);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* HERO */}
      <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/40 p-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,hsl(var(--primary)/0.25),transparent_55%),radial-gradient(circle_at_90%_90%,hsl(var(--primary)/0.15),transparent_50%)]" />
        <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-primary">
              Configuração inicial
            </div>
            <h1 className="mt-1 font-display text-3xl font-bold">
              Bem-vindo ao Radar | brands
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              Vamos coletar as informações necessárias para ativar todos os módulos de proteção
              da sua marca. Leva cerca de <strong className="text-foreground">5 minutos</strong>.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-glow)]">
              <Rocket className="h-7 w-7" />
            </div>
          </div>
        </div>

        <div className="relative mt-6">
          <div className="mb-2 flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
            <span>
              Passo {stepIndex + 1} de {steps.length} — {step.title}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-[image:var(--gradient-primary)] transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-[260px_1fr]">
        {/* SIDEBAR STEPS */}
        <aside className="hidden md:block">
          <ol className="sticky top-24 space-y-1.5">
            {steps.map((s, i) => {
              const active = i === stepIndex;
              const done = i < stepIndex;
              const Icon = s.icon;
              return (
                <li key={s.key}>
                  <button
                    onClick={() => setStepIndex(i)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-all",
                      active
                        ? "border-primary/60 bg-primary/10"
                        : done
                          ? "border-border/60 bg-card/40 hover:bg-muted/50"
                          : "border-border/40 bg-transparent hover:bg-muted/40",
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[11px] font-semibold",
                        active
                          ? "bg-primary text-primary-foreground shadow-[var(--shadow-glow)]"
                          : done
                            ? "bg-emerald-500/80 text-white"
                            : "bg-muted text-muted-foreground",
                      )}
                    >
                      {done ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                    </div>
                    <div className="min-w-0">
                      <div className={cn("text-sm font-medium", active && "text-foreground")}>
                        {s.title}
                      </div>
                      <div className="truncate text-[11px] text-muted-foreground">
                        {s.subtitle}
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ol>
        </aside>

        {/* CONTENT */}
        <section className="min-w-0">
          <div className="rounded-2xl border border-border/60 bg-card/40 p-6">
            <div className="mb-6">
              <div className="font-mono text-[10px] uppercase tracking-widest text-primary">
                {step.subtitle}
              </div>
              <h2 className="font-display text-2xl font-bold">{step.title}</h2>
            </div>

            {step.key === "company" && (
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Razão social *">
                  <Input value={legalName} onChange={(e) => setLegalName(e.target.value)} placeholder="Ex: Cadbrasil Indústria Ltda" />
                </Field>
                <Field label="Nome fantasia">
                  <Input value={tradeName} onChange={(e) => setTradeName(e.target.value)} placeholder="Cadbrasil" />
                </Field>
                <Field label="CNPJ *">
                  <Input value={cnpj} onChange={(e) => setCnpj(e.target.value)} placeholder="00.000.000/0000-00" />
                </Field>
                <Field label="Segmento *">
                  <select
                    value={segment}
                    onChange={(e) => setSegment(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">Selecione...</option>
                    <option>Varejo & E-commerce</option>
                    <option>Indústria</option>
                    <option>Serviços Financeiros</option>
                    <option>Saúde & Farmacêutico</option>
                    <option>Tecnologia</option>
                    <option>Educação</option>
                    <option>Outro</option>
                  </select>
                </Field>
                <Field label="Porte da empresa">
                  <select
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">Selecione...</option>
                    <option>Até 50 colaboradores</option>
                    <option>51 - 250</option>
                    <option>251 - 1.000</option>
                    <option>1.001 - 5.000</option>
                    <option>Mais de 5.000</option>
                  </select>
                </Field>
                <Field label="País sede">
                  <Input value={country} onChange={(e) => setCountry(e.target.value)} />
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Endereço completo">
                    <Textarea value={address} onChange={(e) => setAddress(e.target.value)} rows={2} placeholder="Rua, número, bairro, cidade, UF, CEP" />
                  </Field>
                </div>
              </div>
            )}

            {step.key === "contact" && (
              <div className="space-y-4">
                {contacts.map((c, i) => (
                  <div key={i} className="rounded-xl border border-border/60 bg-background/40 p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-xs font-medium text-muted-foreground">Contato #{i + 1}</span>
                      {contacts.length > 1 && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setContacts(contacts.filter((_, idx) => idx !== i))}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                    <div className="grid gap-3 sm:grid-cols-3">
                      <Field label="Nome *">
                        <Input
                          value={c.name}
                          onChange={(e) => {
                            const arr = [...contacts];
                            arr[i].name = e.target.value;
                            setContacts(arr);
                          }}
                        />
                      </Field>
                      <Field label="Email *">
                        <Input
                          type="email"
                          value={c.email}
                          onChange={(e) => {
                            const arr = [...contacts];
                            arr[i].email = e.target.value;
                            setContacts(arr);
                          }}
                        />
                      </Field>
                      <Field label="Função">
                        <Input
                          value={c.role}
                          onChange={(e) => {
                            const arr = [...contacts];
                            arr[i].role = e.target.value;
                            setContacts(arr);
                          }}
                          placeholder="Ex: Jurídico, Marketing"
                        />
                      </Field>
                    </div>
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={() => setContacts([...contacts, { name: "", email: "", role: "" }])}
                >
                  <Plus className="mr-1 h-4 w-4" /> Adicionar contato
                </Button>
              </div>
            )}

            {step.key === "brands" && (
              <div className="space-y-4">
                {brands.map((b, i) => (
                  <div key={i} className="rounded-xl border border-border/60 bg-background/40 p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-xs font-medium text-muted-foreground">Marca #{i + 1}</span>
                      {brands.length > 1 && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setBrands(brands.filter((_, idx) => idx !== i))}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                    <div className="grid gap-3 sm:grid-cols-3">
                      <Field label="Nome da marca *">
                        <Input
                          value={b.name}
                          onChange={(e) => {
                            const arr = [...brands];
                            arr[i].name = e.target.value;
                            setBrands(arr);
                          }}
                        />
                      </Field>
                      <Field label="Categoria/Classe">
                        <Input
                          value={b.category}
                          onChange={(e) => {
                            const arr = [...brands];
                            arr[i].category = e.target.value;
                            setBrands(arr);
                          }}
                          placeholder="Ex: NCL 35"
                        />
                      </Field>
                      <Field label="Nº registro INPI">
                        <Input
                          value={b.trademark}
                          onChange={(e) => {
                            const arr = [...brands];
                            arr[i].trademark = e.target.value;
                            setBrands(arr);
                          }}
                          placeholder="Opcional"
                        />
                      </Field>
                    </div>
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={() => setBrands([...brands, { name: "", category: "", trademark: "" }])}
                >
                  <Plus className="mr-1 h-4 w-4" /> Adicionar marca
                </Button>
              </div>
            )}

            {step.key === "assets" && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Liste seus domínios oficiais, perfis sociais e apps para monitoramento.
                </p>
                {assets.map((a, i) => (
                  <div key={i} className="flex gap-2">
                    <select
                      value={a.type}
                      onChange={(e) => {
                        const arr = [...assets];
                        arr[i].type = e.target.value;
                        setAssets(arr);
                      }}
                      className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                    >
                      <option value="domain">Domínio</option>
                      <option value="instagram">Instagram</option>
                      <option value="facebook">Facebook</option>
                      <option value="tiktok">TikTok</option>
                      <option value="youtube">YouTube</option>
                      <option value="linkedin">LinkedIn</option>
                      <option value="app">App Store URL</option>
                    </select>
                    <Input
                      className="flex-1"
                      placeholder={a.type === "domain" ? "exemplo.com.br" : "@perfiloficial ou URL"}
                      value={a.value}
                      onChange={(e) => {
                        const arr = [...assets];
                        arr[i].value = e.target.value;
                        setAssets(arr);
                      }}
                    />
                    {assets.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setAssets(assets.filter((_, idx) => idx !== i))}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={() => setAssets([...assets, { type: "domain", value: "" }])}
                >
                  <Plus className="mr-1 h-4 w-4" /> Adicionar ativo
                </Button>
              </div>
            )}

            {step.key === "scope" && (
              <div className="space-y-6">
                <div>
                  <Label className="mb-3 block text-sm font-medium">Módulos ativos</Label>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {[
                      { k: "domains", l: "Domínios & typosquatting" },
                      { k: "social", l: "Perfis falsos em redes sociais" },
                      { k: "ads", l: "Google Ads (uso indevido de marca)" },
                      { k: "marketplace", l: "Marketplaces (falsificação)" },
                      { k: "darkweb", l: "Dark Web & vazamento de dados" },
                      { k: "apps", l: "App stores (apps clonados)" },
                    ].map((m) => (
                      <label
                        key={m.k}
                        className="flex cursor-pointer items-center gap-3 rounded-lg border border-border/60 bg-background/40 p-3 hover:border-primary/50"
                      >
                        <Checkbox
                          checked={modules[m.k]}
                          onCheckedChange={(v) => setModules({ ...modules, [m.k]: Boolean(v) })}
                        />
                        <span className="text-sm">{m.l}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="mb-3 block text-sm font-medium">Prioridade estratégica</Label>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {[
                      { v: "speed", l: "Velocidade", d: "Take-downs rápidos" },
                      { v: "balanced", l: "Equilibrado", d: "Cobertura ampla" },
                      { v: "coverage", l: "Cobertura máxima", d: "Sem deixar nada passar" },
                    ].map((p) => (
                      <button
                        key={p.v}
                        onClick={() => setPriority(p.v)}
                        className={cn(
                          "rounded-lg border p-3 text-left transition-all",
                          priority === p.v
                            ? "border-primary bg-primary/10"
                            : "border-border/60 bg-background/40 hover:border-primary/50",
                        )}
                      >
                        <div className="text-sm font-medium">{p.l}</div>
                        <div className="text-xs text-muted-foreground">{p.d}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <Field label="Observações do escopo">
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    placeholder="Concorrentes conhecidos, casos recentes, exceções..."
                  />
                </Field>
              </div>
            )}

            {step.key === "legal" && (
              <div className="space-y-4">
                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border/60 bg-background/40 p-4">
                  <Checkbox checked={hasPoa} onCheckedChange={(v) => setHasPoa(Boolean(v))} />
                  <div>
                    <div className="text-sm font-medium">
                      Autorizo a Radar | brands a atuar em meu nome
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      Necessário para envio de notificações extrajudiciais e take-downs em nome
                      da sua marca. Enviaremos a procuração digital por email.
                    </div>
                  </div>
                </label>

                <Field label="Contato do jurídico (email)">
                  <Input
                    type="email"
                    value={legalContact}
                    onChange={(e) => setLegalContact(e.target.value)}
                    placeholder="juridico@empresa.com"
                  />
                </Field>

                <Field label="Observações jurídicas / restrições">
                  <Textarea
                    value={poaNotes}
                    onChange={(e) => setPoaNotes(e.target.value)}
                    rows={3}
                    placeholder="Escritório parceiro, casos em andamento, restrições de ação..."
                  />
                </Field>
              </div>
            )}

            {step.key === "access" && (
              <div className="space-y-4">
                <IntegrationRow
                  title="Google Search Console"
                  desc="Detectar cliques indevidos e SEO de fraudes"
                  connected={gscConnected}
                  onToggle={() => setGscConnected((v) => !v)}
                />
                <IntegrationRow
                  title="Google Analytics"
                  desc="Cruzar tráfego suspeito com relatórios de ROI"
                  connected={analyticsConnected}
                  onToggle={() => setAnalyticsConnected((v) => !v)}
                />
                <Field label="Webhook do Slack (alertas)">
                  <Input
                    value={slackWebhook}
                    onChange={(e) => setSlackWebhook(e.target.value)}
                    placeholder="https://hooks.slack.com/services/..."
                  />
                </Field>
                <Field label="Emails adicionais para alertas (separados por vírgula)">
                  <Input
                    value={emailAlerts}
                    onChange={(e) => setEmailAlerts(e.target.value)}
                    placeholder="ceo@empresa.com, marketing@empresa.com"
                  />
                </Field>
              </div>
            )}

            {step.key === "review" && (
              <div className="space-y-4">
                <div className="rounded-xl border border-border/60 bg-background/40 p-5">
                  <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-primary">
                    <Sparkles className="h-3.5 w-3.5" /> Resumo do onboarding
                  </div>
                  <dl className="grid gap-3 sm:grid-cols-2">
                    <SumRow label="Empresa" value={legalName || tradeName || "—"} />
                    <SumRow label="CNPJ" value={cnpj || "—"} />
                    <SumRow label="Segmento" value={segment || "—"} />
                    <SumRow label="Contatos" value={`${contacts.filter((c) => c.name).length}`} />
                    <SumRow label="Marcas" value={`${brands.filter((b) => b.name).length}`} />
                    <SumRow label="Ativos digitais" value={`${assets.filter((a) => a.value).length}`} />
                    <SumRow
                      label="Módulos ativos"
                      value={`${Object.values(modules).filter(Boolean).length} de 6`}
                    />
                    <SumRow label="Procuração" value={hasPoa ? "Autorizada" : "Pendente"} />
                  </dl>
                </div>

                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border/60 bg-background/40 p-4">
                  <Checkbox checked={acceptTerms} onCheckedChange={(v) => setAcceptTerms(Boolean(v))} />
                  <div className="text-sm">
                    Confirmo que as informações fornecidas são verdadeiras e aceito os{" "}
                    <a href="#" className="text-primary underline">termos de uso</a> e a{" "}
                    <a href="#" className="text-primary underline">política de privacidade</a>.
                  </div>
                </label>
              </div>
            )}
          </div>

          {/* NAV */}
          <div className="mt-4 flex items-center justify-between">
            <Button variant="outline" onClick={back} disabled={stepIndex === 0}>
              <ChevronLeft className="mr-1 h-4 w-4" /> Voltar
            </Button>
            {isLast ? (
              <Button onClick={submit} disabled={submitting || !acceptTerms}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enviando...
                  </>
                ) : (
                  <>
                    Concluir onboarding <Check className="ml-1 h-4 w-4" />
                  </>
                )}
              </Button>
            ) : (
              <Button onClick={next}>
                Continuar <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      {children}
    </div>
  );
}

function SumRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border/40 pb-2">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium">{value}</dd>
    </div>
  );
}

function IntegrationRow({
  title,
  desc,
  connected,
  onToggle,
}: {
  title: string;
  desc: string;
  connected: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border/60 bg-background/40 p-4">
      <div>
        <div className="text-sm font-medium">{title}</div>
        <div className="text-xs text-muted-foreground">{desc}</div>
      </div>
      <Button variant={connected ? "outline" : "default"} size="sm" onClick={onToggle}>
        {connected ? (
          <>
            <Check className="mr-1 h-3.5 w-3.5" /> Conectado
          </>
        ) : (
          "Conectar"
        )}
      </Button>
    </div>
  );
}
