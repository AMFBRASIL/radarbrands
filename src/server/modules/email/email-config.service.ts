import type { IntegrationStat } from "@prisma/client";

import type { Prisma } from "@prisma/client";

import { writeAuditLog } from "../audit/audit.service";
import { decryptJson, encryptJson } from "../../shared/crypto/encryption";
import { prisma } from "../../shared/database";
import {
  EMAIL_INTEGRATION_PROVIDER,
  SECRET_FIELD_KEYS,
  SECRET_MASK,
} from "./email.constants";
import type {
  EmailCredentials,
  EmailIntegrationConfig,
  EmailSettingsPublic,
  EmailTransport,
} from "./email.types";
import type { EmailSettingsUpsertInput } from "./email.schemas";

function defaultFeatures() {
  return {
    dkimVerified: false,
    dailyDigest: true,
    weeklyReport: true,
  };
}

function parseIntegrationConfig(raw: unknown): EmailIntegrationConfig | null {
  if (!raw || typeof raw !== "object") return null;
  const config = raw as Partial<EmailIntegrationConfig>;
  if (!config.transport || !config.providerId || !config.fromEmail || !config.credentialsEnc) {
    return null;
  }
  return {
    transport: config.transport,
    providerId: config.providerId,
    fromEmail: config.fromEmail,
    fromName: config.fromName ?? null,
    replyTo: config.replyTo ?? null,
    smtpHost: config.smtpHost ?? null,
    smtpPort: config.smtpPort ?? null,
    smtpSecure: config.smtpSecure ?? null,
    credentialsEnc: config.credentialsEnc,
    verifiedAt: config.verifiedAt ?? null,
    lastTestAt: config.lastTestAt ?? null,
    lastTestStatus: config.lastTestStatus ?? null,
    lastTestMessage: config.lastTestMessage ?? null,
    features: {
      ...defaultFeatures(),
      ...(config.features ?? {}),
    },
  };
}

function maskCredentials(credentials: EmailCredentials): Record<string, string> {
  const masked: Record<string, string> = {};
  for (const [key, value] of Object.entries(credentials)) {
    if (SECRET_FIELD_KEYS.has(key) && value) {
      masked[key] = SECRET_MASK;
    } else {
      masked[key] = value;
    }
  }
  return masked;
}

function mergeCredentials(
  incoming: Record<string, string>,
  existing: EmailCredentials,
): EmailCredentials {
  const merged: EmailCredentials = { ...existing };
  for (const [key, value] of Object.entries(incoming)) {
    if (!value || value === SECRET_MASK) continue;
    merged[key] = value;
  }
  return merged;
}

function toPublicSettings(
  status: IntegrationStat,
  config: EmailIntegrationConfig | null,
): EmailSettingsPublic {
  if (!config) {
    return {
      configured: false,
      status: "disconnected",
      transport: null,
      providerId: null,
      fromEmail: null,
      fromName: null,
      replyTo: null,
      smtpHost: null,
      smtpPort: null,
      smtpSecure: null,
      credentials: {},
      verifiedAt: null,
      lastTestAt: null,
      lastTestStatus: null,
      lastTestMessage: null,
      features: defaultFeatures(),
    };
  }

  const credentials = maskCredentials(decryptJson<EmailCredentials>(config.credentialsEnc));

  return {
    configured: true,
    status,
    transport: config.transport,
    providerId: config.providerId,
    fromEmail: config.fromEmail,
    fromName: config.fromName ?? null,
    replyTo: config.replyTo ?? null,
    smtpHost: config.smtpHost ?? null,
    smtpPort: config.smtpPort ?? null,
    smtpSecure: config.smtpSecure ?? null,
    credentials,
    verifiedAt: config.verifiedAt ?? null,
    lastTestAt: config.lastTestAt ?? null,
    lastTestStatus: config.lastTestStatus ?? null,
    lastTestMessage: config.lastTestMessage ?? null,
    features: {
      ...defaultFeatures(),
      ...(config.features ?? {}),
    },
  };
}

export async function getEmailSettings(organizationId: bigint): Promise<EmailSettingsPublic> {
  const integration = await prisma.integration.findUnique({
    where: {
      organizationId_provider: {
        organizationId,
        provider: EMAIL_INTEGRATION_PROVIDER,
      },
    },
  });

  const config = parseIntegrationConfig(integration?.config);
  return toPublicSettings(integration?.status ?? "disconnected", config);
}

export async function getEmailIntegrationConfig(
  organizationId: bigint,
): Promise<EmailIntegrationConfig | null> {
  const integration = await prisma.integration.findUnique({
    where: {
      organizationId_provider: {
        organizationId,
        provider: EMAIL_INTEGRATION_PROVIDER,
      },
    },
  });

  return parseIntegrationConfig(integration?.config);
}

