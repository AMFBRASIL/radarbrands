import type { EndpointHealth, Prisma, SearchEndpoint } from "@prisma/client";

import { encryptJson } from "../../shared/crypto/encryption";
import { prisma } from "../../shared/database";
import { BusinessRuleError, NotFoundError } from "../../shared/errors";
import { writeAuditLog } from "../audit/audit.service";
import type { CreateEndpointInput, ListEndpointRunsInput, UpdateEndpointInput } from "./endpoints.schemas";

const MASTER_KEY = "endpoints.master_enabled";

export type EndpointDto = {
  id: string;
  code: string;
  name: string;
  category: string;
  desc: string;
  enabled: boolean;
  frequencyMin: number;
  priority: 1 | 2 | 3;
  health: EndpointHealth;
  latencyMs: number;
  successRate: number;
  hits24h: number;
  costPer1k: number;
  requiresKey: boolean;
  keySet: boolean;
  region?: string;
  concurrency: number;
  custom?: boolean;
  tag?: string;
  baseUrl?: string | null;
  lastRunAt?: string | null;
  nextRunAt?: string | null;
  lastError?: string | null;
  advanced?: {
    retryBackoff?: boolean;
    ignoreSsl?: boolean;
    rotateUa?: boolean;
    residentialProxy?: boolean;
  };
};

export type EndpointRunDto = {
  id: string;
  endpointCode: string;
  endpointName: string;
  category: string;
  status: string;
  triggeredBy: string;
  latencyMs: number | null;
  itemsFound: number;
  success: boolean | null;
  error: string | null;
  log: string[];
  startedAt: string | null;
  finishedAt: string | null;
  createdAt: string;
  durationMs: number | null;
};

function toDto(row: SearchEndpoint): EndpointDto {
  const advanced =
    row.advanced && typeof row.advanced === "object"
      ? (row.advanced as EndpointDto["advanced"])
      : undefined;

  return {
    id: row.code,
    code: row.code,
    name: row.name,
    category: row.category,
    desc: row.description,
    enabled: row.enabled,
    frequencyMin: row.frequencyMin,
    priority: Math.min(3, Math.max(1, row.priority)) as 1 | 2 | 3,
    health: row.health,
    latencyMs: row.latencyMs,
    successRate: Number(row.successRate),
    hits24h: row.hits24h,
    costPer1k: Number(row.costPer1k),
    requiresKey: row.requiresKey,
    keySet: Boolean(row.credentialsEnc) || !row.requiresKey,
    region: row.region ?? undefined,
    concurrency: row.concurrency,
    custom: row.isCustom,
    tag: row.tag ?? undefined,
    baseUrl: row.baseUrl,
    lastRunAt: row.lastRunAt?.toISOString() ?? null,
    nextRunAt: row.nextRunAt?.toISOString() ?? null,
    lastError: row.lastError,
    advanced,
  };
}

export async function getMasterEnabled(): Promise<boolean> {
  const setting = await prisma.platformSetting.findUnique({
    where: { key: MASTER_KEY },
  });
  if (!setting) return true;
  return setting.value === true || setting.value === "true";
}

export async function setMasterEnabled(enabled: boolean, actorUserId?: bigint): Promise<boolean> {
  await prisma.platformSetting.upsert({
    where: { key: MASTER_KEY },
    update: { value: enabled },
    create: { key: MASTER_KEY, value: enabled },
  });

  if (!enabled) {
    await prisma.searchEndpoint.updateMany({
      where: { enabled: true },
      data: { health: "paused" },
    });
  } else {
    await prisma.searchEndpoint.updateMany({
      where: { enabled: true, health: "paused" },
      data: { health: "healthy", nextRunAt: new Date() },
    });
  }

  if (actorUserId) {
    await writeAuditLog({
      actorUserId,
      action: enabled ? "endpoints.master.enabled" : "endpoints.master.disabled",
      entityType: "platform_setting",
      after: { enabled },
    });
  }

  return enabled;
}

export async function listEndpoints(): Promise<{
  masterEnabled: boolean;
  endpoints: EndpointDto[];
}> {
  const [masterEnabled, rows] = await Promise.all([
    getMasterEnabled(),
    prisma.searchEndpoint.findMany({ orderBy: [{ category: "asc" }, { priority: "asc" }, { name: "asc" }] }),
  ]);

  return {
    masterEnabled,
    endpoints: rows.map(toDto),
  };
}

