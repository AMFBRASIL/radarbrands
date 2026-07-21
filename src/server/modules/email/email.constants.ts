export const EMAIL_INTEGRATION_PROVIDER = "email";

export const SECRET_MASK = "••••••••••••";

export const SMTP_PRESETS: Record<
  string,
  { host: string; port: number; secure: boolean }
> = {
  gmail: { host: "smtp.gmail.com", port: 587, secure: false },
  office365: { host: "smtp.office365.com", port: 587, secure: false },
  zoho: { host: "smtp.zoho.com", port: 465, secure: true },
};

export const SECRET_FIELD_KEYS = new Set([
  "api_key",
  "pass",
  "secret_key",
  "access_key",
]);
