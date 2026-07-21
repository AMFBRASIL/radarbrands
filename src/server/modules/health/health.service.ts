import { checkRedisConnection } from "../../shared/cache";
import { checkDatabaseConnection } from "../../shared/database";
import { env } from "../../shared/env";

export type HealthCheckResult = {
  status: "ok" | "degraded" | "unhealthy";
  service: string;
  environment: string;
  timestamp: string;
  checks: {
    database: "up" | "down";
    redis: "up" | "down" | "skipped";
  };
};

export async function getLiveHealth(): Promise<Pick<HealthCheckResult, "status" | "timestamp">> {
  return {
    status: "ok",
    timestamp: new Date().toISOString(),
  };
}

export async function getReadyHealth(): Promise<HealthCheckResult> {
  const databaseUp = await checkDatabaseConnection();
  const redisConfigured = Boolean(env.REDIS_URL);
  const redisUp = redisConfigured ? await checkRedisConnection() : null;

  const checks = {
    database: databaseUp ? ("up" as const) : ("down" as const),
    redis: redisConfigured ? (redisUp ? ("up" as const) : ("down" as const)) : ("skipped" as const),
  };

  const status = databaseUp ? "ok" : "unhealthy";

  return {
    status,
    service: env.APP_NAME,
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
    checks,
  };
}

export async function getHealthSummary(): Promise<HealthCheckResult> {
  return getReadyHealth();
}