function extractLog(meta: unknown): string[] {
  if (!meta || typeof meta !== "object") return [];
  const log = (meta as { log?: unknown }).log;
  if (!Array.isArray(log)) return [];
  return log.filter((line): line is string => typeof line === "string");
}

export async function listEndpointRuns(input: ListEndpointRunsInput): Promise<{
  runs: EndpointRunDto[];
  summary: {
    total: number;
    done: number;
    failed: number;
    skipped: number;
    running: number;
  };
}> {
  const where: Prisma.SearchEndpointRunWhereInput = {};

  if (input.status) where.status = input.status;
  if (input.triggeredBy) where.triggeredBy = input.triggeredBy;
  if (input.code || input.q) {
    where.endpoint = {
      ...(input.code ? { code: input.code } : {}),
      ...(input.q
        ? {
            OR: [
              { code: { contains: input.q } },
              { name: { contains: input.q } },
              { description: { contains: input.q } },
            ],
          }
        : {}),
    };
  }

  const [rows, counts] = await Promise.all([
    prisma.searchEndpointRun.findMany({
      where,
      include: {
        endpoint: {
          select: { code: true, name: true, category: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: input.limit,
    }),
    prisma.searchEndpointRun.groupBy({
      by: ["status"],
      where,
      _count: { _all: true },
    }),
  ]);

  const countMap = Object.fromEntries(counts.map((row) => [row.status, row._count._all]));

  const runs: EndpointRunDto[] = rows.map((row) => {
    const started = row.startedAt?.getTime();
    const finished = row.finishedAt?.getTime();
    return {
      id: String(row.id),
      endpointCode: row.endpoint.code,
      endpointName: row.endpoint.name,
      category: row.endpoint.category,
      status: row.status,
      triggeredBy: row.triggeredBy,
      latencyMs: row.latencyMs,
      itemsFound: row.itemsFound,
      success: row.success,
      error: row.error,
      log: extractLog(row.meta),
      startedAt: row.startedAt?.toISOString() ?? null,
      finishedAt: row.finishedAt?.toISOString() ?? null,
      createdAt: row.createdAt.toISOString(),
      durationMs: started && finished ? Math.max(0, finished - started) : null,
    };
  });

  return {
    runs,
    summary: {
      total: runs.length,
      done: countMap.done ?? 0,
      failed: countMap.failed ?? 0,
      skipped: countMap.skipped ?? 0,
      running: countMap.running ?? 0,
    },
  };
}

export async function updateEndpoint(input: {
  code: string;
  data: UpdateEndpointInput;
  actorUserId: bigint;
}): Promise<EndpointDto> {
  const existing = await prisma.searchEndpoint.findUnique({ where: { code: input.code } });
  if (!existing) throw new NotFoundError("Endpoint não encontrado");

  const data: Prisma.SearchEndpointUpdateInput = {};

  if (input.data.enabled !== undefined) {
    data.enabled = input.data.enabled;
    data.health = input.data.enabled ? "healthy" : "paused";
    data.nextRunAt = input.data.enabled ? new Date() : null;
  }
  if (input.data.frequencyMin !== undefined) data.frequencyMin = input.data.frequencyMin;
  if (input.data.priority !== undefined) data.priority = input.data.priority;
  if (input.data.concurrency !== undefined) data.concurrency = input.data.concurrency;
  if (input.data.region !== undefined) data.region = input.data.region;
  if (input.data.advanced) {
    data.advanced = {
      ...((existing.advanced as object) ?? {}),
      ...input.data.advanced,
    } as Prisma.InputJsonValue;
  }
  if (input.data.apiKey) {
    data.credentialsEnc = encryptJson({ api_key: input.data.apiKey });
  }

  const updated = await prisma.searchEndpoint.update({
    where: { code: input.code },
    data,
  });

  await writeAuditLog({
    actorUserId: input.actorUserId,
    action: "endpoints.updated",
    entityType: "search_endpoint",
    entityId: updated.id,
    after: {
      code: updated.code,
      enabled: updated.enabled,
      frequencyMin: updated.frequencyMin,
    },
  });

  return toDto(updated);
}

export async function createCustomEndpoint(input: {
  data: CreateEndpointInput;
  actorUserId: bigint;
}): Promise<EndpointDto> {
  const code = `custom-${Date.now().toString(36)}`;
  const created = await prisma.searchEndpoint.create({
    data: {
      code,
      name: input.data.name,
      category: input.data.category,
      description: input.data.baseUrl,
      baseUrl: input.data.baseUrl,
      enabled: true,
      frequencyMin: input.data.frequencyMin,
      priority: 2,
      health: "healthy",
      requiresKey: input.data.requiresKey,
      credentialsEnc: input.data.apiKey
        ? encryptJson({ api_key: input.data.apiKey })
        : null,
      concurrency: 3,
      isCustom: true,
      tag: "Custom",
      nextRunAt: new Date(),
      advanced: {
        retryBackoff: true,
        ignoreSsl: false,
        rotateUa: true,
        residentialProxy: false,
      },
    },
  });

  await writeAuditLog({
    actorUserId: input.actorUserId,
    action: "endpoints.created",
    entityType: "search_endpoint",
    entityId: created.id,
    after: { code: created.code, name: created.name },
  });

  return toDto(created);
}

export async function bulkSetEnabled(input: {
  category: string;
  enabled: boolean;
  actorUserId: bigint;
}): Promise<number> {
  const where =
    input.category === "all"
      ? {}
      : { category: input.category as Prisma.EnumEndpointCategoryFilter };

  const result = await prisma.searchEndpoint.updateMany({
    where,
    data: {
      enabled: input.enabled,
      health: input.enabled ? "healthy" : "paused",
      nextRunAt: input.enabled ? new Date() : null,
    },
  });

  await writeAuditLog({
    actorUserId: input.actorUserId,
    action: "endpoints.bulk_updated",
    entityType: "search_endpoint",
    after: { category: input.category, enabled: input.enabled, count: result.count },
  });

  return result.count;
}

export async function applyPreset(input: {
  preset: "max" | "balanced" | "eco";
  actorUserId: bigint;
}): Promise<number> {
  const rows = await prisma.searchEndpoint.findMany();
  let count = 0;

  for (const row of rows) {
    let enabled = row.enabled;
    let frequencyMin = row.frequencyMin;
    let concurrency = row.concurrency;

    if (input.preset === "max") {
      enabled = true;
      frequencyMin = Math.max(1, Math.floor(row.frequencyMin / 2));
      concurrency = Math.min(40, row.concurrency + 2);
    } else if (input.preset === "balanced") {
      enabled = row.priority !== 3;
      frequencyMin = row.priority === 1 ? 10 : 30;
    } else {
      enabled = row.priority === 1;
      frequencyMin = 60;
      concurrency = 2;
    }

    await prisma.searchEndpoint.update({
      where: { id: row.id },
      data: {
        enabled,
        frequencyMin,
        concurrency,
        health: enabled ? "healthy" : "paused",
        nextRunAt: enabled ? new Date() : null,
      },
    });
    count += 1;
  }

  await writeAuditLog({
    actorUserId: input.actorUserId,
    action: "endpoints.preset_applied",
    entityType: "search_endpoint",
    after: { preset: input.preset, count },
  });

  return count;
}

export async function getEndpointByCode(code: string): Promise<SearchEndpoint> {
  const endpoint = await prisma.searchEndpoint.findUnique({ where: { code } });
  if (!endpoint) throw new NotFoundError("Endpoint não encontrado");
  return endpoint;
}

export function assertCanRun(endpoint: SearchEndpoint, masterEnabled: boolean): void {
  if (!masterEnabled) {
    throw new BusinessRuleError("Captura global suspensa (master switch)");
  }
  if (!endpoint.enabled) {
    throw new BusinessRuleError("Endpoint desligado");
  }
  if (endpoint.requiresKey && !endpoint.credentialsEnc) {
    throw new BusinessRuleError("Chave de API não configurada");
  }
}

export const endpointsService = {
  list: listEndpoints,
  listRuns: listEndpointRuns,
  update: updateEndpoint,
  create: createCustomEndpoint,
  bulk: bulkSetEnabled,
  preset: applyPreset,
  getMasterEnabled,
  setMasterEnabled,
};
