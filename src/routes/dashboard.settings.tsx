import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SimplePage } from "@/components/dashboard/simple";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Bell,
  Bot,
  Building2,
  Cable,
  ChevronRight,
  CreditCard,
  Database,
  FileClock,
  Fingerprint,
  Globe2,
  KeyRound,
  Languages,
  Mail,
  Palette,
  Plug,
  Radio,
  ScrollText,
  Server,
  ShieldCheck,
  Sparkles,
  Users2,
  Webhook,
} from "lucide-react";

export const Route = createFileRoute("/dashboard/settings")({
  component: SettingsPage,
});

type Section =
  | "brand"
  | "team"
  | "email"
  | "ai"
  | "system"
  | "integrations"
  | "webhooks"
  | "api"
  | "notifications"
  | "security"
  | "billing"
  | "audit"
  | "data"
  | "appearance"
  | "domains"
  | "localization"
  | "channels";

const cards: {
  id: Section;
  title: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  tag?: string;
  gradient: string;
}[] = [
  { id: "brand", title: "Marca & Perfil", desc: "Nome, logotipo, domínio principal e identidade da conta.", icon: Building2, gradient: "from-cyan-500/25 to-teal-500/10" },
  { id: "team", title: "Usuários & Permissões", desc: "Convide o time, defina papéis (Admin, Analista, Jurídico) e SSO.", icon: Users2, tag: "SSO", gradient: "from-indigo-500/25 to-purple-500/10" },
  { id: "email", title: "E-mail & SMTP", desc: "Servidor SMTP dedicado, DKIM, templates de notificação e relatórios.", icon: Mail, gradient: "from-emerald-500/25 to-cyan-500/10" },
  { id: "ai", title: "IA & Modelos", desc: "Sensibilidade, provedor, temperatura e regras de auto-ação.", icon: Bot, tag: "PRO", gradient: "from-fuchsia-500/25 to-indigo-500/10" },
  { id: "system", title: "Sistema", desc: "Fuso horário, formato de datas, retenção e engine de crawler.", icon: Server, gradient: "from-slate-400/25 to-slate-600/10" },
  { id: "integrations", title: "Integrações", desc: "Slack, Teams, Jira, Notion, HubSpot, Google Workspace e mais.", icon: Plug, gradient: "from-orange-500/25 to-amber-500/10" },
  { id: "webhooks", title: "Webhooks", desc: "Envie eventos em tempo real para seus sistemas com HMAC.", icon: Webhook, gradient: "from-violet-500/25 to-fuchsia-500/10" },
  { id: "api", title: "API & Chaves", desc: "Tokens PAT, escopos, IP allowlist e limites por segundo.", icon: KeyRound, tag: "DEV", gradient: "from-lime-500/25 to-emerald-500/10" },
  { id: "notifications", title: "Notificações", desc: "E-mail, SMS, push, Slack e canais críticos com escalonamento.", icon: Bell, gradient: "from-yellow-500/25 to-orange-500/10" },
  { id: "security", title: "Segurança & 2FA", desc: "MFA obrigatório, sessões, políticas de senha e device trust.", icon: ShieldCheck, gradient: "from-red-500/25 to-rose-500/10" },
  { id: "billing", title: "Faturamento", desc: "Plano, uso, notas fiscais, método de pagamento e limites.", icon: CreditCard, gradient: "from-teal-500/25 to-cyan-500/10" },
  { id: "audit", title: "Logs & Auditoria", desc: "Trilha completa de ações, exportação SIEM e retenção legal.", icon: FileClock, gradient: "from-sky-500/25 to-blue-500/10" },
  { id: "data", title: "Dados & Backup", desc: "Exportação, backup diário, LGPD, DPO e direito ao esquecimento.", icon: Database, gradient: "from-blue-500/25 to-indigo-500/10" },
  { id: "appearance", title: "Aparência", desc: "Tema, densidade, cor de destaque e white-label para agências.", icon: Palette, gradient: "from-pink-500/25 to-rose-500/10" },
  { id: "domains", title: "Domínios monitorados", desc: "Lista mestra de termos, TLDs, homoglifos e exceções.", icon: Globe2, gradient: "from-cyan-500/25 to-blue-500/10" },
  { id: "localization", title: "Idioma & Região", desc: "Idioma da interface, moeda, país-alvo e fuso do relatório.", icon: Languages, gradient: "from-emerald-500/25 to-lime-500/10" },
  { id: "channels", title: "Canais de captura", desc: "Ative/desative Google, Bing, TikTok, Meta, X, LinkedIn, apps.", icon: Radio, gradient: "from-purple-500/25 to-indigo-500/10" },
];

