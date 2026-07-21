import Redis from "ioredis";

import { env } from "../env";
import { logger } from "../logger";

let redis: Redis | null = null;

export function getRedis(): Redis | null {
  if (!env.REDIS_URL) {
    return null;
  }

  if (!redis) {
    redis = new Redis(env.REDIS_URL, {
      maxRetriesPerRequest: null,
      lazyConnect: true,
    });

    redis.on("error", (error) => {
      logger.error({ err: error }, "redis connection error");
    });
  }

  return redis;
}

export async function checkRedisConnection(): Promise<boolean> {
  const client = getRedis();
  if (!client) {
    return false;
  }

  try {
    if (client.status !== "ready") {
      await client.connect();
    }
    const pong = await client.ping();
    return pong === "PONG";
  } catch {
    return false;
  }
}

export async function disconnectRedis(): Promise<void> {
  if (redis) {
    await redis.quit();
    redis = null;
  }
}
