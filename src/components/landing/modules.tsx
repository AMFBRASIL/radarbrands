import {
  Activity,
  AlertTriangle,
  BadgeCheck,
  Bot,
  Facebook,
  FileText,
  Gavel,
  Globe,
  Instagram,
  Linkedin,
  Megaphone,
  ShieldCheck,
  ShoppingCart,
  Youtube,
} from "lucide-react";

/* ----------------- Módulo 1: Brand Monitor ----------------- */
export function BrandMonitor() {
  const sources = [
    "Google", "Bing", "Instagram", "Facebook", "TikTok", "YouTube",
    "LinkedIn", "Reclame Aqui", "Notícias", "Blogs", "Fóruns", "Marketplaces", "Domínios",
  ];
  const stats = [
    { value: "120.450", label: "Páginas analisadas", icon: Activity },
    { value: "35", label: "Riscos encontrados", icon: AlertTriangle, tone: "warning" as const },
    { value: "8", label: "Violações críticas", icon: ShieldCheck, tone: "danger" as const },
    { value: "97%", label: "Proteção da marca", icon: BadgeCheck, tone: "success" as const },
  ];
  return (
    <ModuleSection
      id="monitor"
      eyebrow="Módulo 01 · Brand Monitor"
      title="Vigilância contínua em toda a superfície digital"
      description="Nosso motor de IA rastreia 13+ superfícies em tempo real e correlaciona sinais para revelar ameaças invisíveis a ferramentas tradicionais."
    >
      <div className="grid gap-4 md:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          const color =
            s.tone === "danger"
              ? "text-destructive"
              : s.tone === "warning"
              ? "text-[color:var(--warning)]"
              : s.tone === "success"
              ? "text-[color:var(--success)]"
              : "text-primary";
          return (
            <div key={s.label} className="glass rounded-2xl p-5 ring-gradient">
              <Icon className={`h-5 w-5 ${color}`} />
              <div className="mt-3 font-display text-3xl font-bold">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          );
        })}
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        {sources.map((s) => (
          <span
            key={s}
            className="rounded-full border border-border/60 bg-card/60 px-3 py-1 text-xs text-muted-foreground"
          >
            {s}
          </span>
        ))}
      </div>
    </ModuleSection>
  );
}

/* ----------------- Módulo 2: Brand Intelligence AI ----------------- */
export function BrandAI() {
  return (
    <ModuleSection
      id="ia"
      eyebrow="Módulo 02 · Brand Intelligence AI"
      title="A IA que pensa como o seu departamento jurídico"
      description="Detecta uso indevido, classifica risco, gera relatórios e recomenda ações — inclusive documentos jurídicos prontos para envio."
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <ul className="space-y-3">
          {[
            "Detectar uso indevido da marca",
            "Classificar risco automaticamente (0-100)",
            "Criar relatórios executivos em PDF",
            "Sugerir ações táticas e legais",
            "Detectar golpes e phishing",
            "Identificar concorrência desleal",
          ].map((f) => (
            <li key={f} className="flex items-start gap-3 glass rounded-xl p-3">
              <Bot className="h-5 w-5 shrink-0 text-primary" />
              <span className="text-sm">{f}</span>
            </li>
          ))}
        </ul>
        <div className="relative overflow-hidden rounded-2xl glass-strong p-6 ring-gradient">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-destructive">
            <span className="relative flex h-2 w-2">
              <span className="absolute inset-0 rounded-full bg-destructive animate-pulse-dot" />
            </span>
            Alerta crítico
          </div>
          <p className="mt-3 text-lg font-medium leading-snug">
            Encontramos um domínio parecido com sua empresa registrado há
            <span className="text-gradient font-bold"> 2 dias</span>.
          </p>
          <div className="mt-4 flex items-center gap-4">
            <RiskGauge value={94} />
            <div className="text-sm">
              <div className="text-muted-foreground">Risco calculado</div>
              <div className="font-display text-2xl font-bold text-destructive">94%</div>
              <div className="text-xs text-muted-foreground">confiança 99.2%</div>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <button className="rounded-lg bg-[image:var(--gradient-primary)] px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
              Solicitar remoção
            </button>
            <button className="rounded-lg border border-border/60 bg-card/60 px-4 py-2 text-sm font-medium hover:bg-muted">
              Gerar documento jurídico
            </button>
          </div>
        </div>
      </div>
    </ModuleSection>
  );
}