function SettingsPage() {
  const [active, setActive] = useState<Section | null>(null);

  return (
    <SimplePage
      eyebrow="Configurações"
      title="Central de configurações"
      description="Toda a operação do Radar | brand em um só lugar — escolha uma área para configurar."
    >
      {active === null ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c) => (
            <button
              key={c.id}
              onClick={() => setActive(c.id)}
              className="group relative flex flex-col items-start gap-3 overflow-hidden rounded-2xl border border-border/60 bg-card/60 p-5 text-left transition-all hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-[var(--shadow-elevated)]"
            >
              <div className={`absolute inset-0 -z-10 bg-gradient-to-br ${c.gradient} opacity-60`} />
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-glow)]">
                <c.icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-base font-semibold">{c.title}</h3>
                  {c.tag && (
                    <span className="rounded bg-primary/15 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-primary">
                      {c.tag}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{c.desc}</p>
              </div>
              <div className="flex items-center gap-1 text-xs text-primary opacity-0 transition-opacity group-hover:opacity-100">
                Configurar <ChevronRight className="h-3.5 w-3.5" />
              </div>
            </button>
          ))}
        </div>
      ) : (
        <SectionEditor id={active} onBack={() => setActive(null)} />
      )}
    </SimplePage>
  );
}

function SectionEditor({ id, onBack }: { id: Section; onBack: () => void }) {
  const meta = cards.find((c) => c.id === id)!;
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" onClick={onBack}>
          ← Voltar
        </Button>
        <div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-primary">
            {meta.title}
          </div>
          <h2 className="font-display text-2xl font-bold">{meta.title}</h2>
        </div>
      </div>
      <div className="glass-strong ring-gradient rounded-2xl p-6">{renderBody(id)}</div>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium">{label}</Label>
      {children}
      {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  );
}

function Row({ title, desc, defaultChecked }: { title: string; desc?: string; defaultChecked?: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border/60 bg-card/40 p-3">
      <div>
        <div className="text-sm font-medium">{title}</div>
        {desc && <div className="text-xs text-muted-foreground">{desc}</div>}
      </div>
      <Switch defaultChecked={defaultChecked} />
    </div>
  );
}

