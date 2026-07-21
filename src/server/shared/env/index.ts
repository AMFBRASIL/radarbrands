import { config } from "dotenv";

config();

import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  APP_URL: z.string().url(),
  APP_NAME: z.string().min(1).default("radar-brands"),
  PORT: z.coerce.number().int().positive().default(3000),

  DATABASE_URL: z.string().min(1),
  DIRECT_DATABASE_URL: z.string().min(1).optional(),

  AUTH_SECRET: z.string().min(32),
  ENCRYPTION_KEY: z.string().min(16),

  REDIS_URL: z.string().url().optional(),

  EMAIL_PROVIDER: z.enum(["smtp", "ses", "resend", "mailgun"]).default("smtp"),
  EMAIL_FROM: z.string().email().optional(),
  EMAIL_REPLY_TO: z.string().email().optional(),

  STORAGE_PROVIDER: z.enum(["local", "s3", "r2", "minio"]).default("local"),

  SENTRY_DSN: z.string().url().optional().or(z.literal("")),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace"]).default("info"),
});

export type Env = z.infer<typeof envSchema>;

function loadEnv(): Env {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    const formatted = parsed.error.flatten().fieldErrors;
    console.error("Invalid environment variables:", formatted);
    throw new Error("Environment validation failed. Check your .env file.");
  }

  return parsed.data;
}

/** Validated server-side environment. Never import from client components. */
export const env = loadEnv();

export const isProduction = env.NODE_ENV === "production";
export const isDevelopment = env.NODE_ENV === "development";
export const isTest = env.NODE_ENV === "test";
