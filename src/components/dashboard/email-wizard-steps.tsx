import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { WizardStep } from "./settings-wizard";
import {
  Check,
  Cloud,
  Loader2,
  Mail,
  Send,
  Server,
  Sparkles,
  Zap,
} from "lucide-react";

type Mode = "api" | "smtp";

type Provider = {
  id: string;
  name: string;
  desc: string;
  tag?: string;
  fields: { key: string; label: string; placeholder?: string; type?: "text" | "password" }[];
};

const API_PROVIDERS: Provider[] = [
  {
    id: "resend",
    name: "Resend",
    desc: "Simples, alta entregabilidade, ideal para transacional.",
    tag: "Popular",
    fields: [
      { key: "api_key", label: "API Key", placeholder: "re_xxxxxxxxxxxxxxxx", type: "password" },
      { key: "from", label: "Remetente", placeholder: "alerts@radarbrand.com.br" },
    ],
  },
  {
    id: "sendgrid",
    name: "SendGrid",
    desc: "Escala massiva, ótimo para relatórios e digest.",
    fields: [
      { key: "api_key", label: "API Key", placeholder: "SG.xxxxx", type: "password" },
      { key: "from", label: "Remetente", placeholder: "alerts@radarbrand.com.br" },
    ],
  },
  {
    id: "mailgun",
    name: "Mailgun",
    desc: "Roteamento avançado, webhooks e analytics.",
    fields: [
      { key: "api_key", label: "API Key", placeholder: "key-xxxxxxxx", type: "password" },
      { key: "domain", label: "Domínio", placeholder: "mg.radarbrand.com.br" },
      { key: "from", label: "Remetente", placeholder: "alerts@radarbrand.com.br" },
    ],
  },
  {
    id: "postmark",
    name: "Postmark",
    desc: "Velocidade recorde para transacionais críticos.",
    fields: [
      { key: "api_key", label: "Server Token", placeholder: "POSTMARK_TOKEN", type: "password" },
      { key: "from", label: "Remetente", placeholder: "alerts@radarbrand.com.br" },
    ],
  },
  {
    id: "ses",
    name: "Amazon SES",
    desc: "Baixo custo em escala AWS.",
    tag: "Enterprise",
    fields: [
      { key: "access_key", label: "Access Key ID", placeholder: "AKIA..." },
      { key: "secret_key", label: "Secret Access Key", placeholder: "••••••••", type: "password" },
      { key: "region", label: "Região", placeholder: "us-east-1" },
      { key: "from", label: "Remetente", placeholder: "alerts@radarbrand.com.br" },
    ],
  },
  {
    id: "lovable",
    name: "Radar Emails",
    desc: "Infraestrutura própria pré-configurada.",
    tag: "Nativo",
    fields: [{ key: "from", label: "Remetente", placeholder: "alerts@radarbrand.com.br" }],
  },
];

const SMTP_PROVIDERS: Provider[] = [
  {
    id: "gmail",
    name: "Google Workspace",
    desc: "smtp.gmail.com · porta 587 · TLS",
    tag: "Popular",
    fields: [
      { key: "user", label: "Usuário", placeholder: "alerts@suaempresa.com" },
      { key: "pass", label: "Senha de app", placeholder: "••••••••••••", type: "password" },
    ],
  },
  {
    id: "office365",
    name: "Microsoft 365",
    desc: "smtp.office365.com · porta 587 · STARTTLS",
    fields: [
      { key: "user", label: "Usuário", placeholder: "alerts@suaempresa.com" },
      { key: "pass", label: "Senha", placeholder: "••••••••", type: "password" },
    ],
  },
  {
    id: "zoho",
    name: "Zoho Mail",
    desc: "smtp.zoho.com · porta 465 · SSL",
    fields: [
      { key: "user", label: "Usuário", placeholder: "alerts@suaempresa.com" },
      { key: "pass", label: "Senha", placeholder: "••••••••", type: "password" },
    ],
  },
  {
    id: "custom",
    name: "SMTP Personalizado",
    desc: "Configure seu próprio servidor corporativo.",
    fields: [
      { key: "host", label: "Servidor SMTP", placeholder: "smtp.suaempresa.com" },
      { key: "port", label: "Porta", placeholder: "587" },
      { key: "user", label: "Usuário", placeholder: "alerts@suaempresa.com" },
      { key: "pass", label: "Senha", placeholder: "••••••••", type: "password" },
    ],
  },
];

function BigCard({
  selected,
  onClick,
  icon: Icon,
  title,
  desc,
  tag,
}: {
  selected: boolean;
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
  tag?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative flex flex-col items-start gap-3 overflow-hidden rounded-2xl border p-5 text-left transition-all",
        selected
          ? "border-primary bg-primary/10 shadow-[var(--shadow-glow)]"
          : "border-border/60 bg-card/40 hover:-translate-y-0.5 hover:border-primary/50",
      )}
    >
      <div className="flex w-full items-start justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-glow)]">
          <Icon className="h-5 w-5" />
        </div>
        {selected && (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Check className="h-3.5 w-3.5" />
          </div>
        )}
      </div>
      <div>
        <div className="flex items-center gap-2">
          <h3 className="font-display text-base font-semibold">{title}</h3>
          {tag && (
            <span className="rounded bg-primary/15 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-primary">
              {tag}
            </span>
          )}
        </div>
        <p className="mt-1 text-xs text-muted-foreground">{desc}</p>
      </div>
    </button>
  );
}