function renderBody(id: Section) {
  switch (id) {
    case "brand":
      return (
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Nome da marca"><Input defaultValue="CADBRASIL" /></Field>
          <Field label="Domínio principal"><Input defaultValue="cadbrasil.com.br" /></Field>
          <Field label="Razão social"><Input defaultValue="CadBrasil Sistemas Ltda." /></Field>
          <Field label="CNPJ"><Input defaultValue="00.000.000/0001-00" /></Field>
          <div className="md:col-span-2">
            <Field label="Descrição da marca" hint="Usada para calibrar a IA de detecção de contexto."><Textarea rows={3} defaultValue="Fabricante brasileira de sistemas de gestão para indústria." /></Field>
          </div>
        </div>
      );
    case "team":
      return (
        <div className="space-y-3">
          <Row title="Login com Google Workspace" desc="SSO OAuth 2.0" defaultChecked />
          <Row title="SSO SAML (Okta, Azure AD)" desc="Provisionamento SCIM automático" />
          <Row title="Aprovação obrigatória para novos convites" defaultChecked />
          <div className="grid gap-3 md:grid-cols-3">
            <Field label="Admins"><Input defaultValue="2" /></Field>
            <Field label="Analistas"><Input defaultValue="6" /></Field>
            <Field label="Jurídico"><Input defaultValue="3" /></Field>
          </div>
          <Button>Convidar usuário</Button>
        </div>
      );
    case "email":
      return (
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Servidor SMTP"><Input defaultValue="smtp.radarbrand.com.br" /></Field>
          <Field label="Porta"><Input defaultValue="587" /></Field>
          <Field label="Usuário"><Input defaultValue="alerts@cadbrasil.com.br" /></Field>
          <Field label="Senha / Token"><Input type="password" defaultValue="********" /></Field>
          <Field label="Remetente padrão"><Input defaultValue="Radar | brand <alerts@cadbrasil.com.br>" /></Field>
          <Field label="Reply-To"><Input defaultValue="juridico@cadbrasil.com.br" /></Field>
          <div className="md:col-span-2 space-y-3">
            <Row title="DKIM verificado" desc="Assinatura digital de saída" defaultChecked />
            <Row title="Digest diário para diretoria" defaultChecked />
            <Row title="Relatório semanal em PDF" defaultChecked />
          </div>
        </div>
      );
    case "ai":
      return (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Provedor de IA"><Input defaultValue="Radar Core · Ensemble (GPT + Gemini + Claude)" /></Field>
            <Field label="Idioma primário do modelo"><Input defaultValue="pt-BR" /></Field>
            <Field label="Sensibilidade de detecção (0–100)" hint="Quanto maior, mais alertas — e mais falsos-positivos."><Input defaultValue="72" /></Field>
            <Field label="Confiança mínima para auto-ação (%)"><Input defaultValue="88" /></Field>
          </div>
          <Row title="AI Autopilot" desc="Executa notificações e take-downs automaticamente acima do limiar" defaultChecked />
          <Row title="Deepfake Detector" desc="Analisa vídeo e áudio suspeitos" defaultChecked />
          <Row title="Análise de sentimento em tempo real" defaultChecked />
          <Row title="Explicabilidade (XAI)" desc="Anexa evidências e raciocínio do modelo em cada alerta" defaultChecked />
        </div>
      );
    case "system":
      return (
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Fuso horário"><Input defaultValue="America/Sao_Paulo (GMT-3)" /></Field>
          <Field label="Formato de data"><Input defaultValue="DD/MM/YYYY" /></Field>
          <Field label="Retenção de evidências"><Input defaultValue="24 meses" /></Field>
          <Field label="Frequência do crawler"><Input defaultValue="a cada 5 min" /></Field>
          <div className="md:col-span-2 space-y-3">
            <Row title="Modo Alta Performance" desc="Aumenta paralelismo do crawler" defaultChecked />
            <Row title="Manutenção agendada aos domingos 03h" />
          </div>
        </div>
      );
    case "integrations":
      return (
        <div className="grid gap-3 md:grid-cols-2">
          {[
            ["Slack", "Alertas em canais #war-room, #juridico", true],
            ["Microsoft Teams", "Cards adaptativos com evidências", false],
            ["Jira", "Abertura automática de tickets", true],
            ["Notion", "Sincroniza dossiês em uma base", false],
            ["HubSpot", "Cria deals a partir de leakage", false],
            ["Google Workspace", "SSO + Drive para relatórios", true],
            ["Zapier / Make", "Playbooks no-code", true],
            ["Salesforce", "Envia alertas para contas-chave", false],
          ].map(([name, desc, on]) => (
            <Row key={name as string} title={name as string} desc={desc as string} defaultChecked={on as boolean} />
          ))}
        </div>
      );
    case "webhooks":
      return (
        <div className="space-y-3">
          <Field label="Endpoint URL"><Input defaultValue="https://api.cadbrasil.com.br/hooks/radar" /></Field>
          <Field label="Assinatura HMAC (SHA-256)" hint="Rotacione a cada 90 dias."><Input defaultValue="whsec_••••••••••••••••" /></Field>
          <Field label="Eventos"><Textarea rows={3} defaultValue={"alert.created\nalert.escalated\ntakedown.completed\ndeepfake.detected\ncrisis.index.changed"} /></Field>
          <div className="flex gap-2"><Button>Testar envio</Button><Button variant="outline">Rotacionar segredo</Button></div>
        </div>
      );
    case "api":
      return (
        <div className="space-y-3">
          <Field label="Chave PAT ativa"><Input defaultValue="pat_live_wSj••••••••••••" /></Field>
          <div className="grid gap-3 md:grid-cols-3">
            <Field label="Rate limit (req/s)"><Input defaultValue="50" /></Field>
            <Field label="Escopo"><Input defaultValue="read:alerts write:takedowns" /></Field>
            <Field label="Expira em"><Input defaultValue="90 dias" /></Field>
          </div>
          <Field label="IP allowlist"><Textarea rows={2} defaultValue={"200.180.10.0/24\n2804:14c::/32"} /></Field>
          <Button>Gerar nova chave</Button>
        </div>
      );
    case "notifications":
      return (
        <div className="space-y-3">
          {[
            ["Alertas críticos por e-mail", true],
            ["Digest semanal", true],
            ["Notificações push (Slack)", true],
            ["SMS para críticos", false],
            ["WhatsApp Business", true],
            ["Chamada telefônica em crise nível 4+", false],
          ].map(([t, on]) => (
            <Row key={t as string} title={t as string} defaultChecked={on as boolean} />
          ))}
        </div>
      );
    case "security":
      return (
        <div className="space-y-3">
          <Row title="MFA obrigatório para toda a conta" defaultChecked />
          <Row title="Login apenas com dispositivo confiável" />
          <Row title="Expirar sessão após 30 min inativo" defaultChecked />
          <Row title="Bloquear login fora do Brasil" />
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Comprimento mínimo de senha"><Input defaultValue="12" /></Field>
            <Field label="Rotação de senha (dias)"><Input defaultValue="90" /></Field>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground"><Fingerprint className="h-4 w-4 text-primary" /> Biometria WebAuthn habilitada</div>
        </div>
      );
    case "billing":
      return (
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Plano atual"><Input defaultValue="Personalizado · Enterprise" /></Field>
          <Field label="Ciclo"><Input defaultValue="Anual" /></Field>
          <Field label="Método de pagamento"><Input defaultValue="Boleto + NF-e" /></Field>
          <Field label="Próxima fatura"><Input defaultValue="12/01/2027 · R$ 34.200" /></Field>
          <div className="md:col-span-2 flex gap-2"><Button>Baixar NF-e</Button><Button variant="outline">Alterar método</Button></div>
        </div>
      );
    case "audit":
      return (
        <div className="space-y-3">
          <Row title="Enviar logs para SIEM (Splunk / Datadog)" defaultChecked />
          <Row title="Retenção legal 7 anos" defaultChecked />
          <Row title="Assinar cadeia de custódia com blockchain" desc="Ledger imutável para dossiês jurídicos" defaultChecked />
          <div className="flex items-center gap-2 text-xs text-muted-foreground"><ScrollText className="h-4 w-4 text-primary" /> Última auditoria: 03/07/2026 — íntegra</div>
        </div>
      );
    case "data":
      return (
        <div className="space-y-3">
          <Row title="Backup diário criptografado" defaultChecked />
          <Row title="Exportação sob demanda (JSON / CSV)" defaultChecked />
          <Row title="Direito ao esquecimento (LGPD art. 18)" defaultChecked />
          <Field label="DPO responsável"><Input defaultValue="dpo@cadbrasil.com.br" /></Field>
          <div className="flex gap-2"><Button>Exportar tudo</Button><Button variant="outline">Solicitar apagamento</Button></div>
        </div>
      );
    case "appearance":
      return (
        <div className="space-y-3">
          <Row title="Tema escuro" desc="Padrão da plataforma" defaultChecked />
          <Row title="Modo alto contraste (acessibilidade)" />
          <Row title="Densidade compacta" />
          <Row title="White-label para agências" desc="Sua logo, seu domínio, sua paleta" />
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Cor primária (hex)"><Input defaultValue="#22d3ee" /></Field>
            <Field label="Domínio white-label"><Input defaultValue="protecao.suaagencia.com" /></Field>
          </div>
        </div>
      );
    case "domains":
      return (
        <div className="space-y-3">
          <Field label="Termos monitorados" hint="Um por linha."><Textarea rows={5} defaultValue={"cadbrasil\ncad brasil\ncadbrasil sistemas\ncadbr"} /></Field>
          <Field label="TLDs prioritários"><Input defaultValue=".com.br, .com, .app, .net, .io" /></Field>
          <Field label="Exceções (não alertar)"><Textarea rows={2} defaultValue={"cadbrasil.gov.br\ncadbrasiloficial.com.br"} /></Field>
          <Row title="Detectar homoglifos (caracteres visualmente idênticos)" defaultChecked />
          <Row title="Detectar typosquatting com IA" defaultChecked />
        </div>
      );
    case "localization":
      return (
        <div className="grid gap-3 md:grid-cols-2">
          <Field label="Idioma da interface"><Input defaultValue="Português (Brasil)" /></Field>
          <Field label="Moeda"><Input defaultValue="BRL (R$)" /></Field>
          <Field label="País-alvo primário"><Input defaultValue="Brasil" /></Field>
          <Field label="Fuso do relatório executivo"><Input defaultValue="America/Sao_Paulo" /></Field>
        </div>
      );
    case "channels":
      return (
        <div className="grid gap-3 md:grid-cols-2">
          {[
            ["Google Search", true],
            ["Bing Search", true],
            ["Instagram", true],
            ["Facebook", true],
            ["TikTok", true],
            ["YouTube", true],
            ["X / Twitter", true],
            ["LinkedIn", true],
            ["Reclame Aqui", true],
            ["Google Play", true],
            ["App Store", true],
            ["Dark Web (Tor / I2P)", true],
            ["Telegram públicos", false],
            ["Marketplaces LATAM", true],
          ].map(([n, on]) => (
            <Row key={n as string} title={n as string} defaultChecked={on as boolean} />
          ))}
          <div className="col-span-full flex items-center gap-2 text-xs text-muted-foreground"><Cable className="h-4 w-4 text-primary" /> <Sparkles className="h-4 w-4 text-primary" /> Novos canais são ativados por playbook.</div>
        </div>
      );
  }
}
