import pino from "pino";

import { env } from "../env";

const redactPaths = [
  "req.headers.authorization",
  "req.headers.cookie",
  "password",
  "passwordHash",
  "token",
  "apiKey",
  "secret",
  "keyHash",
];

export const logger = pino({
  level: env.LOG_LEVEL,
  redact: {
    paths: redactPaths,
    censor: "[REDACTED]",
  },
  base: {
    service: env.APP_NAME,
    environment: env.NODE_ENV,
  },
});

export type Logger = typeof logger;
