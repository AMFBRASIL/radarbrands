export type EmailTransport = "api" | "smtp";

export type EmailCredentials = Record<string, string>;

export interface EmailIntegrationConfig {
  transport: EmailTransport;
  providerId: string;
  fromEmail: string;
  fromName?: string | null;
  replyTo?: string | null;
  smtpHost?: string | null;
  smtpPort?: number | null;
  smtpSecure?: boolean | null;
  credentialsEnc: string;
  verifiedAt?: string | null;
  lastTestAt?: string | null;
  lastTestStatus?: "ok" | "error" | null;
  lastTestMessage?: string | null;
  features?: {
    dkimVerified?: boolean;
    dailyDigest?: boolean;
    weeklyReport?: boolean;
  };
}

export interface EmailSettingsPublic {
  configured: boolean;
  status: "connected" | "disconnected" | "error";
  transport: EmailTransport | null;
  providerId: string | null;
  fromEmail: string | null;
  fromName: string | null;
  replyTo: string | null;
  smtpHost: string | null;
  smtpPort: number | null;
  smtpSecure: boolean | null;
  credentials: Record<string, string>;
  verifiedAt: string | null;
  lastTestAt: string | null;
  lastTestStatus: "ok" | "error" | null;
  lastTestMessage: string | null;
  features: {
    dkimVerified: boolean;
    dailyDigest: boolean;
    weeklyReport: boolean;
  };
}

export interface SendEmailInput {
  organizationId?: bigint;
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  replyTo?: string;
  fromEmail?: string;
  fromName?: string;
}

export interface SendEmailResult {
  ok: boolean;
  providerId: string;
  transport: EmailTransport;
  messageId?: string;
  log: string[];
}

export interface ResolvedEmailConfig {
  transport: EmailTransport;
  providerId: string;
  fromEmail: string;
  fromName?: string;
  replyTo?: string;
  smtpHost?: string;
  smtpPort?: number;
  smtpSecure?: boolean;
  credentials: EmailCredentials;
  source: "organization" | "platform";
}