function RiskGauge({ value }: { value: number }) {
  const angle = (value / 100) * 360;
  return (
    <div
      className="relative h-24 w-24 rounded-full"
      style={{
        background: `conic-gradient(oklch(0.62 0.24 22) ${angle}deg, oklch(0.28 0.03 250) 0)`,
      }}
    >
      <div className="absolute inset-2 flex items-center justify-center rounded-full bg-card font-display text-lg font-bold">
        {value}
      </div>
    </div>
  );
}

/* ----------------- Módulo 3: Domain Watch ----------------- */
export function DomainWatch() {
  const found = [
    { d: "cadbrasiI.com.br", risk: "Alto", tone: "danger" as const, note: "typosquatting (i por I)" },
    { d: "cadbrasil-oficial.net", risk: "Médio", tone: "warning" as const, note: "logotipo copiado" },
    { d: "cadbra.shop", risk: "Baixo", tone: "success" as const, note: "sem uso ativo" },
  ];
  return (
    <ModuleSection
      id="dominios"
      eyebrow="Módulo 03 · Domain Watch"
      title="Encontramos o próximo golpe antes que ele exista"
      description="Monitoramos registros globais para typosquatting, clones, SSLs suspeitos e uso de logotipo — em qualquer TLD."
    >
      <div className="rounded-2xl glass-strong ring-gradient overflow-hidden">
        <div className="flex items-center justify-between border-b border-border/60 px-5 py-3">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-primary" />
            <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Marca monitorada
            </span>
            <span className="font-display text-sm font-semibold">CADBRASIL</span>
          </div>
          <span className="text-xs text-muted-foreground">3 correspondências</span>
        </div>
        <ul>
          {found.map((f) => (
            <li key={f.d} className="grid grid-cols-[1fr_auto] items-center gap-3 px-5 py-4 border-b border-border/60 last:border-0">
              <div>
                <div className="font-mono text-sm">{f.d}</div>
                <div className="text-xs text-muted-foreground">{f.note}</div>
              </div>
              <RiskBadge tone={f.tone}>{f.risk}</RiskBadge>
            </li>
          ))}
        </ul>
      </div>
    </ModuleSection>
  );
}

