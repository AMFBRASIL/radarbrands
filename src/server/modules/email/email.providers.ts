import nodemailer from "nodemailer";

import { SMTP_PRESETS } from "./email.constants";
import type { ResolvedEmailConfig, SendEmailInput, SendEmailResult } from "./email.types";

type ProviderSendInput = {
  config: ResolvedEmailConfig;
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  replyTo?: string;
};

function buildFrom(config: ResolvedEmailConfig, override?: { fromEmail?: string; fromName?: string }) {
  const email = override?.fromEmail ?? config.fromEmail;
  const name = override?.fromName ?? config.fromName;
  return name ? `${name} <${email}>` : email;
}

async function sendViaSmtp(input: ProviderSendInput): Promise<SendEmailResult> {
  const log: string[] = [];
  const preset = SMTP_PRESETS[input.config.providerId];
  const host = input.config.smtpHost ?? input.config.credentials.host ?? preset?.host;
  const port =
    input.config.smtpPort ??
    (Number(input.config.credentials.port) || preset?.port);
  const secure =
    input.config.smtpSecure ??
    (input.config.credentials.secure === "true" ? true : preset?.secure ?? false);

  if (!host || !port) {
    throw new Error("Servidor SMTP não configurado (host/porta)");
  }

  log.push(`→ Conectando via SMTP · ${host}:${port}`);
  const transport = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user: input.config.credentials.user,
      pass: input.config.credentials.pass,
    },
  });

  await transport.verify();
  log.push("✓ Handshake TLS estabelecido");
  log.push("✓ Autenticação aceita");

  const recipients = Array.isArray(input.to) ? input.to : [input.to];
  log.push(`→ Enviando mensagem para ${recipients.join(", ")}`);

  const info = await transport.sendMail({
    from: buildFrom(input.config),
    to: recipients.join(", "),
    subject: input.subject,
    html: input.html,
    text: input.text,
    replyTo: input.replyTo ?? input.config.replyTo,
  });

  log.push(`✓ Mensagem aceita · ${info.messageId ?? "ok"}`);

  return {
    ok: true,
    providerId: input.config.providerId,
    transport: "smtp",
    messageId: info.messageId,
    log,
  };
}

async function sendViaResend(input: ProviderSendInput): Promise<SendEmailResult> {
  const log: string[] = ["→ Conectando via API · Resend"];
  const apiKey = input.config.credentials.api_key || process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("API Key do Resend não configurada");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: buildFrom(input.config, { fromEmail: input.config.credentials.from }),
      to: Array.isArray(input.to) ? input.to : [input.to],
      subject: input.subject,
      html: input.html,
      text: input.text,
      reply_to: input.replyTo ?? input.config.replyTo,
    }),
  });

  const payload = (await response.json()) as { id?: string; message?: string };
  if (!response.ok) {
    throw new Error(payload.message ?? "Falha ao enviar via Resend");
  }

  log.push("✓ Autenticação aceita");
  log.push(`✓ Mensagem enfileirada · ${payload.id ?? "ok"}`);

  return {
    ok: true,
    providerId: "resend",
    transport: "api",
    messageId: payload.id,
    log,
  };
}

async function sendViaSendGrid(input: ProviderSendInput): Promise<SendEmailResult> {
  const log: string[] = ["→ Conectando via API · SendGrid"];
  const apiKey = input.config.credentials.api_key;
  if (!apiKey) throw new Error("API Key do SendGrid não configurada");

  const recipients = (Array.isArray(input.to) ? input.to : [input.to]).map((email) => ({
    email,
  }));

  const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      personalizations: [{ to: recipients }],
      from: {
        email: input.config.credentials.from ?? input.config.fromEmail,
        name: input.config.fromName,
      },
      reply_to: input.replyTo ?? input.config.replyTo
        ? { email: input.replyTo ?? input.config.replyTo }
        : undefined,
      subject: input.subject,
      content: [
        ...(input.text ? [{ type: "text/plain", value: input.text }] : []),
        ...(input.html ? [{ type: "text/html", value: input.html }] : []),
      ],
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(body || "Falha ao enviar via SendGrid");
  }

  const messageId = response.headers.get("x-message-id") ?? undefined;
  log.push("✓ Autenticação aceita");
  log.push(`✓ Mensagem aceita · ${messageId ?? "ok"}`);

  return {
    ok: true,
    providerId: "sendgrid",
    transport: "api",
    messageId,
    log,
  };
}