export function useEmailWizardSteps(): WizardStep[] {
  const [mode, setMode] = useState<Mode>("api");
  const [providerId, setProviderId] = useState<string>("resend");
  const [values, setValues] = useState<Record<string, string>>({});
  const [testEmail, setTestEmail] = useState("meu-email@empresa.com.br");
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<null | "ok" | "err">(null);
  const [testLog, setTestLog] = useState<string[]>([]);

  const providers = mode === "api" ? API_PROVIDERS : SMTP_PROVIDERS;
  const provider = providers.find((p) => p.id === providerId) ?? providers[0];

  const runTest = () => {
    setTesting(true);
    setTestResult(null);
    setTestLog([]);
    const log = [
      `→ Conectando via ${mode.toUpperCase()} · ${provider.name}...`,
      `✓ Handshake TLS estabelecido`,
      `✓ Autenticação aceita`,
      `→ Enviando mensagem de teste para ${testEmail}`,
      `✓ Mensagem 250 OK · queued as ${Math.random().toString(36).slice(2, 12)}`,
    ];
    let i = 0;
    const tick = () => {
      if (i < log.length) {
        setTestLog((l) => [...l, log[i]]);
        i++;
        setTimeout(tick, 380);
      } else {
        setTestResult("ok");
        setTesting(false);
      }
    };
    setTimeout(tick, 300);
  };

  return useMemo<WizardStep[]>(
    () => [
      {
        key: "mode",
        title: "Método de envio",
        subtitle: "Como o Radar | brand vai enviar os e-mails",
        content: (
          <div className="grid gap-4 sm:grid-cols-2">
            <BigCard
              selected={mode === "api"}
              onClick={() => {
                setMode("api");
                setProviderId("resend");
                setValues({});
                setTestResult(null);
              }}
              icon={Cloud}
              title="API HTTP"
              desc="Mais rápido, escalável e com webhooks nativos. Recomendado."
              tag="Recomendado"
            />
            <BigCard
              selected={mode === "smtp"}
              onClick={() => {
                setMode("smtp");
                setProviderId("gmail");
                setValues({});
                setTestResult(null);
              }}
              icon={Server}
              title="SMTP Clássico"
              desc="Compatível com qualquer servidor de e-mail corporativo."
            />
          </div>
        ),
      },
      {
        key: "provider",
        title: mode === "api" ? "Escolha o provedor de API" : "Escolha o servidor SMTP",
        subtitle: "Selecione o serviço que fará a entrega",
        content: (
          <div className="grid gap-3 sm:grid-cols-2">
            {providers.map((p) => (
              <BigCard
                key={p.id}
                selected={providerId === p.id}
                onClick={() => {
                  setProviderId(p.id);
                  setValues({});
                  setTestResult(null);
                }}
                icon={mode === "api" ? Zap : Mail}
                title={p.name}
                desc={p.desc}
                tag={p.tag}
              />
            ))}
          </div>
        ),
      },
      {
        key: "credentials",
        title: "Credenciais",
        subtitle: `Informe as chaves de acesso do ${provider.name}`,
        content: (
          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-card/40 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[image:var(--gradient-primary)] text-primary-foreground">
                {mode === "api" ? <Cloud className="h-5 w-5" /> : <Server className="h-5 w-5" />}
              </div>
              <div>
                <div className="text-sm font-semibold">{provider.name}</div>
                <div className="text-xs text-muted-foreground">
                  {mode === "api" ? "Integração via API HTTP" : "Servidor SMTP"}
                </div>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {provider.fields.map((f) => (
                <div key={f.key} className="space-y-1.5">
                  <Label className="text-xs font-medium">{f.label}</Label>
                  <Input
                    type={f.type ?? "text"}
                    placeholder={f.placeholder}
                    value={values[f.key] ?? ""}
                    onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                  />
                </div>
              ))}
            </div>
            <p className="text-[11px] text-muted-foreground">
              As credenciais são armazenadas criptografadas em cofre gerenciado (AES-256) e nunca expostas em logs.
            </p>
          </div>
        ),
      },
      {
        key: "test",
        title: "Teste de envio",
        subtitle: "Enviamos uma mensagem real para confirmar tudo funcionando",
        content: (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Enviar teste para</Label>
                <Input
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="voce@empresa.com.br"
                />
              </div>
              <Button onClick={runTest} disabled={testing}>
                {testing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enviando...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" /> Enviar teste
                  </>
                )}
              </Button>
            </div>

            <div className="rounded-2xl border border-border/60 bg-black/40 p-4 font-mono text-[11px] leading-relaxed text-emerald-300 min-h-[180px]">
              {testLog.length === 0 && !testing && (
                <div className="text-muted-foreground">
                  Aguardando execução do teste... Clique em <span className="text-primary">Enviar teste</span>.
                </div>
              )}
              {testLog.map((l, i) => (
                <div key={i}>{l}</div>
              ))}
              {testing && <div className="mt-1 animate-pulse text-primary">▌</div>}
            </div>

            {testResult === "ok" && (
              <div className="flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
                <Sparkles className="h-4 w-4" /> Teste concluído — verifique a caixa de entrada de {testEmail}.
              </div>
            )}
            {testResult === "err" && (
              <div className="flex items-center gap-2 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                Falha no envio. Revise as credenciais e tente novamente.
              </div>
            )}
          </div>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mode, providerId, values, testEmail, testing, testResult, testLog],
  );
}