export async function saveEmailSettings(input: {
  organizationId: bigint;
  actorUserId: bigint;
  userAgent?: string | null;
  data: EmailSettingsUpsertInput;
}): Promise<EmailSettingsPublic> {
  const existing = await getEmailIntegrationConfig(input.organizationId);
  const existingCredentials = existing
    ? decryptJson<EmailCredentials>(existing.credentialsEnc)
    : {};
  const credentials = mergeCredentials(input.data.credentials, existingCredentials);

  const config: EmailIntegrationConfig = {
    transport: input.data.transport,
    providerId: input.data.providerId,
    fromEmail: input.data.fromEmail,
    fromName: input.data.fromName ?? null,
    replyTo: input.data.replyTo || null,
    smtpHost: input.data.smtpHost ?? null,
    smtpPort: input.data.smtpPort ?? null,
    smtpSecure: input.data.smtpSecure ?? null,
    credentialsEnc: encryptJson(credentials),
    verifiedAt: existing?.verifiedAt ?? null,
    lastTestAt: existing?.lastTestAt ?? null,
    lastTestStatus: existing?.lastTestStatus ?? null,
    lastTestMessage: existing?.lastTestMessage ?? null,
    features: {
      ...defaultFeatures(),
      ...(input.data.features ?? existing?.features ?? {}),
    },
  };

  const integration = await prisma.integration.upsert({
    where: {
      organizationId_provider: {
        organizationId: input.organizationId,
        provider: EMAIL_INTEGRATION_PROVIDER,
      },
    },
    create: {
      organizationId: input.organizationId,
      provider: EMAIL_INTEGRATION_PROVIDER,
      status: "connected",
      config: config as unknown as Prisma.InputJsonValue,
      connectedBy: input.actorUserId,
    },
    update: {
      status: "connected",
      config: config as unknown as Prisma.InputJsonValue,
      connectedBy: input.actorUserId,
      connectedAt: new Date(),
    },
  });

  await writeAuditLog({
    organizationId: input.organizationId,
    actorUserId: input.actorUserId,
    action: "email.settings.updated",
    entityType: "integration",
    entityId: integration.id,
    userAgent: input.userAgent,
    before: existing
      ? {
          transport: existing.transport,
          providerId: existing.providerId,
          fromEmail: existing.fromEmail,
        }
      : null,
    after: {
      transport: config.transport,
      providerId: config.providerId,
      fromEmail: config.fromEmail,
    },
  });

  return toPublicSettings(integration.status, config);
}

export async function markEmailTestResult(input: {
  organizationId: bigint;
  ok: boolean;
  message: string;
}): Promise<void> {
  const existing = await getEmailIntegrationConfig(input.organizationId);
  if (!existing) return;

  const config: EmailIntegrationConfig = {
    ...existing,
    verifiedAt: input.ok ? new Date().toISOString() : existing.verifiedAt,
    lastTestAt: new Date().toISOString(),
    lastTestStatus: input.ok ? "ok" : "error",
    lastTestMessage: input.message,
  };

  await prisma.integration.update({
    where: {
      organizationId_provider: {
        organizationId: input.organizationId,
        provider: EMAIL_INTEGRATION_PROVIDER,
      },
    },
    data: {
      status: input.ok ? "connected" : "error",
      config: config as unknown as Prisma.InputJsonValue,
    },
  });
}

export function resolveConfigFromUpsert(
  data: EmailSettingsUpsertInput,
  existing: EmailIntegrationConfig | null,
): EmailIntegrationConfig {
  const existingCredentials = existing
    ? decryptJson<EmailCredentials>(existing.credentialsEnc)
    : {};
  const credentials = mergeCredentials(data.credentials, existingCredentials);

  return {
    transport: data.transport,
    providerId: data.providerId,
    fromEmail: data.fromEmail,
    fromName: data.fromName ?? null,
    replyTo: data.replyTo || null,
    smtpHost: data.smtpHost ?? null,
    smtpPort: data.smtpPort ?? null,
    smtpSecure: data.smtpSecure ?? null,
    credentialsEnc: encryptJson(credentials),
    verifiedAt: existing?.verifiedAt ?? null,
    lastTestAt: existing?.lastTestAt ?? null,
    lastTestStatus: existing?.lastTestStatus ?? null,
    lastTestMessage: existing?.lastTestMessage ?? null,
    features: {
      ...defaultFeatures(),
      ...(data.features ?? existing?.features ?? {}),
    },
  };
}

export function toResolvedTransport(config: EmailIntegrationConfig): {
  transport: EmailTransport;
  providerId: string;
  fromEmail: string;
  fromName?: string;
  replyTo?: string;
  smtpHost?: string;
  smtpPort?: number;
  smtpSecure?: boolean;
  credentials: EmailCredentials;
} {
  return {
    transport: config.transport,
    providerId: config.providerId,
    fromEmail: config.fromEmail,
    fromName: config.fromName ?? undefined,
    replyTo: config.replyTo ?? undefined,
    smtpHost: config.smtpHost ?? undefined,
    smtpPort: config.smtpPort ?? undefined,
    smtpSecure: config.smtpSecure ?? undefined,
    credentials: decryptJson<EmailCredentials>(config.credentialsEnc),
  };
}
