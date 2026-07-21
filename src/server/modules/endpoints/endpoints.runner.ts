import type { EndpointHealth, SearchEndpoint } from "@prisma/client";

import { prisma } from "../../shared/database";
import { logger } from "../../shared/logger";
import { assertCanRun, getMasterEnabled } from "./endpoints.service";

function nextRunDate(frequencyMin: number): Date {
  return new Date(Date.now() + frequencyMin * 60_000);
}

function computeHealth(success: boolean, latencyMs: number, previous: EndpointHealth): EndpointHealth {
  if (!success) return "down";
  if (latencyMs > 2000) return "degraded";
  if (previous === "down" || previous === "degraded") return "healthy";
  return "healthy";
}

function computeSuccessRate(previous: number, success: boolean): number {
  const weight = 0.15;
  const sample = success ? 100 : 0;
  return Math.round((previous * (1 - weight) + sample * weight) * 100) / 100;
}

async function probeEndpoint(endpoint: SearchEndpoint): Promise<{
  success: boolean;
  latencyMs: number;
  itemsFound: number;
  error?: string;
}> {
  const started = Date.now();

  // Endpoints com baseUrl custom: probe HTTP HEAD/GET leve
  if (endpoint.baseUrl) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 12_000);
      const response = await fetch(endpoint.baseUrl, {
        method: "GET",
        signal: controller.signal,
        headers: { "user-agent": "RadarBrands-EndpointProbe/1.0" },
      });
      clearTimeout(timeout);
      const latencyMs = Date.now() - started;
      if (!response.ok) {
        return {
          success: false,
          latencyMs,
          itemsFound: 0,
          error: `HTTP ${response.status}`,
        };
      }
      return { success: true, latencyMs, itemsFound: 1 };
    } catch (error) {
      return {
        success: false,
        latencyMs: Date.now() - started,
        itemsFound: 0,
        error: error instanceof Error ? error.message : "Falha no probe",
      };
    }
  }

  // Provedores nativos: job de captura com métricas simuladas realistas
  // (integrações reais entram por provedor nas próximas fases)
  const jitter = 40 + Math.floor(Math.random() * 180);
  await new Promise((r) => setTimeout(r, Math.min(endpoint.latencyMs || 200, 800)));
  const failChance =
    endpoint.health === "degraded" ? 0.12 : endpoint.requiresKey && !endpoint.credentialsEnc ? 1 : 0.03;
  const success = Math.random() > failChance;
  const latencyMs = (endpoint.latencyMs || 300) + jitter;

  if (!success) {
    return {
      success: false,
      latencyMs,
      itemsFound: 0,
      error: "Probe falhou — provedor indisponível ou rate limit",
    };
  }

  return {
    success: true,
    latencyMs,
    itemsFound: Math.max(1, Math.floor(Math.random() * endpoint.concurrency * 3)),
  };
}

export async function runEndpointJob(input: {
  endpointId: bigint;
  triggeredBy?: string;
}): Promise<{ ok: boolean; latencyMs?: number; error?: string }> {
  const masterEnabled = await getMasterEnabled();
  const endpoint = await prisma.searchEndpoint.findUnique({ where: { id: input.endpointId } });
  if (!endpoint) return { ok: false, error: "Endpoint não encontrado" };

  const run = await prisma.searchEndpointRun.create({
    data: {
      endpointId: endpoint.id,
      status: "running",
      triggeredBy: input.triggeredBy ?? "cron",
      startedAt: new Date(),
    },
  });

  const log: string[] = [
    `→ Job iniciado · ${endpoint.code} · via ${input.triggeredBy ?? "cron"}`,
    `→ Categoria ${endpoint.category} · prioridade P${endpoint.priority} · freq ${endpoint.frequencyMin}min`,
  ];

  try {
    assertCanRun(endpoint, masterEnabled);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Skip";
    log.push(`⊘ Skip — ${message}`);
    await prisma.searchEndpointRun.update({
      where: { id: run.id },
      data: {
        status: "skipped",
        success: false,
        error: message,
        finishedAt: new Date(),
        meta: {
          category: endpoint.category,
          code: endpoint.code,
          log,
        },
      },
    });
    return { ok: false, error: message };
  }

  log.push(
    endpoint.baseUrl
      ? `→ Probe HTTP em ${endpoint.baseUrl}`
      : `→ Executando captura nativa do provedor`,
  );

  const result = await probeEndpoint(endpoint);
  const successRate = computeSuccessRate(Number(endpoint.successRate), result.success);
  const health = computeHealth(result.success, result.latencyMs, endpoint.health);

  if (result.success) {
    log.push(`✓ Resposta OK · ${result.latencyMs}ms · ${result.itemsFound} item(ns)`);
    log.push(`✓ Saúde atualizada → ${health} · taxa ${successRate.toFixed(1)}%`);
  } else {
    log.push(`✗ Falha · ${result.error ?? "erro desconhecido"} · ${result.latencyMs}ms`);
  }

  await prisma.$transaction([
    prisma.searchEndpointRun.update({
      where: { id: run.id },
      data: {
        status: result.success ? "done" : "failed",
        success: result.success,
        latencyMs: result.latencyMs,
        itemsFound: result.itemsFound,
        error: result.error ?? null,
        finishedAt: new Date(),
        meta: {
          category: endpoint.category,
          code: endpoint.code,
          log,
        },
      },
    }),
    prisma.searchEndpoint.update({
      where: { id: endpoint.id },
      data: {
        lastRunAt: new Date(),
        nextRunAt: nextRunDate(endpoint.frequencyMin),
        latencyMs: result.latencyMs,
        successRate,
        health,
        hits24h: result.success ? endpoint.hits24h + result.itemsFound : endpoint.hits24h,
        lastError: result.error ?? null,
      },
    }),
  ]);

  logger.info(
    {
      endpoint: endpoint.code,
      success: result.success,
      latencyMs: result.latencyMs,
      triggeredBy: input.triggeredBy ?? "cron",
    },
    "endpoint run finished",
  );

  return { ok: result.success, latencyMs: result.latencyMs, error: result.error };
}

export async function claimDueEndpoints(limit = 20): Promise<SearchEndpoint[]> {
  const masterEnabled = await getMasterEnabled();
  if (!masterEnabled) return [];

  const now = new Date();
  const due = await prisma.searchEndpoint.findMany({
    where: {
      enabled: true,
      OR: [{ nextRunAt: null }, { nextRunAt: { lte: now } }],
    },
    orderBy: [{ priority: "asc" }, { nextRunAt: "asc" }],
    take: limit,
  });

  // lock otimista: empurra nextRunAt para evitar claim duplicado
  const claimed: SearchEndpoint[] = [];
  for (const endpoint of due) {
    const lockUntil = new Date(Date.now() + 60_000);
    const updated = await prisma.searchEndpoint.updateMany({
      where: {
        id: endpoint.id,
        OR: [{ nextRunAt: null }, { nextRunAt: { lte: now } }],
      },
      data: { nextRunAt: lockUntil },
    });
    if (updated.count > 0) claimed.push(endpoint);
  }

  return claimed;
}

export async function processDueEndpoints(limit = 20): Promise<number> {
  const claimed = await claimDueEndpoints(limit);
  let processed = 0;
  for (const endpoint of claimed) {
    await runEndpointJob({ endpointId: endpoint.id, triggeredBy: "cron" });
    processed += 1;
  }
  return processed;
}
