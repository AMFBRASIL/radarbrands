import type { EmailSettingsPublic } from "@/server/modules/email/email.types";

export type EmailSettingsPayload = {
  transport: "api" | "smtp";
  providerId: string;
  fromEmail: string;
  fromName?: string | null;
  replyTo?: string | null;
  smtpHost?: string | null;
  smtpPort?: number | null;
  smtpSecure?: boolean | null;
  credentials: Record<string, string>;
  features?: {
    dkimVerified?: boolean;
    dailyDigest?: boolean;
    weeklyReport?: boolean;
  };
};

export type EmailTestResult = {
  ok: boolean;
  providerId: string;
  transport: "api" | "smtp";
  messageId?: string;
  log: string[];
  error?: string;
};

type ApiResponse<T> = {
  success: boolean;
  data: T;
  error?: { code: string; message: string; details?: unknown };
};

async function parseApiResponse<T>(response: Response): Promise<T> {
  const payload = (await response.json()) as ApiResponse<T>;
  if (!payload.success) {
    throw new Error(payload.error?.message ?? "Erro na requisição");
  }
  return payload.data;
}

export async function fetchEmailSettings(): Promise<EmailSettingsPublic> {
  const response = await fetch("/api/v1/settings/email", {
    credentials: "include",
  });
  return parseApiResponse<EmailSettingsPublic>(response);
}

export async function saveEmailSettingsRequest(
  payload: EmailSettingsPayload,
): Promise<EmailSettingsPublic> {
  const response = await fetch("/api/v1/settings/email", {
    method: "PUT",
    credentials: "include",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  return parseApiResponse<EmailSettingsPublic>(response);
}

export async function sendEmailTestRequest(input: {
  to: string;
  settings?: EmailSettingsPayload;
}): Promise<EmailTestResult> {
  const response = await fetch("/api/v1/settings/email/test", {
    method: "POST",
    credentials: "include",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input),
  });
  return parseApiResponse<EmailTestResult>(response);
}
