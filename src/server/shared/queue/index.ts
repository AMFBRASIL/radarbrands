import { Queue } from "bullmq";

import { env } from "../env";
import { logger } from "../logger";

export const QUEUE_NAMES = {
  default: "default",
  monitoring: "monitoring",
  notifications: "notifications",
  email: "email",
  reports: "reports",
  webhooks: "webhooks",
} as const;

export type QueueName = (typeof QUEUE_NAMES)[keyof typeof QUEUE_NAMES];

const queues = new Map<QueueName, Queue>();

function getQueueConnection() {
  if (!env.REDIS_URL) {
    return null;
  }

  return { url: env.REDIS_URL };
}

export function getQueue(name: QueueName): Queue | null {
  const connection = getQueueConnection();
  if (!connection) {
    return null;
  }

  let queue = queues.get(name);
  if (!queue) {
    queue = new Queue(name, {
      connection,
      defaultJobOptions: {
        attempts: 5,
        backoff: {
          type: "exponential",
          delay: 1000,
        },
        removeOnComplete: 1000,
        removeOnFail: 5000,
      },
    });
    queues.set(name, queue);
    logger.info({ queue: name }, "bullmq queue initialized");
  }

  return queue;
}

export function isQueueEnabled(): boolean {
  return Boolean(env.REDIS_URL);
}