async function sendViaMailgun(input: ProviderSendInput): Promise<SendEmailResult> {
  const log: string[] = ["→ Conectando via API · Mailgun"];
  const apiKey = input.config.credentials.api_key;
  const domain = input.config.credentials.domain;
  if (!apiKey || !domain) throw new Error("API Key ou domínio do Mailgun não configurados");

  const form = new FormData();
  form.append(
    "from",
    buildFrom(input.config, { fromEmail: input.config.credentials.from ?? input.config.fromEmail }),
  );
  const recipients = Array.isArray(input.to) ? input.to : [input.to];
  for (const email of recipients) form.append("to", email);
  form.append("subject", input.subject);
  if (input.html) form.append("html", input.html);
  if (input.text) form.append("text", input.text);

  const response = await fetch(`https://api.mailgun.net/v3/${domain}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`api:${apiKey}`).toString("base64")}`,
    },
    body: form,
  });

  const payload = (await response.json()) as { id?: string; message?: string };
  if (!response.ok) {
    throw new Error(payload.message ?? "Falha ao enviar via Mailgun");
  }

  log.push("✓ Autenticação aceita");
  log.push(`✓ Mensagem enfileirada · ${payload.id ?? "ok"}`);

  return {
    ok: true,
    providerId: "mailgun",
    transport: "api",
    messageId: payload.id,
    log,
  };
}

async function sendViaPostmark(input: ProviderSendInput): Promise<SendEmailResult> {
  const log: string[] = ["→ Conectando via API · Postmark"];
  const apiKey = input.config.credentials.api_key;
  if (!apiKey) throw new Error("Server Token do Postmark não configurado");

  const response = await fetch("https://api.postmarkapp.com/email", {
    method: "POST",
    headers: {
      "X-Postmark-Server-Token": apiKey,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      From: buildFrom(input.config, {
        fromEmail: input.config.credentials.from ?? input.config.fromEmail,
      }),
      To: (Array.isArray(input.to) ? input.to : [input.to]).join(", "),
      Subject: input.subject,
      HtmlBody: input.html,
      TextBody: input.text,
      ReplyTo: input.replyTo ?? input.config.replyTo,
    }),
  });

  const payload = (await response.json()) as { MessageID?: string; Message?: string };
  if (!response.ok) {
    throw new Error(payload.Message ?? "Falha ao enviar via Postmark");
  }

  log.push("✓ Autenticação aceita");
  log.push(`✓ Mensagem aceita · ${payload.MessageID ?? "ok"}`);

  return {
    ok: true,
    providerId: "postmark",
    transport: "api",
    messageId: payload.MessageID,
    log,
  };
}

async function sendViaSesSmtp(input: ProviderSendInput): Promise<SendEmailResult> {
  const region = input.config.credentials.region ?? "us-east-1";
  return sendViaSmtp({
    ...input,
    config: {
      ...input.config,
      providerId: "ses",
      smtpHost: `email-smtp.${region}.amazonaws.com`,
      smtpPort: 587,
      smtpSecure: false,
      credentials: {
        ...input.config.credentials,
        user: input.config.credentials.access_key,
        pass: input.config.credentials.secret_key,
      },
    },
  });
}

export async function dispatchEmail(
  config: ResolvedEmailConfig,
  input: Omit<SendEmailInput, "organizationId">,
): Promise<SendEmailResult> {
  const payload: ProviderSendInput = {
    config: {
      ...config,
      fromEmail: input.fromEmail ?? config.fromEmail,
      fromName: input.fromName ?? config.fromName,
      replyTo: input.replyTo ?? config.replyTo,
    },
    to: input.to,
    subject: input.subject,
    html: input.html,
    text: input.text,
    replyTo: input.replyTo,
  };

  if (config.transport === "smtp" || config.providerId === "ses") {
    if (config.providerId === "ses") {
      return sendViaSesSmtp(payload);
    }
    return sendViaSmtp(payload);
  }

  switch (config.providerId) {
    case "resend":
    case "lovable":
      return sendViaResend(payload);
    case "sendgrid":
      return sendViaSendGrid(payload);
    case "mailgun":
      return sendViaMailgun(payload);
    case "postmark":
      return sendViaPostmark(payload);
    default:
      throw new Error(`Provedor de API não suportado: ${config.providerId}`);
  }
}