function RiskBadge({
  tone,
  children,
}: {
  tone: "danger" | "warning" | "success";
  children: React.ReactNode;
}) {
  const map = {
    danger: "bg-destructive/15 text-destructive",
    warning: "bg-[color:var(--warning)]/15 text-[color:var(--warning)]",
    success: "bg-[color:var(--success)]/15 text-[color:var(--success)]",
  } as const;
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-medium ${map[tone]}`}>Risco {children}</span>
  );
}

/* ----------------- Módulo 4: Social Media Protection ----------------- */
export function SocialProtection() {
  const nets = [
    { icon: Instagram, name: "Instagram", fake: 4 },
    { icon: Facebook, name: "Facebook", fake: 2 },
    { icon: Youtube, name: "YouTube", fake: 1 },
    { icon: Linkedin, name: "LinkedIn", fake: 0 },
  ];
  return (
    <ModuleSection
      id="social"
      eyebrow="Módulo 04 · Social Media Protection"
      title="Perfis falsos e crises de imagem, contidos em minutos"
      description="Vigilância em Instagram, Facebook, TikTok, YouTube e LinkedIn com IA de sentimento e detecção de golpes."
    >
      <div className="grid gap-6 md:grid-cols-2">
        <div className="grid grid-cols-2 gap-3">
          {nets.map((n) => {
            const Icon = n.icon;
            return (
              <div key={n.name} className="glass rounded-2xl p-4 ring-gradient">
                <Icon className="h-5 w-5 text-primary" />
                <div className="mt-2 text-sm text-muted-foreground">{n.name}</div>
                <div className="font-display text-2xl font-bold">
                  {n.fake} <span className="text-xs font-normal text-muted-foreground">perfis falsos</span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="glass-strong rounded-2xl p-5 ring-gradient">
          <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
            Sentimento (últimos 30 dias)
          </div>
          <div className="mt-4 space-y-3">
            <SentimentBar label="Positivo" value={72} tone="success" />
            <SentimentBar label="Neutro" value={20} tone="neutral" />
            <SentimentBar label="Negativo" value={8} tone="danger" />
          </div>
          <div className="mt-6 grid grid-cols-3 gap-3 text-center text-xs">
            <div>
              <div className="font-display text-xl font-bold text-[color:var(--success)]">+18%</div>
              <div className="text-muted-foreground">Menções</div>
            </div>
            <div>
              <div className="font-display text-xl font-bold">4.8k</div>
              <div className="text-muted-foreground">Interações</div>
            </div>
            <div>
              <div className="font-display text-xl font-bold text-destructive">2</div>
              <div className="text-muted-foreground">Crises</div>
            </div>
          </div>
        </div>
      </div>
    </ModuleSection>
  );
}

function SentimentBar({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "success" | "neutral" | "danger";
}) {
  const color =
    tone === "success"
      ? "var(--success)"
      : tone === "danger"
      ? "var(--destructive)"
      : "var(--muted-foreground)";
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs">
        <span>{label}</span>
        <span className="font-mono">{value}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full"
          style={{ width: `${value}%`, background: `oklch(from ${color} l c h)` }}
        />
      </div>
    </div>
  );
}

/* ----------------- Módulo 5: Ads Guardian ----------------- */
export function AdsGuardian() {
  return (
    <ModuleSection
      id="ads"
      eyebrow="Módulo 05 · Ads Guardian"
      title="Concorrentes comprando sua marca? Fim."
      description="Detectamos concorrentes usando seu nome em Google Ads, landing pages falsas e uso irregular da sua marca."
    >
      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2 rounded-2xl glass-strong p-6 ring-gradient">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-primary">
            <Megaphone className="h-4 w-4" /> Anúncio detectado
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Empresa" value="Concorrente XYZ" />
            <Field label="Palavra-chave" value={`"minha marca"`} mono />
            <Field label="Ativo há" value="15 dias" />
            <Field label="Investimento estimado" value="R$ 8.500/mês" accent />
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <button className="rounded-lg bg-[image:var(--gradient-primary)] px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
              Reportar ao Google Ads
            </button>
            <button className="rounded-lg border border-border/60 px-4 py-2 text-sm hover:bg-muted">
              Notificar concorrente
            </button>
          </div>
        </div>
        <div className="glass rounded-2xl p-6 ring-gradient">
          <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
            Impacto financeiro
          </div>
          <div className="mt-3 font-display text-3xl font-bold text-gradient">R$ 42k</div>
          <div className="text-xs text-muted-foreground">receita potencial recuperada / trimestre</div>
          <div className="mt-6 text-xs text-muted-foreground">
            Baseado em CPC médio, taxa de conversão e ticket da sua marca.
          </div>
        </div>
      </div>
    </ModuleSection>
  );
}

function Field({
  label,
  value,
  mono,
  accent,
}: {
  label: string;
  value: string;
  mono?: boolean;
  accent?: boolean;
}) {
  return (
    <div>
      <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
      <div
        className={`mt-1 text-sm ${mono ? "font-mono" : ""} ${accent ? "text-gradient font-bold" : "text-foreground"}`}
      >
        {value}
      </div>
    </div>
  );
}

/* ----------------- Módulo 6: Marketplace Monitor ----------------- */
export function MarketplaceMonitor() {
  const rows = [
    { mp: "Amazon", items: 12, revoke: 5 },
    { mp: "Mercado Livre", items: 34, revoke: 18 },
    { mp: "Shopee", items: 21, revoke: 9 },
  ];
  return (
    <ModuleSection
      id="marketplace"
      eyebrow="Módulo 06 · Marketplace Monitor"
      title="Falsificações e revendas não autorizadas, expostas"
      description="Rastreamento em Amazon, Mercado Livre e Shopee com identificação de produtos falsificados e uso indevido da marca."
    >
      <div className="rounded-2xl glass-strong ring-gradient overflow-hidden">
        <div className="grid grid-cols-3 gap-4 border-b border-border/60 px-6 py-3 text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
          <span>Marketplace</span>
          <span>Itens suspeitos</span>
          <span className="text-right">Ações sugeridas</span>
        </div>
        {rows.map((r) => (
          <div
            key={r.mp}
            className="grid grid-cols-3 items-center gap-4 border-b border-border/60 px-6 py-4 last:border-0"
          >
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4 text-primary" />
              <span className="font-medium">{r.mp}</span>
            </div>
            <span className="font-display text-xl font-bold">{r.items}</span>
            <span className="text-right text-sm text-muted-foreground">
              {r.revoke} anúncios prontos para <span className="text-destructive">remoção</span>
            </span>
          </div>
        ))}
      </div>
    </ModuleSection>
  );
}

/* ----------------- Módulo 7: Trademark Center ----------------- */
export function TrademarkCenter() {
  const stages = ["Pedido enviado", "Publicado", "Oposição", "Registrado"];
  const active = 2;
  return (
    <ModuleSection
      id="protecao"
      eyebrow="Módulo 07 · Trademark Center"
      title="Do INPI ao WIPO — sua marca sob controle"
      description="Consulta ao INPI, status por classe, alertas de vencimento e detecção de pedidos parecidos por concorrentes."
    >
      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <div className="glass-strong rounded-2xl p-6 ring-gradient">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-muted-foreground">
            <Gavel className="h-4 w-4 text-primary" /> Processo INPI · 921.457.882
          </div>
          <div className="mt-6 flex items-center">
            {stages.map((s, i) => (
              <div key={s} className="flex flex-1 items-center last:flex-none">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold ${
                      i <= active
                        ? "bg-[image:var(--gradient-primary)] text-primary-foreground"
                        : "border border-border/60 text-muted-foreground"
                    }`}
                  >
                    {i + 1}
                  </div>
                  <div className="mt-2 max-w-[90px] text-center text-[11px] text-muted-foreground">
                    {s}
                  </div>
                </div>
                {i < stages.length - 1 && (
                  <div
                    className={`mx-2 h-px flex-1 ${
                      i < active ? "bg-primary/60" : "bg-border"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="mt-6 grid grid-cols-3 gap-3 text-xs">
            <StatCell label="Classes" value="3" />
            <StatCell label="Vigência" value="2033" />
            <StatCell label="Oposições" value="0" tone="success" />
          </div>
        </div>
        <div className="glass rounded-2xl p-6 ring-gradient">
          <div className="text-xs font-mono uppercase tracking-widest text-warning">
            Novos pedidos parecidos
          </div>
          <ul className="mt-3 space-y-3">
            <li className="flex items-center justify-between text-sm">
              <span className="font-mono">BRANDSHIELD PRO</span>
              <RiskBadge tone="warning">Médio</RiskBadge>
            </li>
            <li className="flex items-center justify-between text-sm">
              <span className="font-mono">BRAND SHIELD IA</span>
              <RiskBadge tone="danger">Alto</RiskBadge>
            </li>
            <li className="flex items-center justify-between text-sm">
              <span className="font-mono">BRAND-SHIELD.AI</span>
              <RiskBadge tone="success">Baixo</RiskBadge>
            </li>
          </ul>
          <button className="mt-5 inline-flex items-center gap-2 text-xs font-medium text-primary hover:underline">
            <FileText className="h-3.5 w-3.5" /> Preparar oposição automaticamente
          </button>
        </div>
      </div>
    </ModuleSection>
  );
}

function StatCell({ label, value, tone }: { label: string; value: string; tone?: "success" }) {
  return (
    <div className="rounded-lg border border-border/60 bg-background/40 p-3">
      <div
        className={`font-display text-lg font-bold ${
          tone === "success" ? "text-[color:var(--success)]" : ""
        }`}
      >
        {value}
      </div>
      <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
    </div>
  );
}

/* ----------------- Wrapper ----------------- */
function ModuleSection({
  id,
  eyebrow,
  title,
  description,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-10 max-w-2xl">
          <div className="text-xs font-mono uppercase tracking-widest text-primary">{eyebrow}</div>
          <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">{title}</h2>
          <p className="mt-3 text-muted-foreground">{description}</p>
        </div>
        {children}
      </div>
    </section>
  );
}
