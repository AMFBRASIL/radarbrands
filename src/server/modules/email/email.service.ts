import { env } from "../../shared/env";
import { BusinessRuleError } from "../../shared/errors";
import {
  getEmailIntegrationConfig,
  markEmailTestResult,
  resolveConfigFromUpsert,
  toResolvedTransport,
} from "./email-config.service";
import { dispatchEmail } from "./email.providers";
import type { EmailSettingsUpsertInput } from "./email.schemas";
import type { ResolvedEmailConfig, SendEmailInput, SendEmailResult } from "./email.types";

function resolvePlatformConfig(): ResolvedEmailConfig | null {
  if (!env.EMAIL_FROM) return null;

  const provider = env.EMAIL_PROVIDER;
  if (provider === "smtp") {
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT ?? 587);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    if (!host || !user || !pass) return null;

    return {
      source: "platform",
      transport: "smtp",
      providerId: "custom",
      fromEmail: env.EMAIL_FROM,
      replyTo: env.EMAIL_REPLY_TO,
      smtpHost: host,
      smtpPort: port,
      smtpSecure: process.env.SMTP_SECURE === "true",
      credentials: { user, pass, host, port: String(port) },
    };
  }

  if (provider === "resend" && process.env.RESEND_API_KEY) {
    return {
      source: "platform",
      transport: "api",
      providerId: "resend",
      fromEmail: env.EMAIL_FROM,
      replyTo: env.EMAIL_REPLY_TO,
      credentials: {
        api_key: process.env.RESEND_API_KEY,
        from: env.EMAIL_FROM,
      },
    };
  }

  if (provider === "mailgun" && process.env.MAILGUN_API_KEY && process.env.MAILGUN_DOMAIN) {
    return {
      source: "platform",
      transport: "api",
      providerId: "mailgun",
      fromEmail: env.EMAIL_FROM,
      replyTo: env.EMAIL_REPLY_TO,
      credentials: {
        api_key: process.env.MAILGUN_API_KEY,
        domain: process.env.MAILGUN_DOMAIN,
        from: env.EMAIL_FROM,
      },
    };
  }

  return null;
}

export async function resolveEmailConfig(
  organizationId?: bigint,
): Promise<ResolvedEmailConfig> {
  if (organizationId) {
    const orgConfig = await getEmailIntegrationConfig(organizationId);
    if (orgConfig) {
      return {
        source: "organization",
        ...toResolvedTransport(orgConfig),
      };
    }
  }

  const platform = resolvePlatformConfig();
  if (platform) return platform;

  throw new BusinessRuleError("E-mail não configurado para esta organização");
}

export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  const config = await resolveEmailConfig(input.organizationId);
  return dispatchEmail(config, input);
}

export async function sendTestEmail(input: {
  organizationId: bigint;
  to: string;
  draft?: EmailSettingsUpsertInput;
}): Promise<SendEmailResult> {
  let config: ResolvedEmailConfig;

  if (input.draft) {
    const existing = await getEmailIntegrationConfig(input.organizationId);
    const resolved = resolveConfigFromUpsert(input.draft, existing);
    config = {
      source: "organization",
      ...toResolvedTransport(resolved),
    };
  } else {
    config = await resolveEmailConfig(input.organizationId);
  }

  const result = await dispatchEmail(config, {
    to: input.to,
    subject: "Radar Brands — teste de e-mail",
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.5">
        <h2>Teste de envio</h2>
        <p>Este é um e-mail de teste enviado pelo módulo <strong>E-mail &amp; SMTP</strong> do Radar Brands.</p>
        <p>Provedor: <code>${config.providerId}</code> · Transporte: <code>${config.transport}</code></p>
      </div>
    `,
    text: "Teste de envio do Radar Brands. Se você recebeu esta mensagem, a configuração está funcionando.",
  });

  if (!input.draft) {
    await markEmailTestResult({
      organizationId: input.organizationId,
      ok: result.ok,
      message: result.messageId ?? "Teste enviado com sucesso",
    });
  }

  return result;
}

export const emailService = {
  send: sendEmail,
  sendTest: sendTestEmail,
  resolveConfig: resolveEmailConfig,
};
