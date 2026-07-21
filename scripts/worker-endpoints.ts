import { config } from "dotenv";

config();

const TICK_MS = Number(process.env.ENDPOINTS_CRON_MS ?? 15_000);
const BATCH = Number(process.env.ENDPOINTS_CRON_BATCH ?? 15);

async function tick() {
  const { processDueEndpoints } = await import("../src/server/modules/endpoints/endpoints.runner.ts");
  const { logger } = await import("../src/server/shared/logger/index.ts");

  try {
    const processed = await processDueEndpoints(BATCH);
    if (processed > 0) {
      logger.info({ processed }, "endpoints cron tick");
    }
  } catch (error) {
    logger.error({ err: error }, "endpoints cron failed");
  }
}

async function main() {
  const { logger } = await import("../src/server/shared/logger/index.ts");
  logger.info({ tickMs: TICK_MS, batch: BATCH }, "endpoints worker started");
  await tick();
  setInterval(() => {
    void tick();
  }, TICK_MS);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
